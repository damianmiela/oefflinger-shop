<?php
/**
 * Plugin Name: Newsletter (Oefflinger)
 * Description: Double-opt-in newsletter signup for the headless frontend. Stores
 * subscribers as a private `oeff_newsletter` CPT, sends a German confirmation
 * email (DOI), and issues a 10% WooCommerce welcome coupon on confirmation.
 *
 * Endpoints (oeff/v1):
 *   POST /newsletter/subscribe    { email, website (honeypot), turnstile_token }
 *   POST /newsletter/confirm      { token }
 *   POST /newsletter/unsubscribe  { token }
 *
 * Protections mirror the auth/contact APIs: origin check, honeypot, Turnstile,
 * rate limit. Responses are generic (no email enumeration).
 */

defined('ABSPATH') || exit;

/* ------------------------------------------------------------------ CPT --- */

add_action('init', function () {
    register_post_type('oeff_newsletter', [
        'labels' => [
            'name'          => 'Newsletter',
            'singular_name' => 'Newsletter-Abonnent',
            'menu_name'     => 'Newsletter',
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => false,
        'menu_icon'           => 'dashicons-email',
        'capability_type'     => 'post',
        'supports'            => ['title'],
        'exclude_from_search' => true,
    ]);
});

/** Owner-facing admin columns: status + confirmation date. */
add_filter('manage_oeff_newsletter_posts_columns', function ($cols) {
    return [
        'cb'        => $cols['cb'] ?? '<input type="checkbox" />',
        'title'     => 'E-Mail',
        'oeff_status' => 'Status',
        'oeff_confirmed' => 'Bestätigt am',
        'date'      => $cols['date'] ?? 'Datum',
    ];
});
add_action('manage_oeff_newsletter_posts_custom_column', function ($col, $post_id) {
    if ($col === 'oeff_status') {
        $status = get_post_meta($post_id, '_oeff_nl_status', true) ?: 'pending';
        $labels = ['pending' => '⏳ ausstehend', 'confirmed' => '✅ bestätigt', 'unsubscribed' => '🚫 abgemeldet'];
        echo esc_html($labels[$status] ?? $status);
    } elseif ($col === 'oeff_confirmed') {
        echo esc_html(get_post_meta($post_id, '_oeff_nl_confirmed_at', true) ?: '—');
    }
}, 10, 2);

/* -------------------------------------------------------------- helpers --- */

function oeff_nl_error($code, $message, $status) {
    return new WP_REST_Response(['code' => $code, 'message' => $message], $status);
}

function oeff_nl_token() {
    return bin2hex(random_bytes(16));
}

function oeff_nl_frontend_url() {
    return rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:4000', '/');
}

/** Find a subscriber post id by (lower-cased) email, or 0. */
function oeff_nl_find_by_email($email) {
    $q = new WP_Query([
        'post_type'      => 'oeff_newsletter',
        'post_status'    => 'any',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'meta_query'     => [[
            'key'   => '_oeff_nl_email',
            'value' => strtolower($email),
        ]],
    ]);
    return $q->have_posts() ? (int) $q->posts[0] : 0;
}

/** Find a subscriber post id by token, or 0. */
function oeff_nl_find_by_token($token) {
    if ($token === '') {
        return 0;
    }
    $q = new WP_Query([
        'post_type'      => 'oeff_newsletter',
        'post_status'    => 'any',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'meta_query'     => [[
            'key'   => '_oeff_nl_token',
            'value' => $token,
        ]],
    ]);
    return $q->have_posts() ? (int) $q->posts[0] : 0;
}

function oeff_nl_send_confirmation_email($email, $token) {
    $url     = oeff_nl_frontend_url() . '/newsletter/bestaetigen?token=' . rawurlencode($token);
    $subject = 'Bitte bestätigen Sie Ihre Newsletter-Anmeldung – Öfflinger';
    $body    = sprintf(
        "Hallo,\n\nvielen Dank für Ihr Interesse am Öfflinger-Newsletter.\n\n" .
        "Bitte bestätigen Sie Ihre Anmeldung mit einem Klick auf den folgenden Link:\n%s\n\n" .
        "Nach der Bestätigung erhalten Sie Ihren 10%%-Willkommensgutschein für Ihre erste Bestellung.\n\n" .
        "Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach – es werden dann keine Daten gespeichert oder E-Mails versendet.\n\n" .
        "Ihr Öfflinger-Team",
        $url
    );
    wp_mail($email, $subject, $body);
}

function oeff_nl_send_coupon_email($email, $code, $token) {
    $unsub   = oeff_nl_frontend_url() . '/newsletter/abmelden?token=' . rawurlencode($token);
    $subject = 'Ihr 10%-Willkommensgutschein – Öfflinger';
    $body    = sprintf(
        "Hallo,\n\nvielen Dank – Ihre Newsletter-Anmeldung ist bestätigt.\n\n" .
        "Ihr persönlicher Willkommensgutschein über 10%% auf Ihre erste Bestellung:\n\n    %s\n\n" .
        "Lösen Sie den Code im Warenkorb bzw. an der Kasse ein. Der Gutschein ist 90 Tage gültig, " .
        "einmalig einlösbar und an diese E-Mail-Adresse gebunden.\n\n" .
        "Sie möchten den Newsletter nicht mehr erhalten? Hier abmelden:\n%s\n\n" .
        "Ihr Öfflinger-Team",
        $code,
        $unsub
    );
    wp_mail($email, $subject, $body);
}

/**
 * Create a single-use 10% welcome coupon bound to the subscriber's email.
 * Returns the coupon code, or '' if WooCommerce is unavailable.
 */
function oeff_nl_create_welcome_coupon($email) {
    if (!class_exists('WC_Coupon')) {
        return '';
    }
    $code = 'WILLKOMMEN10-' . strtoupper(wp_generate_password(6, false, false));
    try {
        $coupon = new WC_Coupon();
        $coupon->set_code($code);
        $coupon->set_discount_type('percent');
        $coupon->set_amount(10);
        $coupon->set_individual_use(true);
        $coupon->set_usage_limit(1);
        $coupon->set_email_restrictions([strtolower($email)]);
        $coupon->set_date_expires(strtotime('+90 days'));
        $coupon->set_description('Newsletter-Willkommensgutschein (10%)');
        $coupon->save();
    } catch (Exception $e) {
        return '';
    }
    return $code;
}

/* --------------------------------------------------------------- routes --- */

add_action('rest_api_init', function () {
    $routes = [
        ['/newsletter/subscribe',   'oeff_nl_subscribe'],
        ['/newsletter/confirm',     'oeff_nl_confirm'],
        ['/newsletter/unsubscribe', 'oeff_nl_unsubscribe'],
    ];
    foreach ($routes as [$path, $cb]) {
        register_rest_route('oeff/v1', $path, [
            'methods'             => 'POST',
            'callback'            => $cb,
            'permission_callback' => '__return_true',
        ]);
    }
});

function oeff_nl_subscribe(WP_REST_Request $request) {
    if (function_exists('oeff_auth_check_origin') && !oeff_auth_check_origin($request)) {
        return oeff_nl_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    if (function_exists('oeff_rate_limit') && !oeff_rate_limit('newsletter_subscribe', 5, HOUR_IN_SECONDS)) {
        return oeff_nl_error('rate_limited', 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.', 429);
    }
    // Honeypot – bots fill it, humans never see it.
    if ((string) $request->get_param('website') !== '') {
        return new WP_REST_Response(['ok' => true], 200);
    }
    if (function_exists('oeff_verify_turnstile') && !oeff_verify_turnstile((string) $request->get_param('turnstile_token'))) {
        return oeff_nl_error('turnstile_failed', 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte laden Sie die Seite neu.', 400);
    }

    $email = sanitize_email((string) $request->get_param('email'));
    if (!is_email($email)) {
        return oeff_nl_error('invalid_email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', 400);
    }
    $email = strtolower($email);

    $existing = oeff_nl_find_by_email($email);
    if ($existing) {
        $status = get_post_meta($existing, '_oeff_nl_status', true);
        if ($status === 'confirmed') {
            // Already subscribed – stay generic, don't resend or disclose.
            return new WP_REST_Response(['ok' => true], 200);
        }
        // pending or previously unsubscribed → (re)start double opt-in
        $token = oeff_nl_token();
        update_post_meta($existing, '_oeff_nl_token', $token);
        update_post_meta($existing, '_oeff_nl_status', 'pending');
        oeff_nl_send_confirmation_email($email, $token);
        return new WP_REST_Response(['ok' => true], 200);
    }

    $token   = oeff_nl_token();
    $post_id = wp_insert_post([
        'post_type'   => 'oeff_newsletter',
        'post_status' => 'publish',
        'post_title'  => $email,
    ], true);
    if (is_wp_error($post_id)) {
        return oeff_nl_error('save_failed', 'Die Anmeldung konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.', 500);
    }
    update_post_meta($post_id, '_oeff_nl_email', $email);
    update_post_meta($post_id, '_oeff_nl_token', $token);
    update_post_meta($post_id, '_oeff_nl_status', 'pending');
    update_post_meta($post_id, '_oeff_nl_signup_ip', function_exists('oeff_client_ip') ? oeff_client_ip() : '');

    oeff_nl_send_confirmation_email($email, $token);
    return new WP_REST_Response(['ok' => true], 200);
}

function oeff_nl_confirm(WP_REST_Request $request) {
    if (function_exists('oeff_auth_check_origin') && !oeff_auth_check_origin($request)) {
        return oeff_nl_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    if (function_exists('oeff_rate_limit') && !oeff_rate_limit('newsletter_confirm', 20, HOUR_IN_SECONDS)) {
        return oeff_nl_error('rate_limited', 'Zu viele Versuche. Bitte versuchen Sie es später erneut.', 429);
    }
    $token   = (string) $request->get_param('token');
    $post_id = oeff_nl_find_by_token($token);
    if (!$post_id) {
        return oeff_nl_error('invalid_token', 'Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an.', 400);
    }

    $email  = get_post_meta($post_id, '_oeff_nl_email', true);
    $status = get_post_meta($post_id, '_oeff_nl_status', true);

    // Idempotent: re-clicking returns the existing coupon instead of issuing a new one.
    if ($status === 'confirmed') {
        $code = get_post_meta($post_id, '_oeff_nl_coupon', true);
        return new WP_REST_Response(['ok' => true, 'coupon' => $code ?: null, 'discount' => '10%'], 200);
    }

    update_post_meta($post_id, '_oeff_nl_status', 'confirmed');
    update_post_meta($post_id, '_oeff_nl_confirmed_at', current_time('Y-m-d H:i'));

    $code = oeff_nl_create_welcome_coupon($email);
    if ($code) {
        update_post_meta($post_id, '_oeff_nl_coupon', $code);
        oeff_nl_send_coupon_email($email, $code, get_post_meta($post_id, '_oeff_nl_token', true));
    }

    return new WP_REST_Response(['ok' => true, 'coupon' => $code ?: null, 'discount' => '10%'], 200);
}

function oeff_nl_unsubscribe(WP_REST_Request $request) {
    if (function_exists('oeff_auth_check_origin') && !oeff_auth_check_origin($request)) {
        return oeff_nl_error('forbidden', 'Ungültige Anfrage.', 403);
    }
    if (function_exists('oeff_rate_limit') && !oeff_rate_limit('newsletter_unsubscribe', 20, HOUR_IN_SECONDS)) {
        return oeff_nl_error('rate_limited', 'Zu viele Versuche. Bitte versuchen Sie es später erneut.', 429);
    }
    $token   = (string) $request->get_param('token');
    $post_id = oeff_nl_find_by_token($token);
    if (!$post_id) {
        // Generic success so the link can't be used to probe addresses.
        return new WP_REST_Response(['ok' => true], 200);
    }
    update_post_meta($post_id, '_oeff_nl_status', 'unsubscribed');
    return new WP_REST_Response(['ok' => true], 200);
}
