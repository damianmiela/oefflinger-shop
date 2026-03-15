#!/bin/bash

WP="wp --allow-root --path=/var/www/html"

echo "[setup] Installing mu-plugins and theme for headless frontend..."
mkdir -p /var/www/html/wp-content/mu-plugins /var/www/html/wp-content/themes
cp /usr/src/wordpress/wp-content/mu-plugins/cors-api.php /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
cp /usr/src/wordpress/wp-content/mu-plugins/stock-quantity-api.php /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
cp /usr/src/wordpress/wp-content/mu-plugins/product-attributes-api.php /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
cp /usr/src/wordpress/wp-content/mu-plugins/delivery-estimate-api.php /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
cp /usr/src/wordpress/wp-content/mu-plugins/checkout-styles.php /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
cp /usr/src/wordpress/wp-content/mu-plugins/checkout-embed.php /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
cp -r /usr/src/wordpress/wp-content/themes/oefflinger-checkout /var/www/html/wp-content/themes/ 2>/dev/null || true

echo "[setup] Waiting for WordPress files and database connection..."

until $WP db check >/dev/null 2>&1; do
    sleep 3
done

echo "[setup] Fixing uploads directory permissions (enables product image uploads)..."
mkdir -p /var/www/html/wp-content/uploads
chown -R www-data:www-data /var/www/html/wp-content/uploads
chmod -R 775 /var/www/html/wp-content/uploads

if ! $WP core is-installed 2>/dev/null; then
    echo "[setup] Running WordPress core install..."
    $WP core install \
        --url="${WP_URL:-http://localhost:4001}" \
        --title="Öfflinger" \
        --admin_user="${WP_ADMIN_USER:-admin}" \
        --admin_password="${WP_ADMIN_PASSWORD:-admin}" \
        --admin_email="${WP_ADMIN_EMAIL:-admin@oefflinger.de}" \
        --skip-email
fi

echo "[setup] WordPress is installed. Checking WooCommerce..."

if ! $WP plugin is-installed woocommerce 2>/dev/null; then
    echo "[setup] Installing WooCommerce..."
    $WP plugin install woocommerce --activate
else
    echo "[setup] WooCommerce already installed. Ensuring it is active..."
    $WP plugin activate woocommerce 2>/dev/null || true
fi

echo "[setup] Setting permalink structure..."
$WP rewrite structure '/%postname%/' --hard 2>/dev/null || true

echo "[setup] Activating Oefflinger Checkout theme..."
$WP theme activate oefflinger-checkout 2>/dev/null || true

echo "[setup] WooCommerce setup complete."
