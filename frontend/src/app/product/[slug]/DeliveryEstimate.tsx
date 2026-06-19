"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";

interface DeliveryEstimateProps {
  deliveryEstimate: Product["delivery_estimate"];
}

function formatCountdown(secondsLeft: number): string {
  if (secondsLeft <= 0) return "00:00:00";
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  return [h, m, s].map((n) => n.toString().padStart(2, "0")).join(":");
}

export function DeliveryEstimate({ deliveryEstimate }: DeliveryEstimateProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!deliveryEstimate?.cutoffIso) {
      setSecondsLeft(null);
      return;
    }
    const cutoff = new Date(deliveryEstimate.cutoffIso).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.floor((cutoff - now) / 1000);
      setSecondsLeft(diff > 0 ? diff : 0);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deliveryEstimate?.cutoffIso]);

  if (!deliveryEstimate?.message) return null;

  const showCountdown = deliveryEstimate.cutoffIso && secondsLeft !== null && secondsLeft > 0;
  // Announce per minute, not per second (P2-16d): screen readers should not be
  // interrupted every second by the live countdown.
  const minutesLeft = secondsLeft != null ? Math.ceil(secondsLeft / 60) : 0;
  const deliveryDateLabel = new Date(
    deliveryEstimate.deliveryDate + "T12:00:00",
  ).toLocaleDateString("de-DE", { day: "numeric", month: "long" });

  return (
    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-800">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0" aria-hidden>
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
        <div className="min-w-0 flex-1">
          {showCountdown ? (
            <>
              {/* Visual countdown updates every second but is hidden from screen readers… */}
              <div className="space-y-1" aria-hidden="true">
                <p>
                  Bestellen Sie in den nächsten{" "}
                  <span className="inline-block min-w-[4.5rem] font-mono font-semibold tabular-nums text-emerald-700">
                    {formatCountdown(secondsLeft!)}
                  </span>{" "}
                  für Lieferung am {deliveryEstimate.deliveryDayName}, {deliveryDateLabel}
                </p>
                <p className="text-xs text-emerald-600/90">
                  Noch bis{" "}
                  {deliveryEstimate.cutoffIso
                    ? new Date(deliveryEstimate.cutoffIso).toLocaleDateString("de-DE", {
                        weekday: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : deliveryEstimate.orderBy}{" "}
                  bestellen
                </p>
              </div>
              {/* …and this polite region only changes once per minute, so it's announced per minute. */}
              <p className="sr-only" aria-live="polite">
                {minutesLeft > 0
                  ? `Noch ${minutesLeft} ${minutesLeft === 1 ? "Minute" : "Minuten"}, um für Lieferung am ${deliveryEstimate.deliveryDayName}, ${deliveryDateLabel} zu bestellen.`
                  : ""}
              </p>
            </>
          ) : (
            <p>{deliveryEstimate.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
