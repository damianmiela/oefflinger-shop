#!/bin/bash

echo "[setup] Waiting for WordPress to become ready..."

until wp core is-installed --allow-root --path=/var/www/html 2>/dev/null; do
    sleep 5
done

echo "[setup] WordPress is installed. Checking WooCommerce..."

if ! wp plugin is-installed woocommerce --allow-root --path=/var/www/html 2>/dev/null; then
    echo "[setup] Installing WooCommerce..."
    wp plugin install woocommerce --activate --allow-root --path=/var/www/html
else
    echo "[setup] WooCommerce already installed. Ensuring it is active..."
    wp plugin activate woocommerce --allow-root --path=/var/www/html 2>/dev/null || true
fi

echo "[setup] Setting permalink structure..."
wp rewrite structure '/%postname%/' --hard --allow-root --path=/var/www/html 2>/dev/null || true

echo "[setup] Enabling pretty permalinks for REST API..."
wp option update permalink_structure '/%postname%/' --allow-root --path=/var/www/html 2>/dev/null || true

echo "[setup] WooCommerce setup complete."
