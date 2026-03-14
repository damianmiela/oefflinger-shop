import type { Product } from "@/types";

interface DeliveryEstimateProps {
  deliveryEstimate: Product["delivery_estimate"];
}

export function DeliveryEstimate({ deliveryEstimate }: DeliveryEstimateProps) {
  if (!deliveryEstimate?.message) return null;

  return (
    <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-800">
      <span className="mr-2 inline-block" aria-hidden>
        <svg
          className="h-4 w-4 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </span>
      {deliveryEstimate.message}
    </p>
  );
}
