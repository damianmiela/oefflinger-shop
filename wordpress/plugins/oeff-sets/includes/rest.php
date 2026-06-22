<?php
/**
 * Öfflinger Sets — REST feed for the headless storefront.
 *
 *   GET oeff/v1/sets            → all active (published) sets, resolved + priced
 *   GET oeff/v1/sets/{id|slug}  → one set
 *
 * Public, read-only catalog data; only published sets are exposed. Prices are
 * returned in minor units (cents) to match the WooCommerce Store API the rest
 * of the frontend already consumes. CORS for /oeff/v1 is handled by the existing
 * cors mu-plugin.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('oeff/v1', '/sets', [
        'methods'             => 'GET',
        'callback'            => 'oeff_sets_rest_list',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('oeff/v1', '/sets/(?P<key>[a-zA-Z0-9_-]+)', [
        'methods'             => 'GET',
        'callback'            => 'oeff_sets_rest_single',
        'permission_callback' => '__return_true',
        'args'                => [
            'key' => ['required' => true],
        ],
    ]);
});

/** List all active sets. */
function oeff_sets_rest_list() {
    $query = new WP_Query([
        'post_type'      => OEFF_SETS_CPT,
        'post_status'    => 'publish',
        'posts_per_page' => 100,
        'orderby'        => 'menu_order title',
        'order'          => 'ASC',
        'no_found_rows'  => true,
    ]);

    $sets = [];
    foreach ($query->posts as $post) {
        $payload = oeff_sets_build_payload($post);
        if ($payload) {
            $sets[] = $payload;
        }
    }
    wp_reset_postdata();

    return rest_ensure_response($sets);
}

/** Single set by numeric ID or slug. */
function oeff_sets_rest_single($request) {
    $key  = $request['key'];
    $post = null;

    if (ctype_digit((string) $key)) {
        $candidate = get_post((int) $key);
        if ($candidate && OEFF_SETS_CPT === $candidate->post_type) {
            $post = $candidate;
        }
    } else {
        $candidate = get_page_by_path($key, OBJECT, OEFF_SETS_CPT);
        if ($candidate) {
            $post = $candidate;
        }
    }

    if (!$post || 'publish' !== $post->post_status) {
        return new WP_Error('oeff_set_not_found', 'Set nicht gefunden.', ['status' => 404]);
    }

    return rest_ensure_response(oeff_sets_build_payload($post));
}

/**
 * Resolve a Set post into the storefront payload: components (with product data),
 * computed set price / savings, and availability. Prices in cents.
 */
function oeff_sets_build_payload($post) {
    if (!function_exists('wc_get_product')) {
        return null;
    }

    $components_meta = get_post_meta($post->ID, '_oeff_set_components', true);
    $components_meta = is_array($components_meta) ? $components_meta : [];

    $mode  = get_post_meta($post->ID, '_oeff_set_pricing_mode', true) ?: 'percent';
    $value = (float) get_post_meta($post->ID, '_oeff_set_pricing_value', true);
    $type  = get_post_meta($post->ID, '_oeff_set_type', true) ?: 'fixed';

    $components = [];
    $sum_cents  = 0;
    $available  = !empty($components_meta);

    foreach ($components_meta as $c) {
        $cid = isset($c['id']) ? absint($c['id']) : 0;
        $qty = isset($c['qty']) ? max(1, (int) $c['qty']) : 1;
        if (!$cid) {
            $available = false;
            continue;
        }

        $product = wc_get_product($cid);
        if (!$product) {
            $available = false;
            continue;
        }

        $price_cents = (int) round((float) wc_get_price_to_display($product) * 100);
        $sum_cents  += $price_cents * $qty;

        $in_stock = $product->is_in_stock() && $product->is_purchasable();
        if (!$in_stock) {
            $available = false;
        }

        $image_id = $product->get_image_id();
        $components[] = [
            'id'       => $product->get_id(),
            'name'     => $product->get_name(),
            'slug'     => $product->get_slug(),
            'qty'      => $qty,
            'price'    => $price_cents,
            'image'    => $image_id ? wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail') : null,
            'in_stock' => $in_stock,
        ];
    }

    // Set price by pricing mode.
    $set_cents = $sum_cents;
    if ('fixed' === $mode) {
        $set_cents = (int) round($value * 100);
    } elseif ('percent' === $mode) {
        $set_cents = (int) round($sum_cents * (1 - $value / 100));
    } elseif ('amount' === $mode) {
        $set_cents = $sum_cents - (int) round($value * 100);
    }
    if ($set_cents < 0) {
        $set_cents = 0;
    }

    $savings_cents = max(0, $sum_cents - $set_cents);
    $savings_pct   = $sum_cents > 0 ? (int) round($savings_cents / $sum_cents * 100) : 0;

    $thumb_id = get_post_thumbnail_id($post->ID);

    return [
        'id'              => $post->ID,
        'slug'            => $post->post_name,
        'name'            => get_the_title($post->ID),
        'description'     => wpautop($post->post_content),
        'image'           => $thumb_id ? wp_get_attachment_image_url($thumb_id, 'large') : null,
        'type'            => $type,
        'pricing_mode'    => $mode,
        'components'      => $components,
        'components_sum'  => $sum_cents,
        'set_price'       => $set_cents,
        'savings'         => $savings_cents,
        'savings_percent' => $savings_pct,
        'available'       => $available,
        'currency_code'   => function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'EUR',
    ];
}
