<?php
/**
 * Plugin Name: Reviews API (Oefflinger)
 * Description: Product review submission endpoint for the headless frontend (held for moderation, D4).
 *
 * Product review submission endpoint for the headless frontend.
 * POST /wp-json/oeff/v1/reviews
 *   { product_id, rating (1-5), reviewer, [reviewer_email optional], [review optional],
 *     website (honeypot), turnstile_token }
 *
 * Creates a WooCommerce review (comment_type 'review') HELD FOR MODERATION
 * (comment_approved = 0) per decision D4 — the shop owner approves it in wp-admin.
 * Reviews are READ by the frontend via the WooCommerce Store API
 * (/wc/store/v1/products/reviews and the product's average_rating/review_count).
 *
 * Mirrors the protections of the contact/newsletter APIs: rate limit, honeypot,
 * Turnstile, generic responses.
 *
 * WordPress settings required (wp-admin → WooCommerce → Settings → Products):
 *   - "Enable product reviews" = ON
 *   - "Reviews can only be left by verified owners" = OFF (open reviews, moderated)
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('oeff/v1', '/reviews', [
        'methods'             => 'POST',
        'callback'            => 'oeff_reviews_handle',
        'permission_callback' => '__return_true',
    ]);
});

function oeff_reviews_error($code, $message, $status) {
    return new WP_REST_Response(['code' => $code, 'message' => $message], $status);
}

function oeff_reviews_handle(WP_REST_Request $request) {
    // Rate limit: 5 reviews per hour per IP
    if (function_exists('oeff_rate_limit') && !oeff_rate_limit('reviews', 5, HOUR_IN_SECONDS)) {
        return oeff_reviews_error('rate_limited', 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.', 429);
    }

    // Honeypot – bots fill it, humans never see it
    $honeypot = (string) $request->get_param('website');
    if ($honeypot !== '') {
        return new WP_REST_Response(['ok' => true], 200); // pretend success
    }

    // Turnstile (skipped automatically when TURNSTILE_SECRET_KEY is not configured)
    $token = (string) $request->get_param('turnstile_token');
    if (function_exists('oeff_verify_turnstile') && !oeff_verify_turnstile($token)) {
        return oeff_reviews_error('turnstile_failed', 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte laden Sie die Seite neu.', 400);
    }

    $product_id = (int) $request->get_param('product_id');
    $rating     = (int) $request->get_param('rating');
    $name       = sanitize_text_field((string) $request->get_param('reviewer'));
    $email      = sanitize_email((string) $request->get_param('reviewer_email'));
    $review     = sanitize_textarea_field((string) $request->get_param('review'));

    // Validate the product exists and is a published product
    if ($product_id <= 0 || get_post_type($product_id) !== 'product' || get_post_status($product_id) !== 'publish') {
        return oeff_reviews_error('invalid_product', 'Produkt nicht gefunden.', 404);
    }
    if ($rating < 1 || $rating > 5) {
        return oeff_reviews_error('invalid_rating', 'Bitte geben Sie eine Bewertung von 1 bis 5 Sternen ab.', 400);
    }
    if (mb_strlen($name) < 2 || mb_strlen($name) > 100) {
        return oeff_reviews_error('invalid_name', 'Bitte geben Sie Ihren Namen an.', 400);
    }
    // E-Mail is optional; validate only when provided.
    if ($email !== '' && !is_email($email)) {
        return oeff_reviews_error('invalid_email', 'Bitte geben Sie eine gültige E-Mail-Adresse an.', 400);
    }
    // Review text is optional (rating-only reviews allowed); cap length when present.
    if (mb_strlen($review) > 3000) {
        return oeff_reviews_error('invalid_review', 'Der Bewertungstext ist zu lang (max. 3000 Zeichen).', 400);
    }

    // Create the review as an unapproved comment of type 'review'.
    $commentdata = [
        'comment_post_ID'      => $product_id,
        'comment_author'       => $name,
        'comment_author_email' => $email,
        'comment_content'      => $review,
        'comment_type'         => 'review',
        'comment_parent'       => 0,
        'user_id'              => get_current_user_id(),
        'comment_approved'     => 0, // hold for moderation (D4)
        'comment_author_IP'    => function_exists('oeff_client_ip') ? oeff_client_ip() : '',
        'comment_agent'        => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 254),
    ];

    $comment_id = wp_insert_comment($commentdata);
    if (!$comment_id) {
        return oeff_reviews_error('insert_failed', 'Ihre Bewertung konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.', 500);
    }

    add_comment_meta($comment_id, 'rating', $rating, true);
    add_comment_meta($comment_id, 'verified', 0, true);

    return new WP_REST_Response([
        'ok'      => true,
        'message' => 'Vielen Dank! Ihre Bewertung wird nach einer kurzen Prüfung veröffentlicht.',
    ], 201);
}
