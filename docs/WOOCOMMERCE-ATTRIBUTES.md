# Product Attributes (Größe, Konzentration, etc.)

Product attributes (e.g. Größe, Konzentration) configured in WooCommerce → Product data → Attributes are shown on the product page **only when the WooCommerce REST API is configured**.

The Store API (`wc/store/v1`) does not include product attributes in its response. To display them, add REST API credentials:

## Setup

1. In WordPress: **WooCommerce → Settings → Advanced → REST API**
2. Click **Add key**
3. Set description (e.g. "Frontend attributes")
4. Choose **Read** permissions
5. Copy the **Consumer key** and **Consumer secret**

## Environment variables

Add to your `.env` file in the project root:

```
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The frontend Docker service loads `.env` automatically.

## Restart

Restart the frontend after adding the variables. Product attributes will then appear under the short description on product pages.
