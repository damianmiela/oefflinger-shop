<?php
/**
 * Plugin Name: Contact API (Oefflinger)
 * Description: Contact form endpoint for the headless frontend (rate limit, honeypot, Turnstile).
 *
 * Contact form endpoint for the headless frontend.
 * POST /wp-json/oeff/v1/contact  { name, email, message, website (honeypot), turnstile_token }
 * Mirrors the protections used by the auth API: rate limit, honeypot, Turnstile.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('oeff/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'oeff_contact_handle',
        'permission_callback' => '__return_true',
    ]);
});

function oeff_contact_error($code, $message, $status) {
    return new WP_REST_Response(['code' => $code, 'message' => $message], $status);
}

function oeff_contact_handle(WP_REST_Request $request) {
    // Rate limit: 5 messages per hour per IP
    if (function_exists('oeff_rate_limit') && !oeff_rate_limit('contact', 5, HOUR_IN_SECONDS)) {
        return oeff_contact_error(
            'rate_limited',
            'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
            429
        );
    }

    // Honeypot – bots fill it, humans never see it
    $honeypot = (string) $request->get_param('website');
    if ($honeypot !== '') {
        // Pretend success so bots learn nothing
        return new WP_REST_Response(['ok' => true], 200);
    }

    // Turnstile (skipped automatically when TURNSTILE_SECRET_KEY is not configured)
    $token = (string) $request->get_param('turnstile_token');
    if (function_exists('oeff_verify_turnstile') && !oeff_verify_turnstile($token)) {
        return oeff_contact_error(
            'turnstile_failed',
            'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte laden Sie die Seite neu.',
            400
        );
    }

    $name    = sanitize_text_field((string) $request->get_param('name'));
    $email   = sanitize_email((string) $request->get_param('email'));
    $message = sanitize_textarea_field((string) $request->get_param('message'));

    if (mb_strlen($name) < 2 || mb_strlen($name) > 100) {
        return oeff_contact_error('invalid_name', 'Bitte geben Sie Ihren Namen an.', 400);
    }
    if (!is_email($email)) {
        return oeff_contact_error('invalid_email', 'Bitte geben Sie eine gültige E-Mail-Adresse an.', 400);
    }
    if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
        return oeff_contact_error(
            'invalid_message',
            'Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.',
            400
        );
    }

    $to      = get_option('admin_email');
    $subject = sprintf('Kontaktanfrage über oefflinger.de von %s', $name);
    $content = '<p><strong>Neue Kontaktanfrage über oefflinger.de</strong></p>'
        . '<table cellpadding="0" cellspacing="0" style="margin:12px 0;"><tbody>'
        . '<tr><td style="padding:2px 12px 2px 0;color:#6b7280;">Name:</td><td style="padding:2px 0;"><strong>' . esc_html($name) . '</strong></td></tr>'
        . '<tr><td style="padding:2px 12px 2px 0;color:#6b7280;">E-Mail:</td><td style="padding:2px 0;"><a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a></td></tr>'
        . '</tbody></table>'
        . '<p style="color:#6b7280;margin-bottom:4px;">Nachricht:</p>'
        . '<p style="background:#f0f4f6;border-radius:6px;padding:14px;">' . nl2br(esc_html($message)) . '</p>';
    $headers = ['Reply-To: ' . $name . ' <' . $email . '>'];

    $sent = oeff_send_html_email($to, $subject, 'Kontaktanfrage', $content, $headers);

    if (!$sent) {
        return oeff_contact_error(
            'send_failed',
            'Ihre Nachricht konnte nicht gesendet werden. Bitte schreiben Sie uns direkt an info@example.com.',
            500
        );
    }

    return new WP_REST_Response(['ok' => true], 200);
}
