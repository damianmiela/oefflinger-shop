<?php
/**
 * Oefflinger Checkout Theme
 */

add_theme_support('woocommerce');
add_theme_support('wc-product-gallery-zoom');
add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);

add_action('wp_enqueue_scripts', 'oefflinger_theme_scripts');

function oefflinger_theme_scripts() {
    wp_enqueue_style(
        'oefflinger-theme-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        [],
        null
    );
    wp_add_inline_style('oefflinger-theme-fonts', '
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
    ');
}

function oefflinger_frontend_url() {
    return getenv('FRONTEND_URL') ?: 'http://localhost:4000';
}

function oefflinger_logo_url() {
    return oefflinger_frontend_url() . '/logo/logo-transparent.png';
}
