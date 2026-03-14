<?php
/**
 * Plugin Name: Delivery Estimate for Store API
 * Description: Adds delivery_estimate to product responses. Configurable cutoff hour, timezone, and per-product shipping days. Work-day aware.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OEFFLINGER_DELIVERY_META_KEY', '_oefflinger_shipping_days');
define('OEFFLINGER_DELIVERY_OPTION_CUTOFF', 'oefflinger_delivery_cutoff_hour');
define('OEFFLINGER_DELIVERY_OPTION_TZ', 'oefflinger_delivery_timezone');
define('OEFFLINGER_DELIVERY_OPTION_DAYS', 'oefflinger_delivery_default_days');

$oefflinger_delivery_weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
$oefflinger_delivery_months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/**
 * Check if a date is a work day (Mon–Fri).
 */
function oefflinger_is_workday(DateTime $dt) {
    $dow = (int) $dt->format('N');
    return $dow >= 1 && $dow <= 5;
}

/**
 * Add N work days to a date.
 */
function oefflinger_add_work_days(DateTime $dt, int $days) {
    $added = 0;
    $current = clone $dt;
    while ($added < $days) {
        $current->modify('+1 day');
        if (oefflinger_is_workday($current)) {
            $added++;
        }
    }
    return $current;
}

/**
 * Get next work day (or today if today is work day).
 */
function oefflinger_next_ship_date(DateTime $now, int $cutoffHour) {
    $hour = (int) $now->format('G');
    $minute = (int) $now->format('i');
    $currentMinutes = $hour * 60 + $minute;
    $cutoffMinutes = $cutoffHour * 60;

    if (oefflinger_is_workday($now) && $currentMinutes < $cutoffMinutes) {
        return clone $now;
    }
    $next = clone $now;
    $next->modify('+1 day');
    while (!oefflinger_is_workday($next)) {
        $next->modify('+1 day');
    }
    return $next;
}

/**
 * Calculate delivery estimate for a product.
 */
function oefflinger_calc_delivery_estimate(int $shippingDays) {
    $cutoff = (int) get_option(OEFFLINGER_DELIVERY_OPTION_CUTOFF, 14);
    $tz = get_option(OEFFLINGER_DELIVERY_OPTION_TZ, 'Europe/Berlin');
    if (!in_array($tz, timezone_identifiers_list(), true)) {
        $tz = 'Europe/Berlin';
    }
    try {
        $now = new DateTime('now', new DateTimeZone($tz));
    } catch (Exception $e) {
        return null;
    }

    $shipDate = oefflinger_next_ship_date($now, $cutoff);
    $deliveryDate = oefflinger_add_work_days($shipDate, max(0, $shippingDays));

    global $oefflinger_delivery_weekdays, $oefflinger_delivery_months;
    $dow = (int) $deliveryDate->format('N') - 1;
    $month = (int) $deliveryDate->format('n') - 1;
    $dayNum = $deliveryDate->format('j');
    $deliveryDayName = $oefflinger_delivery_weekdays[$dow];
    $deliveryMonth = $oefflinger_delivery_months[$month];
    $deliveryDateStr = $deliveryDate->format('Y-m-d');
    $formattedDate = $deliveryDayName . ', ' . $dayNum . '. ' . $deliveryMonth;

    $orderBy = sprintf('%02d:00', $cutoff);
    $hour = (int) $now->format('G');
    $minute = (int) $now->format('i');
    $currentMinutes = $hour * 60 + $minute;
    $cutoffMinutes = $cutoff * 60;

    $hoursLeft = 0;
    $message = '';

    if (oefflinger_is_workday($now) && $currentMinutes < $cutoffMinutes) {
        $hoursLeft = (int) floor(($cutoffMinutes - $currentMinutes) / 60);
        if ($hoursLeft < 1) {
            $minsLeft = $cutoffMinutes - $currentMinutes;
            $message = sprintf(
                'Bestellen Sie in den nächsten %d Minuten für Lieferung am %s',
                $minsLeft,
                $formattedDate
            );
            $hoursLeft = 0;
        } else {
            $message = sprintf(
                'Bestellen Sie in den nächsten %d %s für Lieferung am %s',
                $hoursLeft,
                $hoursLeft === 1 ? 'Stunde' : 'Stunden',
                $formattedDate
            );
        }
    } else {
        $nextCutoff = oefflinger_next_ship_date($now, $cutoff);
        $nextCutoffStr = ($nextCutoff->format('Y-m-d') === $now->format('Y-m-d')) ? 'heute' : ($nextCutoff->format('N') === '1' ? 'Montag' : 'morgen');
        $message = sprintf(
            'Bestellen Sie bis %s %s für Lieferung am %s',
            $nextCutoffStr,
            $orderBy,
            $formattedDate
        );
    }

    return [
        'orderBy' => $orderBy,
        'orderByHoursLeft' => $hoursLeft,
        'deliveryDate' => $deliveryDateStr,
        'deliveryDayName' => $deliveryDayName,
        'message' => $message,
    ];
}

/**
 * Inject delivery_estimate into product responses.
 */
function oefflinger_inject_delivery_estimate($response, $server, $request) {
    if (!function_exists('wc_get_product')) {
        return $response;
    }
    $route = $request->get_route() ?? '';
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    $is_products = (strpos($route, 'products') !== false) || (strpos($uri, 'wc/store') !== false && strpos($uri, 'products') !== false);
    if (!$is_products) {
        return $response;
    }
    if (!($response instanceof WP_REST_Response)) {
        return $response;
    }
    $data = $response->get_data();
    if (!is_array($data)) {
        return $response;
    }
    $defaultDays = (int) get_option(OEFFLINGER_DELIVERY_OPTION_DAYS, 2);
    $defaultDays = max(0, min(10, $defaultDays));

    $products = isset($data[0]) && is_array($data[0]) ? $data : [$data];
    $modified = false;
    foreach ($products as $i => $product) {
        if (!is_array($product) || !isset($product['id'])) {
            continue;
        }
        $productId = (int) $product['id'];
        $shippingDays = get_post_meta($productId, OEFFLINGER_DELIVERY_META_KEY, true);
        if ($shippingDays === '' || $shippingDays === false) {
            $shippingDays = $defaultDays;
        } else {
            $shippingDays = max(0, min(10, (int) $shippingDays));
        }
        $estimate = oefflinger_calc_delivery_estimate($shippingDays);
        if ($estimate) {
            $products[$i]['delivery_estimate'] = $estimate;
            $modified = true;
        }
    }
    if ($modified) {
        $response->set_data(isset($data[0]) && is_array($data[0]) ? $products : $products[0]);
    }
    return $response;
}

add_filter('rest_request_after_callbacks', 'oefflinger_inject_delivery_estimate', 10, 3);
add_filter('woocommerce_hydration_request_after_callbacks', 'oefflinger_inject_delivery_estimate', 10, 3);

/**
 * Admin: Settings page.
 */
function oefflinger_delivery_add_settings_page() {
    add_options_page(
        'Lieferzeiten',
        'Lieferzeiten',
        'manage_options',
        'oefflinger-delivery',
        'oefflinger_delivery_render_settings_page'
    );
}

function oefflinger_delivery_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    if (isset($_POST['oefflinger_delivery_save']) && check_admin_referer('oefflinger_delivery_settings')) {
        $cutoff = isset($_POST['oefflinger_cutoff']) ? (int) $_POST['oefflinger_cutoff'] : 14;
        $cutoff = max(0, min(23, $cutoff));
        update_option(OEFFLINGER_DELIVERY_OPTION_CUTOFF, $cutoff);

        $tz = isset($_POST['oefflinger_tz']) ? sanitize_text_field($_POST['oefflinger_tz']) : 'Europe/Berlin';
        if (in_array($tz, timezone_identifiers_list(), true)) {
            update_option(OEFFLINGER_DELIVERY_OPTION_TZ, $tz);
        }

        $days = isset($_POST['oefflinger_days']) ? (int) $_POST['oefflinger_days'] : 2;
        $days = max(0, min(10, $days));
        update_option(OEFFLINGER_DELIVERY_OPTION_DAYS, $days);

        echo '<div class="notice notice-success"><p>Einstellungen gespeichert.</p></div>';
    }
    $cutoff = (int) get_option(OEFFLINGER_DELIVERY_OPTION_CUTOFF, 14);
    $tz = get_option(OEFFLINGER_DELIVERY_OPTION_TZ, 'Europe/Berlin');
    $days = (int) get_option(OEFFLINGER_DELIVERY_OPTION_DAYS, 2);
    ?>
    <div class="wrap">
        <h1>Lieferzeiten</h1>
        <p>Einstellungen für die Lieferzeitschätzung auf der Produktseite.</p>
        <form method="post">
            <?php wp_nonce_field('oefflinger_delivery_settings'); ?>
            <table class="form-table">
                <tr>
                    <th><label for="oefflinger_cutoff">Versand bis Uhrzeit (Stunde)</label></th>
                    <td>
                        <input type="number" id="oefflinger_cutoff" name="oefflinger_cutoff" value="<?php echo esc_attr($cutoff); ?>" min="0" max="23" />
                        <p class="description">Bestellungen vor dieser Uhrzeit werden am gleichen Werktag versendet (z.B. 14 = 14:00).</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="oefflinger_tz">Zeitzone</label></th>
                    <td>
                        <select id="oefflinger_tz" name="oefflinger_tz">
                            <?php
                            $zones = ['Europe/Berlin', 'Europe/Vienna', 'Europe/Zurich', 'UTC'];
                            foreach ($zones as $z) {
                                printf('<option value="%s"%s>%s</option>', esc_attr($z), selected($tz, $z, false), esc_html($z));
                            }
                            ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th><label for="oefflinger_days">Standard Werktage (Vorbereitung + Versand)</label></th>
                    <td>
                        <input type="number" id="oefflinger_days" name="oefflinger_days" value="<?php echo esc_attr($days); ?>" min="0" max="10" />
                        <p class="description">Anzahl Werktage von Versand bis Lieferung. Kann pro Produkt überschrieben werden.</p>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="oefflinger_delivery_save" class="button button-primary" value="Speichern" />
            </p>
        </form>
    </div>
    <?php
}

add_action('admin_menu', 'oefflinger_delivery_add_settings_page');

/**
 * Admin: Product meta box.
 */
function oefflinger_delivery_add_product_meta_box() {
    add_meta_box(
        'oefflinger_delivery',
        'Lieferung',
        'oefflinger_delivery_render_meta_box',
        'product',
        'side'
    );
}

function oefflinger_delivery_render_meta_box($post) {
    wp_nonce_field('oefflinger_delivery_meta', 'oefflinger_delivery_nonce');
    $val = get_post_meta($post->ID, OEFFLINGER_DELIVERY_META_KEY, true);
    $defaultDays = (int) get_option(OEFFLINGER_DELIVERY_OPTION_DAYS, 2);
    ?>
    <p>
        <label for="oefflinger_shipping_days">Werktage (Vorbereitung + Versand)</label><br />
        <input type="number" id="oefflinger_shipping_days" name="oefflinger_shipping_days" value="<?php echo esc_attr($val !== '' && $val !== false ? $val : ''); ?>" min="0" max="10" placeholder="<?php echo esc_attr($defaultDays); ?>" style="width:80px" />
    </p>
    <p class="description">Leer = Standard (<?php echo esc_html($defaultDays); ?> Tage) aus den Lieferzeiten-Einstellungen.</p>
    <?php
}

function oefflinger_delivery_save_meta_box($postId) {
    if (!isset($_POST['oefflinger_delivery_nonce']) || !wp_verify_nonce($_POST['oefflinger_delivery_nonce'], 'oefflinger_delivery_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $postId)) {
        return;
    }
    if (isset($_POST['oefflinger_shipping_days'])) {
        $val = $_POST['oefflinger_shipping_days'];
        if ($val === '') {
            delete_post_meta($postId, OEFFLINGER_DELIVERY_META_KEY);
        } else {
            $val = max(0, min(10, (int) $val));
            update_post_meta($postId, OEFFLINGER_DELIVERY_META_KEY, $val);
        }
    }
}

add_action('add_meta_boxes', 'oefflinger_delivery_add_product_meta_box');
add_action('save_post_product', 'oefflinger_delivery_save_meta_box');
