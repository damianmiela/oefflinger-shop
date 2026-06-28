<?php
/**
 * Öfflinger Sets — product image cutouts.
 *
 * Generates a white-background-removed (transparent PNG) version of a product
 * image for the auto-composed set thumbnail, so bottles can overlap without
 * white boxes. Uses Imagick flood-fill seeded from the four corners, which only
 * removes the background connected to the edges and therefore PRESERVES the
 * bottle's interior white (the label). The result is cached in uploads and we
 * fall back to the original image if Imagick is unavailable or anything fails.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * @param int    $attachment_id Product image attachment ID.
 * @param string $fallback_url  URL to return if a cutout can't be produced.
 * @return string Cutout PNG URL, or $fallback_url.
 */
function oeff_sets_cutout_url($attachment_id, $fallback_url) {
    $attachment_id = (int) $attachment_id;
    if (!$attachment_id || !class_exists('Imagick')) {
        return $fallback_url;
    }

    $uploads = wp_upload_dir();
    if (!empty($uploads['error'])) {
        return $fallback_url;
    }

    $cache_dir  = trailingslashit($uploads['basedir']) . 'oeff-sets';
    $cache_file = $cache_dir . '/cutout-v2-' . $attachment_id . '.png';
    $cache_url  = trailingslashit($uploads['baseurl']) . 'oeff-sets/cutout-v2-' . $attachment_id . '.png';

    // Source: prefer the (uncropped) single-product size, else the original file.
    $src   = get_attached_file($attachment_id);
    $sized = image_get_intermediate_size($attachment_id, 'woocommerce_single');
    if ($sized && !empty($sized['path'])) {
        $candidate = trailingslashit($uploads['basedir']) . $sized['path'];
        if (file_exists($candidate)) {
            $src = $candidate;
        }
    }
    if (!$src || !file_exists($src)) {
        return $fallback_url;
    }

    // Serve the cached cutout if it is current.
    if (file_exists($cache_file) && filemtime($cache_file) >= filemtime($src)) {
        return $cache_url;
    }

    if (!wp_mkdir_p($cache_dir)) {
        return $fallback_url;
    }

    try {
        $im = new Imagick($src);
        $im->setImageFormat('png');

        // Fuzz relative to THIS image's quantum range (reliable across IM builds).
        $range = $im->getQuantumRange();
        $q     = (is_array($range) && !empty($range['quantumRangeLong'])) ? $range['quantumRangeLong'] : 65535;
        $fuzz  = 0.10 * $q; // ~10% tolerance to catch near-white / anti-aliased edges

        // Make near-white pixels transparent (global paint — never runs away into
        // the dark bottle). The label/highlights also go transparent but read as
        // white on the white thumbnail background.
        $im->transparentPaintImage('white', 0.0, $fuzz, false);

        $im->writeImage($cache_file);
        $im->clear();
        $im->destroy();
    } catch (\Throwable $e) {
        return $fallback_url;
    }

    return file_exists($cache_file) ? $cache_url : $fallback_url;
}
