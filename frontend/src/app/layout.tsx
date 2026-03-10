import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Öfflinger – Kolloidales Wasser",
  description:
    "Hochwertige Kolloide aus eigener Produktion für Ihre Gesundheit und Ihr Wohlbefinden.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-surface text-gray-900 antialiased`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            <AnimateOnScroll variant="fade-up">
              {children}
            </AnimateOnScroll>
          </main>
          <footer className="border-t border-gray-200 bg-primary-dark">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                <p className="text-sm text-white/80">
                  &copy; {new Date().getFullYear()} Öfflinger · Rheinland-Pfalz, Deutschland
                </p>
                <Link
                  href="/shop"
                  className="text-sm font-medium text-white transition hover:text-white/90"
                >
                  Zum Shop
                </Link>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
