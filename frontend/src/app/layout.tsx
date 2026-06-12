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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-surface text-gray-900 antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <footer className="bg-primary-dark border-t border-gray-200">
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-white/80">
                      &copy; {new Date().getFullYear()} Öfflinger
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      Musterstraße 1, 12345 Oberöfflingen, Deutschland
                    </p>
                  </div>
                  <nav className="flex flex-wrap items-center justify-center gap-6">
                    <Link
                      href="/impressum"
                      className="text-sm font-medium text-white/80 transition hover:text-white"
                    >
                      Impressum
                    </Link>
                    <Link
                      href="/datenschutz"
                      className="text-sm font-medium text-white/80 transition hover:text-white"
                    >
                      Datenschutz
                    </Link>
                    <Link
                      href="/agb"
                      className="text-sm font-medium text-white/80 transition hover:text-white"
                    >
                      AGB
                    </Link>
                  </nav>
                </div>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
