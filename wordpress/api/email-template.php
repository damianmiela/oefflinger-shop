<?php
/**
 * Plugin Name: Email Template (Öfflinger)
 * Description: Sends branded HTML emails by wrapping content in WooCommerce's
 * (CSS-inlined) email template, so the shop's custom transactional emails
 * (password reset, account, newsletter, contact) match the WooCommerce order
 * emails — one consistent, client-tested design. Branding (logo, colours,
 * footer) is configured via the standard WooCommerce email options in the setup
 * script. Exposes oeff_send_html_email() used by the other API plugins.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('oeff_send_html_email')) {
    /**
     * Send a branded HTML email. Wraps $content in the WooCommerce email
     * header/footer (logo + brand colours) and inlines the CSS for broad client
     * support. Falls back to a simple HTML wp_mail() if WooCommerce is missing.
     *
     * @param string|array $to            Recipient(s).
     * @param string       $subject       Subject line.
     * @param string       $heading       Heading shown in the coloured bar.
     * @param string       $content       Inner HTML (paragraphs, buttons, …).
     * @param array        $extra_headers Extra raw headers (e.g. 'Reply-To: …').
     * @return bool
     */
    function oeff_send_html_email($to, $subject, $heading, $content, $extra_headers = []) {
        if (function_exists('WC') && WC() && WC()->mailer() && class_exists('WC_Email')) {
            try {
                $mailer  = WC()->mailer();
                $wrapped = $mailer->wrap_message($heading, $content);

                $email = new WC_Email();
                $email->email_type = 'html'; // ensure style_inline() runs the inliner
                $html = $email->style_inline($wrapped);

                $headers = "Content-Type: text/html\r\n";
                foreach ($extra_headers as $h) {
                    $headers .= rtrim($h) . "\r\n";
                }
                return (bool) $mailer->send($to, $subject, $html, $headers);
            } catch (\Throwable $e) {
                // fall through to the plain-HTML fallback below
            }
        }

        $headers  = array_merge(['Content-Type: text/html; charset=UTF-8'], $extra_headers);
        $fallback = '<div style="font-family:Arial,Helvetica,sans-serif;color:#333333;line-height:1.5;">'
            . '<h2 style="color:#1e5f74;">' . esc_html($heading) . '</h2>'
            . $content
            . '</div>';
        return (bool) wp_mail($to, $subject, $fallback, $headers);
    }
}
