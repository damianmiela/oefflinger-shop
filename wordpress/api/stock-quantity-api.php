<?php
/**
 * Plugin Name: Stock Quantity for Store API
 * Description: Adds stock_quantity and quantity_limits.maximum to product responses for headless frontend.
 */

if (!defined('ABSPATH')) {
    exit;
}

function oefflinger_inject_stock_quantity($response, $server, $request) {
    if (!function_exists('wc_get_product')) {
        return $response;
    }
    $route = $request->get_route() ?? '';
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    $is_products = (strpos($route, 'products') !== false) || (strpos($uri, 'wc/store') !== false && strpos($uri, 'products') !== false);
    if (!$is_products) {
        return $response;
    }
    if (!($response instanceof WP_REST_Response)) {
        return $response;
    }
    $data = $response->get_data();
    if (!is_array($data)) {
        return $response;
    }
    $products = isset($data[0]) && is_array($data[0]) ? $data : [$data];
    $modified = false;
    foreach ($products as $i => $product) {
        if (!is_array($product) || !isset($product['id'])) {
            continue;
        }
        $p = wc_get_product($product['id']);
        if ($p && $p->managing_stock()) {
            $qty = (int) $p->get_stock_quantity();
            $products[$i]['stock_quantity'] = $qty;
            $limits = $products[$i]['quantity_limits'] ?? ['minimum' => 1, 'maximum' => 9999, 'multiple_of' => 1, 'editable' => true];
            $limits['maximum'] = min($qty, 9999);
            $products[$i]['quantity_limits'] = $limits;
            $modified = true;
        }
    }
    if ($modified) {
        $response->set_data(isset($data[0]) && is_array($data[0]) ? $products : $products[0]);
    }
    return $response;
}

add_filter('rest_request_after_callbacks', 'oefflinger_inject_stock_quantity', 10, 3);
add_filter('woocommerce_hydration_request_after_callbacks', 'oefflinger_inject_stock_quantity', 10, 3);
