<?php
/**
 * Minimal checkout template – form only, no header/footer.
 * Used when checkout is embedded in frontend iframe.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        html, body.oeff-checkout-embed { margin: 0; padding: 0; overflow: hidden; }
        .oeff-embed-content { overflow: visible; }
    </style>
</head>
<body <?php body_class('oeff-checkout-embed'); ?>>
<?php wp_body_open(); ?>
<div class="oeff-embed-content" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
<?php woocommerce_content(); ?>
</div>
<?php wp_footer(); ?>
<script>
(function() {
    function sendHeight() {
        var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'oeff-checkout-height', height: h }, '*');
        }
    }
    sendHeight();
    if (window.MutationObserver) {
        new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener('resize', sendHeight);
})();
</script>
</body>
</html>
