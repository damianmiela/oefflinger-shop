/**
 * Colloidal metals data – update descriptions and details here.
 * Used by /produkte (Unsere Kolloide) and /produkte/[id].
 * Neutral, health-claim-free copy (P0-3). NOT legally vetted (D6).
 */

export interface ColloidalMetal {
  id: string;
  name: string;
  /** Gradient from-to for metallic effect. Accent color (dots, pills) is derived from gradientTo. */
  gradientFrom: string;
  gradientTo: string;
  /** Short, factual tagline */
  tagline: string;
  /** Short description (shown in carousel + used as SEO meta description) */
  description: string;
  /** Long description (shown on metal detail page) */
  longDescription?: string;
  /** Link to product in shop */
  productLink?: string;
}

export const COLLOIDAL_METALS: ColloidalMetal[] = [
  {
    id: "chrom",
    name: "Chrom",
    gradientFrom: "#b8c6db",
    gradientTo: "#5f7c9a",
    tagline: "Übergangsmetall – bekannt aus Edelstahl",
    description:
      "Kolloidales Chrom von Öfflinger: hochreines Chrom (99,9 %) in destilliertem Wasser mit einer Konzentration von 25 ppm. Chrom ist ein hartes, silbrig glänzendes Übergangsmetall, das vor allem aus der Verchromung und aus rostfreiem Edelstahl bekannt ist.",
    longDescription: `Chrom ist ein silbrig glänzendes, sehr hartes Übergangsmetall. Im Alltag begegnet es uns vor allem als glänzende Verchromung von Oberflächen und als Bestandteil von rostfreiem Edelstahl.

Als Kolloid liegen feinste Chrompartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 25 ppm entsprechen rund 25 Milligramm Chrom pro Liter.

Wir stellen unser kolloidales Chrom in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-chrom",
  },
  {
    id: "eisen",
    name: "Eisen",
    gradientFrom: "#8f8f8f",
    gradientTo: "#3f3f3f",
    tagline: "Das Basismetall des Stahls",
    description:
      "Kolloidales Eisen von Öfflinger: hochreines Eisen (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Eisen ist eines der am häufigsten genutzten Gebrauchsmetalle der Welt und die Grundlage von Stahl.",
    longDescription: `Eisen ist eines der am häufigsten genutzten Gebrauchsmetalle der Welt und die Grundlage von Stahl. Nach Masse ist es sogar das häufigste Element der Erde.

Als Kolloid liegen feinste Eisenpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Eisen pro Liter.

Wir stellen unser kolloidales Eisen in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-eisen",
  },
  {
    id: "gold",
    name: "Gold",
    gradientFrom: "#f7d774",
    gradientTo: "#c59b1d",
    tagline: "Edelmetall mit langer Tradition",
    description:
      "Kolloidales Gold von Öfflinger: hochreines Gold (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Gold ist seit der Antike das bekannteste Edelmetall – geschätzt für Beständigkeit, Glanz und seine Verwendung als Wertanlage und Schmuck.",
    longDescription: `Gold ist seit der Antike das wohl bekannteste Edelmetall – geschätzt für seine Beständigkeit, seinen Glanz und seine Verwendung als Wertanlage und Schmuck. Chemisch ist Gold ausgesprochen reaktionsträge.

Als Kolloid sind feinste Goldpartikel gleichmäßig in destilliertem Wasser verteilt. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Gold pro Liter. Die typische Färbung kolloidaler Goldlösungen entsteht durch die Streuung des Lichts an den feinen Partikeln.

Wir stellen unser kolloidales Gold in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-gold",
  },
  {
    id: "kobalt",
    name: "Kobalt",
    gradientFrom: "#5fa8d3",
    gradientTo: "#1f4e79",
    tagline: "Übergangsmetall – bekannt als Blaupigment",
    description:
      "Kolloidales Kobalt von Öfflinger: hochreines Kobalt (99,9 %) in destilliertem Wasser mit einer Konzentration von 5 ppm. Kobalt ist ein silbrig glänzendes Übergangsmetall, historisch vor allem als tiefblaues Farbpigment in Glas und Keramik bekannt.",
    longDescription: `Kobalt ist ein silbrig glänzendes Übergangsmetall. Historisch ist es vor allem als Farbpigment bekannt – das tiefe „Kobaltblau" in Glas und Keramik.

Als Kolloid liegen feinste Kobaltpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 5 ppm entsprechen rund 5 Milligramm Kobalt pro Liter.

Wir stellen unser kolloidales Kobalt in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-kobalt",
  },
  {
    id: "kupfer",
    name: "Kupfer",
    gradientFrom: "#e09b4c",
    gradientTo: "#9a4d1a",
    tagline: "Rötliches Metall, sehr gut leitfähig",
    description:
      "Kolloidales Kupfer von Öfflinger: hochreines Kupfer (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Kupfer ist ein rötlich glänzendes, sehr gut leitfähiges Metall und zählt zu den ältesten vom Menschen genutzten Metallen.",
    longDescription: `Kupfer ist ein rötlich glänzendes Metall mit sehr guter elektrischer Leitfähigkeit und zählt zu den ältesten vom Menschen genutzten Metallen. Es ist Bestandteil bekannter Legierungen wie Bronze und Messing.

Als Kolloid liegen feinste Kupferpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Kupfer pro Liter.

Wir stellen unser kolloidales Kupfer in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-kupfer",
  },
  {
    id: "magnesium",
    name: "Magnesium",
    gradientFrom: "#e6e6e6",
    gradientTo: "#9b9b9b",
    tagline: "Silbrig-weißes Leichtmetall",
    description:
      "Kolloidales Magnesium von Öfflinger: hochreines Magnesium (99,9 %) in destilliertem Wasser mit einer Konzentration von 100 ppm. Magnesium ist ein silbrig-weißes Leichtmetall, das wegen seiner geringen Dichte vor allem im Leichtbau eingesetzt wird.",
    longDescription: `Magnesium ist ein silbrig-weißes Leichtmetall. Wegen seiner geringen Dichte wird es vor allem im Leichtbau – etwa im Fahrzeug- und Flugzeugbau – sowie in Legierungen eingesetzt.

Als Kolloid liegen feinste Magnesiumpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 100 ppm entsprechen rund 100 Milligramm Magnesium pro Liter.

Wir stellen unser kolloidales Magnesium in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-magnesium",
  },
  {
    id: "molybdan",
    name: "Molybdän",
    gradientFrom: "#9aa0a6",
    gradientTo: "#3c4043",
    tagline: "Hochschmelzendes Übergangsmetall",
    description:
      "Kolloidales Molybdän von Öfflinger: hochreines Molybdän (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Molybdän ist ein hochschmelzendes, silbrig-graues Übergangsmetall, das vor allem zur Veredelung von Stählen verwendet wird.",
    longDescription: `Molybdän ist ein hochschmelzendes, silbrig-graues Übergangsmetall. Es wird vor allem zur Härtung und Veredelung von Stählen sowie in Hochtemperaturanwendungen verwendet.

Als Kolloid liegen feinste Molybdänpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Molybdän pro Liter.

Wir stellen unser kolloidales Molybdän in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-molybdan",
  },
  {
    id: "nickel",
    name: "Nickel",
    gradientFrom: "#cfd8dc",
    gradientTo: "#6b7c86",
    tagline: "Silbrig glänzendes Übergangsmetall",
    description:
      "Kolloidales Nickel von Öfflinger: hochreines Nickel (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Nickel ist ein silbrig glänzendes, gut polierbares Übergangsmetall, bekannt aus Münzlegierungen und rostfreiem Edelstahl.",
    longDescription: `Nickel ist ein silbrig glänzendes, gut polierbares Übergangsmetall. Bekannt ist es aus Münzlegierungen und aus rostfreiem Edelstahl.

Als Kolloid liegen feinste Nickelpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Nickel pro Liter.

Wir stellen unser kolloidales Nickel in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-nickel",
  },
  {
    id: "silber",
    name: "Silber",
    gradientFrom: "#f2f2f2",
    gradientTo: "#b3b3b3",
    tagline: "Edelmetall mit höchster Leitfähigkeit",
    description:
      "Kolloidales Silber von Öfflinger: hochreines Silber (99,9 %) in destilliertem Wasser mit einer Konzentration von 25 ppm. Silber ist ein Edelmetall mit der höchsten elektrischen und thermischen Leitfähigkeit aller Metalle und wird seit Jahrtausenden genutzt.",
    longDescription: `Silber ist ein Edelmetall, das der Mensch seit Jahrtausenden nutzt – als Werkstoff, Zahlungsmittel und für Schmuck. Unter allen Metallen besitzt Silber die höchste elektrische und thermische Leitfähigkeit.

Als Kolloid liegen feinste Silberpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 25 ppm entsprechen rund 25 Milligramm Silber pro Liter.

Wir stellen unser kolloidales Silber in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-silber",
  },
  {
    id: "silizium",
    name: "Silizium",
    gradientFrom: "#9fb3c8",
    gradientTo: "#4c647d",
    tagline: "Halbmetall – Grundstoff von Glas & Chips",
    description:
      "Kolloidales Silizium von Öfflinger: hochreines Silizium (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Silizium ist ein Halbmetall und nach Sauerstoff das zweithäufigste Element der Erdkruste – Grundlage von Glas und Halbleitern.",
    longDescription: `Silizium ist ein Halbmetall und nach Sauerstoff das zweithäufigste Element der Erdkruste. Es bildet die Grundlage von Glas und Quarz sowie der modernen Halbleiter- und Elektronikindustrie.

Als Kolloid liegen feinste Siliziumpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Silizium pro Liter.

Wir stellen unser kolloidales Silizium in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-silizium",
  },
  {
    id: "tantal",
    name: "Tantal",
    gradientFrom: "#6b7f8f",
    gradientTo: "#2f3e4b",
    tagline: "Seltenes, korrosionsbeständiges Metall",
    description:
      "Kolloidales Tantal von Öfflinger: hochreines Tantal (99,9 %) in destilliertem Wasser mit einer Konzentration von 5 ppm. Tantal ist ein seltenes, ausgesprochen korrosionsbeständiges Übergangsmetall mit sehr hohem Schmelzpunkt, bekannt aus der Elektronik.",
    longDescription: `Tantal ist ein seltenes, ausgesprochen korrosionsbeständiges Übergangsmetall mit sehr hohem Schmelzpunkt. Eingesetzt wird es vor allem in der Elektronik, etwa in Kondensatoren.

Als Kolloid liegen feinste Tantalpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 5 ppm entsprechen rund 5 Milligramm Tantal pro Liter.

Wir stellen unser kolloidales Tantal in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-tantal",
  },
  {
    id: "vanadium",
    name: "Vanadium",
    gradientFrom: "#8bbf9f",
    gradientTo: "#3d7a63",
    tagline: "Übergangsmetall zur Stahlveredelung",
    description:
      "Kolloidales Vanadium von Öfflinger: hochreines Vanadium (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Vanadium ist ein silbrig-graues Übergangsmetall, das überwiegend zur Veredelung von Stahl verwendet wird.",
    longDescription: `Vanadium ist ein silbrig-graues Übergangsmetall. Es wird überwiegend zur Veredelung von Stahl – etwa für Werkzeug- und Federstähle – verwendet und ist für seine farbenfrohen Verbindungen bekannt.

Als Kolloid liegen feinste Vanadiumpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Vanadium pro Liter.

Wir stellen unser kolloidales Vanadium in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-vanadium",
  },
  {
    id: "zink",
    name: "Zink",
    gradientFrom: "#b0bec5",
    gradientTo: "#546e7a",
    tagline: "Vielseitiges Gebrauchsmetall",
    description:
      "Kolloidales Zink von Öfflinger: hochreines Zink (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Zink ist ein bläulich-weißes Übergangsmetall und eines der wichtigsten Gebrauchsmetalle, bekannt aus Korrosionsschutz und Messing.",
    longDescription: `Zink ist ein bläulich-weißes Übergangsmetall und eines der wichtigsten Gebrauchsmetalle – bekannt aus dem Korrosionsschutz (Verzinken) und aus Legierungen wie Messing.

Als Kolloid liegen feinste Zinkpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Zink pro Liter.

Wir stellen unser kolloidales Zink in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-zink",
  },
  {
    id: "zinn",
    name: "Zinn",
    gradientFrom: "#d1d1d1",
    gradientTo: "#7a7a7a",
    tagline: "Weiches Metall mit langer Geschichte",
    description:
      "Kolloidales Zinn von Öfflinger: hochreines Zinn (99,9 %) in destilliertem Wasser mit einer Konzentration von 10 ppm. Zinn ist ein weiches, silbrig glänzendes Metall mit langer Geschichte – aus der Bronzezeit, von Zinngeschirr und als Lötmetall.",
    longDescription: `Zinn ist ein weiches, silbrig glänzendes Metall mit langer Geschichte – in der Bronzezeit Bestandteil der Bronze, später bekannt aus Zinngeschirr und als Lötmetall.

Als Kolloid liegen feinste Zinnpartikel gleichmäßig in destilliertem Wasser verteilt vor. Die Angabe „ppm" (parts per million) beschreibt die Konzentration: 10 ppm entsprechen rund 10 Milligramm Zinn pro Liter.

Wir stellen unser kolloidales Zinn in eigener Herstellung in der Eifel her und füllen es in lichtgeschützte Glasflaschen (500 ml) ab. Bewahren Sie es kühl, trocken und vor Licht geschützt auf.`,
    productLink: "/shop/kolloidales-zinn",
  },
];

/** Accent color for dots, pills, etc. Derived from gradient (single source of truth). */
export function getMetalAccentColor(metal: ColloidalMetal): string {
  return metal.gradientTo;
}

/** Get metal by id, or undefined if not found */
export function getMetalById(id: string): ColloidalMetal | undefined {
  return COLLOIDAL_METALS.find((m) => m.id === id);
}

/** Get the metal whose shop product matches the given product slug (e.g. "kolloidales-silber"). */
export function getMetalByProductSlug(slug: string): ColloidalMetal | undefined {
  return COLLOIDAL_METALS.find((m) => m.productLink === `/shop/${slug}`);
}
