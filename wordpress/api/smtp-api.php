<?php
/**
 * Plugin Name: SMTP Mail (Öfflinger)
 * Description: Routes every wp_mail() through an external SMTP server (poste.io)
 * so transactional mail actually gets delivered — WooCommerce order emails,
 * password resets, registration, newsletter double-opt-in, and the contact form.
 * Fully env-driven, so the mail provider can be swapped (poste.io → Brevo/SES/…)
 * without touching code. Recognised env vars:
 *
 *   SMTP_HOST       SMTP server host (poste.io container name or mail hostname)
 *   SMTP_PORT       587 (STARTTLS) | 465 (SMTPS) | 25            (default 587)
 *   SMTP_SECURE     tls | ssl | '' (none)                        (default tls)
 *   SMTP_USER       mailbox login (e.g. shop@example.com); enables auth
 *   SMTP_PASS       mailbox password
 *   SMTP_FROM       From address forced on all mail               (e.g. info@…)
 *   SMTP_FROM_NAME  From display name                             (e.g. Öfflinger)
 *   SMTP_VERIFY     1 = verify TLS cert (default) | 0 = skip (internal Docker)
 *
 * If SMTP_HOST is empty the plugin is inert and WordPress uses its default mailer.
 */

if (!defined('ABSPATH')) {
    exit;
}

function oeff_smtp_cfg($key, $default = '') {
    $v = getenv($key);
    return ($v === false || $v === '') ? $default : $v;
}

/** Point PHPMailer at the SMTP server when SMTP_HOST is configured. */
add_action('phpmailer_init', function ($phpmailer) {
    $host = oeff_smtp_cfg('SMTP_HOST');
    if ($host === '') {
        return; // not configured → leave WordPress' default mailer untouched
    }

    $phpmailer->isSMTP();
    $phpmailer->Host = $host;
    $phpmailer->Port = (int) oeff_smtp_cfg('SMTP_PORT', '587');

    $secure = strtolower(oeff_smtp_cfg('SMTP_SECURE', 'tls'));
    if ($secure === 'tls' || $secure === 'ssl') {
        $phpmailer->SMTPSecure = $secure;   // tls = STARTTLS, ssl = implicit TLS
    } else {
        $phpmailer->SMTPSecure  = '';
        $phpmailer->SMTPAutoTLS = false;
    }

    $user = oeff_smtp_cfg('SMTP_USER');
    if ($user !== '') {
        $phpmailer->SMTPAuth = true;
        $phpmailer->Username = $user;
        $phpmailer->Password = oeff_smtp_cfg('SMTP_PASS');
    } else {
        $phpmailer->SMTPAuth = false;
    }

    // For container-to-container SMTP the server's TLS cert often won't match the
    // internal hostname; allow skipping verification on the private network.
    if (oeff_smtp_cfg('SMTP_VERIFY', '1') === '0') {
        $phpmailer->SMTPOptions = [
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ],
        ];
    }
}, 20);

/** Force a consistent, authenticated From so SPF/DKIM align (overrides the
 *  wordpress@<host> default). Individual callers keep control of Reply-To. */
add_filter('wp_mail_from', function ($email) {
    $from = oeff_smtp_cfg('SMTP_FROM');
    return $from !== '' ? $from : $email;
}, 20);

add_filter('wp_mail_from_name', function ($name) {
    $from_name = oeff_smtp_cfg('SMTP_FROM_NAME');
    return $from_name !== '' ? $from_name : $name;
}, 20);
