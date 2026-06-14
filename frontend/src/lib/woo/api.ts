import type { Product, Cart, ProductAttribute, CheckoutAddress, CheckoutResult } from "@/types";

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

/** Error thrown for non-OK Store API responses, carrying status + server message. */
export class StoreApiError extends Error {
  status: number;
  /** Localized message from the API response body (WordPress locale), if any */
  serverMessage?: string;

  constructor(status: number, statusText: string, serverMessage?: string) {
    super(serverMessage || `${status} ${statusText}`);
    this.name = "StoreApiError";
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

async function toStoreApiError(res: Response): Promise<StoreApiError> {
  let serverMessage: string | undefined;
  try {
    const body = (await res.json()) as { message?: string };
    if (body?.message) serverMessage = body.message.replace(/<[^>]*>/g, "");
  } catch {
    // unparseable body – fall back to status text
  }
  return new StoreApiError(res.status, res.statusText, serverMessage);
}

/** Map any API/network failure to a friendly German message for customers. */
export function toUserMessage(err: unknown): string {
  if (err instanceof StoreApiError) {
    if (err.status === 429) {
      return "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
    }
    if (err.status >= 500) {
      return "Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
    }
    // 4xx: the Store API message is meaningful for customers (e.g. quantity limits)
    if (err.serverMessage) return err.serverMessage;
    return "Die Anfrage konnte nicht verarbeitet werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.";
  }
  if (err instanceof TypeError) {
    // fetch() network failure
    return "Keine Verbindung zum Shop. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
  }
  return "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.";
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
    throw await toStoreApiError(res);
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
    throw await toStoreApiError(res);
  }

  const data = (await res.json()) as T;
  const newToken = res.headers.get("Cart-Token") ?? undefined;
  return { data, token: newToken };
}

const PRODUCTS_PER_PAGE = 20;

/**
 * ISR caching for product catalog reads (P1-12b → §4.4).
 * Server-side fetches are cached and revalidated every 5 minutes, and tagged
 * so they can later be purged on demand via revalidateTag(PRODUCT_CACHE_TAG).
 * (Ignored for client-side calls, e.g. the cart page – cache only applies on the server.)
 */
const PRODUCT_REVALIDATE = 300;
const PRODUCT_CACHE_TAG = "products";

export interface ProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
}

export async function getProductsPaginated(
  page: number = 1,
  perPage: number = PRODUCTS_PER_PAGE,
): Promise<ProductsResponse> {
  const base = getBaseUrl();
  const offset = (page - 1) * perPage;
  const url = `${base}/products?per_page=${perPage}&offset=${offset}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: PRODUCT_REVALIDATE, tags: [PRODUCT_CACHE_TAG] },
  });

  if (!res.ok) {
    throw await toStoreApiError(res);
  }

  const products = (await res.json()) as Product[];
  const total = parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);

  return { products, total, totalPages };
}

/** Fetch all products (for main page, etc.) – uses first page only */
export async function getProducts(): Promise<Product[]> {
  const { products } = await getProductsPaginated(1, 100);
  return products;
}

/** Search products by term (used by the header typeahead). */
export async function searchProducts(term: string, perPage: number = 5): Promise<Product[]> {
  return storeApiFetch<Product[]>(
    `/products?search=${encodeURIComponent(term)}&per_page=${perPage}`,
  );
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
  const products = await storeApiFetch<Product[]>(`/products?slug=${slug}`, {
    next: { revalidate: PRODUCT_REVALIDATE, tags: [PRODUCT_CACHE_TAG] },
  });
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

export async function updateCustomer(
  payload: { billing_address?: Partial<CheckoutAddress>; shipping_address?: Partial<CheckoutAddress> },
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/update-customer", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify(payload),
  });
}

export async function selectShippingRate(
  packageId: number | string,
  rateId: string,
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/select-shipping-rate", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify({ package_id: packageId, rate_id: rateId }),
  });
}

export async function applyCoupon(
  code: string,
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/apply-coupon", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify({ code }),
  });
}

export async function removeCoupon(
  code: string,
  cartToken?: string,
): Promise<{ data: Cart; token?: string }> {
  return cartApiFetch<Cart>("/cart/remove-coupon", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify({ code }),
  });
}

/** Place the order (Store API checkout). Payment redirects come back in payment_result. */
export async function placeOrder(
  payload: {
    billing_address: CheckoutAddress;
    shipping_address: CheckoutAddress;
    payment_method: string;
    customer_note?: string;
  },
  cartToken?: string,
): Promise<{ data: CheckoutResult; token?: string }> {
  return cartApiFetch<CheckoutResult>("/checkout", {
    method: "POST",
    token: cartToken,
    body: JSON.stringify(payload),
  });
}
