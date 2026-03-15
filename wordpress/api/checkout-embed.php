<?php
/**
 * Plugin Name: Checkout Embed (Oefflinger)
 * Description: When checkout is loaded in iframe from frontend, output form only (no header/footer).
 * Provides checkout-link endpoint: add products to cart and redirect to checkout.
 */

defined('ABSPATH') || exit;

add_action('init', 'oefflinger_remove_woo_frame_header', 999);
add_action('template_redirect', 'oefflinger_handle_checkout_link', 0);
add_action('template_redirect', 'oefflinger_checkout_embed', 1);
add_action('send_headers', 'oefflinger_allow_frontend_frame', 999);

/**
 * Handle checkout-link: add products to cart, set embed cookie, redirect to checkout.
 * Uses REQUEST_URI to avoid needing rewrite rules.
 */
function oefflinger_handle_checkout_link() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/checkout-link') === false) {
        return;
    }

    oefflinger_set_embed_cookie();

    $products_param = isset($_GET['products']) ? sanitize_text_field(wp_unslash($_GET['products'])) : '';
    if (empty($products_param)) {
        wp_safe_redirect(wc_get_checkout_url());
        exit;
    }

    if (!function_exists('WC') || !WC()->cart) {
        wp_safe_redirect(wc_get_checkout_url());
        exit;
    }

    WC()->cart->empty_cart();

    $pairs = array_map('trim', explode(',', $products_param));
    foreach ($pairs as $pair) {
        $parts = explode(':', $pair, 2);
        $product_id = isset($parts[0]) ? absint($parts[0]) : 0;
        $qty = isset($parts[1]) ? max(1, absint($parts[1])) : 1;
        if ($product_id && wc_get_product($product_id)) {
            WC()->cart->add_to_cart($product_id, $qty);
        }
    }

    if (!empty($_GET['coupon'])) {
        WC()->cart->apply_coupon(sanitize_text_field(wp_unslash($_GET['coupon'])));
    }

    wp_safe_redirect(wc_get_checkout_url());
    exit;
}

function oefflinger_remove_woo_frame_header() {
    if (!oefflinger_should_allow_frame()) {
        return;
    }
    if (function_exists('wc_send_frame_options_header')) {
        remove_action('template_redirect', 'wc_send_frame_options_header');
    }
}

function oefflinger_should_allow_frame() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/checkout-link') !== false) {
        return true;
    }
    if (preg_match('#/checkout(/|$|\?)#', $uri)) {
        if (strpos($uri, 'order-received') !== false) {
            return false;
        }
        return true;
    }
    if (function_exists('is_checkout') && is_checkout()) {
        if (function_exists('is_wc_endpoint_url') && is_wc_endpoint_url('order-received')) {
            return false;
        }
        return true;
    }
    return false;
}

function oefflinger_allow_frontend_frame() {
    if (!oefflinger_should_allow_frame()) {
        return;
    }
    if (headers_sent()) {
        return;
    }
    header_remove('X-Frame-Options');
    header_remove('Content-Security-Policy');
    $frontend = getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000';
    header("Content-Security-Policy: frame-ancestors 'self' " . $frontend);
}

function oefflinger_checkout_embed() {
    if (is_checkout() && !is_wc_endpoint_url('order-received')) {
        if (isset($_GET['embed']) && $_GET['embed'] === '1') {
            oefflinger_set_embed_cookie();
        }
    }

    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/checkout-link') !== false) {
        oefflinger_set_embed_cookie();
        return;
    }

    if (!function_exists('is_checkout') || !is_checkout()) {
        return;
    }

    if (is_wc_endpoint_url('order-received')) {
        oefflinger_clear_embed_cookie();
        return;
    }

    if (!isset($_COOKIE['oeff_embed']) || $_COOKIE['oeff_embed'] !== '1') {
        return;
    }

    add_filter('template_include', 'oefflinger_checkout_embed_template', 99);
}

function oefflinger_clear_embed_cookie() {
    if (headers_sent()) {
        return;
    }
    $path = '/';
    $domain = parse_url(home_url(), PHP_URL_HOST);
    setcookie('oeff_embed', '', time() - 3600, $path, $domain, is_ssl(), true);
}

function oefflinger_set_embed_cookie() {
    if (headers_sent()) {
        return;
    }
    $path = '/';
    $domain = parse_url(home_url(), PHP_URL_HOST);
    setcookie('oeff_embed', '1', time() + 3600, $path, $domain, is_ssl(), true);
}

function oefflinger_checkout_embed_template($template) {
    $embed_template = dirname(__FILE__) . '/../themes/oefflinger-checkout/checkout-embed.php';
    if (file_exists($embed_template)) {
        return $embed_template;
    }
    return $template;
}
