<?php
/**
 * Plugin Name: Checkout Styles (Oefflinger)
 * Description: Styles WooCommerce checkout to match the Next.js frontend design.
 */

defined('ABSPATH') || exit;

add_action('wp_enqueue_scripts', 'oefflinger_checkout_styles', 50);

function oefflinger_checkout_styles() {
    if (!function_exists('is_checkout') || !is_checkout()) {
        return;
    }

    wp_enqueue_style(
        'google-font-inter',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        [],
        null
    );

    wp_register_style('oefflinger-checkout', false, ['google-font-inter']);
    wp_enqueue_style('oefflinger-checkout');

    $css = "
:root {
  --oeff-primary: #1e5f74;
  --oeff-primary-light: #2d7a94;
  --oeff-primary-dark: #0f3d4a;
  --oeff-accent: #b8954a;
  --oeff-accent-light: #d4b96a;
  --oeff-surface: #f8fafb;
  --oeff-surface-alt: #f0f4f6;
  --oeff-muted: #6b7280;
}

html {
  overflow-x: hidden !important;
}

body.woocommerce-checkout {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif !important;
  background: var(--oeff-surface) !important;
  color: #1f2937 !important;
  overflow-x: hidden !important;
  margin: 0 !important;
}

/* Inside the frontend iframe nothing may exceed the viewport width
   (100vw-based elements overflow when a scrollbar is present) */
.woocommerce-checkout .wp-block-woocommerce-checkout,
.woocommerce-checkout .wc-block-components-sidebar-layout,
.woocommerce-checkout .woocommerce {
  max-width: 100% !important;
}

/* Main content container */
.woocommerce-checkout .woocommerce,
.woocommerce-checkout .wp-block-woocommerce-checkout {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem 2rem;
}

/* Form sections */
.woocommerce-checkout .woocommerce-billing-fields h3,
.woocommerce-checkout .woocommerce-shipping-fields h3,
.woocommerce-checkout .woocommerce-additional-fields h3,
.woocommerce-checkout #order_review_heading,
.woocommerce-checkout .wc-block-components-shipping-address h2,
.woocommerce-checkout .wc-block-components-billing-address h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

/* Inputs */
.woocommerce-checkout input[type='text'],
.woocommerce-checkout input[type='email'],
.woocommerce-checkout input[type='tel'],
.woocommerce-checkout input[type='number'],
.woocommerce-checkout select,
.woocommerce-checkout textarea,
.woocommerce-checkout .wc-block-components-text-input input,
.woocommerce-checkout .wc-block-components-combobox input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  background: #fff;
  transition: border-color 0.15s;
}
.woocommerce-checkout input:focus,
.woocommerce-checkout select:focus,
.woocommerce-checkout textarea:focus {
  outline: none;
  border-color: var(--oeff-primary);
  box-shadow: 0 0 0 3px rgba(30,95,116,0.15);
}

/* Labels */
.woocommerce-checkout label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

/* Place order button */
.woocommerce-checkout #place_order,
.woocommerce-checkout .wc-block-components-button:not(.is-link) {
  background: var(--oeff-accent) !important;
  color: #fff !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  cursor: pointer !important;
  transition: background 0.15s !important;
}
.woocommerce-checkout #place_order:hover,
.woocommerce-checkout .wc-block-components-button:not(.is-link):hover {
  background: var(--oeff-accent-light) !important;
}

/* Order review table */
.woocommerce-checkout .woocommerce-checkout-review-order-table,
.woocommerce-checkout .wc-block-components-order-summary {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}
.woocommerce-checkout .woocommerce-checkout-review-order-table th,
.woocommerce-checkout .woocommerce-checkout-review-order-table td {
  padding: 0.75rem 1rem;
  border-color: #f3f4f6;
}
.woocommerce-checkout .woocommerce-checkout-review-order-table .order-total th,
.woocommerce-checkout .woocommerce-checkout-review-order-table .order-total td {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--oeff-primary);
}

/* Form row spacing */
.woocommerce-checkout .form-row {
  margin-bottom: 1rem;
}

/* Payment methods */
.woocommerce-checkout .wc_payment_methods {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  padding: 1rem;
}
.woocommerce-checkout .wc_payment_methods li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.woocommerce-checkout .wc_payment_methods li:last-child {
  border-bottom: none;
}

/* Block-based checkout */
.woocommerce-checkout .wp-block-woocommerce-checkout-form {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
";

    wp_add_inline_style('oefflinger-checkout', $css);

}

