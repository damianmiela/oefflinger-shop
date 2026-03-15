<?php
/**
 * Plugin Name: Checkout Embed (Oefflinger)
 * Description: When checkout is loaded in iframe from frontend, output form only (no header/footer).
 * Sets cookie on checkout-link so redirect to checkout uses minimal template.
 */

defined('ABSPATH') || exit;

add_action('template_redirect', 'oefflinger_checkout_embed', 1);

function oefflinger_checkout_embed() {
    $frontend = getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000';

    if (is_checkout() && !is_wc_endpoint_url('order-received')) {
        if (isset($_GET['embed']) && $_GET['embed'] === '1') {
            oefflinger_set_embed_cookie();
        }
    }

    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/checkout-link') !== false) {
        oefflinger_set_embed_cookie();
        $frontend = getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000';
        if (!headers_sent()) {
            header("Content-Security-Policy: frame-ancestors 'self' " . $frontend);
            header_remove('X-Frame-Options');
        }
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

    $frontend = getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000';
    if (!headers_sent()) {
        header("Content-Security-Policy: frame-ancestors 'self' " . $frontend);
        header_remove('X-Frame-Options');
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
    $embed_template = dirname(__FILE__) . '/../theme/oefflinger-checkout/checkout-embed.php';
    if (file_exists($embed_template)) {
        return $embed_template;
    }
    return $template;
}
