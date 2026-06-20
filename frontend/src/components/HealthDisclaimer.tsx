interface HealthDisclaimerProps {
  className?: string;
}

/** Neutral product note (no health claims) at the bottom of product-related pages. Single source of truth — edit the Hinweis text here. */
export function HealthDisclaimer({ className = "" }: HealthDisclaimerProps) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center text-sm text-amber-900 sm:text-left ${className}`}
    >
      <p className="font-medium">Hinweis</p>
      <p className="mt-1">
        Unsere kolloidalen Metalle sind hochreine Erzeugnisse aus eigener Herstellung. Die
        Produktangaben beschreiben ausschließlich Zusammensetzung, Reinheit, Konzentration (ppm)
        und Herstellung. Es handelt sich nicht um ein Arzneimittel und nicht um ein
        Nahrungsergänzungsmittel; zu gesundheitlichen Wirkungen treffen wir keine Aussagen.
      </p>
    </div>
  );
}
