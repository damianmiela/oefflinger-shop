<?php
/**
 * Öfflinger Sets — admin builder.
 *
 * Classic-editor meta boxes for composing a Set:
 *  - "Set-Inhalt": live product search + component rows with quantities.
 *  - "Set-Preis & Rabatt": pricing mode (fixed / percent / amount) + value +
 *    a live price/savings preview.
 *
 * No build step: vanilla JS (assets/admin.js) talking to a small admin-ajax
 * product search. All writes gated to shop managers (manage_woocommerce).
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Use the classic editor for Sets so the builder meta boxes render cleanly. */
add_filter('use_block_editor_for_post_type', function ($use, $type) {
    return OEFF_SETS_CPT === $type ? false : $use;
}, 10, 2);

/** Register the builder meta boxes on the Set editor. */
add_action('add_meta_boxes', function () {
    add_meta_box('oeff_set_type', 'Set-Typ', 'oeff_sets_render_type_box', OEFF_SETS_CPT, 'side', 'high');
    add_meta_box('oeff_set_components', 'Set-Inhalt (fester Satz)', 'oeff_sets_render_components_box', OEFF_SETS_CPT, 'normal', 'high');
    add_meta_box('oeff_set_config', 'Konfigurierbar: Auswahl & Mengenrabatt', 'oeff_sets_render_config_box', OEFF_SETS_CPT, 'normal', 'default');
    add_meta_box('oeff_set_pricing', 'Set-Preis & Rabatt (fester Satz)', 'oeff_sets_render_pricing_box', OEFF_SETS_CPT, 'side', 'default');
});

/** Components meta box: search field + table of rows (rows injected by JS). */
function oeff_sets_render_components_box($post) {
    wp_nonce_field('oeff_sets_save', 'oeff_sets_nonce');
    ?>
    <div class="oeff-sets-builder">
        <p class="description">Produkt suchen und zum Set hinzufügen. Menge je Produkt einstellbar.</p>
        <div class="oeff-set-search">
            <input type="text" id="oeff-set-search-input" placeholder="Produkt suchen…" autocomplete="off" />
            <ul id="oeff-set-search-results" class="oeff-set-search-results" hidden></ul>
        </div>
        <table class="widefat oeff-set-rows" id="oeff-set-rows">
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th style="width:110px;">Einzelpreis</th>
                    <th style="width:80px;">Menge</th>
                    <th style="width:40px;"></th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
                <tr><td colspan="4" class="oeff-set-empty">Noch keine Produkte im Set.</td></tr>
            </tfoot>
        </table>
    </div>
    <?php
}

/** Pricing meta box: mode radios + value + live preview. */
function oeff_sets_render_pricing_box($post) {
    $mode  = get_post_meta($post->ID, '_oeff_set_pricing_mode', true) ?: 'percent';
    $value = get_post_meta($post->ID, '_oeff_set_pricing_value', true);
    ?>
    <div class="oeff-set-pricing">
        <p>
            <label><input type="radio" name="oeff_set_pricing_mode" value="fixed" <?php checked($mode, 'fixed'); ?> /> Fester Set-Preis (€)</label><br/>
            <label><input type="radio" name="oeff_set_pricing_mode" value="percent" <?php checked($mode, 'percent'); ?> /> Summe − Prozent (%)</label><br/>
            <label><input type="radio" name="oeff_set_pricing_mode" value="amount" <?php checked($mode, 'amount'); ?> /> Summe − Betrag (€)</label>
        </p>
        <p>
            <label for="oeff-set-pricing-value"><strong>Wert</strong></label><br/>
            <input type="number" step="0.01" min="0" id="oeff-set-pricing-value" name="oeff_set_pricing_value" value="<?php echo esc_attr($value); ?>" class="regular-text" />
        </p>
        <div class="oeff-set-preview" id="oeff-set-preview">
            <div>Summe der Artikel: <strong data-preview="sum">–</strong></div>
            <div>Set-Preis: <strong data-preview="price">–</strong></div>
            <div>Ersparnis: <strong data-preview="savings">–</strong></div>
        </div>
        <p class="description">Vorschau nutzt die aktuellen Produktpreise. Der endgültige Rabatt wird im Warenkorb serverseitig berechnet.</p>
    </div>
    <?php
}

/** Set-Typ meta box: fixed vs configurable (JS toggles which boxes show). */
function oeff_sets_render_type_box($post) {
    $type = get_post_meta($post->ID, '_oeff_set_type', true) ?: 'fixed';
    ?>
    <div class="oeff-set-typebox">
        <p>
            <label><input type="radio" name="oeff_set_type" value="fixed" <?php checked($type, 'fixed'); ?> /> <strong>Fester Satz</strong></label><br/>
            <span class="description">Feste Produkte zum Set-Preis.</span>
        </p>
        <p>
            <label><input type="radio" name="oeff_set_type" value="configurable" <?php checked($type, 'configurable'); ?> /> <strong>Konfigurierbar</strong></label><br/>
            <span class="description">Kunde wählt aus einer Kategorie; Rabatt nach Menge.</span>
        </p>
    </div>
    <?php
}

/** Configurable meta box: source category + quantity discount tiers. */
function oeff_sets_render_config_box($post) {
    $category = (int) get_post_meta($post->ID, '_oeff_set_category', true);
    $cats     = function_exists('get_terms')
        ? get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false])
        : [];
    ?>
    <div class="oeff-set-config">
        <p>
            <label for="oeff-set-category"><strong>Kategorie</strong> – Kunden wählen Produkte hieraus</label><br/>
            <select id="oeff-set-category" name="oeff_set_category">
                <option value="0">— Kategorie wählen —</option>
                <?php if (!is_wp_error($cats)) : foreach ($cats as $cat) : ?>
                    <option value="<?php echo (int) $cat->term_id; ?>" <?php selected($category, $cat->term_id); ?>>
                        <?php echo esc_html($cat->name); ?> (<?php echo (int) $cat->count; ?>)
                    </option>
                <?php endforeach; endif; ?>
            </select>
        </p>
        <p><strong>Mengenrabatt-Stufen</strong></p>
        <table class="widefat oeff-set-tiers" id="oeff-set-tiers">
            <thead>
                <tr><th style="width:140px;">Ab Menge</th><th style="width:140px;">Rabatt (%)</th><th style="width:40px;"></th></tr>
            </thead>
            <tbody></tbody>
            <tfoot>
                <tr><td colspan="3" class="oeff-set-empty">Noch keine Stufen. Beispiel: ab 3 → 5 %, ab 5 → 10 %.</td></tr>
            </tfoot>
        </table>
        <p><button type="button" class="button" id="oeff-set-add-tier">Stufe hinzufügen</button></p>
        <p class="description">Es gilt die höchste erreichte Stufe. Unter der kleinsten Menge: kein Rabatt.</p>
    </div>
    <?php
}

/** Persist the builder fields when a Set is saved. */
add_action('save_post_' . OEFF_SETS_CPT, 'oeff_sets_save', 10, 2);
function oeff_sets_save($post_id, $post) {
    if (!isset($_POST['oeff_sets_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['oeff_sets_nonce'])), 'oeff_sets_save')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('manage_woocommerce')) {
        return;
    }

    // Components: array of { id, qty }.
    $components = [];
    if (!empty($_POST['oeff_set_components']) && is_array($_POST['oeff_set_components'])) {
        foreach (wp_unslash($_POST['oeff_set_components']) as $row) {
            $id  = isset($row['id']) ? absint($row['id']) : 0;
            $qty = isset($row['qty']) ? max(1, absint($row['qty'])) : 1;
            if ($id > 0) {
                $components[] = ['id' => $id, 'qty' => $qty];
            }
        }
    }
    update_post_meta($post_id, '_oeff_set_components', $components);

    $mode = isset($_POST['oeff_set_pricing_mode']) ? sanitize_key($_POST['oeff_set_pricing_mode']) : 'percent';
    if (!in_array($mode, ['fixed', 'percent', 'amount'], true)) {
        $mode = 'percent';
    }
    update_post_meta($post_id, '_oeff_set_pricing_mode', $mode);

    $value = isset($_POST['oeff_set_pricing_value']) ? (float) $_POST['oeff_set_pricing_value'] : 0;
    if ($value < 0) {
        $value = 0;
    }
    if ('percent' === $mode && $value > 100) {
        $value = 100;
    }
    update_post_meta($post_id, '_oeff_set_pricing_value', $value);

    // Set type.
    $type = isset($_POST['oeff_set_type']) ? sanitize_key($_POST['oeff_set_type']) : 'fixed';
    if (!in_array($type, ['fixed', 'configurable'], true)) {
        $type = 'fixed';
    }
    update_post_meta($post_id, '_oeff_set_type', $type);

    // Configurable: source category + quantity discount tiers (sorted ascending).
    $category = isset($_POST['oeff_set_category']) ? absint($_POST['oeff_set_category']) : 0;
    update_post_meta($post_id, '_oeff_set_category', $category);

    $tiers = [];
    if (!empty($_POST['oeff_set_tiers']) && is_array($_POST['oeff_set_tiers'])) {
        foreach (wp_unslash($_POST['oeff_set_tiers']) as $row) {
            $min = isset($row['min_qty']) ? absint($row['min_qty']) : 0;
            $pct = isset($row['percent']) ? (float) $row['percent'] : 0;
            if ($pct < 0) {
                $pct = 0;
            }
            if ($pct > 100) {
                $pct = 100;
            }
            if ($min > 0 && $pct > 0) {
                $tiers[] = ['min_qty' => $min, 'percent' => $pct];
            }
        }
        usort($tiers, function ($a, $b) {
            return $a['min_qty'] - $b['min_qty'];
        });
    }
    update_post_meta($post_id, '_oeff_set_tiers', $tiers);
}

/** Enqueue the builder assets on the Set add/edit screen only. */
add_action('admin_enqueue_scripts', 'oeff_sets_enqueue_admin');
function oeff_sets_enqueue_admin($hook) {
    if (!in_array($hook, ['post.php', 'post-new.php'], true)) {
        return;
    }
    $screen = get_current_screen();
    if (!$screen || OEFF_SETS_CPT !== $screen->post_type) {
        return;
    }

    wp_enqueue_style('oeff-sets-admin', OEFF_SETS_URL . 'assets/admin.css', [], OEFF_SETS_VERSION);
    wp_enqueue_script('oeff-sets-admin', OEFF_SETS_URL . 'assets/admin.js', [], OEFF_SETS_VERSION, true);

    // Resolve existing components to display data so the JS can hydrate the rows.
    global $post;
    $existing   = [];
    $components = $post ? get_post_meta($post->ID, '_oeff_set_components', true) : [];
    if (is_array($components) && function_exists('wc_get_product')) {
        foreach ($components as $c) {
            $product = wc_get_product($c['id']);
            if ($product) {
                $existing[] = [
                    'id'    => (int) $c['id'],
                    'qty'   => (int) $c['qty'],
                    'name'  => $product->get_name(),
                    'price' => (float) $product->get_price(),
                ];
            }
        }
    }

    $tiers = $post ? get_post_meta($post->ID, '_oeff_set_tiers', true) : [];
    $tiers = is_array($tiers) ? array_values($tiers) : [];

    wp_localize_script('oeff-sets-admin', 'OeffSets', [
        'ajaxUrl'  => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('oeff_sets_search'),
        'currency' => function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '€',
        'existing' => $existing,
        'type'     => $post ? (get_post_meta($post->ID, '_oeff_set_type', true) ?: 'fixed') : 'fixed',
        'tiers'    => $tiers,
    ]);
}

/** admin-ajax product search for the builder. */
add_action('wp_ajax_oeff_sets_search', 'oeff_sets_ajax_search');
function oeff_sets_ajax_search() {
    check_ajax_referer('oeff_sets_search', 'nonce');
    if (!current_user_can('manage_woocommerce') || !function_exists('wc_get_product')) {
        wp_send_json_error([], 403);
    }

    $term = isset($_GET['term']) ? sanitize_text_field(wp_unslash($_GET['term'])) : '';
    if (strlen($term) < 2) {
        wp_send_json_success([]);
    }

    $query = new WP_Query([
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => 20,
        's'              => $term,
        'orderby'        => 'title',
        'order'          => 'ASC',
        'no_found_rows'  => true,
    ]);

    $out = [];
    foreach ($query->posts as $p) {
        $product = wc_get_product($p->ID);
        if (!$product) {
            continue;
        }
        $out[] = [
            'id'    => $product->get_id(),
            'name'  => $product->get_name(),
            'price' => (float) $product->get_price(),
        ];
    }
    wp_reset_postdata();

    wp_send_json_success($out);
}
