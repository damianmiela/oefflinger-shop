<?php
/**
 * Plugin Name: Auth API (Oefflinger)
 * Description: Cookie-based auth endpoints for the headless frontend
 * (login, logout, register, me, orders, addresses).
 */

defined('ABSPATH') || exit;

/** Hide the admin bar on the WP frontend (only used inside the checkout iframe). */
add_filter('show_admin_bar', '__return_false');

add_action('rest_api_init', 'oeff_auth_register_routes');

function oeff_auth_register_routes() {
    $routes = [
        ['login',    'POST', 'oeff_auth_login',           false],
        ['logout',   'POST', 'oeff_auth_logout',          true],
        ['register', 'POST', 'oeff_auth_register',        false],
        ['me',       'GET',  'oeff_auth_me',              true],
        ['orders',   'GET',  'oeff_auth_orders',          true],
        ['address',  'POST', 'oeff_auth_update_address',  true],
    ];
    foreach ($routes as [$path, $method, $cb, $needs_auth]) {
        register_rest_route('oeff/v1', '/' . $path, [
            'methods'             => $method,
            'callback'            => $cb,
            'permission_callback' => '__return_true', // auth handled per-callback via cookie
        ]);
    }
}

/** Resolve the current user from the WP logged-in cookie (REST nonce not required). */
function oeff_auth_user_id() {
    if (empty($_COOKIE[LOGGED_IN_COOKIE])) {
        return 0;
    }
    $user_id = wp_validate_auth_cookie($_COOKIE[LOGGED_IN_COOKIE], 'logged_in');
    return $user_id ? (int) $user_id : 0;
}

/** CSRF protection: mutating requests must come from an allowed origin. */
function oeff_auth_check_origin(WP_REST_Request $request) {
    $origin = $request->get_header('Origin');
    if (!$origin) {
        return true; // same-origin (no Origin header on some GETs)
    }
    $allowed = function_exists('oefflinger_cors_get_allowed_origins')
        ? oefflinger_cors_get_allowed_origins()
        : [];
    $allowed[] = rtrim(getenv('WP_URL') ?: home_url(), '/');
    return in_array(rtrim($origin, '/'), array_map(fn($o) => rtrim($o, '/'), $allowed), true);
}

function oeff_auth_error($code, $message, $status) {
    return new WP_REST_Response(['code' => $code, 'message' => $message], $status);
}

function oeff_auth_user_payload($user_id) {
    $user     = get_userdata($user_id);
    $customer = new WC_Customer($user_id);
    return [
        'id'         => $user_id,
        'email'      => $user->user_email,
        'first_name' => $customer->get_first_name() ?: $user->first_name,
        'last_name'  => $customer->get_last_name() ?: $user->last_name,
        'billing'    => [
            'first_name' => $customer->get_billing_first_name(),
            'last_name'  => $customer->get_billing_last_name(),
            'address_1'  => $customer->get_billing_address_1(),
            'address_2'  => $customer->get_billing_address_2(),
            'postcode'   => $customer->get_billing_postcode(),
            'city'       => $customer->get_billing_city(),
            'country'    => $customer->get_billing_country() ?: 'DE',
            'phone'      => $customer->get_billing_phone(),
        ],
        'shipping'   => [
            'first_name' => $customer->get_shipping_first_name(),
            'last_name'  => $customer->get_shipping_last_name(),
            'address_1'  => $customer->get_shipping_address_1(),
            'address_2'  => $customer->get_shipping_address_2(),
            'postcode'   => $customer->get_shipping_postcode(),
            'city'       => $customer->get_shipping_city(),
            'country'    => $customer->get_shipping_country() ?: 'DE',
        ],
    ];
}

function oeff_auth_login(WP_REST_Request $request) {
    if (!oeff_auth_check_origin($request)) {
        return oeff_auth_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    $login    = sanitize_text_field($request->get_param('login') ?? '');
    $password = (string) ($request->get_param('password') ?? '');
    if (!$login || !$password) {
        return oeff_auth_error('missing_fields', 'E-Mail und Passwort sind erforderlich.', 400);
    }
    $user = wp_authenticate($login, $password);
    if (is_wp_error($user)) {
        return oeff_auth_error('invalid_credentials', 'E-Mail oder Passwort ist falsch.', 401);
    }
    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID, true); // "remember me"
    return new WP_REST_Response(['user' => oeff_auth_user_payload($user->ID)], 200);
}

function oeff_auth_logout(WP_REST_Request $request) {
    if (!oeff_auth_check_origin($request)) {
        return oeff_auth_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    $user_id = oeff_auth_user_id();
    if ($user_id) {
        wp_set_current_user($user_id);
    }
    wp_logout();
    return new WP_REST_Response(['success' => true], 200);
}

function oeff_auth_register(WP_REST_Request $request) {
    if (!oeff_auth_check_origin($request)) {
        return oeff_auth_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    $email      = sanitize_email($request->get_param('email') ?? '');
    $password   = (string) ($request->get_param('password') ?? '');
    $first_name = sanitize_text_field($request->get_param('first_name') ?? '');
    $last_name  = sanitize_text_field($request->get_param('last_name') ?? '');

    if (!is_email($email)) {
        return oeff_auth_error('invalid_email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 400);
    }
    if (strlen($password) < 8) {
        return oeff_auth_error('weak_password', 'Das Passwort muss mindestens 8 Zeichen lang sein.', 400);
    }
    if (email_exists($email)) {
        return oeff_auth_error('email_exists', 'Für diese E-Mail-Adresse existiert bereits ein Konto.', 409);
    }
    $customer_id = wc_create_new_customer($email, '', $password, [
        'first_name' => $first_name,
        'last_name'  => $last_name,
    ]);
    if (is_wp_error($customer_id)) {
        return oeff_auth_error('register_failed', $customer_id->get_error_message(), 400);
    }
    wp_set_current_user($customer_id);
    wp_set_auth_cookie($customer_id, true);
    return new WP_REST_Response(['user' => oeff_auth_user_payload($customer_id)], 201);
}

function oeff_auth_me(WP_REST_Request $request) {
    $user_id = oeff_auth_user_id();
    if (!$user_id) {
        return oeff_auth_error('not_logged_in', 'Nicht angemeldet.', 401);
    }
    return new WP_REST_Response(['user' => oeff_auth_user_payload($user_id)], 200);
}

function oeff_auth_orders(WP_REST_Request $request) {
    $user_id = oeff_auth_user_id();
    if (!$user_id) {
        return oeff_auth_error('not_logged_in', 'Nicht angemeldet.', 401);
    }
    $orders = wc_get_orders([
        'customer_id' => $user_id,
        'limit'       => 25,
        'orderby'     => 'date',
        'order'       => 'DESC',
    ]);
    $payload = array_map(function ($order) {
        return [
            'id'       => $order->get_id(),
            'number'   => $order->get_order_number(),
            'date'     => $order->get_date_created() ? $order->get_date_created()->date('Y-m-d') : null,
            'status'   => $order->get_status(),
            'status_label' => wc_get_order_status_name($order->get_status()),
            'total'    => $order->get_total(),
            'currency' => $order->get_currency(),
            'items'    => array_values(array_map(function ($item) {
                return [
                    'name'     => $item->get_name(),
                    'quantity' => $item->get_quantity(),
                ];
            }, $order->get_items())),
        ];
    }, $orders);
    return new WP_REST_Response(['orders' => $payload], 200);
}

function oeff_auth_update_address(WP_REST_Request $request) {
    if (!oeff_auth_check_origin($request)) {
        return oeff_auth_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    $user_id = oeff_auth_user_id();
    if (!$user_id) {
        return oeff_auth_error('not_logged_in', 'Nicht angemeldet.', 401);
    }
    $customer = new WC_Customer($user_id);
    $billing  = $request->get_param('billing');
    $shipping = $request->get_param('shipping');

    $fields = ['first_name', 'last_name', 'address_1', 'address_2', 'postcode', 'city', 'country', 'phone'];
    if (is_array($billing)) {
        foreach ($fields as $f) {
            if (array_key_exists($f, $billing)) {
                $setter = "set_billing_$f";
                if (method_exists($customer, $setter)) {
                    $customer->$setter(sanitize_text_field($billing[$f]));
                }
            }
        }
    }
    if (is_array($shipping)) {
        foreach ($fields as $f) {
            if ($f === 'phone') continue;
            if (array_key_exists($f, $shipping)) {
                $setter = "set_shipping_$f";
                if (method_exists($customer, $setter)) {
                    $customer->$setter(sanitize_text_field($shipping[$f]));
                }
            }
        }
    }
    $customer->save();
    return new WP_REST_Response(['user' => oeff_auth_user_payload($user_id)], 200);
}
