<?php
/**
 * Loads the demo catalog (catalog.json and uploads/ next to this file) into a fresh
 * shop. setup-woocommerce.sh runs it when the seed folder is mounted and the shop has
 * no products yet; export-catalog.php produces the data.
 */
require_once ABSPATH . 'wp-admin/includes/image.php';

$dir         = __DIR__;
$data        = json_decode(file_get_contents("$dir/catalog.json"), true, 512, JSON_THROW_ON_ERROR);
$site        = untrailingslashit(site_url());
$upload_base = wp_get_upload_dir()['basedir'];
$fail        = fn($result) => is_wp_error($result) ? WP_CLI::error($result->get_error_message()) : $result;

foreach ($data['settings'] as $key => $value) {
    update_option($key, $value);
}

foreach ($data['attributes'] as $a) {
    if (!wc_attribute_taxonomy_id_by_name($a['slug'])) {
        $fail(wc_create_attribute([
            'name'         => $a['name'],
            'slug'         => $a['slug'],
            'type'         => $a['type'],
            'order_by'     => $a['order_by'],
            'has_archives' => $a['has_archives'],
        ]));
    }
    // WooCommerce registers attribute taxonomies on init, so a new one needs registering for this run.
    $taxonomy = wc_attribute_taxonomy_name($a['slug']);
    if (!taxonomy_exists($taxonomy)) {
        register_taxonomy($taxonomy, ['product'], ['hierarchical' => false, 'show_ui' => false, 'rewrite' => false]);
    }
    foreach ($a['terms'] as $t) {
        $term = term_exists($t['slug'], $taxonomy)
            ?: $fail(wp_insert_term($t['name'], $taxonomy, ['slug' => $t['slug'], 'description' => $t['description']]));
        if ($t['order']) update_term_meta((int) $term['term_id'], 'order', $t['order']);
    }
}

$image_ids = [];
foreach ($data['images'] as $img) {
    $path = "$upload_base/{$img['file']}";
    wp_mkdir_p(dirname($path));
    copy("$dir/uploads/{$img['file']}", $path);
    $id = $fail(wp_insert_attachment([
        'post_title'     => $img['title'],
        'post_excerpt'   => $img['caption'],
        'post_mime_type' => wp_check_filetype($path)['type'],
        'post_status'    => 'inherit',
    ], $path, 0, true));
    wp_update_attachment_metadata($id, wp_generate_attachment_metadata($id, $path));
    if ($img['alt'] !== '') update_post_meta($id, '_wp_attachment_image_alt', $img['alt']);
    $image_ids[$img['file']] = $id;
}
foreach ($data['files'] as $rel) {
    wp_mkdir_p(dirname("$upload_base/$rel"));
    copy("$dir/uploads/$rel", "$upload_base/$rel");
}

foreach ($data['categories'] as $c) {
    $args = [
        'description' => $c['description'],
        'parent'      => $c['parent'] ? (int) get_term_by('slug', $c['parent'], 'product_cat')->term_id : 0,
    ];
    $existing = term_exists($c['slug'], 'product_cat');
    $term     = $fail($existing
        ? wp_update_term((int) $existing['term_id'], 'product_cat', $args + ['name' => $c['name']])
        : wp_insert_term($c['name'], 'product_cat', $args + ['slug' => $c['slug']]));
    if ($c['image']) update_term_meta((int) $term['term_id'], 'thumbnail_id', $image_ids[$c['image']]);
}

foreach ($data['products'] as $p) {
    $product = new WC_Product_Simple();
    $fail($product->set_props([
        'name'               => $p['name'],
        'slug'               => $p['slug'],
        'status'             => 'publish',
        'description'        => str_replace('{{site}}', $site, $p['description']),
        'short_description'  => str_replace('{{site}}', $site, $p['short_description']),
        'sku'                => $p['sku'],
        'regular_price'      => $p['regular_price'],
        'sale_price'         => $p['sale_price'],
        'tax_status'         => $p['tax_status'],
        'tax_class'          => $p['tax_class'],
        'manage_stock'       => $p['manage_stock'],
        'stock_quantity'     => $p['stock_quantity'],
        'stock_status'       => $p['stock_status'],
        'backorders'         => $p['backorders'],
        'sold_individually'  => $p['sold_individually'],
        'weight'             => $p['weight'],
        'catalog_visibility' => $p['catalog_visibility'],
        'featured'           => $p['featured'],
        'menu_order'         => $p['menu_order'],
        'reviews_allowed'    => $p['reviews_allowed'],
        'virtual'            => $p['virtual'],
        'category_ids'       => array_map(fn($slug) => (int) get_term_by('slug', $slug, 'product_cat')->term_id, $p['categories']),
        'image_id'           => $p['image'] ? $image_ids[$p['image']] : '',
        'gallery_image_ids'  => array_map(fn($file) => $image_ids[$file], $p['gallery']),
        'attributes'         => array_map(function ($a) {
            $attr = new WC_Product_Attribute();
            $attr->set_id($a['taxonomy'] ? wc_attribute_taxonomy_id_by_name($a['name']) : 0);
            $attr->set_name($a['name']);
            $attr->set_options($a['taxonomy']
                ? array_map(fn($slug) => (int) get_term_by('slug', $slug, $a['name'])->term_id, $a['options'])
                : $a['options']);
            $attr->set_position($a['position']);
            $attr->set_visible($a['visible']);
            $attr->set_variation($a['variation']);
            return $attr;
        }, $p['attributes']),
    ]));
    if ($p['shipping_days'] !== '') $product->update_meta_data('_oefflinger_shipping_days', $p['shipping_days']);
    $product->save();
    if ($p['tags']) wp_set_object_terms($product->get_id(), $p['tags'], 'product_tag');
}

WP_CLI::success(sprintf('Demo catalog loaded: %d products, %d photos.', count($data['products']), count($image_ids)));
