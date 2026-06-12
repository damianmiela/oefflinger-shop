import { redirect } from "next/navigation";

/** Legacy iframe checkout route – permanently forwarded to the native checkout. */
export default async function CheckoutRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sp = new URLSearchParams();
  const coupon = params.coupon;
  if (typeof coupon === "string" && coupon) sp.set("coupon", coupon);
  const qs = sp.toString();
  redirect(qs ? `/kasse?${qs}` : "/kasse");
}
