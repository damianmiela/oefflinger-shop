<?php
$is_checkout = function_exists('is_checkout') && is_checkout() && (!function_exists('is_wc_endpoint_url') || !is_wc_endpoint_url('order-received'));
$frontend = function_exists('oefflinger_frontend_url') ? oefflinger_frontend_url() : 'http://localhost:4000';
$logo = function_exists('oefflinger_logo_url') ? oefflinger_logo_url() : $frontend . '/logo/logo-transparent.png';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <?php if (!$is_checkout): ?>
    <style>
        .oeff-header { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid #e5e7eb; background: #fff; }
        .oeff-header-inner { max-width: 80rem; margin: 0 auto; padding: 1.25rem 1rem; display: flex; align-items: center; justify-content: space-between; }
        .oeff-logo { height: 48px; width: auto; }
        .oeff-nav { display: flex; align-items: center; gap: 1.5rem; }
        .oeff-nav a { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; color: #374151; text-decoration: none; border-radius: 9999px; transition: color 0.2s, background 0.2s; }
        .oeff-nav a:hover { background: rgba(30,95,116,0.1); color: #1e5f74; }
        .oeff-cart { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; color: #fff; background: #1e5f74; text-decoration: none; border-radius: 0.5rem; transition: background 0.2s; }
        .oeff-cart:hover { background: #2d7a94; color: #fff; }
        @media (max-width: 640px) {
            .oeff-header-inner { flex-wrap: wrap; gap: 1rem; }
            .oeff-nav { flex-wrap: wrap; }
        }
    </style>
    <?php endif; ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php if (!$is_checkout): ?>
<header class="oeff-header">
    <div class="oeff-header-inner">
        <a href="<?php echo esc_url($frontend); ?>" class="oeff-logo-link">
            <img src="<?php echo esc_url($logo); ?>" alt="Öfflinger" class="oeff-logo">
        </a>
        <nav class="oeff-nav">
            <a href="<?php echo esc_url($frontend); ?>">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Start
            </a>
            <a href="<?php echo esc_url($frontend . '/produkte'); ?>">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.318H2.665c-1.718 0-2.3-2.086-1.067-3.318L5 14.5"/></svg>
                Kolloidales Wasser
            </a>
            <a href="<?php echo esc_url($frontend . '/shop'); ?>">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Shop
            </a>
            <a href="<?php echo esc_url($frontend . '/cart'); ?>" class="oeff-cart">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                Warenkorb
            </a>
        </nav>
    </div>
</header>
<main class="oeff-main" style="min-height: calc(100vh - 200px); background: #f8fafb; padding: 2rem 1rem 4rem;">
<?php else: ?>
<main class="oeff-main" style="padding: 1rem;">
<?php endif; ?>
