<?php
/**
 * Exports the shop catalog for the local demo: the published simple products with
 * their prices, stock, attributes, categories and photos, plus the few shop settings
 * the storefront needs. Orders, customers, reviews, newsletter data, users and the
 * payment and mail settings are never read.
 *
 * Run inside the live WordPress container:
 *   wp --allow-root --path=/var/www/html eval-file export-catalog.php
 * It writes /tmp/catalog-export/catalog.json and the photos under
 * /tmp/catalog-export/uploads/; those go into wordpress/seed/ in the repo.
 */

$out         = '/tmp/catalog-export';
$site        = untrailingslashit(site_url());
$upload_base = wp_get_upload_dir()['basedir'];

$images = [];
$image  = function ($id) use (&$images, $upload_base) {
    $id   = (int) $id;
    $file = $id ? get_post_meta($id, '_wp_attached_file', true) : '';
    if (!$file || !file_exists("$upload_base/$file")) {
        if ($id) WP_CLI::warning("Photo $id is missing on disk, left out.");
        return null;
    }
    $images[$file] = [
        'file'    => $file,
        'title'   => get_the_title($id),
        'alt'     => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
        'caption' => (string) wp_get_attachment_caption($id),
    ];
    return $file;
};
$term_field = fn(array $ids, string $taxonomy, string $field) =>
    array_values(array_filter(array_map(fn($id) => get_term($id, $taxonomy)->$field ?? null, $ids)));

$settings = [];
foreach ([
    'woocommerce_currency', 'woocommerce_default_country', 'woocommerce_currency_pos',
    'woocommerce_price_decimal_sep', 'woocommerce_price_thousand_sep', 'woocommerce_price_num_decimals',
    'woocommerce_prices_include_tax', 'woocommerce_calc_taxes', 'woocommerce_tax_display_shop',
    'woocommerce_tax_display_cart', 'woocommerce_weight_unit', 'woocommerce_dimension_unit',
    'woocommerce_manage_stock', 'oeff_volume_discount', 'oefflinger_delivery_enabled',
    'oefflinger_delivery_cutoff_hour', 'oefflinger_delivery_default_days', 'oefflinger_delivery_timezone',
] as $key) {
    $settings[$key] = get_option($key);
}

$attributes = [];
foreach (wc_get_attribute_taxonomies() as $a) {
    $taxonomy     = wc_attribute_taxonomy_name($a->attribute_name);
    $attributes[] = [
        'slug'         => $a->attribute_name,
        'name'         => $a->attribute_label,
        'type'         => $a->attribute_type,
        'order_by'     => $a->attribute_orderby,
        'has_archives' => (bool) $a->attribute_public,
        'terms'        => array_map(fn($t) => [
            'slug'        => $t->slug,
            'name'        => $t->name,
            'description' => $t->description,
            'order'       => (int) get_term_meta($t->term_id, 'order', true),
        ], get_terms(['taxonomy' => $taxonomy, 'hide_empty' => false])),
    ];
}

$categories = [];
foreach (get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false, 'orderby' => 'term_id']) as $t) {
    $categories[] = [
        'slug'        => $t->slug,
        'name'        => $t->name,
        'description' => $t->description,
        'parent'      => $t->parent ? get_term($t->parent, 'product_cat')->slug : null,
        'image'       => $image(get_term_meta($t->term_id, 'thumbnail_id', true)),
    ];
}

$products = [];
foreach (wc_get_products(['limit' => -1, 'status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC']) as $product) {
    if (!$product->is_type('simple')) {
        WP_CLI::error("Product {$product->get_id()} is a {$product->get_type()} product; this script only handles simple products.");
    }
    $product_attributes = [];
    foreach ($product->get_attributes() as $attr) {
        $product_attributes[] = [
            'name'      => $attr->get_name(),
            'taxonomy'  => $attr->is_taxonomy(),
            'options'   => $attr->is_taxonomy() ? $term_field($attr->get_options(), $attr->get_name(), 'slug') : $attr->get_options(),
            'position'  => $attr->get_position(),
            'visible'   => $attr->get_visible(),
            'variation' => $attr->get_variation(),
        ];
    }
    $products[] = [
        'name'               => $product->get_name(),
        'slug'               => $product->get_slug(),
        'description'        => str_replace($site, '{{site}}', $product->get_description()),
        'short_description'  => str_replace($site, '{{site}}', $product->get_short_description()),
        'sku'                => $product->get_sku(),
        'regular_price'      => $product->get_regular_price(),
        'sale_price'         => $product->get_sale_price(),
        'tax_status'         => $product->get_tax_status(),
        'tax_class'          => $product->get_tax_class(),
        'manage_stock'       => $product->get_manage_stock(),
        'stock_quantity'     => $product->get_stock_quantity(),
        'stock_status'       => $product->get_stock_status(),
        'backorders'         => $product->get_backorders(),
        'sold_individually'  => $product->get_sold_individually(),
        'weight'             => $product->get_weight(),
        'catalog_visibility' => $product->get_catalog_visibility(),
        'featured'           => $product->get_featured(),
        'menu_order'         => $product->get_menu_order(),
        'reviews_allowed'    => $product->get_reviews_allowed(),
        'virtual'            => $product->get_virtual(),
        'shipping_days'      => (string) $product->get_meta('_oefflinger_shipping_days'),
        'categories'         => $term_field($product->get_category_ids(), 'product_cat', 'slug'),
        'tags'               => $term_field($product->get_tag_ids(), 'product_tag', 'name'),
        'attributes'         => $product_attributes,
        'image'              => $image($product->get_image_id()),
        'gallery'            => array_values(array_filter(array_map($image, $product->get_gallery_image_ids()))),
    ];
}

// Photos placed directly in the descriptions travel along as plain files.
$files = [];
$hosts = [];
foreach ($products as $p) {
    foreach ([$p['description'], $p['short_description']] as $text) {
        preg_match_all('#\{\{site\}\}/wp-content/uploads/([^"\'\s<>?)]+)#', $text, $m);
        foreach ($m[1] as $rel) {
            if (!isset($images[$rel]) && file_exists("$upload_base/$rel")) $files[$rel] = true;
        }
        preg_match_all('#https?://([^/\s"\'<>]+)#', $text, $m);
        foreach ($m[1] as $host) $hosts[$host] = true;
    }
}

foreach (array_merge(array_keys($images), array_keys($files)) as $rel) {
    wp_mkdir_p(dirname("$out/uploads/$rel"));
    copy("$upload_base/$rel", "$out/uploads/$rel");
}
file_put_contents("$out/catalog.json", wp_json_encode([
    'settings'   => $settings,
    'attributes' => $attributes,
    'categories' => $categories,
    'images'     => array_values($images),
    'files'      => array_keys($files),
    'products'   => $products,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");

if ($hosts) WP_CLI::log('Descriptions also link to: ' . implode(', ', array_keys($hosts)));
WP_CLI::success(sprintf('%d products, %d photos, %d extra files -> %s', count($products), count($images), count($files), $out));
