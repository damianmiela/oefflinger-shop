<?php
/**
 * Plugin Name: Reverse Proxy SSL (Öfflinger)
 * Description: Behind the Nginx Proxy Manager, TLS is terminated at the proxy and
 * the request reaches WordPress over plain HTTP carrying an X-Forwarded-Proto
 * header. This tells WordPress the original request was HTTPS, which prevents
 * wp-admin redirect loops and makes the auth cookie Secure. Loaded as an
 * mu-plugin so it runs before WordPress evaluates the canonical/SSL redirect.
 *
 * Note: it lives as an mu-plugin (not WORDPRESS_CONFIG_EXTRA) on purpose — the
 * official image only writes wp-config.php on first install, so a config-extra
 * change would never reach the existing persistent volume.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (
    !empty($_SERVER['HTTP_X_FORWARDED_PROTO'])
    && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https'
) {
    $_SERVER['HTTPS'] = 'on';
}
