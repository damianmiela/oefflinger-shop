/**
 * Colloidal metals data – update descriptions and details here.
 * Used by /produkte page.
 */

export interface ColloidalMetal {
  id: string;
  name: string;
  /** Primary hex color for visual representation */
  color: string;
  /** Gradient from-to for metallic effect */
  gradientFrom: string;
  gradientTo: string;
  /** Short tagline */
  tagline: string;
  /** Short description (shown in carousel) */
  description: string;
  /** Long description (shown on metal detail page) */
  longDescription?: string;
  /** Optional: traditional uses (neutral phrasing) */
  uses?: string[];
  /** Link to product in shop – replace when products are added */
  productLink?: string;
}

/** Replace with actual product slug when products are in shop */
const PLACEHOLDER_PRODUCT = "/product/test-product";

export const COLLOIDAL_METALS: ColloidalMetal[] = [
  {
    id: "chrom",
    name: "Chrom",
    color: "#8b9dc3",
    gradientFrom: "#a8b8d4",
    gradientTo: "#6b7fa8",
    tagline: "Spurenelement für den Stoffwechsel",
    description:
      "Kolloidales Chrom ist ein essentielles Spurenelement, das eine wichtige Rolle im Stoffwechsel spielt. Es unterstützt die Regulierung des Blutzuckerspiegels, fördert die Insulinsensitivität und kann dadurch Heißhunger auf Süßes reduzieren. Chrom beteiligt sich außerdem am Stoffwechsel von Kohlenhydraten, Fetten und Proteinen und kann zur Stabilisierung des Cholesterinspiegels beitragen. Darüber hinaus besitzt kolloidales Chrom antioxidative Eigenschaften, unterstützt die Knochengesundheit und kann den Energiehaushalt sowie die körperliche Leistungsfähigkeit positiv beeinflussen.",
    longDescription: `Kolloidales Chrom ist ein Spurenelement, das für zahlreiche Stoffwechselprozesse im Körper von Bedeutung ist. Besonders bekannt ist seine Rolle bei der Unterstützung des Insulinstoffwechsels und der Regulierung des Blutzuckerspiegels. Durch eine verbesserte Insulinsensitivität können Zellen Glukose effizienter aufnehmen, wodurch starke Schwankungen des Blutzuckerspiegels reduziert werden können. Dies kann dazu beitragen, Heißhunger auf Süßigkeiten zu verringern und den Energiehaushalt stabil zu halten.

Chrom ist außerdem am Stoffwechsel von Kohlenhydraten, Fetten und Proteinen beteiligt. Dadurch unterstützt es den Energiestoffwechsel und kann die Verwertung von Nährstoffen im Körper verbessern.

Ein weiterer wichtiger Bereich ist die Regulation des Cholesterinspiegels. Chrom beeinflusst Enzyme des Fettstoffwechsels und kann dazu beitragen, das Gleichgewicht zwischen HDL- („gutem“) und LDL-Cholesterin („schlechtem“) zu fördern. Zusätzlich besitzt kolloidales Chrom antioxidative Eigenschaften, die helfen können, freie Radikale zu neutralisieren und oxidativen Stress zu reduzieren.

Auch für die Knochengesundheit spielt Chrom eine Rolle. Es kann die Aktivität des Hormons Osteocalcin unterstützen, welches für die Einlagerung von Calcium in die Knochen verantwortlich ist und somit zur Knochenstärke beitragen kann.

Darüber hinaus kann kolloidales Chrom die körperliche Leistungsfähigkeit unterstützen. Durch eine stabilere Energieproduktion und eine effizientere Nutzung von Nährstoffen können Ausdauer und Belastbarkeit verbessert werden. Ebenso kann es den Transport von Glukose und Aminosäuren in Muskelzellen fördern und dadurch den Muskelaufbau unterstützen.

Chrom kann außerdem einen Einfluss auf die Stimmung und das allgemeine Wohlbefinden haben, da es an der Regulation wichtiger Neurotransmitter wie Serotonin und Dopamin beteiligt sein kann.

Durch die kolloidale Form werden Chrompartikel in einer Form bereitgestellt, die eine mögliche bessere Aufnahme und Verwertung im Körper unterstützen kann.`,
    uses: [
      "Energie & Stoffwechsel",
      "Blutzuckerbalance",
      "Cholesterinspiegel",
      "Knochenstärke",
      "Muskelaufbau",
      "Gewichtsmanagement",
      "Antioxidativer Schutz",
      "Stimmung & Wohlbefinden",
    ],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "eisen",
    name: "Eisen",
    color: "#b87333",
    gradientFrom: "#c98b4a",
    gradientTo: "#8b5a2b",
    tagline: "Zentrales Element für Blut und Energie",
    description:
      "Kolloidales Eisen ist ein essentielles Spurenelement, das eine zentrale Rolle im Sauerstofftransport und im Energiestoffwechsel spielt. Es ist ein wichtiger Bestandteil des Hämoglobins und sorgt dafür, dass Sauerstoff effizient durch den Körper transportiert wird. Dadurch unterstützt Eisen die Energieproduktion in den Zellen, fördert die körperliche Leistungsfähigkeit und kann Müdigkeit reduzieren. Zusätzlich trägt Eisen zur Unterstützung des Immunsystems, der kognitiven Funktionen sowie zur Bildung neuer Zellen bei. Durch die kolloidale Form wird Eisen in einer Form bereitgestellt, die eine mögliche bessere Aufnahme und Verwertung im Körper unterstützen kann.",
    longDescription: `Kolloidales Eisen

Eisen ist ein lebenswichtiges Spurenelement und spielt eine zentrale Rolle in zahlreichen biologischen Prozessen des Körpers. Eine der wichtigsten Funktionen von Eisen ist seine Beteiligung am Sauerstofftransport im Blut. Als Bestandteil des Hämoglobins ermöglicht Eisen den Transport von Sauerstoff zu den Zellen und unterstützt damit die Energieproduktion im Körper.

Eine ausreichende Versorgung mit Eisen kann dazu beitragen, die Energieproduktion in den Mitochondrien zu unterstützen und die körperliche Leistungsfähigkeit zu verbessern. Durch eine bessere Sauerstoffversorgung der Zellen können Ausdauer, Muskelarbeit und allgemeine Belastbarkeit positiv beeinflusst werden.

Eisen ist außerdem entscheidend für die Bildung roter Blutkörperchen. Ein ausreichender Eisenspiegel unterstützt den Körper dabei, den Sauerstofftransport im Blut aufrechtzuerhalten und kann helfen, Symptome eines Eisenmangels zu reduzieren.

Darüber hinaus spielt Eisen eine wichtige Rolle für das Immunsystem. Es ist an der Bildung von Immunzellen beteiligt und unterstützt die Fähigkeit des Körpers, sich gegen Krankheitserreger und Infektionen zu verteidigen.

Auch die kognitive Funktion kann durch Eisen beeinflusst werden. Eine ausreichende Eisenversorgung ist wichtig für die normale Funktion von Gehirn und Nervensystem und kann Konzentration, Gedächtnis und Lernfähigkeit unterstützen.

Zusätzlich kann Eisen zur Gesundheit von Haut, Haaren und Nägeln beitragen, da ein Eisenmangel mit trockener Haut, Haarausfall und brüchigen Nägeln verbunden sein kann.

Kolloidales Eisen stellt dieses wichtige Spurenelement in einer speziellen Form bereit, die eine mögliche bessere Aufnahme und Verwertung im Körper unterstützen kann.`,
    uses: [
      "Energie & Stoffwechsel",
      "Immunsystem",
      "Gehirn & Konzentration",
      "Haut & Haare",
      "Muskelaufbau",
      "Schwangerschaft & Entwicklung",
      "Eisenmangel",
      "Verdauung & Wohlbefinden",
    ],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "gold",
    name: "Gold",
    color: "#d4af37",
    gradientFrom: "#e8c547",
    gradientTo: "#b8962e",
    tagline: "Edelmetall mit langer Tradition",
    description:
      "Kolloidales Gold wird seit Jahrhunderten in verschiedenen Kulturen geschätzt und mit geistigem Wohlbefinden, Harmonie und Weisheit in Verbindung gebracht. Viele Menschen nutzen es, um ihre mentale Leistungsfähigkeit und Lebensqualität zu unterstützen. Kolloidales Gold kann mit positiven Effekten auf Konzentration, Stimmung und geistige Klarheit verbunden sein. Es wird zudem mit einer möglichen Unterstützung des Stoffwechsels, der Hormonbalance sowie der Hautgesundheit in Verbindung gebracht. Durch seine kolloidale Form wird Gold in einer speziellen Struktur bereitgestellt, die eine mögliche Aufnahme und Nutzung im Körper unterstützen kann.",
    longDescription: `Kolloidales Gold

Kolloidales Gold hat eine lange Geschichte und wurde bereits in verschiedenen Kulturen und von historischen Persönlichkeiten untersucht und geschätzt. Es wird häufig mit Eigenschaften wie Harmonie, geistiger Klarheit und Weisheit in Verbindung gebracht.

Viele Menschen interessieren sich heute für kolloidales Gold als Ergänzung zur Unterstützung ihres geistigen Wohlbefindens und ihrer mentalen Leistungsfähigkeit. Es wird angenommen, dass kolloidales Gold auf verschiedene Weise mit dem Gehirn interagieren kann und dadurch Prozesse wie Konzentration, Aufmerksamkeit, Gedächtnis und Lernfähigkeit beeinflusst.

Ein möglicher Wirkmechanismus wird in der Unterstützung der neuronalen Kommunikation im Gehirn gesehen. Dadurch könnte die geistige Leistungsfähigkeit verbessert und die kognitive Aktivität gesteigert werden. Einige Anwender berichten von mehr geistiger Klarheit, höherer Konzentrationsfähigkeit und einer verbesserten Problemlösungskompetenz.

Darüber hinaus wird kolloidales Gold mit einer positiven Wirkung auf die Stimmung und das emotionale Gleichgewicht in Verbindung gebracht. Es könnte dazu beitragen, Stress und innere Unruhe zu reduzieren und das allgemeine Wohlbefinden zu fördern.

Kolloidales Gold wird außerdem mit verjüngenden Eigenschaften für die Haut in Verbindung gebracht. Es kann möglicherweise die Kollagenproduktion unterstützen und so zur Elastizität und Festigkeit der Haut beitragen.

Zusätzlich wird kolloidales Gold mit der Aktivierung von Enzymprozessen im Stoffwechsel in Verbindung gebracht. Enzyme spielen eine wichtige Rolle bei zahlreichen biochemischen Reaktionen im Körper, darunter die Energieproduktion, die Verarbeitung von Nährstoffen sowie Entgiftungsprozesse.

Auch eine mögliche Unterstützung der hormonellen Balance wird diskutiert, da kolloidales Gold die Aktivität hormonproduzierender Drüsen beeinflussen könnte.

Ein weiterer Bereich ist die Förderung von Kreativität und Sensibilität. Es wird angenommen, dass kolloidales Gold die Wahrnehmung sowie kreative Denkprozesse unterstützen kann.

Darüber hinaus wird kolloidales Gold mit einer möglichen Unterstützung der körperlichen Regeneration und antioxidativen Schutzmechanismen in Verbindung gebracht.`,
    uses: [
      "Gehirn & Konzentration",
      "Stimmung & Wohlbefinden",
      "Energie & Stoffwechsel",
      "Haut & Haare",
      "Hormonbalance",
      "Kreativität",
      "Regeneration",
      "Antioxidativer Schutz",
    ],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "kobalt",
    name: "Kobalt",
    color: "#4a90a4",
    gradientFrom: "#6ba5b8",
    gradientTo: "#2d6b7a",
    tagline: "Spurenelement für Vitamin B12",
    description:
      "Kobalt ist ein Bestandteil von Vitamin B12 und damit wichtig für verschiedene Stoffwechselprozesse. Kolloidales Kobalt hat eine typische blaugraue metallische Färbung. Es wird traditionell geschätzt.",
    uses: ["Stoffwechsel", "Energie"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "kupfer",
    name: "Kupfer",
    color: "#b87333",
    gradientFrom: "#cd8c47",
    gradientTo: "#8b5a2b",
    tagline: "Essentiell für Enzyme und Bindegewebe",
    description:
      "Kupfer ist ein essentielles Spurenelement und Bestandteil vieler Enzyme. Es unterstützt unter anderem den Eisenstoffwechsel und die Bindegewebsbildung. Kolloidales Kupfer hat die charakteristische kupferrote Färbung.",
    uses: ["Enzyme", "Bindegewebe", "Eisenstoffwechsel"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "magnesium",
    name: "Magnesium",
    color: "#c0c0c0",
    gradientFrom: "#d8d8d8",
    gradientTo: "#a0a0a0",
    tagline: "Mineral für Muskeln und Nerven",
    description:
      "Magnesium ist ein lebenswichtiges Mineral, das an über 300 enzymatischen Reaktionen beteiligt ist. Kolloidales Magnesium hat eine silberweiße metallische Erscheinung. Es wird traditionell für Muskeln, Nerven und Knochen geschätzt.",
    uses: ["Muskelfunktion", "Nervensystem", "Knochen"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "molybdän",
    name: "Molybdän",
    color: "#6b7b8a",
    gradientFrom: "#8a9aa8",
    gradientTo: "#4d5c6b",
    tagline: "Spurenelement für Enzyme",
    description:
      "Molybdän ist ein essentielles Spurenelement und Bestandteil verschiedener Enzyme. Kolloidales Molybdän hat eine graue bis silbergraue Färbung. Es wird traditionell in der Naturheilkunde verwendet.",
    uses: ["Enzyme", "Stoffwechsel"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "nickel",
    name: "Nickel",
    color: "#8b8b8b",
    gradientFrom: "#a3a3a3",
    gradientTo: "#6b6b6b",
    tagline: "Spurenelement in minimalen Mengen",
    description:
      "Nickel kommt als Spurenelement in vielen Lebensmitteln vor. Kolloidales Nickel hat eine silbrig-weiße, leicht goldene Färbung. Es wird traditionell geschätzt – bei bekannter Nickelallergie sollte auf die Anwendung verzichtet werden.",
    uses: ["Traditionelle Anwendung"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "silber",
    name: "Silber",
    color: "#c0c0c0",
    gradientFrom: "#e8e8e8",
    gradientTo: "#a0a0a0",
    tagline: "Das bekannteste kolloidale Metall",
    description:
      "Kolloidales Silber ist das bekannteste kolloidale Metall. Es besteht aus winzigen Silberpartikeln in destilliertem Wasser und hat eine charakteristische hellgraue bis gelbliche Färbung. Silber wird seit langem in der Naturheilkunde traditionell verwendet.",
    uses: ["Haut", "Mundhygiene", "Traditionelle Anwendung"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "silizium",
    name: "Silizium",
    color: "#708090",
    gradientFrom: "#8a9aa8",
    gradientTo: "#556677",
    tagline: "Element für Haut, Haare und Bindegewebe",
    description:
      "Silizium ist nach Sauerstoff das häufigste Element der Erdkruste. Kolloidales Silizium wird traditionell für Haut, Haare und Nägel geschätzt. Das Halbmetall hat eine graue, metallisch glänzende Erscheinung.",
    uses: ["Haut", "Haare", "Bindegewebe"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "tantal",
    name: "Tantal",
    color: "#5c6b7a",
    gradientFrom: "#7a8a98",
    gradientTo: "#3d4c5b",
    tagline: "Seltenes Metall mit besonderen Eigenschaften",
    description:
      "Tantal ist ein seltenes, korrosionsbeständiges Metall mit einer charakteristischen grau-bläulichen Färbung. Kolloidales Tantal wird in der Naturheilkunde traditionell verwendet.",
    uses: ["Traditionelle Anwendung"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "vanadium",
    name: "Vanadium",
    color: "#6b7b8a",
    gradientFrom: "#8a9aa8",
    gradientTo: "#4d5c6b",
    tagline: "Spurenelement für den Stoffwechsel",
    description:
      "Vanadium kommt als Spurenelement in verschiedenen Lebensmitteln vor. Kolloidales Vanadium hat eine graue bis silbergraue Färbung. Es wird traditionell geschätzt.",
    uses: ["Stoffwechsel", "Traditionelle Anwendung"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "zink",
    name: "Zink",
    color: "#7d8b99",
    gradientFrom: "#9aa8b5",
    gradientTo: "#5c6b78",
    tagline: "Essentiell für Immunsystem und Haut",
    description:
      "Zink ist ein essentielles Spurenelement und an zahlreichen Körperfunktionen beteiligt. Kolloidales Zink hat eine bläulich-weiße metallische Färbung. Es wird traditionell für Immunsystem, Haut und Wundheilung geschätzt.",
    uses: ["Immunsystem", "Haut", "Wundheilung"],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "zinn",
    name: "Zinn",
    color: "#a8a8a8",
    gradientFrom: "#c0c0c0",
    gradientTo: "#808080",
    tagline: "Weiches Metall mit langer Geschichte",
    description:
      "Zinn ist ein weiches, silberweiß glänzendes Metall. Kolloidales Zinn wird traditionell in der Naturheilkunde verwendet. Es hat eine charakteristische silbrige Färbung.",
    uses: ["Traditionelle Anwendung"],
    productLink: PLACEHOLDER_PRODUCT,
  },
];

/** Get metal by id, or undefined if not found */
export function getMetalById(id: string): ColloidalMetal | undefined {
  return COLLOIDAL_METALS.find((m) => m.id === id);
}

/** All unique uses across metals, sorted by metal count (most first) */
export function getSortedUses(metals: ColloidalMetal[]): string[] {
  const counts: Record<string, number> = {};
  for (const m of metals) {
    for (const u of m.uses ?? []) {
      counts[u] = (counts[u] ?? 0) + 1;
    }
  }
  return Object.keys(counts).sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));
}
