import type { Product, Cart, ProductAttribute } from "@/types";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_WC_STORE_API!;
  }
  return process.env.WC_INTERNAL_STORE_URL || process.env.NEXT_PUBLIC_WC_STORE_API!;
}

/** WooCommerce REST API base (for attributes) – derive from Store API or use WC_REST_API_URL */
function getRestApiBases(): string[] {
  const explicit = process.env.WC_REST_API_URL;
  if (explicit) return [explicit];
  const bases: string[] = [];
  // Prefer public URL when running locally (wordpress host only works inside Docker)
  if (process.env.NEXT_PUBLIC_WC_STORE_API) {
    bases.push(process.env.NEXT_PUBLIC_WC_STORE_API.replace(/\/wc\/store\/v1\/?$/, "/wc/v3"));
  }
  if (process.env.WC_INTERNAL_STORE_URL && !bases.includes(process.env.WC_INTERNAL_STORE_URL.replace(/\/wc\/store\/v1\/?$/, "/wc/v3"))) {
    bases.push(process.env.WC_INTERNAL_STORE_URL.replace(/\/wc\/store\/v1\/?$/, "/wc/v3"));
  }
  return bases;
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
    let message = `${res.status} ${res.statusText}`;
    try {
      const errBody = (await res.json()) as { message?: string; code?: string };
      if (errBody?.message) message = errBody.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(`WooCommerce Store API error: ${message}`);
  }

  const data = (await res.json()) as T;
  const newToken = res.headers.get("Cart-Token") ?? undefined;
  return { data, token: newToken };
}

export async function getProducts(): Promise<Product[]> {
  return storeApiFetch<Product[]>("/products?per_page=100");
}

/** Fetch product attributes from WooCommerce REST API – requires consumer key/secret */
async function fetchProductAttributesFromRestApi(
  slug: string,
  productId: number
): Promise<ProductAttribute[] | null> {
  const bases = getRestApiBases();
  if (!bases.length) return null;

  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret) return null;

  const authParams = `consumer_key=${encodeURIComponent(key)}&consumer_secret=${encodeURIComponent(secret)}`;

  const tryFetch = async (base: string, version: "v3" | "v2") => {
    const apiBase = base.replace(/\/wc\/v\d\/?$/, `/wc/${version}`);
    // Try single product by ID first (may have different permissions than list)
    const urlById = `${apiBase}/products/${productId}?${authParams}`;
    const resById = await fetch(urlById, { headers: { "Content-Type": "application/json" } });
    if (resById.ok) {
      const product = (await resById.json()) as {
        attributes?: Array<{
          id?: number;
          name?: string;
          options?: string[];
          visible?: boolean;
          variation?: boolean;
        }>;
      };
      if (product?.attributes?.length) {
        return product.attributes.map((a) => ({
          id: a.id,
          name: a.name,
          options: a.options,
          visible: a.visible,
          variation: a.variation,
        }));
      }
    }
    // Fallback: list by slug
    const urlList = `${apiBase}/products?slug=${encodeURIComponent(slug)}&${authParams}`;
    const res = await fetch(urlList, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown[];
    const p = data[0] as {
      attributes?: Array<{
        id?: number;
        name?: string;
        options?: string[];
        visible?: boolean;
        variation?: boolean;
      }>;
    } | undefined;
    if (!p?.attributes?.length) return null;
    return p.attributes.map((a) => ({
      id: a.id,
      name: a.name,
      options: a.options,
      visible: a.visible,
      variation: a.variation,
    }));
  };

  for (const base of bases) {
    try {
      const attrs = await tryFetch(base, "v3");
      if (attrs) return attrs;
      const attrsV2 = await tryFetch(base, "v2");
      if (attrsV2) return attrsV2;
    } catch {
      continue;
    }
  }
  return null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await storeApiFetch<Product[]>(`/products?slug=${slug}`);
  const product = products[0] ?? null;
  if (!product) return null;

  // Attributes: Store API may include them; otherwise try REST API if configured
  const storeAttrs = (product as unknown as Record<string, unknown>).attributes as ProductAttribute[] | undefined;
  if (storeAttrs?.length) {
    return { ...product, attributes: storeAttrs };
  }
  const restAttributes = await fetchProductAttributesFromRestApi(slug, product.id);
  if (restAttributes?.length) {
    return { ...product, attributes: restAttributes };
  }
  return product;
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
