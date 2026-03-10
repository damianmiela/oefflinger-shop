import type { Metadata } from "next";
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
          <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fade-up">
              {children}
            </AnimateOnScroll>
          </main>
          <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Öfflinger. Alle Rechte vorbehalten.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
