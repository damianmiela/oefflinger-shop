<?php
/**
 * Öfflinger Sets — cart integration (grouped model + server-side discount).
 *
 * Adding a set = adding products as real Store-API cart lines, each tagged with
 * the set id + a unique instance, via the Store API's official update-callback
 * (runs inside the cart session — no fragile session handling).
 *
 *  - Fixed set:        adds the recipe; discount distributes the set price across
 *                      lines (remainder on the last line → exact total); changing
 *                      or removing a line dissolves it.
 *  - Configurable set: adds the customer's selection (validated to the set's
 *                      category + subcategories); discount = the reached qty tier.
 *
 * The discount is recomputed on every cart calculation. Each cart item carries
 * extensions.oeff_sets (grouping, type, applied %, dissolved) for the frontend.
 *
 * Frontend usage: POST /wc/store/v1/cart/extensions
 *   fixed:        { namespace:"oeff-sets", data:{ action:"add_set", set_id } }
 *   configurable: { namespace:"oeff-sets", data:{ action:"add_set", set_id,
 *                   selection:[{ id, qty }] } }
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Store-API extensibility. `woocommerce_blocks_loaded` is the canonical
 * hook — by then the Store API + ExtendSchema are available.
 */
add_action('woocommerce_blocks_loaded', function () {
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
 * Store-API update callback: add a set to the cart, tagged with a shared instance
 * id so its lines form one group (distinct from the same product added standalone
 * or as part of another set).
 *
 * @param array $data Posted under the "oeff-sets" namespace.
 */
function oeff_sets_store_api_update($data) {
    $action = isset($data['action']) ? sanitize_key($data['action']) : '';
    if ('add_set' !== $action) {
        return;
    }

    $set_id = isset($data['set_id']) ? absint($data['set_id']) : 0;
    if (!$set_id || get_post_type($set_id) !== OEFF_SETS_CPT || 'publish' !== get_post_status($set_id) || !WC()->cart) {
        return;
    }

    $instance = uniqid('set_', true);

    if ('configurable' === oeff_sets_get_set_type($set_id)) {
        $cat_id    = oeff_sets_get_category($set_id);
        $selection = isset($data['selection']) && is_array($data['selection']) ? $data['selection'] : [];
        if (!$cat_id || empty($selection)) {
            return;
        }
        // Allowed = the category and its descendants (matches the REST options query).
        $children      = get_term_children($cat_id, 'product_cat');
        $allowed_terms = array_merge([$cat_id], is_array($children) ? $children : []);
        foreach ($selection as $row) {
            $pid = isset($row['id']) ? absint($row['id']) : 0;
            $qty = isset($row['qty']) ? max(1, absint($row['qty'])) : 0;
            // Only products that belong to the set's category tree (no tampering).
            if (!$pid || $qty < 1 || !has_term($allowed_terms, 'product_cat', $pid)) {
                continue;
            }
            WC()->cart->add_to_cart($pid, $qty, 0, [], [
                'oeff_set' => ['id' => $set_id, 'instance' => $instance],
            ]);
        }
        return;
    }

    // Fixed set: add the recipe.
    $recipe = oeff_sets_get_recipe($set_id);
    if (empty($recipe)) {
        return;
    }
    foreach ($recipe as $product_id => $qty) {
        WC()->cart->add_to_cart($product_id, $qty, 0, [], [
            'oeff_set' => ['id' => $set_id, 'instance' => $instance],
        ]);
    }
}

/**
 * Apply (or withhold) the set discount on every cart calculation. Groups tagged
 * items by instance and, per set type, reduces each line's price so the cart
 * total reflects the set price / quantity discount (VAT stays correct per line).
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
        $instances[$inst]['keys'][]       = $key;
        $pid                              = (int) $item['product_id'];
        $instances[$inst]['counts'][$pid] = ($instances[$inst]['counts'][$pid] ?? 0) + (int) $item['quantity'];
    }

    $status = [];

    foreach ($instances as $inst => $info) {
        $set_id = $info['set_id'];
        $type   = oeff_sets_get_set_type($set_id);

        // Components sum (original prices) + total quantity.
        $sum       = 0.0;
        $total_qty = 0;
        foreach ($info['keys'] as $key) {
            $ci         = $cart->cart_contents[$key];
            $sum       += oeff_sets_original_price($ci) * (int) $ci['quantity'];
            $total_qty += (int) $ci['quantity'];
        }

        if ('configurable' === $type) {
            $percent = $sum > 0 ? oeff_sets_tier_percent(oeff_sets_get_tiers($set_id), $total_qty) : 0;
            if ($percent > 0) {
                $factor = 1 - $percent / 100;
                foreach ($info['keys'] as $key) {
                    $orig = oeff_sets_original_price($cart->cart_contents[$key]);
                    $cart->cart_contents[$key]['data']->set_price($orig * $factor);
                }
                $status[$inst] = ['status' => 'applied', 'type' => 'configurable', 'percent' => $percent];
            } else {
                $status[$inst] = ['status' => 'none', 'type' => 'configurable', 'percent' => 0];
            }
            continue;
        }

        // Fixed set: exact recipe match required, else dissolve.
        $recipe = oeff_sets_get_recipe($set_id);
        if (empty($recipe) || !oeff_sets_counts_match($info['counts'], $recipe) || $sum <= 0) {
            $status[$inst] = ['status' => 'dissolved', 'type' => 'fixed', 'percent' => 0];
            continue;
        }

        // Distribute the target set price across lines; the last line absorbs the
        // rounding remainder so the set total is exact (no penny drift).
        $target    = oeff_sets_compute_price($set_id, $sum);
        $keys      = $info['keys'];
        $lastIndex = count($keys) - 1;
        $assigned  = 0.0;
        foreach ($keys as $i => $key) {
            $ci   = $cart->cart_contents[$key];
            $qty  = max(1, (int) $ci['quantity']);
            $orig = oeff_sets_original_price($ci);
            if ($i === $lastIndex) {
                $line_subtotal = round($target - $assigned, 2);
            } else {
                $line_subtotal = round(($orig * $qty / $sum) * $target, 2);
                $assigned     += $line_subtotal;
            }
            $cart->cart_contents[$key]['data']->set_price($line_subtotal / $qty);
        }
        $status[$inst] = ['status' => 'applied', 'type' => 'fixed', 'percent' => (int) round((1 - $target / $sum) * 100)];
    }

    $GLOBALS['oeff_sets_status'] = $status;
}

/** Original (catalog) unit price for a cart item, unaffected by our discount. */
function oeff_sets_original_price($cart_item) {
    $pid     = !empty($cart_item['variation_id']) ? $cart_item['variation_id'] : $cart_item['product_id'];
    $product = wc_get_product($pid);
    return $product ? (float) $product->get_price() : 0.0;
}

/** Set type: 'configurable' or 'fixed'. */
function oeff_sets_get_set_type($set_id) {
    return get_post_meta($set_id, '_oeff_set_type', true) === 'configurable' ? 'configurable' : 'fixed';
}

/** Source category (term ID) for a configurable set. */
function oeff_sets_get_category($set_id) {
    return (int) get_post_meta($set_id, '_oeff_set_category', true);
}

/** Recipe for a fixed set: [ product_id => quantity ]. */
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

/** Normalized, ascending discount tiers for a configurable set. */
function oeff_sets_get_tiers($set_id) {
    $tiers = get_post_meta($set_id, '_oeff_set_tiers', true);
    $out   = [];
    if (is_array($tiers)) {
        foreach ($tiers as $t) {
            $min = isset($t['min_qty']) ? (int) $t['min_qty'] : 0;
            $pct = isset($t['percent']) ? (float) $t['percent'] : 0;
            if ($min > 0 && $pct > 0) {
                $out[] = ['min_qty' => $min, 'percent' => $pct];
            }
        }
        usort($out, function ($a, $b) {
            return $a['min_qty'] - $b['min_qty'];
        });
    }
    return $out;
}

/** Highest tier percent reached by $total_qty (tiers ascending); 0 if none. */
function oeff_sets_tier_percent($tiers, $total_qty) {
    $percent = 0.0;
    foreach ($tiers as $t) {
        if ($total_qty >= $t['min_qty']) {
            $percent = (float) $t['percent'];
        }
    }
    return $percent;
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

/** Expose the set grouping + discount state on each Store-API cart item. */
function oeff_sets_cart_item_data($cart_item) {
    if (empty($cart_item['oeff_set']['instance'])) {
        return [
            'is_set_member' => false,
            'set_id'        => 0,
            'instance'      => '',
            'name'          => '',
            'slug'          => '',
            'type'          => '',
            'percent'       => 0,
            'dissolved'     => false,
        ];
    }
    $inst = $cart_item['oeff_set']['instance'];
    $sid  = (int) ($cart_item['oeff_set']['id'] ?? 0);
    $info = isset($GLOBALS['oeff_sets_status'][$inst])
        ? $GLOBALS['oeff_sets_status'][$inst]
        : ['status' => 'applied', 'type' => 'fixed', 'percent' => 0];

    return [
        'is_set_member' => true,
        'set_id'        => $sid,
        'instance'      => (string) $inst,
        'name'          => $sid ? get_the_title($sid) : '',
        'slug'          => $sid ? (string) get_post_field('post_name', $sid) : '',
        'type'          => (string) (isset($info['type']) ? $info['type'] : 'fixed'),
        'percent'       => (float) (isset($info['percent']) ? $info['percent'] : 0),
        'dissolved'     => (isset($info['status']) && 'dissolved' === $info['status']),
    ];
}

/** Schema for the cart-item extension data above. */
function oeff_sets_cart_item_schema() {
    return [
        'is_set_member' => ['description' => 'Whether this line is part of a set.', 'type' => 'boolean', 'readonly' => true],
        'set_id'        => ['description' => 'The set (oeff_set) post ID this line belongs to.', 'type' => 'integer', 'readonly' => true],
        'instance'      => ['description' => 'Groups the lines of one added set instance together.', 'type' => 'string', 'readonly' => true],
        'name'          => ['description' => 'Set name, for the cart group header.', 'type' => 'string', 'readonly' => true],
        'slug'          => ['description' => 'Set slug, links to /sets/{slug}.', 'type' => 'string', 'readonly' => true],
        'type'          => ['description' => 'Set type: fixed or configurable.', 'type' => 'string', 'readonly' => true],
        'percent'       => ['description' => 'Applied discount percent for this set instance.', 'type' => 'number', 'readonly' => true],
        'dissolved'     => ['description' => 'True if a fixed set was changed so its discount no longer applies.', 'type' => 'boolean', 'readonly' => true],
    ];
}
