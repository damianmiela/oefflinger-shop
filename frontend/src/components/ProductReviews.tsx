"use client";

import { useState } from "react";
import { StarRating } from "@/components/StarRating";
import { Turnstile, turnstileEnabled } from "@/components/Turnstile";
import { getProductReviews, submitReview } from "@/lib/woo/reviews";
import type { ProductReview } from "@/types";

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.79c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

interface ProductReviewsProps {
  productId: number;
  initialReviews: ProductReview[];
  initialTotal: number;
  average: number;
  count: number;
}

export function ProductReviews({
  productId,
  initialReviews,
  initialTotal,
  average,
  count,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await getProductReviews(productId, next, 10);
      setReviews((prev) => [...prev, ...data.reviews]);
      setTotal(data.total);
      setPage(next);
    } catch {
      // leave the list as-is; the button stays for a retry
    } finally {
      setLoadingMore(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Bitte wählen Sie eine Sternebewertung.");
      return;
    }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const message = await submitReview({
        productId,
        rating,
        reviewer: String(form.get("reviewer") || ""),
        review: String(form.get("review") || ""),
        turnstileToken: turnstileToken ?? undefined,
        website: String(form.get("website") || ""),
      });
      setSent(message);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Ihre Bewertung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Kundenbewertungen</h2>

      {count > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <StarRating rating={average} size="lg" showCount={false} />
          <span className="text-gray-700">
            <span className="font-semibold">{average.toFixed(1).replace(".", ",")}</span> von 5
            <span className="text-gray-400"> · </span>
            {count} {count === 1 ? "Bewertung" : "Bewertungen"}
          </span>
        </div>
      ) : (
        <p className="mt-3 text-gray-600">
          Noch keine Bewertungen. Seien Sie der oder die Erste und teilen Sie Ihre Erfahrung.
        </p>
      )}

      {/* Review list */}
      {reviews.length > 0 && (
        <ul className="mt-6">
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-gray-100 py-5 first:border-t-0">
              <div className="flex flex-wrap items-center gap-2">
                <StarRating rating={r.rating} size="sm" showCount={false} />
                {r.verified && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Verifizierter Kauf
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm font-medium text-gray-900">
                {r.reviewer}
                {r.formatted_date_created && (
                  <span className="font-normal text-gray-400"> · {r.formatted_date_created}</span>
                )}
              </p>
              {r.review && r.review.replace(/<[^>]*>/g, "").trim() !== "" && (
                <div
                  className="product-html-content mt-2 leading-relaxed text-gray-600 [&_p]:mb-2 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: r.review }}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {reviews.length < total && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="hover:border-primary hover:text-primary mt-4 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition disabled:opacity-60"
        >
          {loadingMore ? "Wird geladen…" : "Weitere Bewertungen laden"}
        </button>
      )}

      {/* Submit – collapsed behind a button by default */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        {sent ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6" role="status">
            <h3 className="text-lg font-semibold text-green-900">Vielen Dank für Ihre Bewertung!</h3>
            <p className="mt-2 text-green-800">{sent}</p>
          </div>
        ) : showForm ? (
          <form
            onSubmit={onSubmit}
            aria-describedby={error ? "review-error" : undefined}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900">Bewertung schreiben</h3>

            {/* Star picker */}
            <div className="mt-4">
              <span className={labelClass}>Ihre Bewertung</span>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Sternebewertung">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = (hover || rating) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} ${n === 1 ? "Stern" : "Sterne"}`}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onFocus={() => setHover(n)}
                      onBlur={() => setHover(0)}
                      className="focus-visible:outline-primary rounded p-0.5 focus-visible:outline-2"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-7 w-7 transition-colors ${active ? "text-amber-400" : "text-gray-300"}`}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d={STAR_PATH} />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 sm:max-w-sm">
              <label htmlFor="review_name" className={labelClass}>
                Name
              </label>
              <input
                id="review_name"
                name="reviewer"
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="review_text" className={labelClass}>
                Ihre Bewertung <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                id="review_text"
                name="review"
                maxLength={3000}
                rows={5}
                className={inputClass}
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div className="mt-4">
              <Turnstile onToken={setTurnstileToken} />
            </div>

            {error && (
              <p
                id="review-error"
                role="alert"
                className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || (turnstileEnabled && !turnstileToken)}
                className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Wird gesendet…" : "Bewertung absenden"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="hover:text-gray-700 text-sm font-medium text-gray-500"
              >
                Abbrechen
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="border-primary text-primary hover:bg-primary/5 rounded-lg border px-5 py-2.5 font-semibold transition"
          >
            Bewertung schreiben
          </button>
        )}
      </div>
    </div>
  );
}
