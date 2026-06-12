<?php
/**
 * Plugin Name: Frontend Lockdown (Oefflinger)
 * Description: WordPress only serves the embedded checkout and APIs. All other
 * frontend pages redirect to the headless Next.js frontend, where unknown
 * paths get a proper 404.
 */

defined('ABSPATH') || exit;

add_action('template_redirect', 'oeff_lockdown_redirect', 1);

function oeff_lockdown_redirect() {
    // Shop managers / admins may view the WP site (customizer previews etc.)
    if (is_user_logged_in() && current_user_can('manage_woocommerce')) {
        return;
    }

    // Checkout pages stay (the embedded checkout, incl. order confirmation)
    if (function_exists('is_checkout') && is_checkout()) {
        return;
    }
    if (function_exists('oefflinger_should_allow_frame') && oefflinger_should_allow_frame()) {
        return;
    }

    $frontend = rtrim(getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000', '/');
    $uri      = $_SERVER['REQUEST_URI'] ?? '/';
    $path     = parse_url($uri, PHP_URL_PATH) ?: '/';
    $query    = parse_url($uri, PHP_URL_QUERY);

    // Map WP routes to their headless equivalents; unknown paths pass through
    // unchanged and hit the frontend's 404 page.
    if (preg_match('#^/my-account#', $path)) {
        $path = '/konto';
    } elseif (preg_match('#^/(\?.*)?$#', $path) || $path === '/') {
        $path = '/';
    }

    wp_redirect($frontend . $path . ($query ? '?' . $query : ''), 302);
    exit;
}

/**
 * Customers must never end up in wp-admin. WooCommerce already blocks them,
 * but its redirect target (my-account) gets re-redirected by the lockdown
 * above – send them straight to the frontend account page instead.
 */
add_filter('woocommerce_prevent_admin_access', '__return_true');
add_filter('login_redirect', function ($redirect, $requested, $user) {
    if ($user instanceof WP_User && !user_can($user, 'manage_woocommerce')) {
        $frontend = rtrim(getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000', '/');
        return $frontend . '/konto';
    }
    return $redirect;
}, 10, 3);
