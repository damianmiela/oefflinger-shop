import type { Product, Cart } from "@/types";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_WC_STORE_API!;
  }
  return process.env.WC_INTERNAL_STORE_URL || process.env.NEXT_PUBLIC_WC_STORE_API!;
}

async function storeApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`WooCommerce Store API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  return storeApiFetch<Product[]>("/products");
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await storeApiFetch<Product[]>(`/products?slug=${slug}`);
  return products[0] ?? null;
}

export async function getCart(cartToken?: string): Promise<Cart> {
  const headers: HeadersInit = {};
  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }
  return storeApiFetch<Cart>("/cart", { headers });
}

export async function addToCart(
  productId: number,
  quantity: number = 1,
  cartToken?: string,
): Promise<Cart> {
  const headers: HeadersInit = {};
  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }
  return storeApiFetch<Cart>("/cart/add-item", {
    method: "POST",
    headers,
    body: JSON.stringify({ id: productId, quantity }),
  });
}

export async function removeFromCart(
  itemKey: string,
  cartToken?: string,
): Promise<Cart> {
  const headers: HeadersInit = {};
  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }
  return storeApiFetch<Cart>("/cart/remove-item", {
    method: "POST",
    headers,
    body: JSON.stringify({ key: itemKey }),
  });
}

export async function updateCartItem(
  itemKey: string,
  quantity: number,
  cartToken?: string,
): Promise<Cart> {
  const headers: HeadersInit = {};
  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }
  return storeApiFetch<Cart>("/cart/update-item", {
    method: "POST",
    headers,
    body: JSON.stringify({ key: itemKey, quantity }),
  });
}
