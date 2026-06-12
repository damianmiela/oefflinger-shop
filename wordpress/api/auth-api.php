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
        ['password-reset-request', 'POST', 'oeff_auth_password_reset_request', false],
        ['password-reset',         'POST', 'oeff_auth_password_reset',         false],
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
    register_rest_route('oeff/v1', '/order/(?P<id>\\d+)', [
        'methods'             => 'GET',
        'callback'            => 'oeff_auth_order_detail',
        'permission_callback' => '__return_true',
    ]);
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
    if (!oeff_rate_limit('login', 10, 15 * MINUTE_IN_SECONDS)) {
        return oeff_auth_error('rate_limited', 'Zu viele Anmeldeversuche. Bitte versuchen Sie es in einigen Minuten erneut.', 429);
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
    // Honeypot: hidden field bots tend to fill – reject without detail
    if ((string) ($request->get_param('website') ?? '') !== '') {
        return oeff_auth_error('register_failed', 'Registrierung fehlgeschlagen.', 400);
    }
    if (!oeff_rate_limit('register', 3, HOUR_IN_SECONDS)) {
        return oeff_auth_error('rate_limited', 'Zu viele Registrierungen. Bitte versuchen Sie es später erneut.', 429);
    }
    if (!oeff_verify_turnstile((string) ($request->get_param('turnstile_token') ?? ''))) {
        return oeff_auth_error('captcha_failed', 'Sicherheitsprüfung fehlgeschlagen. Bitte laden Sie die Seite neu und versuchen Sie es erneut.', 400);
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
        // Real orders only – no checkout drafts ("Entwurf")
        'status'      => ['pending', 'processing', 'on-hold', 'completed', 'refunded'],
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

function oeff_auth_order_item_payload($item) {
    $product   = $item->get_product();
    $image_url = null;
    $slug      = null;
    if ($product) {
        $image_id = $product->get_image_id();
        if ($image_id) {
            $image_url = wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail');
        }
        $parent = $product->is_type('variation')
            ? wc_get_product($product->get_parent_id())
            : $product;
        if ($parent) {
            $slug = $parent->get_slug();
        }
    }
    return [
        'name'     => $item->get_name(),
        'quantity' => $item->get_quantity(),
        'total'    => wc_format_decimal($item->get_total(), 2),
        'image'    => $image_url,
        'slug'     => $slug,
    ];
}

function oeff_auth_order_detail(WP_REST_Request $request) {
    $user_id = oeff_auth_user_id();
    if (!$user_id) {
        return oeff_auth_error('not_logged_in', 'Nicht angemeldet.', 401);
    }
    $order = wc_get_order((int) $request['id']);
    if (!$order || (int) $order->get_customer_id() !== $user_id) {
        return oeff_auth_error('not_found', 'Bestellung nicht gefunden.', 404);
    }
    $address = function ($type) use ($order) {
        $get = fn($field) => $order->{"get_{$type}_{$field}"}();
        return [
            'first_name' => $get('first_name'),
            'last_name'  => $get('last_name'),
            'address_1'  => $get('address_1'),
            'address_2'  => $get('address_2'),
            'postcode'   => $get('postcode'),
            'city'       => $get('city'),
            'country'    => $get('country'),
        ];
    };
    return new WP_REST_Response(['order' => [
        'id'              => $order->get_id(),
        'number'          => $order->get_order_number(),
        'date'            => $order->get_date_created() ? $order->get_date_created()->date('d.m.Y H:i') : null,
        'status'          => $order->get_status(),
        'status_label'    => wc_get_order_status_name($order->get_status()),
        'currency'        => $order->get_currency(),
        'subtotal'        => wc_format_decimal($order->get_subtotal(), 2),
        'shipping_total'  => wc_format_decimal($order->get_shipping_total(), 2),
        'discount_total'  => wc_format_decimal($order->get_discount_total(), 2),
        'total_tax'       => wc_format_decimal($order->get_total_tax(), 2),
        'total'           => wc_format_decimal($order->get_total(), 2),
        'payment_method'  => $order->get_payment_method_title(),
        'shipping_method' => $order->get_shipping_method(),
        'customer_note'   => $order->get_customer_note(),
        'billing'         => $address('billing'),
        'shipping'        => $address('shipping'),
        'items'           => array_values(array_map('oeff_auth_order_item_payload', $order->get_items())),
    ]], 200);
}

/**
 * Request a password reset link (always answers generically – never reveals
 * whether an account exists). Protections: origin, honeypot, rate limit, Turnstile.
 */
function oeff_auth_password_reset_request(WP_REST_Request $request) {
    if (!oeff_auth_check_origin($request)) {
        return oeff_auth_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    if ((string) ($request->get_param('website') ?? '') !== '') {
        return new WP_REST_Response(['ok' => true], 200); // honeypot: fake success
    }
    if (!oeff_rate_limit('password_reset_request', 3, HOUR_IN_SECONDS)) {
        return oeff_auth_error('rate_limited', 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.', 429);
    }
    if (!oeff_verify_turnstile((string) ($request->get_param('turnstile_token') ?? ''))) {
        return oeff_auth_error('captcha_failed', 'Sicherheitsprüfung fehlgeschlagen. Bitte laden Sie die Seite neu und versuchen Sie es erneut.', 400);
    }
    $email = sanitize_email($request->get_param('email') ?? '');
    if (!is_email($email)) {
        return oeff_auth_error('invalid_email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 400);
    }

    $user = get_user_by('email', $email);
    if ($user) {
        $key = get_password_reset_key($user);
        if (!is_wp_error($key)) {
            $frontend = rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:4000', '/');
            $url = $frontend . '/konto/passwort-zuruecksetzen?login=' . rawurlencode($user->user_login) . '&key=' . rawurlencode($key);
            $name = $user->first_name ?: $user->display_name;
            $subject = 'Passwort zurücksetzen – Öfflinger';
            $body = sprintf(
                "Hallo %s,\n\nfür Ihr Konto bei Öfflinger wurde das Zurücksetzen des Passworts angefordert.\n\nKlicken Sie auf den folgenden Link, um ein neues Passwort zu vergeben:\n%s\n\nDer Link ist 24 Stunden gültig. Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren – Ihr Passwort bleibt unverändert.\n\nIhr Öfflinger-Team",
                $name,
                $url
            );
            wp_mail($email, $subject, $body);
        }
    }

    // Always generic – never reveal whether an account exists
    return new WP_REST_Response(['ok' => true], 200);
}

/** Set a new password using a reset key, then log the customer in. */
function oeff_auth_password_reset(WP_REST_Request $request) {
    if (!oeff_auth_check_origin($request)) {
        return oeff_auth_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    if (!oeff_rate_limit('password_reset', 5, HOUR_IN_SECONDS)) {
        return oeff_auth_error('rate_limited', 'Zu viele Versuche. Bitte versuchen Sie es später erneut.', 429);
    }
    $login    = (string) ($request->get_param('login') ?? '');
    $key      = (string) ($request->get_param('key') ?? '');
    $password = (string) ($request->get_param('password') ?? '');

    if ($login === '' || $key === '') {
        return oeff_auth_error('invalid_link', 'Der Link ist ungültig. Bitte fordern Sie einen neuen Link an.', 400);
    }
    if (strlen($password) < 8) {
        return oeff_auth_error('weak_password', 'Das Passwort muss mindestens 8 Zeichen lang sein.', 400);
    }

    $user = check_password_reset_key($key, $login);
    if (is_wp_error($user)) {
        return oeff_auth_error('invalid_key', 'Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.', 400);
    }

    reset_password($user, $password);
    if (class_exists('WP_Session_Tokens')) {
        WP_Session_Tokens::get_instance($user->ID)->destroy_all();
    }
    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID, true);

    return new WP_REST_Response(['user' => oeff_auth_user_payload($user->ID)], 200);
}
