export interface ProductImage {
  id: number;
  src: string;
  thumbnail: string;
  name: string;
  alt: string;
}

export interface ProductPrice {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
}

export interface QuantityLimits {
  minimum: number;
  maximum: number;
  multiple_of: number;
  editable: boolean;
}

export interface ProductAttribute {
  id?: number;
  name?: string;
  attribute?: string;
  options?: string[];
  value?: string;
  visible?: boolean;
  variation?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  prices: ProductPrice;
  images: ProductImage[];
  categories: { id: number; name: string; slug: string }[];
  is_in_stock: boolean;
  is_on_backorder?: boolean;
  is_purchasable: boolean;
  permalink: string;
  quantity_limits?: QuantityLimits;
  low_stock_remaining?: number | null;
  /** Stock quantity when manage_stock is enabled (Store API may return this) */
  stock_quantity?: number | null;
  /** Product attributes (e.g. size, color) – shown when present */
  attributes?: ProductAttribute[];
  /** Aggregate review data (WooCommerce Store API) */
  average_rating?: string;
  review_count?: number;
  /** Delivery estimate from mu-plugin (order by X for delivery on Y) */
  delivery_estimate?: {
    orderBy: string;
    orderByHoursLeft: number;
    deliveryDate: string;
    deliveryDayName: string;
    message: string;
    /** ISO timestamp of cutoff for live countdown (when before cutoff) */
    cutoffIso?: string;
  };
}

export interface CartItemData {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  sku: string;
  permalink?: string;
  images: ProductImage[];
  prices: ProductPrice;
  quantity_limits?: QuantityLimits;
  totals: {
    line_subtotal: string;
    line_total: string;
    /** Tax on the line total (minor units) – add to line_total for gross display */
    line_total_tax?: string;
    currency_code: string;
    currency_symbol: string;
  };
}

export interface ShippingRate {
  rate_id: string;
  name: string;
  description?: string;
  delivery_time?: string;
  price: string;
  taxes?: string;
  selected: boolean;
  currency_code: string;
}

export interface ShippingPackage {
  package_id: number | string;
  name: string;
  shipping_rates: ShippingRate[];
}

export interface CartCoupon {
  code: string;
  totals?: { total_discount: string; total_discount_tax?: string; currency_code: string };
}

export interface Cart {
  items: CartItemData[];
  items_count: number;
  needs_shipping?: boolean;
  shipping_rates?: ShippingPackage[];
  coupons?: CartCoupon[];
  /** Enabled payment gateway ids (provided by newer Store API versions) */
  payment_methods?: string[];
  totals: {
    total_items: string;
    /** Tax on items (minor units) */
    total_items_tax?: string;
    total_shipping?: string;
    total_shipping_tax?: string;
    total_discount?: string;
    /** Total tax (minor units) */
    total_tax?: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
  };
}

export interface CheckoutAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface CheckoutResult {
  order_id: number;
  status: string;
  order_key?: string;
  payment_result?: {
    payment_status: "success" | "pending" | "failure" | "error" | string;
    redirect_url?: string;
    payment_details?: { key: string; value: string }[];
  };
}

export interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
  excerpt: { rendered: string };
}

/** A single product review from the WooCommerce Store API (/products/reviews). */
export interface ProductReview {
  id: number;
  date_created: string;
  formatted_date_created: string;
  rating: number;
  reviewer: string;
  /** Sanitized HTML review content */
  review: string;
  verified: boolean;
}
