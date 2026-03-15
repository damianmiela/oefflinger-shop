<?php
/**
 * Plugin Name: Checkout Embed (Oefflinger)
 * Description: Allow checkout in iframe from frontend (CSP, remove X-Frame-Options).
 */

defined('ABSPATH') || exit;

add_action('init', 'oefflinger_remove_woo_frame_header', 999);
add_action('send_headers', 'oefflinger_allow_frontend_frame', 999);

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
