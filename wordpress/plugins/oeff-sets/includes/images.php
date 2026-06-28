<?php
/**
 * Öfflinger Sets — auto-composed set thumbnails.
 *
 * For a set without an uploaded image, composes ONE thumbnail from its product
 * photos: each bottle's white background is removed (corner-seeded flood fill,
 * which keeps the label), trimmed to its bounds, and the bottles are laid out
 * overlapping on a white canvas — saved as a single JPEG (quality 90) in uploads
 * as set-<id>.jpg. Cached and regenerated when the set or a product photo
 * changes (see cleanup.php). Returns null if Imagick is missing or anything
 * fails, in which case the storefront shows a neutral placeholder.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Directory + URL base for generated set images, or null on failure. */
function oeff_sets_image_dir() {
    $uploads = wp_upload_dir();
    if (!empty($uploads['error'])) {
        return null;
    }
    return [
        'dir' => trailingslashit($uploads['basedir']) . 'oeff-sets',
        'url' => trailingslashit($uploads['baseurl']) . 'oeff-sets',
    ];
}

/** Absolute path to a product image: prefer the uncropped single size, else original. */
function oeff_sets_source_path($attachment_id) {
    $attachment_id = (int) $attachment_id;
    if (!$attachment_id) {
        return null;
    }
    $uploads = wp_upload_dir();
    if (!empty($uploads['error'])) {
        return null;
    }
    $sized = image_get_intermediate_size($attachment_id, 'woocommerce_single');
    if ($sized && !empty($sized['path'])) {
        $candidate = trailingslashit($uploads['basedir']) . $sized['path'];
        if (file_exists($candidate)) {
            return $candidate;
        }
    }
    $src = get_attached_file($attachment_id);
    return ($src && file_exists($src)) ? $src : null;
}

/**
 * URL of the auto-composed thumbnail for a set, generating it on demand.
 *
 * @param int   $set_id      The set post ID (used as the cache filename).
 * @param int[] $product_ids Component/option product IDs to compose from.
 * @return string|null
 */
function oeff_sets_composite_url($set_id, $product_ids) {
    if (!class_exists('Imagick')) {
        return null;
    }
    $set_id = (int) $set_id;
    $base   = oeff_sets_image_dir();
    if (!$base) {
        return null;
    }

    // Resolve the (up to 4) product photos to compose.
    $sources = [];
    foreach ((array) $product_ids as $pid) {
        $pid = absint($pid);
        if (!$pid) {
            continue;
        }
        $img_id = get_post_thumbnail_id($pid);
        if (!$img_id) {
            continue;
        }
        $path = oeff_sets_source_path($img_id);
        if ($path) {
            $sources[] = $path;
        }
        if (count($sources) >= 4) {
            break;
        }
    }
    if (empty($sources)) {
        return null;
    }

    $file = $base['dir'] . '/set-' . $set_id . '.jpg';
    $url  = $base['url'] . '/set-' . $set_id . '.jpg';

    // Reuse the cache unless a source photo is newer than the composite.
    $newest = 0;
    foreach ($sources as $p) {
        $newest = max($newest, (int) @filemtime($p));
    }
    if (file_exists($file) && filemtime($file) >= $newest) {
        return $url;
    }

    if (!wp_mkdir_p($base['dir'])) {
        return null;
    }

    try {
        $canvas_w = 1200;
        $canvas_h = 900;
        $usable_h = (int) round($canvas_h * 0.84);
        $usable_w = (int) round($canvas_w * 0.92);
        $overlap  = 0.16; // each bottle tucked 16% behind the previous

        $canvas = new Imagick();
        $canvas->newImage($canvas_w, $canvas_h, new ImagickPixel('white'));
        $canvas->setImageFormat('jpeg');

        $bottles = [];
        foreach ($sources as $path) {
            $b = new Imagick($path);
            $b->setImageAlphaChannel(Imagick::ALPHACHANNEL_ACTIVATE);
            $range = $b->getQuantumRange();
            $q     = (is_array($range) && !empty($range['quantumRangeLong'])) ? $range['quantumRangeLong'] : 65535;
            $fuzz  = 0.10 * $q;
            $w = $b->getImageWidth();
            $h = $b->getImageHeight();
            // Remove the white background; corner seeds keep the (interior) label.
            foreach ([[0, 0], [$w - 1, 0], [0, $h - 1], [$w - 1, $h - 1]] as $corner) {
                $b->floodFillPaintImage('transparent', $fuzz, 'white', (int) $corner[0], (int) $corner[1], false);
            }
            $b->trimImage($fuzz);
            $b->setImagePage(0, 0, 0, 0);
            $b->resizeImage(0, $usable_h, Imagick::FILTER_LANCZOS, 1);
            $bottles[] = $b;
        }

        $row_width = function ($bottles) use ($overlap) {
            $total = 0;
            foreach ($bottles as $i => $b) {
                $total += ($i === 0) ? $b->getImageWidth() : (int) round($b->getImageWidth() * (1 - $overlap));
            }
            return $total;
        };

        $total = $row_width($bottles);
        if ($total > $usable_w && $total > 0) {
            $scale = $usable_w / $total;
            foreach ($bottles as $b) {
                $b->resizeImage(0, max(1, (int) round($b->getImageHeight() * $scale)), Imagick::FILTER_LANCZOS, 1);
            }
            $total = $row_width($bottles);
        }

        $x = (int) round(($canvas_w - $total) / 2);
        foreach ($bottles as $i => $b) {
            $bw = $b->getImageWidth();
            $bh = $b->getImageHeight();
            $y  = (int) round(($canvas_h - $bh) / 2);
            $canvas->compositeImage($b, Imagick::COMPOSITE_OVER, $x, $y);
            $x += (int) round($bw * (1 - $overlap));
            $b->clear();
            $b->destroy();
        }

        $canvas->setImageCompressionQuality(90);
        $canvas->writeImage($file);
        $canvas->clear();
        $canvas->destroy();
    } catch (\Throwable $e) {
        return null;
    }

    return file_exists($file) ? $url : null;
}
