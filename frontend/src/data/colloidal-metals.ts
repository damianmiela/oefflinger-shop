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
  /** Full description */
  description: string;
  /** Optional: traditional uses (neutral phrasing) */
  uses?: string[];
}

export const COLLOIDAL_METALS: ColloidalMetal[] = [
  {
    id: "chrom",
    name: "Chrom",
    color: "#8b9dc3",
    gradientFrom: "#a8b8d4",
    gradientTo: "#6b7fa8",
    tagline: "Spurenelement für den Stoffwechsel",
    description:
      "Chrom ist ein essentielles Spurenelement, das in der Natur in verschiedenen Verbindungen vorkommt. Kolloidales Chrom wird traditionell geschätzt. Das Metall hat eine charakteristische silbergraue bis bläuliche Färbung.",
    uses: ["Stoffwechsel", "Energie"],
  },
  {
    id: "eisen",
    name: "Eisen",
    color: "#b87333",
    gradientFrom: "#c98b4a",
    gradientTo: "#8b5a2b",
    tagline: "Zentrales Element für Blut und Energie",
    description:
      "Eisen ist eines der wichtigsten Spurenelemente und spielt eine zentrale Rolle bei der Sauerstoffversorgung des Körpers. Kolloidales Eisen wird in der Naturheilkunde traditionell verwendet. Das Metall zeigt eine typische grau-metallische bis rötliche Färbung.",
    uses: ["Blutbildung", "Energie", "Sauerstofftransport"],
  },
  {
    id: "gold",
    name: "Gold",
    color: "#d4af37",
    gradientFrom: "#e8c547",
    gradientTo: "#b8962e",
    tagline: "Edelmetall mit langer Tradition",
    description:
      "Gold wird seit jeher als Edelmetall geschätzt. Kolloidales Gold besteht aus winzigen Goldpartikeln in destilliertem Wasser. Es hat eine charakteristische goldene bis bernsteinfarbene Färbung und wird traditionell in der Naturheilkunde verwendet.",
    uses: ["Traditionelle Anwendung", "Haut"],
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
  },
];

/** All unique uses across metals, sorted for display */
export const ALL_USES = Array.from(
  new Set(COLLOIDAL_METALS.flatMap((m) => m.uses ?? [])),
).sort();
