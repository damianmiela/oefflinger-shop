<?php
$is_checkout_form = function_exists('is_checkout') && is_checkout() && (!function_exists('is_wc_endpoint_url') || !is_wc_endpoint_url('order-received'));
if ($is_checkout_form) {
    ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div class="oeff-woo-content" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
<?php woocommerce_content(); ?>
</div>
<?php wp_footer(); ?>
</body>
</html>
<?php
} else {
    get_header();
    ?>
<div class="oeff-woo-content" style="max-width: 80rem; margin: 0 auto;">
<?php woocommerce_content(); ?>
</div>
<?php
    get_footer();
}
?>
