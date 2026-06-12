interface HealthDisclaimerProps {
  className?: string;
}

/** Legal/health disclaimer shown at the bottom of product-related pages. */
export function HealthDisclaimer({ className = "" }: HealthDisclaimerProps) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center text-sm text-amber-900 sm:text-left ${className}`}
    >
      <p className="font-medium">Hinweis</p>
      <p className="mt-1">
        Die hier präsentierten Informationen dienen ausschließlich zu Bildungszwecken und
        allgemeinen Informationen. Sie ersetzen keine professionelle medizinische Beratung, Diagnose
        oder Behandlung. Vor der Einnahme von Nahrungsergänzungsmitteln oder Änderungen Ihrer
        Gesundheitsroutine konsultieren Sie bitte einen qualifizierten Arzt oder
        Gesundheitsexperten.
      </p>
    </div>
  );
}
