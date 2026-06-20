import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { PaymentMethodLogos } from "@/components/PaymentMethodLogos";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, robotsMetadata, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

const SITE_NAME = "Öfflinger";
const DEFAULT_TITLE = "Öfflinger – Kolloidale Metalle aus eigener Produktion";
const DEFAULT_DESCRIPTION =
  "Kolloidales Eisen, Gold, Silber, Zink und weitere Metalle aus eigener Produktion in Oberöfflingen, Rheinland-Pfalz.";

/** schema.org LocalBusiness (P2-14f) – rendered once, sitewide. */
const BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  logo: absoluteUrl("/logo/logo-transparent.png"),
  email: "info@example.com",
  telephone: "+49 1234 567890",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Musterstraße 1",
    postalCode: "12345",
    addressLocality: "Oberöfflingen",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.0000000,
    longitude: 6.0000000,
  },
  areaServed: "DE",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Öfflinger",
  },
  description: DEFAULT_DESCRIPTION,
  robots: robotsMetadata,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "de_DE",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const FOOTER_LINK_CLASS = "text-sm text-white/80 transition hover:text-white";

const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Alle Produkte" },
      { href: "/produkte", label: "Unsere Metalle" },
      { href: "/konto", label: "Mein Konto" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/kontakt", label: "Kontakt" },
      { href: "/faq", label: "FAQ" },
      { href: "/versand", label: "Versand & Zahlung" },
      { href: "/widerruf", label: "Widerrufsrecht" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/agb", label: "AGB" },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-surface text-gray-900 antialiased`}>
        {/* Mark JS as available before paint so scroll-reveal (P2-16e) only hides
            content when it can actually be animated back in. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <a
          href="#main"
          className="focus:bg-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-medium focus:text-white focus:shadow-lg"
        >
          Zum Inhalt springen
        </a>
        <JsonLd data={BUSINESS_LD} />
        <AuthProvider>
          <CartProvider>
            <Header />
            <main id="main" tabIndex={-1} className="min-h-screen scroll-mt-24 focus:outline-none">
              {children}
            </main>
            <footer className="bg-primary-dark">
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mb-12 grid gap-6 border-b border-white/10 pb-12 lg:grid-cols-2 lg:items-center">
                  <div>
                    <p className="text-sm font-semibold tracking-wider text-white uppercase">
                      Newsletter
                    </p>
                    <p className="mt-2 text-sm text-white/80">
                      5% auf Ihre erste Bestellung – plus Neuigkeiten zu unseren kolloidalen
                      Metallen aus der Eifel.
                    </p>
                  </div>
                  <NewsletterSignup variant="footer" />
                </div>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  {FOOTER_COLUMNS.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                      <p className="text-sm font-semibold tracking-wider text-white uppercase">
                        {column.title}
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className={FOOTER_LINK_CLASS}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ))}

                  <div>
                    <p className="text-sm font-semibold tracking-wider text-white uppercase">
                      Kontakt
                    </p>
                    <address className="mt-4 space-y-2.5 text-sm text-white/80 not-italic">
                      <p>
                        Öfflinger
                        <br />
                        Musterstraße 1
                        <br />
                        12345 Oberöfflingen
                      </p>
                      <p>
                        <a href="mailto:info@example.com" className={FOOTER_LINK_CLASS}>
                          info@example.com
                        </a>
                        <br />
                        <a href="tel:+491234567890" className={FOOTER_LINK_CLASS}>
                          +49 1234 567890
                        </a>
                      </p>
                    </address>
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-white/70 uppercase">
                      Sichere Bezahlung
                    </p>
                    <PaymentMethodLogos className="mt-3" />
                  </div>
                  <p className="text-sm text-white/80">
                    Versand mit DHL – Lieferung innerhalb Deutschlands
                  </p>
                </div>

                <p className="mt-10 text-sm text-white/70">
                  &copy; {new Date().getFullYear()} Öfflinger · Kolloidale Metalle aus eigener
                  Produktion
                </p>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
