/**
 * Payment method badges (inline SVG approximations of the acceptance marks).
 * No external assets needed. Before launch these can be swapped for the
 * official acceptance marks from the providers' brand portals if desired.
 */

const BADGE_CLASS = "h-8 w-auto rounded-md border border-black/5 bg-white shadow-sm";

function VisaBadge() {
  return (
    <svg viewBox="0 0 64 40" className={BADGE_CLASS} role="img" aria-label="Visa">
      <rect width="64" height="40" rx="6" fill="#fff" />
      <text
        x="32"
        y="26"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="17"
        letterSpacing="1"
        fill="#1A1F71"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardBadge() {
  return (
    <svg viewBox="0 0 64 40" className={BADGE_CLASS} role="img" aria-label="Mastercard">
      <rect width="64" height="40" rx="6" fill="#fff" />
      <circle cx="27" cy="20" r="11" fill="#EB001B" />
      <circle cx="39" cy="20" r="11" fill="#F79E1B" />
      <path d="M33 10.8 A11 11 0 0 1 33 29.2 A11 11 0 0 1 33 10.8 Z" fill="#FF5F00" />
    </svg>
  );
}

function PayPalBadge() {
  return (
    <svg viewBox="0 0 84 40" className={BADGE_CLASS} role="img" aria-label="PayPal">
      <rect width="84" height="40" rx="6" fill="#fff" />
      <text
        x="42"
        y="26"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="15"
      >
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009CDE">Pal</tspan>
      </text>
    </svg>
  );
}

function KlarnaBadge() {
  return (
    <svg viewBox="0 0 84 40" className={BADGE_CLASS} role="img" aria-label="Klarna">
      <rect width="84" height="40" rx="6" fill="#FFB3C7" />
      <text
        x="42"
        y="25"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="700"
        fontSize="14"
        fill="#17120F"
      >
        Klarna.
      </text>
    </svg>
  );
}

function UeberweisungBadge() {
  return (
    <svg viewBox="0 0 118 40" className={BADGE_CLASS} role="img" aria-label="Überweisung">
      <rect width="118" height="40" rx="6" fill="#fff" />
      {/* Bank icon */}
      <g fill="none" stroke="#0f3d4a" strokeWidth="1.8" strokeLinecap="round">
        <path d="M10 17 L17 11 L24 17 Z" strokeLinejoin="round" />
        <path d="M12 20 V27 M17 20 V27 M22 20 V27" />
        <path d="M9.5 29.5 H24.5" />
      </g>
      <text
        x="69"
        y="25"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="600"
        fontSize="12"
        fill="#0f3d4a"
      >
        Überweisung
      </text>
    </svg>
  );
}

export function PaymentMethodLogos({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      <li>
        <PayPalBadge />
      </li>
      <li>
        <KlarnaBadge />
      </li>
      <li>
        <VisaBadge />
      </li>
      <li>
        <MastercardBadge />
      </li>
      <li>
        <UeberweisungBadge />
      </li>
    </ul>
  );
}
