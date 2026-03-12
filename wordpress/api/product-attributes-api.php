<?php
/**
 * Plugin Name: Product Attributes for Store API
 * Description: Adds product attributes (Größe, Konzentration, etc.) to Store API product responses.
 */

if (!defined('ABSPATH')) {
    exit;
}

function oefflinger_inject_product_attributes($response, $server, $request) {
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
        if (!$p) {
            continue;
        }
        $attrs = $p->get_attributes();
        if (empty($attrs)) {
            continue;
        }
        $attributes = [];
        foreach ($attrs as $attr_name => $attr) {
            if (!$attr->get_visible()) {
                continue;
            }
            $options = $attr->get_options();
            $options_str = [];
            foreach ($options as $opt) {
                if (is_numeric($opt) && taxonomy_exists($attr_name)) {
                    $term = get_term((int) $opt, $attr_name);
                    $options_str[] = ($term && !is_wp_error($term)) ? $term->name : (string) $opt;
                } else {
                    $options_str[] = (string) $opt;
                }
            }
            $options_str = array_values(array_filter($options_str));
            if (empty($options_str)) {
                continue;
            }
            $name = $attr->get_name();
            if (strpos($name, 'pa_') === 0) {
                $tax = get_taxonomy($name);
                $name = $tax && $tax->labels ? $tax->labels->singular_name : ucfirst(str_replace(['pa_', '-'], ['', ' '], $name));
            }
            $attributes[] = [
                'id' => $attr->get_id(),
                'name' => $name,
                'attribute' => $attr_name,
                'options' => $options_str,
                'visible' => $attr->get_visible(),
                'variation' => $attr->get_variation(),
            ];
        }
        if (!empty($attributes)) {
            $products[$i]['attributes'] = $attributes;
            $modified = true;
        }
    }
    if ($modified) {
        $response->set_data(isset($data[0]) && is_array($data[0]) ? $products : $products[0]);
    }
    return $response;
}

add_filter('rest_request_after_callbacks', 'oefflinger_inject_product_attributes', 10, 3);
add_filter('woocommerce_hydration_request_after_callbacks', 'oefflinger_inject_product_attributes', 10, 3);
