FROM wordpress:latest

# Increase max upload size to 5MB
COPY php-upload-limit.ini /usr/local/etc/php/conf.d/99-upload-limit.ini

RUN mkdir -p /usr/src/wordpress/wp-content/mu-plugins /usr/src/wordpress/wp-content/themes
COPY api/cors-api.php api/stock-quantity-api.php api/product-attributes-api.php api/delivery-estimate-api.php api/checkout-styles.php api/checkout-embed.php api/auth-api.php /usr/src/wordpress/wp-content/mu-plugins/
COPY theme/oefflinger-checkout /usr/src/wordpress/wp-content/themes/oefflinger-checkout

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

COPY setup-woocommerce.sh /usr/local/bin/setup-woocommerce.sh
COPY custom-entrypoint.sh /usr/local/bin/custom-entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/setup-woocommerce.sh \
    && sed -i 's/\r$//' /usr/local/bin/custom-entrypoint.sh \
    && chmod +x /usr/local/bin/setup-woocommerce.sh \
    && chmod +x /usr/local/bin/custom-entrypoint.sh

ENTRYPOINT ["custom-entrypoint.sh"]
CMD ["apache2-foreground"]
