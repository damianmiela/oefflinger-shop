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

/** Cart endpoints return Cart-Token in response headers - use cartApiFetch for those */
async function cartApiFetch<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<{ data: T; token?: string }> {
  const { token, ...fetchOptions } = options;
  const base = getBaseUrl();
  const url = `${base}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { "Cart-Token": token }),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    throw new Error(`WooCommerce Store API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  const newToken = res.headers.get("Cart-Token") ?? undefined;
  return { data, token: newToken };
}

export async function getProducts(): Promise<Product[]> {
  return storeApiFetch<Product[]>("/products");
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await storeApiFetch<Product[]>(`/products?slug=${slug}`);
  return products[0] ?? null;
}

export async function getCart(cartToken?: string): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart", { token: cartToken });
}

export async function addToCart(
  productId: number,
  quantity: number = 1,
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/add-item", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify({ id: productId, quantity }),
  });
}

export async function removeFromCart(
  itemKey: string,
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/remove-item", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify({ key: itemKey }),
  });
}

export async function updateCartItem(
  itemKey: string,
  quantity: number,
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/update-item", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify({ key: itemKey, quantity }),
  });
}
