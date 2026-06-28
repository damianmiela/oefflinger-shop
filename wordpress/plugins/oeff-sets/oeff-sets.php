<?php
/**
 * Plugin Name: Öfflinger Sets
 * Description: Product sets / bundles for the headless Öfflinger shop. Sets are defined as recipes in wp-admin; the storefront adds their component products and the Store-API cart applies the set discount server-side (grouped line items). See _docs/bundles-design.md.
 * Version: 0.5.0
 * Author: Öfflinger
 * Text Domain: oeff-sets
 *
 * Phase 1 scaffold: registers the `oeff_set` custom post type (the recipe) + its
 * meta, with Shop-Manager-and-Admin permissions. The builder UI, REST feed and
 * cart logic follow in later phases (see the design doc).
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OEFF_SETS_VERSION', '0.5.0');
define('OEFF_SETS_CPT', 'oeff_set');
define('OEFF_SETS_DIR', plugin_dir_path(__FILE__));
define('OEFF_SETS_URL', plugin_dir_url(__FILE__));

// REST feed for the headless storefront — registers in all contexts.
require_once OEFF_SETS_DIR . 'includes/rest.php';

// Cart integration (grouped set add + server-side discount) — all contexts.
require_once OEFF_SETS_DIR . 'includes/cart.php';

// Admin builder (meta boxes, product search, save) — admin context only.
if (is_admin()) {
    require_once OEFF_SETS_DIR . 'includes/admin-builder.php';
}

/**
 * The capability that gates Set management. Shop Managers and Admins both have
 * `manage_woocommerce`, so mapping every Set capability to it lets shop staff
 * build sets without full admin rights.
 */
function oeff_sets_capability() {
    return 'manage_woocommerce';
}

/**
 * Anyone who can manage the shop can read/write Set meta (REST + builder).
 */
function oeff_sets_meta_auth() {
    return current_user_can(oeff_sets_capability());
}

/**
 * Register the "Set" custom post type — the recipe. A Set is never itself a cart
 * line (the storefront adds its component products and the cart applies the set
 * discount server-side), so it is deliberately NOT a WooCommerce product.
 */
function oeff_sets_register_cpt() {
    $cap = oeff_sets_capability();

    $labels = [
        'name'               => 'Sets',
        'singular_name'      => 'Set',
        'menu_name'          => 'Sets',
        'add_new'            => 'Set hinzufügen',
        'add_new_item'       => 'Neues Set',
        'edit_item'          => 'Set bearbeiten',
        'new_item'           => 'Neues Set',
        'view_item'          => 'Set ansehen',
        'search_items'       => 'Sets durchsuchen',
        'all_items'          => 'Alle Sets',
        'not_found'          => 'Keine Sets gefunden',
        'not_found_in_trash' => 'Keine Sets im Papierkorb',
    ];

    register_post_type(OEFF_SETS_CPT, [
        'labels'          => $labels,
        'public'          => false,   // headless: no themed front-end for the CPT itself
        'show_ui'         => true,    // but fully manageable in wp-admin
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-screenoptions',
        'menu_position'   => 58.5,    // own slot below the WooCommerce zone (avoid menu_position collisions)
        'supports'        => ['title', 'editor', 'thumbnail'],
        'show_in_rest'    => true,
        'map_meta_cap'    => true,
        // Map ONLY the plural caps to manage_woocommerce. Mapping the singular
        // meta caps (edit_post/read_post/delete_post) with map_meta_cap=true makes
        // WordPress register `manage_woocommerce` itself as a per-post meta cap,
        // so every plain current_user_can('manage_woocommerce') (no post context)
        // resolves to 'do_not_allow' — silently locking admins out of WooCommerce
        // pages (coupons, PDF invoices, …). The plural caps alone gate the Sets
        // screens. Fixed 2026-06-28.
        'capabilities'    => [
            'edit_posts'             => $cap,
            'edit_others_posts'      => $cap,
            'delete_posts'           => $cap,
            'delete_others_posts'    => $cap,
            'publish_posts'          => $cap,
            'read_private_posts'     => $cap,
            'create_posts'           => $cap,
        ],
    ]);
}
add_action('init', 'oeff_sets_register_cpt');

/**
 * Register Set meta (recipe + pricing). Exposed in REST so the builder UI and the
 * headless frontend can read/write them; writes gated to shop managers.
 */
function oeff_sets_register_meta() {
    // Fixed-set recipe: array of { id: product ID, qty: quantity }.
    register_post_meta(OEFF_SETS_CPT, '_oeff_set_components', [
        'type'          => 'array',
        'single'        => true,
        'show_in_rest'  => [
            'schema' => [
                'type'  => 'array',
                'items' => [
                    'type'       => 'object',
                    'properties' => [
                        'id'  => ['type' => 'integer'],
                        'qty' => ['type' => 'integer'],
                    ],
                ],
            ],
        ],
        'auth_callback' => 'oeff_sets_meta_auth',
    ]);

    // Simple scalar meta.
    $scalars = [
        '_oeff_set_type'         => 'string', // fixed | configurable
        '_oeff_set_status'       => 'string', // active | inactive
        '_oeff_set_pricing_mode' => 'string', // fixed | percent | amount
    ];
    foreach ($scalars as $key => $type) {
        register_post_meta(OEFF_SETS_CPT, $key, [
            'type'          => $type,
            'single'        => true,
            'show_in_rest'  => true,
            'auth_callback' => 'oeff_sets_meta_auth',
        ]);
    }

    // Pricing value: price (amount), percent, or euro discount depending on mode.
    register_post_meta(OEFF_SETS_CPT, '_oeff_set_pricing_value', [
        'type'          => 'number',
        'single'        => true,
        'show_in_rest'  => true,
        'auth_callback' => 'oeff_sets_meta_auth',
    ]);

    // Configurable sets: source category (term ID) + quantity discount tiers.
    register_post_meta(OEFF_SETS_CPT, '_oeff_set_category', [
        'type'          => 'integer',
        'single'        => true,
        'show_in_rest'  => true,
        'auth_callback' => 'oeff_sets_meta_auth',
    ]);
    register_post_meta(OEFF_SETS_CPT, '_oeff_set_tiers', [
        'type'          => 'array',
        'single'        => true,
        'show_in_rest'  => [
            'schema' => [
                'type'  => 'array',
                'items' => [
                    'type'       => 'object',
                    'properties' => [
                        'min_qty' => ['type' => 'integer'],
                        'percent' => ['type' => 'number'],
                    ],
                ],
            ],
        ],
        'auth_callback' => 'oeff_sets_meta_auth',
    ]);
}
add_action('init', 'oeff_sets_register_meta');

/**
 * Activation: register the CPT, then flush rewrite rules so its routes resolve.
 */
function oeff_sets_activate() {
    oeff_sets_register_cpt();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'oeff_sets_activate');

function oeff_sets_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'oeff_sets_deactivate');
