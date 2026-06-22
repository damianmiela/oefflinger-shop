<?php
/**
 * Öfflinger Sets — cart integration (grouped model + server-side discount).
 *
 * Adding a set = adding its component products as real Store-API cart lines,
 * each tagged with the set id + a unique instance, via the Store API's official
 * update-callback (runs inside the cart session — no fragile session handling).
 *
 * The discount is recomputed on every cart calculation: items are grouped by
 * instance, checked against the set recipe, and — if the instance is intact —
 * each line's price is reduced proportionally so the set total matches and VAT
 * stays correct per line. If a customer changes/removes a component the instance
 * no longer matches the recipe → no discount (dissolve) and a flag the frontend
 * turns into a message.
 *
 * Frontend usage (P5): POST /wc/store/v1/cart/extensions
 *   { "namespace": "oeff-sets", "data": { "action": "add_set", "set_id": 123 } }
 * then re-read the cart. Each cart item carries extensions.oeff_sets with the
 * grouping + dissolved state.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Register Store-API extensibility once WooCommerce is ready. */
add_action('woocommerce_init', function () {
    if (function_exists('woocommerce_store_api_register_update_callback')) {
        woocommerce_store_api_register_update_callback([
            'namespace' => 'oeff-sets',
            'callback'  => 'oeff_sets_store_api_update',
        ]);
    }
    if (function_exists('woocommerce_store_api_register_endpoint_data')) {
        woocommerce_store_api_register_endpoint_data([
            'endpoint'        => 'cart_item',
            'namespace'       => 'oeff_sets',
            'data_callback'   => 'oeff_sets_cart_item_data',
            'schema_callback' => 'oeff_sets_cart_item_schema',
            'schema_type'     => ARRAY_A,
        ]);
    }
});

/** Recompute the set discounts whenever the cart totals are calculated. */
add_action('woocommerce_before_calculate_totals', 'oeff_sets_apply_discounts', 20, 1);

/**
 * Store-API update callback: add a set's components to the cart, tagged with a
 * shared instance id so they form one group (and stay distinct from the same
 * product added standalone or as part of another set).
 *
 * @param array $data Posted under the "oeff-sets" namespace.
 */
function oeff_sets_store_api_update($data) {
    $action = isset($data['action']) ? sanitize_key($data['action']) : '';
    if ('add_set' !== $action) {
        return;
    }

    $set_id = isset($data['set_id']) ? absint($data['set_id']) : 0;
    if (!$set_id || get_post_type($set_id) !== OEFF_SETS_CPT || 'publish' !== get_post_status($set_id)) {
        return;
    }

    $recipe = oeff_sets_get_recipe($set_id);
    if (empty($recipe) || !WC()->cart) {
        return;
    }

    $instance = uniqid('set_', true);
    foreach ($recipe as $product_id => $qty) {
        WC()->cart->add_to_cart($product_id, $qty, 0, [], [
            'oeff_set' => ['id' => $set_id, 'instance' => $instance],
        ]);
    }
}

/**
 * Apply (or withhold) the set discount on every cart calculation.
 *
 * @param WC_Cart $cart
 */
function oeff_sets_apply_discounts($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    if (!$cart || !is_a($cart, 'WC_Cart')) {
        return;
    }

    // Group tagged items by instance.
    $instances = [];
    foreach ($cart->get_cart() as $key => $item) {
        if (empty($item['oeff_set']['instance'])) {
            continue;
        }
        $inst = $item['oeff_set']['instance'];
        if (!isset($instances[$inst])) {
            $instances[$inst] = ['set_id' => (int) ($item['oeff_set']['id'] ?? 0), 'keys' => [], 'counts' => []];
        }
        $instances[$inst]['keys'][] = $key;
        $pid = (int) $item['product_id'];
        $instances[$inst]['counts'][$pid] = ($instances[$inst]['counts'][$pid] ?? 0) + (int) $item['quantity'];
    }

    $status = [];

    foreach ($instances as $inst => $info) {
        $recipe = oeff_sets_get_recipe($info['set_id']);

        // Intact only if the instance's products + quantities exactly match the recipe.
        if (empty($recipe) || !oeff_sets_counts_match($info['counts'], $recipe)) {
            $status[$inst] = 'dissolved';
            continue;
        }

        // Sum the components at their original prices.
        $sum = 0.0;
        foreach ($info['keys'] as $key) {
            $ci = $cart->cart_contents[$key];
            $sum += oeff_sets_original_price($ci) * (int) $ci['quantity'];
        }
        if ($sum <= 0) {
            $status[$inst] = 'dissolved';
            continue;
        }

        $set_price = oeff_sets_compute_price($info['set_id'], $sum);
        $factor    = $set_price / $sum;

        // Reduce each line proportionally — VAT stays correct per line.
        foreach ($info['keys'] as $key) {
            $ci   = $cart->cart_contents[$key];
            $orig = oeff_sets_original_price($ci);
            $cart->cart_contents[$key]['data']->set_price($orig * $factor);
        }
        $status[$inst] = 'applied';
    }

    $GLOBALS['oeff_sets_status'] = $status;
}

/** Original (catalog) unit price for a cart item, unaffected by our discount. */
function oeff_sets_original_price($cart_item) {
    $pid     = !empty($cart_item['variation_id']) ? $cart_item['variation_id'] : $cart_item['product_id'];
    $product = wc_get_product($pid);
    return $product ? (float) $product->get_price() : 0.0;
}

/** Recipe for a set: [ product_id => quantity ]. */
function oeff_sets_get_recipe($set_id) {
    $meta   = get_post_meta($set_id, '_oeff_set_components', true);
    $recipe = [];
    if (is_array($meta)) {
        foreach ($meta as $c) {
            $pid = isset($c['id']) ? absint($c['id']) : 0;
            $qty = isset($c['qty']) ? max(1, (int) $c['qty']) : 1;
            if ($pid) {
                $recipe[$pid] = ($recipe[$pid] ?? 0) + $qty;
            }
        }
    }
    return $recipe;
}

/** True if cart counts [pid=>qty] exactly equal the recipe [pid=>qty]. */
function oeff_sets_counts_match($counts, $recipe) {
    if (count($counts) !== count($recipe)) {
        return false;
    }
    foreach ($recipe as $pid => $qty) {
        if (!isset($counts[$pid]) || (int) $counts[$pid] !== (int) $qty) {
            return false;
        }
    }
    return true;
}

/** Target set price (same basis as get_price) from the components sum + mode. */
function oeff_sets_compute_price($set_id, $sum) {
    $mode  = get_post_meta($set_id, '_oeff_set_pricing_mode', true) ?: 'percent';
    $value = (float) get_post_meta($set_id, '_oeff_set_pricing_value', true);

    if ('fixed' === $mode) {
        $price = $value;
    } elseif ('amount' === $mode) {
        $price = $sum - $value;
    } else { // percent
        $price = $sum * (1 - $value / 100);
    }

    if ($price < 0) {
        $price = 0;
    }
    return $price;
}

/** Expose the set grouping + dissolved state on each Store-API cart item. */
function oeff_sets_cart_item_data($cart_item) {
    if (empty($cart_item['oeff_set']['instance'])) {
        return ['is_set_member' => false, 'set_id' => 0, 'instance' => '', 'dissolved' => false];
    }
    $inst   = $cart_item['oeff_set']['instance'];
    $status = isset($GLOBALS['oeff_sets_status'][$inst]) ? $GLOBALS['oeff_sets_status'][$inst] : 'applied';

    return [
        'is_set_member' => true,
        'set_id'        => (int) ($cart_item['oeff_set']['id'] ?? 0),
        'instance'      => (string) $inst,
        'dissolved'     => ('dissolved' === $status),
    ];
}

/** Schema for the cart-item extension data above. */
function oeff_sets_cart_item_schema() {
    return [
        'is_set_member' => [
            'description' => 'Whether this line is part of a set.',
            'type'        => 'boolean',
            'readonly'    => true,
        ],
        'set_id' => [
            'description' => 'The set (oeff_set) post ID this line belongs to.',
            'type'        => 'integer',
            'readonly'    => true,
        ],
        'instance' => [
            'description' => 'Groups the lines of one added set instance together.',
            'type'        => 'string',
            'readonly'    => true,
        ],
        'dissolved' => [
            'description' => 'True if the set was changed so the discount no longer applies.',
            'type'        => 'boolean',
            'readonly'    => true,
        ],
    ];
}
