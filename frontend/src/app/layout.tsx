import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Öfflinger – Kolloidale Metalle",
  description:
    "Kolloidales Eisen, Gold, Silber, Zink und weitere Metalle aus eigener Produktion in Oberöfflingen, Rheinland-Pfalz.",
};

const FOOTER_LINK_CLASS = "text-sm text-white/75 transition hover:text-white";

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

const PAYMENT_METHODS = ["PayPal", "Klarna", "Visa", "Mastercard", "Überweisung"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-surface text-gray-900 antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <footer className="bg-primary-dark">
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
                    <address className="mt-4 space-y-2.5 text-sm text-white/75 not-italic">
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
                    <p className="text-xs font-medium tracking-wider text-white/60 uppercase">
                      Sichere Bezahlung
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {PAYMENT_METHODS.map((method) => (
                        <li
                          key={method}
                          className="rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-white/70">
                    Versand mit DHL – Lieferung innerhalb Deutschlands
                  </p>
                </div>

                <p className="mt-10 text-sm text-white/60">
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
