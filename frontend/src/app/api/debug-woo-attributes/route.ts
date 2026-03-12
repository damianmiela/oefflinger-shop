import { NextRequest, NextResponse } from "next/server";

/**
 * Debug endpoint: GET /api/debug-woo-attributes?slug=product-slug
 * Returns REST API response to diagnose attribute fetching.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  // Prefer public URL first (works locally); wordpress host only works inside Docker
  const bases: string[] = [];
  if (process.env.NEXT_PUBLIC_WC_STORE_API) {
    bases.push(process.env.NEXT_PUBLIC_WC_STORE_API.replace(/\/wc\/store\/v1\/?$/, "/wc/v3"));
  }
  if (process.env.WC_INTERNAL_STORE_URL) {
    const internal = process.env.WC_INTERNAL_STORE_URL.replace(/\/wc\/store\/v1\/?$/, "/wc/v3");
    if (!bases.includes(internal)) bases.push(internal);
  }
  const base = bases[0] ?? null;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  const debug: Record<string, unknown> = {
    slug,
    hasBase: !!base,
    base: base ?? "(null)",
    basesTried: bases,
    hasKey: !!key,
    hasSecret: !!secret,
  };

  if (!base || !key || !secret) {
    return NextResponse.json({
      debug,
      error: "Missing REST API config (base, key, or secret)",
    });
  }

  const auth = `consumer_key=${encodeURIComponent(key)}&consumer_secret=${encodeURIComponent(secret)}`;

  try {
    // Get product ID from Store API first (use public URL for local dev)
    const storeBase = process.env.NEXT_PUBLIC_WC_STORE_API || process.env.WC_INTERNAL_STORE_URL;
    const storeUrl = `${storeBase}/products?slug=${encodeURIComponent(slug)}`;
    const storeRes = await fetch(storeUrl);
    const storeData = (await storeRes.json()) as Array<{ id?: number }>;
    const productId = storeData[0]?.id;

    // Try single product by ID (may have different permissions than list)
    const urlById = productId ? `${base}/products/${productId}?${auth}` : null;
    if (urlById) {
      const resById = await fetch(urlById);
      const productData = await resById.json();

      debug.triedById = true;
      debug.productId = productId;
      debug.statusById = resById.status;
      debug.okById = resById.ok;

      if (resById.ok && typeof productData === "object" && !productData.code) {
        const product = productData as Record<string, unknown>;
        debug.attributes = product.attributes;
        debug.attributesLength = Array.isArray(product.attributes)
          ? product.attributes.length
          : 0;
        return NextResponse.json({ debug, data: productData });
      }
      debug.apiErrorById = productData;
    }

    // Fallback: list by slug
    const urlList = `${base}/products?slug=${encodeURIComponent(slug)}&${auth}`;
    const res = await fetch(urlList);
    const data = await res.json();

    debug.status = res.status;
    debug.ok = res.ok;

    if (Array.isArray(data) && data[0]) {
      const product = data[0] as Record<string, unknown>;
      debug.attributes = product.attributes;
      debug.attributesLength = Array.isArray(product.attributes)
        ? product.attributes.length
        : 0;
    } else if (typeof data === "object" && data?.code) {
      debug.apiError = data;
    }

    return NextResponse.json({ debug, data: Array.isArray(data) ? data[0] : data });
  } catch (err) {
    debug.fetchError = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ debug, error: "Fetch failed" });
  }
}
