import Link from "next/link";

export const metadata = {
  title: "Seite nicht gefunden – Öfflinger",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-primary text-sm font-medium tracking-widest uppercase">Fehler 404</p>
      <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Seite nicht gefunden</h1>
      <p className="mt-4 max-w-md text-lg text-gray-600">
        Die gesuchte Seite existiert nicht oder wurde verschoben. Kein Grund zur Sorge – unsere
        Kolloide sind alle noch da.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition"
        >
          Zur Startseite
        </Link>
        <Link
          href="/shop"
          className="border-primary text-primary hover:bg-primary/5 rounded-lg border bg-white px-6 py-3 font-semibold transition"
        >
          Zum Shop
        </Link>
      </div>
    </div>
  );
}
