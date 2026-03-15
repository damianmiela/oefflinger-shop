<?php
/**
 * Plugin Name: CORS for Store API
 * Description: Adds CORS headers for headless frontend (Next.js) to access WooCommerce Store API.
 */

function oefflinger_cors_get_allowed_origins() {
    $env = getenv('CORS_ALLOWED_ORIGINS');
    if ($env) {
        return array_map('trim', explode(',', $env));
    }
    return ['http://localhost:4000', 'http://127.0.0.1:4000'];
}

add_filter('rest_pre_serve_request', function ($served, $response, $request, $server) {
    $origin = $request->get_header('Origin');
    $allowed = oefflinger_cors_get_allowed_origins();

    if ($origin && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Expose-Headers: Cart-Token');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Cart-Token');
        header('Access-Control-Max-Age: 86400');
    }

    return $served;
}, 10, 4);

add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    if ($request->get_method() === 'OPTIONS') {
        $origin = $request->get_header('Origin');
        $allowed = oefflinger_cors_get_allowed_origins();

        if ($origin && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Expose-Headers: Cart-Token');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Cart-Token');
            header('Access-Control-Max-Age: 86400');
            return new WP_REST_Response(null, 204);
        }
    }

    return $result;
}, 10, 3);
