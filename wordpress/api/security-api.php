<?php
/**
 * Plugin Name: Security (Oefflinger)
 * Description: Bot protection – Cloudflare Turnstile verification, rate
 * limiting for auth endpoints and Store API checkout.
 */

defined('ABSPATH') || exit;

/** Best-effort client IP (works behind the reverse proxy). */
function oeff_client_ip() {
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', $_SERVER[$key])[0];
            return trim($ip);
        }
    }
    return '0.0.0.0';
}

/**
 * Transient-based rate limiter.
 * Returns true when the action is ALLOWED, false when the limit is exceeded.
 */
function oeff_rate_limit($action, $max, $window_seconds) {
    $key   = 'oeff_rl_' . md5($action . '|' . oeff_client_ip());
    $count = (int) get_transient($key);
    if ($count >= $max) {
        return false;
    }
    set_transient($key, $count + 1, $window_seconds);
    return true;
}

/**
 * Verify a Cloudflare Turnstile token (server side).
 * If TURNSTILE_SECRET_KEY is not configured, verification is skipped (dev mode).
 */
function oeff_verify_turnstile($token) {
    $secret = getenv('TURNSTILE_SECRET_KEY');
    if (!$secret) {
        return true; // not configured – do not block
    }
    if (!$token) {
        return false;
    }
    $response = wp_remote_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
        'timeout' => 10,
        'body'    => [
            'secret'   => $secret,
            'response' => $token,
            'remoteip' => oeff_client_ip(),
        ],
    ]);
    if (is_wp_error($response)) {
        return false;
    }
    $body = json_decode(wp_remote_retrieve_body($response), true);
    return !empty($body['success']);
}

/**
 * Store API rate limiting is DISABLED on purpose. This is a headless setup, so
 * all SSR/ISR/build requests share the Next.js server's single IP. WooCommerce
 * rate-limits by IP and writes to wp_wc_rate_limits on every request; under that
 * shared-IP load it caused severe InnoDB row-lock contention ("Lock wait timeout
 * exceeded") that jammed the whole database. Abuse protection for the sensitive
 * checkout POST is handled separately below (oeff_rate_limit), and edge/IP rate
 * limiting belongs at the reverse proxy where the real client IP is available.
 */
add_filter('woocommerce_store_api_rate_limit_options', function ($options) {
    $options['enabled'] = false;
    return $options;
});

/** Additional strict limit on order submission (checkout POST): 10 per hour per IP. */
add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    if (
        $request->get_method() === 'POST' &&
        strpos($request->get_route(), '/wc/store/v1/checkout') === 0
    ) {
        if (!oeff_rate_limit('checkout', 10, HOUR_IN_SECONDS)) {
            return new WP_REST_Response([
                'code'    => 'rate_limited',
                'message' => 'Zu viele Bestellversuche. Bitte versuchen Sie es später erneut.',
            ], 429);
        }
    }
    return $result;
}, 5, 3);
