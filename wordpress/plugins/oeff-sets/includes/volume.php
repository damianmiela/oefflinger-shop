<?php
/**
 * Öfflinger — shop-wide Mengenrabatt (volume discount).
 *
 * A single global rule, completely separate from fixed Sets: the more LOOSE
 * bottles in the cart (items that are NOT part of a Set), the higher the
 * automatic % discount. Configured under "Sets → Mengenrabatt". Recomputed
 * server-side on every cart calculation and exposed to the headless storefront
 * via the Store API (cart-level `extensions.oeff_volume`) so the progress bar +
 * messaging stay in sync.
 *
 * No stacking — best deal wins: the volume discount and coupon codes never
 * combine. The customer gets whichever saves more. When the volume discount
 * wins, any applied coupon is neutralised (kept visible, discount forced to 0)
 * with a note; when a coupon wins, the volume discount steps aside. Fixed-Set
 * lines are fully independent: they keep their set price, get no volume %, and
 * their bottles do not count toward the threshold.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OEFF_VOLUME_OPTION', 'oeff_volume_discount');

/* -------------------------------------------------------------------------- */
/* Config                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Global config: ['enabled' => bool, 'tiers' => [['min_qty'=>int,'percent'=>float], ...]].
 * Tiers are normalised (positive only) and sorted ascending by min_qty.
 */
function oeff_volume_get_config() {
    $raw     = get_option(OEFF_VOLUME_OPTION, []);
    $enabled = !empty($raw['enabled']);
    $tiers   = [];

    if (!empty($raw['tiers']) && is_array($raw['tiers'])) {
        foreach ($raw['tiers'] as $t) {
            $min = isset($t['min_qty']) ? (int) $t['min_qty'] : 0;
            $pct = isset($t['percent']) ? (float) $t['percent'] : 0;
            if ($min > 0 && $pct > 0) {
                $tiers[] = ['min_qty' => $min, 'percent' => min(100.0, $pct)];
            }
        }
        usort($tiers, function ($a, $b) {
            return $a['min_qty'] - $b['min_qty'];
        });
    }

    return ['enabled' => $enabled, 'tiers' => $tiers];
}

/** Highest tier percent reached by $qty (tiers ascending); 0 if none reached. */
function oeff_volume_tier_percent($tiers, $qty) {
    $pct = 0.0;
    foreach ($tiers as $t) {
        if ($qty >= $t['min_qty']) {
            $pct = (float) $t['percent'];
        }
    }
    return $pct;
}

/** The next tier above $qty, or null when already at the top tier. */
function oeff_volume_next_tier($tiers, $qty) {
    foreach ($tiers as $t) {
        if ($qty < $t['min_qty']) {
            return $t;
        }
    }
    return null;
}

/* -------------------------------------------------------------------------- */
/* Admin screen: Sets → Mengenrabatt                                          */
/* -------------------------------------------------------------------------- */

add_action('admin_menu', function () {
    add_submenu_page(
        'edit.php?post_type=' . OEFF_SETS_CPT,
        'Mengenrabatt',
        'Mengenrabatt',
        'manage_woocommerce',
        'oeff-volume-discount',
        'oeff_volume_render_admin'
    );
});

add_action('admin_post_oeff_volume_save', 'oeff_volume_handle_save');
function oeff_volume_handle_save() {
    if (!current_user_can('manage_woocommerce')) {
        wp_die('Keine Berechtigung.');
    }
    check_admin_referer('oeff_volume_save', 'oeff_volume_nonce');

    $enabled = !empty($_POST['oeff_volume_enabled']);

    $tiers = [];
    if (!empty($_POST['oeff_volume_tiers']) && is_array($_POST['oeff_volume_tiers'])) {
        foreach (wp_unslash($_POST['oeff_volume_tiers']) as $row) {
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

    update_option(OEFF_VOLUME_OPTION, ['enabled' => $enabled, 'tiers' => $tiers]);

    wp_safe_redirect(add_query_arg(
        ['post_type' => OEFF_SETS_CPT, 'page' => 'oeff-volume-discount', 'updated' => '1'],
        admin_url('edit.php')
    ));
    exit;
}

function oeff_volume_render_admin() {
    if (!current_user_can('manage_woocommerce')) {
        return;
    }
    $config  = oeff_volume_get_config();
    $enabled = $config['enabled'];
    $tiers   = $config['tiers'];
    ?>
    <div class="wrap">
        <h1>Mengenrabatt</h1>

        <?php if (isset($_GET['updated'])) : ?>
            <div class="notice notice-success is-dismissible"><p>Einstellungen gespeichert.</p></div>
        <?php endif; ?>

        <p class="description" style="max-width:680px;">
            Automatischer, shop-weiter Rabatt nach Anzahl der Flaschen im Warenkorb –
            „je mehr, desto günstiger“. Gilt für alle Einzelartikel; Artikel aus einem
            Set zählen nicht mit. Rabatt und Gutscheine werden nie kombiniert: es gilt
            immer der für den Kunden günstigere.
        </p>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="oeff_volume_save" />
            <?php wp_nonce_field('oeff_volume_save', 'oeff_volume_nonce'); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row">Status</th>
                    <td>
                        <label>
                            <input type="checkbox" name="oeff_volume_enabled" value="1" <?php checked($enabled); ?> />
                            Mengenrabatt aktivieren
                        </label>
                    </td>
                </tr>
            </table>

            <h2>Rabatt-Stufen</h2>
            <table class="widefat oeff-volume-tiers" id="oeff-volume-tiers" style="max-width:520px;">
                <thead>
                    <tr>
                        <th style="width:160px;">Ab Flaschen</th>
                        <th style="width:160px;">Rabatt (%)</th>
                        <th style="width:48px;"></th>
                    </tr>
                </thead>
                <tbody></tbody>
                <tfoot>
                    <tr><td colspan="3" style="color:#646970;font-style:italic;">Noch keine Stufen. Beispiel: ab 3 → 5 %, ab 6 → 10 %, ab 12 → 15 %.</td></tr>
                </tfoot>
            </table>
            <p><button type="button" class="button" id="oeff-volume-add">Stufe hinzufügen</button></p>
            <p class="description">Es gilt die höchste erreichte Stufe. Unter der kleinsten Menge: kein Rabatt.</p>

            <?php submit_button('Speichern'); ?>
        </form>
    </div>

    <script>
    (function () {
        var tiers = <?php echo wp_json_encode(array_values($tiers)); ?> || [];
        var body  = document.querySelector('#oeff-volume-tiers tbody');
        var foot  = document.querySelector('#oeff-volume-tiers tfoot tr');

        function render() {
            body.innerHTML = '';
            tiers.forEach(function (t, i) {
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td><input type="number" min="1" step="1" class="small-text" name="oeff_volume_tiers[' + i + '][min_qty]" value="' + (t.min_qty || '') + '"></td>' +
                    '<td><input type="number" min="0" max="100" step="0.1" class="small-text" name="oeff_volume_tiers[' + i + '][percent]" value="' + (t.percent || '') + '"></td>' +
                    '<td><button type="button" class="button-link" aria-label="Entfernen" style="color:#b32d2e;font-weight:700;">✕</button></td>';
                tr.querySelector('button').addEventListener('click', function () {
                    tiers.splice(i, 1);
                    render();
                });
                body.appendChild(tr);
            });
            if (foot) foot.style.display = tiers.length ? 'none' : '';
        }

        document.getElementById('oeff-volume-add').addEventListener('click', function () {
            tiers.push({ min_qty: '', percent: '' });
            render();
        });

        render();
    })();
    </script>
    <?php
}

/* -------------------------------------------------------------------------- */
/* Cart engine                                                                */
/* -------------------------------------------------------------------------- */

/** Recompute the volume discount on every cart calculation (after the Set discount, prio 20). */
add_action('woocommerce_before_calculate_totals', 'oeff_volume_apply_discount', 25, 1);

function oeff_volume_apply_discount($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }
    if (!$cart || !is_a($cart, 'WC_Cart')) {
        return;
    }

    // Reset the per-request coupon-suppression flag.
    $GLOBALS['oeff_volume_suppress_coupons'] = false;

    $config = oeff_volume_get_config();
    $tiers  = $config['tiers'];

    $state = [
        'enabled'            => $config['enabled'],
        'applied'            => false,
        'percent'            => 0.0,
        'qty'                => 0,
        'savings'            => 0,    // cents (gross)
        'next_min_qty'       => 0,    // 0 = top tier reached / none
        'next_percent'       => 0.0,
        'winner'             => 'none',
        'suppressed_coupons' => [],
        'tiers'              => $tiers,
    ];

    if (!$config['enabled'] || empty($tiers)) {
        $GLOBALS['oeff_volume_state'] = $state;
        return;
    }

    // Eligible = loose lines (NOT part of a Set instance). Prices taken from the
    // catalog product so repeated recalculations never compound the discount.
    $eligible  = []; // key => original per-unit price (get_price basis)
    $qty       = 0;
    $base_sum  = 0.0; // get_price basis (for the winner comparison vs coupons)
    $gross_sum = 0.0; // incl. tax (for the savings figure shown to the customer)

    foreach ($cart->get_cart() as $key => $item) {
        if (!empty($item['oeff_set']['instance'])) {
            continue; // Set member → excluded from the volume discount + threshold.
        }
        $pid     = !empty($item['variation_id']) ? $item['variation_id'] : $item['product_id'];
        $product = wc_get_product($pid);
        if (!$product) {
            continue;
        }
        $q          = (int) $item['quantity'];
        $orig       = (float) $product->get_price();
        $qty       += $q;
        $base_sum  += $orig * $q;
        $gross_sum += (float) wc_get_price_including_tax($product, ['qty' => 1]) * $q;
        $eligible[$key] = $orig;
    }

    $state['qty'] = $qty;
    $percent      = oeff_volume_tier_percent($tiers, $qty);
    $state['percent'] = $percent;

    $next = oeff_volume_next_tier($tiers, $qty);
    if ($next) {
        $state['next_min_qty'] = (int) $next['min_qty'];
        $state['next_percent'] = (float) $next['percent'];
    }

    $volume_saving = $percent > 0 ? $base_sum * $percent / 100 : 0.0;

    // Coupon value (computed without mutating the cart) for best-deal-wins.
    $coupon_codes  = $cart->get_applied_coupons();
    $coupon_saving = 0.0;
    if (!empty($coupon_codes) && class_exists('WC_Discounts')) {
        $discounts = new WC_Discounts($cart);
        foreach ($coupon_codes as $code) {
            $discounts->apply_coupon(new WC_Coupon($code));
        }
        $by = $discounts->get_discounts_by_coupon();
        if (is_array($by)) {
            $coupon_saving = array_sum(array_map('floatval', $by));
        }
    }

    $volume_wins = $percent > 0 && (empty($coupon_codes) || $volume_saving > $coupon_saving);

    // Always (re)set the eligible line prices on every calculation: apply the tier
    // factor when the volume discount wins, otherwise reset to the original price.
    // Without the explicit reset, a discount from a previous higher-quantity
    // calculation would stick when the cart later drops below the first tier
    // (e.g. going from 2 → 1 bottle would keep the 2-bottle price).
    $factor = $volume_wins ? (1 - $percent / 100) : 1.0;
    foreach ($eligible as $key => $orig) {
        $cart->cart_contents[$key]['data']->set_price($orig * $factor);
    }

    if ($volume_wins) {
        $state['applied'] = true;
        $state['winner']  = 'volume';
        $state['savings'] = (int) round($gross_sum * $percent / 100 * 100);
        if (!empty($coupon_codes)) {
            $GLOBALS['oeff_volume_suppress_coupons'] = true;
            $state['suppressed_coupons'] = array_values($coupon_codes);
        }
    } elseif (!empty($coupon_codes) && $coupon_saving > 0) {
        $state['winner'] = 'coupon';
    }

    $GLOBALS['oeff_volume_state'] = $state;
}

/**
 * Best-deal-wins: when the volume discount wins, force applied coupons to 0 so
 * the two never stack. The coupon stays visibly applied; the storefront explains
 * it via the oeff_volume extension (winner + suppressed_coupons).
 */
add_filter('woocommerce_coupon_get_discount_amount', function ($discount) {
    return !empty($GLOBALS['oeff_volume_suppress_coupons']) ? 0 : $discount;
}, 10, 1);

/* -------------------------------------------------------------------------- */
/* Store API: expose the volume state on the cart                             */
/* -------------------------------------------------------------------------- */

add_action('woocommerce_blocks_loaded', function () {
    if (function_exists('woocommerce_store_api_register_endpoint_data')) {
        woocommerce_store_api_register_endpoint_data([
            'endpoint'        => 'cart',
            'namespace'       => 'oeff_volume',
            'data_callback'   => 'oeff_volume_cart_data',
            'schema_callback' => 'oeff_volume_cart_schema',
            'schema_type'     => ARRAY_A,
        ]);
    }
});

function oeff_volume_cart_data() {
    $s = isset($GLOBALS['oeff_volume_state']) ? $GLOBALS['oeff_volume_state'] : null;
    if (!$s) {
        $config = oeff_volume_get_config();
        $s = [
            'enabled' => $config['enabled'], 'applied' => false, 'percent' => 0.0,
            'qty' => 0, 'savings' => 0, 'next_min_qty' => 0, 'next_percent' => 0.0,
            'winner' => 'none', 'suppressed_coupons' => [], 'tiers' => $config['tiers'],
        ];
    }

    return [
        'enabled'            => (bool) $s['enabled'],
        'applied'            => (bool) $s['applied'],
        'percent'            => (float) $s['percent'],
        'qty'                => (int) $s['qty'],
        'savings'            => (int) $s['savings'],
        'next_min_qty'       => (int) $s['next_min_qty'],
        'next_percent'       => (float) $s['next_percent'],
        'winner'             => (string) $s['winner'],
        'suppressed_coupons' => array_values((array) $s['suppressed_coupons']),
        'tiers'              => array_map(function ($t) {
            return ['min_qty' => (int) $t['min_qty'], 'percent' => (float) $t['percent']];
        }, (array) $s['tiers']),
    ];
}

function oeff_volume_cart_schema() {
    return [
        'enabled'            => ['description' => 'Whether the volume discount is active.', 'type' => 'boolean', 'readonly' => true],
        'applied'            => ['description' => 'Whether the discount is currently applied to the cart.', 'type' => 'boolean', 'readonly' => true],
        'percent'            => ['description' => 'Current reached discount percent.', 'type' => 'number', 'readonly' => true],
        'qty'                => ['description' => 'Eligible (loose) bottle count.', 'type' => 'integer', 'readonly' => true],
        'savings'            => ['description' => 'Gross savings in minor units (cents).', 'type' => 'integer', 'readonly' => true],
        'next_min_qty'       => ['description' => 'Bottle count for the next tier (0 = top tier reached).', 'type' => 'integer', 'readonly' => true],
        'next_percent'       => ['description' => 'Percent of the next tier (0 = none).', 'type' => 'number', 'readonly' => true],
        'winner'             => ['description' => 'Which discount applies: volume | coupon | none.', 'type' => 'string', 'readonly' => true],
        'suppressed_coupons' => ['description' => 'Coupon codes neutralised because the volume discount is cheaper.', 'type' => 'array', 'readonly' => true, 'items' => ['type' => 'string']],
        'tiers'              => ['description' => 'All configured tiers.', 'type' => 'array', 'readonly' => true, 'items' => ['type' => 'object']],
    ];
}
