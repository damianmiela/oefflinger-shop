/**
 * Tailwind background + text classes for a WooCommerce order-status pill (P2-19c).
 * The caller supplies shape/padding; this only colours by status.
 */
export function orderStatusClasses(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
    case "on-hold":
      return "bg-amber-100 text-amber-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-surface-alt text-gray-700";
  }
}
