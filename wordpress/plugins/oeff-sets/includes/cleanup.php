<?php
/**
 * Öfflinger Sets — cleanup of generated thumbnails.
 *
 * Generated set thumbnails live in uploads/oeff-sets/ as set-<id>.jpg. They are
 * deleted when a set is saved (so the next view regenerates it) or deleted, and
 * a daily cron sweeps the folder for composites whose set no longer exists, plus
 * any legacy per-product cutout files from the earlier approach.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Delete the generated composite for one set (forces regeneration on next view). */
function oeff_sets_delete_composite($set_id) {
    $base = oeff_sets_image_dir();
    if (!$base) {
        return;
    }
    $file = $base['dir'] . '/set-' . (int) $set_id . '.jpg';
    if (file_exists($file)) {
        @unlink($file);
    }
}

// Regenerate on edit (components/pricing may have changed), remove on delete.
add_action('save_post_' . OEFF_SETS_CPT, 'oeff_sets_delete_composite');
add_action('before_delete_post', function ($post_id) {
    if (get_post_type($post_id) === OEFF_SETS_CPT) {
        oeff_sets_delete_composite($post_id);
    }
});

/** Daily sweep: drop composites for missing sets + legacy per-product cutouts. */
function oeff_sets_cleanup_images() {
    $base = oeff_sets_image_dir();
    if (!$base || !is_dir($base['dir'])) {
        return;
    }
    $files = glob($base['dir'] . '/*.{png,jpg,jpeg}', GLOB_BRACE);
    if (!$files) {
        return;
    }
    foreach ($files as $file) {
        $name = basename($file);
        // Legacy per-product cutouts from the earlier approach — no longer used.
        if (strpos($name, 'cutout-') === 0) {
            @unlink($file);
            continue;
        }
        // Composite whose set no longer exists.
        if (preg_match('/^set-(\d+)\.jpg$/', $name, $m) && get_post_status((int) $m[1]) === false) {
            @unlink($file);
        }
    }
}
add_action('oeff_sets_daily_cleanup', 'oeff_sets_cleanup_images');

// Schedule the daily sweep (wp-cron fires on normal traffic).
add_action('init', function () {
    if (!wp_next_scheduled('oeff_sets_daily_cleanup')) {
        wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', 'oeff_sets_daily_cleanup');
    }
});
