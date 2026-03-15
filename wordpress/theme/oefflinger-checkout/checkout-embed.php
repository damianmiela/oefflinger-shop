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
</head>
<body <?php body_class('oeff-checkout-embed'); ?>>
<?php wp_body_open(); ?>
<div class="oeff-embed-content" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
<?php woocommerce_content(); ?>
</div>
<?php wp_footer(); ?>
</body>
</html>
