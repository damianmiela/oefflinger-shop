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
}

export interface CartItemData {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  sku: string;
  images: ProductImage[];
  prices: ProductPrice;
  totals: {
    line_subtotal: string;
    line_total: string;
    currency_code: string;
    currency_symbol: string;
  };
}

export interface Cart {
  items: CartItemData[];
  items_count: number;
  totals: {
    total_items: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
  };
}

export interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
  excerpt: { rendered: string };
}
