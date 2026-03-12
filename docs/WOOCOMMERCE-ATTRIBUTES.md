# Product Attributes (Größe, Konzentration, etc.)

Product attributes configured in WooCommerce → Product data → Attributes (e.g. Größe, Konzentration) are shown on the product page via the **Product Attributes for Store API** plugin.

## How it works

The WordPress plugin `product-attributes-api.php` injects attributes into the Store API product response. No REST API credentials are needed.

## Setup

1. **Rebuild the WordPress container** (to load the plugin):
   ```bash
   docker compose build wordpress
   docker compose up -d
   ```

2. For **new installations**, the setup script copies the plugin automatically.

3. For **existing installations**, ensure `wordpress/api/product-attributes-api.php` is copied to `wp-content/mu-plugins/` and restart the container.

## Fallback: REST API

If the plugin is not available, the frontend can fetch attributes from the WooCommerce REST API. Add to `.env`:

```
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx
```

Create keys in **WooCommerce → Settings → Advanced → REST API** with Read permission.

## Debugging

Visit `http://localhost:4000/api/debug-woo-attributes?slug=YOUR-PRODUCT-SLUG` to inspect the API response.
