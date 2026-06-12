<?php
/**
 * Plugin Name: Checkout Embed (Oefflinger)
 * Description: Allow checkout in iframe from frontend (CSP, remove X-Frame-Options).
 */

defined('ABSPATH') || exit;

add_action('init', 'oefflinger_remove_woo_frame_header', 999);

/**
 * The WP cart is unused (headless setup) – point all cart links (e.g. the
 * "Return to Cart" link in the checkout block) at the frontend cart page.
 */
add_filter('woocommerce_get_cart_url', 'oefflinger_frontend_cart_url', 999);

function oefflinger_frontend_cart_url() {
    $frontend = getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000';
    return rtrim($frontend, '/') . '/cart';
}
add_action('send_headers', 'oefflinger_allow_frontend_frame', 999);

function oefflinger_remove_woo_frame_header() {
    if (!oefflinger_should_allow_frame()) {
        return;
    }
    if (function_exists('wc_send_frame_options_header')) {
        remove_action('template_redirect', 'wc_send_frame_options_header');
    }
}

function oefflinger_should_allow_frame() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/checkout-link') !== false) {
        return true;
    }
    if (preg_match('#/checkout(/|$|\?)#', $uri)) {
        if (strpos($uri, 'order-received') !== false) {
            return false;
        }
        return true;
    }
    if (function_exists('is_checkout') && is_checkout()) {
        if (function_exists('is_wc_endpoint_url') && is_wc_endpoint_url('order-received')) {
            return false;
        }
        return true;
    }
    return false;
}

function oefflinger_allow_frontend_frame() {
    if (!oefflinger_should_allow_frame()) {
        return;
    }
    if (headers_sent()) {
        return;
    }
    header_remove('X-Frame-Options');
    header_remove('Content-Security-Policy');
    $frontend = getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000';
    header("Content-Security-Policy: frame-ancestors 'self' " . $frontend);
}

/**
 * When the checkout runs inside the frontend iframe, continuously report the
 * document height to the parent so it can resize the iframe (no scrollbars).
 */
add_action('wp_footer', 'oefflinger_iframe_autoheight_script', 99);

function oefflinger_iframe_autoheight_script() {
    if (!oefflinger_should_allow_frame()) {
        return;
    }
    ?>
    <script>
    (function () {
        if (window.self === window.top) return; // not framed
        var lastHeight = 0;
        function report() {
            var h = Math.max(
                document.documentElement.scrollHeight,
                document.body ? document.body.scrollHeight : 0
            );
            if (h !== lastHeight) {
                lastHeight = h;
                window.parent.postMessage({ type: 'oeff:checkout-height', height: h }, '*');
            }
        }
        if (typeof ResizeObserver !== 'undefined') {
            var ro = new ResizeObserver(report);
            ro.observe(document.documentElement);
            if (document.body) ro.observe(document.body);
        }
        window.addEventListener('load', report);
        setInterval(report, 1000); // safety net for async content (payment methods etc.)
        report();

        // Links leaving the checkout (e.g. "Zurück zum Warenkorb") must
        // navigate the parent page, not the iframe.
        var frontendOrigin = <?php echo wp_json_encode(rtrim(getenv('FRONTEND_URL') ?: 'http://91.98.112.186:4000', '/')); ?>;
        document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (!a) return;
            var href = a.href;
            // Direct links to the frontend
            if (href.indexOf(frontendOrigin) === 0) {
                e.preventDefault();
                window.parent.postMessage({ type: 'oeff:navigate', href: href }, '*');
                return;
            }
            // WP cart links (blocks checkout builds them from the WP cart page
            // permalink) -> map to the headless frontend cart
            try {
                var url = new URL(href, window.location.href);
                if (url.origin === window.location.origin && /^\/cart\/?$/.test(url.pathname)) {
                    e.preventDefault();
                    window.parent.postMessage({ type: 'oeff:navigate', href: frontendOrigin + '/cart' }, '*');
                }
            } catch (err) { /* ignore */ }
        }, true);
    })();
    </script>
    <?php
}
