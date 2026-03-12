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
      "Kolloidales Kobalt ist ein essentielles Spurenelement, das eine wichtige Rolle in verschiedenen Stoffwechselprozessen des Körpers spielt. Besonders bekannt ist seine Beteiligung an der Bildung roter Blutkörperchen, die für den Sauerstofftransport im Körper verantwortlich sind. Darüber hinaus wird Kobalt mit einer möglichen Unterstützung der Gehirnfunktion, der Energieproduktion sowie des Nervensystems in Verbindung gebracht. Es kann zur geistigen Klarheit beitragen und das allgemeine Wohlbefinden unterstützen. Durch die kolloidale Form wird Kobalt in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Verwertung im Körper unterstützen kann.",
    longDescription: `Kolloidales Kobalt

Kobalt ist ein Spurenelement, das in kleinen Mengen im Körper vorkommt, jedoch eine wichtige Rolle für zahlreiche biologische Prozesse spielt. Besonders bedeutend ist seine Beteiligung an der Bildung roter Blutkörperchen, die für den Transport von Sauerstoff im Körper verantwortlich sind. Eine ausreichende Versorgung mit Kobalt kann daher zur Unterstützung der Sauerstoffversorgung der Zellen beitragen.

Durch diese Funktion kann Kobalt auch eine Rolle bei der Energieproduktion im Körper spielen und dabei helfen, Müdigkeit und Erschöpfung zu reduzieren.

Kobalt wird außerdem mit einer möglichen Unterstützung des Nervensystems und der Gehirnfunktion in Verbindung gebracht. Es kann dazu beitragen, Nervenzellen zu schützen und die neuronale Aktivität im Gehirn zu unterstützen. Dadurch könnten Konzentration, geistige Klarheit und kognitive Leistungsfähigkeit positiv beeinflusst werden.

Darüber hinaus wird angenommen, dass Kobalt Einfluss auf Wahrnehmung und Stimmung nehmen kann, da es möglicherweise an der Regulation von Neurotransmittern beteiligt ist. Dies kann zur emotionalen Balance und zum allgemeinen Wohlbefinden beitragen.

Kobalt kann außerdem eine Rolle im Hormonhaushalt spielen, da es an Prozessen beteiligt sein kann, die die Produktion und Regulation von Hormonen beeinflussen.

Ein weiterer möglicher Wirkbereich liegt im Stoffwechsel bestimmter Substanzen, beispielsweise bei der Umwandlung von Homocystein sowie bei der Aktivierung von Folsäure, die für verschiedene Stoffwechselprozesse wichtig ist.

Darüber hinaus wird kolloidales Kobalt mit möglichen entzündungshemmenden Eigenschaften in Verbindung gebracht und könnte bei allergischen Reaktionen wie Heuschnupfen unterstützend wirken.

Durch seine kolloidale Form wird Kobalt in einer speziellen Struktur bereitgestellt, die eine mögliche Aufnahme und Verwertung im Körper unterstützen kann.`,
    uses: [
      "Energie & Stoffwechsel",
      "Gehirn & Konzentration",
      "Stimmung & Wohlbefinden",
      "Hormonbalance",
      "Immunsystem",
      "Haut & Haare",
      "Allergien",
      "Eisenmangel",
    ],
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
      "Kolloidales Kupfer ist ein essentielles Spurenelement, das zahlreiche wichtige Funktionen im Körper unterstützt. Es spielt eine Rolle bei der Bildung von Bindegewebe, der Produktion roter Blutkörperchen sowie bei der Energieerzeugung im Stoffwechsel. Kupfer ist außerdem an der Eisenverwertung beteiligt und unterstützt die Funktion des Nervensystems. Zusätzlich trägt es zur Bildung antioxidativer Enzyme bei und kann so zum Schutz der Zellen sowie zur Unterstützung des Immunsystems beitragen. Durch seine kolloidale Form wird Kupfer in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Verwertung im Körper unterstützen kann.",
    longDescription: `Kolloidales Kupfer

Kupfer ist ein essentielles Spurenelement, das im Körper an zahlreichen biologischen Prozessen beteiligt ist. Es spielt eine wichtige Rolle bei der Bildung von Bindegewebe, Knochen und Blutgefäßen, da es an der Produktion von Kollagen und Elastin beteiligt ist. Diese strukturellen Proteine sorgen für Stabilität und Elastizität verschiedener Gewebe im Körper.

Darüber hinaus unterstützt Kupfer die Bildung roter Blutkörperchen und ist an der Verwertung von Eisen beteiligt. Dadurch trägt es zur Sauerstoffversorgung der Zellen und zur allgemeinen Energieproduktion im Körper bei.

Kupfer spielt außerdem eine wichtige Rolle im Nervensystem, da es an der Bildung von Neurotransmittern und der Signalübertragung zwischen Nervenzellen beteiligt ist. Dadurch kann es zur Unterstützung kognitiver Funktionen und der Regulation von Stimmung beitragen.

Ein weiterer wichtiger Bereich ist die antioxidative Wirkung von Kupfer. Als Bestandteil des Enzyms Superoxiddismutase (SOD) hilft es dabei, freie Radikale zu neutralisieren und oxidativen Stress zu reduzieren. Dies trägt zum Schutz der Zellen und zur allgemeinen Gesundheit bei.

Kupfer kann außerdem eine Rolle im Hormonstoffwechsel spielen, indem es Enzyme unterstützt, die am Abbau überschüssiger Hormone beteiligt sind. Dadurch kann es helfen, ein hormonelles Gleichgewicht im Körper zu fördern.

Zusätzlich besitzt Kupfer antibakterielle Eigenschaften, da Kupferionen Mikroorganismen in ihrer Funktion stören können. Diese Eigenschaften werden auch in verschiedenen medizinischen Anwendungen untersucht.

Darüber hinaus wird kolloidales Kupfer mit möglichen positiven Effekten auf Hautgesundheit und Kollagenbildung in Verbindung gebracht. Durch die Unterstützung der Hyaluronsäure- und Kollagenproduktion kann es zur Elastizität, Feuchtigkeit und Struktur der Haut beitragen.`,
    uses: [
      "Haut & Haare",
      "Energie & Stoffwechsel",
      "Immunsystem",
      "Gehirn & Konzentration",
      "Hormonbalance",
      "Antioxidativer Schutz",
      "Eisenmangel",
      "Verdauung & Wohlbefinden",
    ],
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
      "Kolloidales Magnesium ist ein wichtiges Mineral, das an zahlreichen biologischen Prozessen im Körper beteiligt ist. Es wirkt als Cofaktor bei über 300 enzymatischen Reaktionen und spielt eine zentrale Rolle bei der Energieproduktion, der Muskel- und Nervenfunktion sowie im Stoffwechsel. Magnesium unterstützt die Entspannung der Muskulatur, trägt zur Regulation des Nervensystems bei und kann zur Stabilisierung von Stimmung und Stressreaktionen beitragen. Zudem ist es wichtig für die Knochengesundheit, den Blutzuckerspiegel sowie die normale Funktion des Herz-Kreislauf-Systems. Durch seine kolloidale Form wird Magnesium in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Verwertung im Körper unterstützen kann.",
    longDescription: `Kolloidales Magnesium

Magnesium ist ein lebenswichtiges Mineral und an einer Vielzahl von biologischen Prozessen beteiligt. Als Cofaktor für mehr als 300 enzymatische Reaktionen spielt es eine zentrale Rolle im Energiestoffwechsel, bei der DNA-Synthese sowie bei zahlreichen Stoffwechselprozessen im Körper.

Eine der wichtigsten Funktionen von Magnesium liegt in der Unterstützung der Muskelentspannung und Regeneration. Es ist an der Regulation der Muskelkontraktion beteiligt und hilft dabei, Muskelverspannungen, Krämpfe und Muskelkater zu reduzieren. Dadurch kann Magnesium zur Erholung nach körperlicher Belastung beitragen.

Magnesium unterstützt außerdem das Nervensystem und die mentale Balance. Es kann beruhigend auf das Nervensystem wirken, zur Regulation von Stresshormonen beitragen und die Produktion von Neurotransmittern wie Serotonin unterstützen. Dadurch kann Magnesium helfen, Stress zu reduzieren und die emotionale Ausgeglichenheit zu fördern.

Darüber hinaus spielt Magnesium eine wichtige Rolle für die Knochengesundheit, da es an der Aufnahme und dem Stoffwechsel von Calcium beteiligt ist. Eine ausreichende Versorgung kann dazu beitragen, die Stabilität der Knochen zu unterstützen.

Magnesium ist auch wichtig für das Herz-Kreislauf-System. Es trägt zur Entspannung der Blutgefäße bei, kann den Blutdruck regulieren und unterstützt die normale Herzfunktion.

Ein weiterer wichtiger Bereich ist die Regulation des Blutzuckerspiegels. Magnesium ist an der Funktion von Insulin beteiligt und kann dazu beitragen, die Insulinsensitivität zu verbessern und den Blutzuckerspiegel stabil zu halten.

Zusätzlich unterstützt Magnesium das Immunsystem, indem es an verschiedenen immunologischen Prozessen beteiligt ist und zur Regulation entzündungshemmender Mechanismen beitragen kann.

Kolloidales Magnesium stellt dieses wichtige Mineral in einer Form bereit, die eine mögliche Aufnahme und Nutzung im Körper unterstützen kann.`,
    uses: [
      "Muskel & Regeneration",
      "Energie & Stoffwechsel",
      "Gehirn & Konzentration",
      "Stimmung & Wohlbefinden",
      "Knochen",
      "Herz-Kreislauf",
      "Blutzucker",
      "Immunsystem",
    ],
    productLink: PLACEHOLDER_PRODUCT,
  },
  {
    id: "molybdan",
    name: "Molybdän",
    color: "#6b7b8a",
    gradientFrom: "#8a9aa8",
    gradientTo: "#4d5c6b",
    tagline: "Spurenelement für Enzyme",
    description:
      "Kolloidales Molybdän ist ein essentielles Spurenelement, das als wichtiger Cofaktor für zahlreiche Enzyme im Körper wirkt. Diese Enzyme sind an wichtigen biochemischen Prozessen beteiligt, darunter der Stoffwechsel von Aminosäuren, die Energieproduktion sowie verschiedene Entgiftungsmechanismen. Molybdän unterstützt insbesondere enzymatische Prozesse, die beim Abbau von Schwefelverbindungen und bei der Entgiftung des Körpers eine Rolle spielen. Darüber hinaus kann es zur Unterstützung des Nervensystems, des Immunsystems sowie des Stoffwechsels beitragen. Durch seine kolloidale Form wird Molybdän in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Verwertung im Körper unterstützen kann.",
    longDescription: `Kolloidales Molybdän

Molybdän ist ein essentielles Spurenelement, das im Körper eine wichtige Rolle als Cofaktor für verschiedene Enzyme spielt. Diese Enzyme sind an zahlreichen biochemischen Prozessen beteiligt, darunter der Stoffwechsel von Aminosäuren, die Energieproduktion sowie die Entgiftung bestimmter Substanzen.

Eine zentrale Funktion von Molybdän liegt in der Unterstützung von Entgiftungsprozessen im Körper. Es ist Bestandteil von Enzymen wie der Sulfitoxidase, die schädliche Schwefelverbindungen in weniger belastende Substanzen umwandeln können. Dadurch kann Molybdän dazu beitragen, den Stoffwechsel von schwefelhaltigen Aminosäuren zu unterstützen.

Darüber hinaus spielt Molybdän eine Rolle im Harnsäurestoffwechsel, indem es an enzymatischen Prozessen beteiligt ist, die Harnsäure in weniger schädliche Formen umwandeln können.

Molybdän unterstützt außerdem verschiedene Stoffwechselprozesse, da es an der Aktivierung von Enzymen beteiligt ist, die Nährstoffe verarbeiten und biochemische Reaktionen im Körper regulieren.

Auch das Nervensystem kann von einer ausreichenden Versorgung profitieren, da Molybdän an Prozessen beteiligt ist, die mit der Synthese von Neurotransmittern und der Kommunikation zwischen Nervenzellen verbunden sind.

Zusätzlich wird Molybdän mit einer möglichen Unterstützung des Immunsystems in Verbindung gebracht, da es Enzyme aktiviert, die an der Immunantwort beteiligt sein können.

Darüber hinaus kann Molybdän eine Rolle bei der Hormonregulation spielen, da bestimmte Enzyme beim Abbau und bei der Verarbeitung von Hormonen auf dieses Spurenelement angewiesen sind.

Weitere mögliche Wirkbereiche betreffen die antioxidative Unterstützung sowie die Beteiligung an enzymatischen Prozessen, die für die Hautgesundheit und die Knochengesundheit relevant sein können.

Kolloidales Molybdän stellt dieses Spurenelement in einer Form bereit, die eine mögliche Aufnahme und Nutzung im Körper unterstützen kann.`,
    uses: [
      "Energie & Stoffwechsel",
      "Immunsystem",
      "Gehirn & Konzentration",
      "Stimmung & Wohlbefinden",
      "Hormonbalance",
      "Antioxidativer Schutz",
      "Haut & Haare",
      "Knochen",
      "Verdauung & Wohlbefinden",
    ],
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
      "Kolloidales Nickel ist ein Spurenelement, das im Körper an verschiedenen enzymatischen und biochemischen Prozessen beteiligt sein kann. Es wird vermutet, dass Nickel die Aktivität bestimmter Enzyme unterstützt, die für den Stoffwechsel, die Energieproduktion und andere wichtige Funktionen im Organismus verantwortlich sind. Darüber hinaus kann Nickel zur Unterstützung der Zellgesundheit beitragen und möglicherweise antioxidative Eigenschaften besitzen, die helfen können, freie Radikale zu neutralisieren und Zellschäden zu reduzieren. Durch seine kolloidale Form wird Nickel in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Verwertung im Körper unterstützen kann.",
    longDescription: `Kolloidales Nickel

Nickel ist ein Spurenelement, das in geringen Mengen im Körper vorkommen kann und an verschiedenen biochemischen Prozessen beteiligt ist. Es wird angenommen, dass Nickel als Cofaktor bestimmter Enzyme fungieren kann, die wichtige Stoffwechselreaktionen im Körper unterstützen.

Eine mögliche Rolle von Nickel liegt in der Unterstützung der Zellgesundheit. Es kann an Enzymen beteiligt sein, die bei der Reparatur von DNA-Schäden eine Rolle spielen und so zur Aufrechterhaltung der genetischen Integrität der Zellen beitragen.

Darüber hinaus unterstützt Nickel verschiedene enzymatische Stoffwechselprozesse, die für die Umwandlung von Nährstoffen sowie für die Energieproduktion im Körper wichtig sind. Diese enzymatischen Reaktionen tragen dazu bei, dass der Körper Energie effizient nutzen kann.

Nickel wird außerdem mit einer möglichen Unterstützung des Immunsystems in Verbindung gebracht. Es kann die Aktivität bestimmter Immunzellen beeinflussen und zur Regulation von Entzündungsprozessen beitragen, die eine wichtige Rolle bei der Immunantwort spielen.

Ein weiterer möglicher Wirkbereich betrifft die Bildung und Erhaltung von Gewebe, einschließlich Haut, Haaren und Nägeln. Nickel kann an enzymatischen Prozessen beteiligt sein, die die Produktion von Kollagen und Keratin unterstützen.

Auch das Nervensystem kann von Nickel beeinflusst werden, da es möglicherweise an neurologischen Prozessen beteiligt ist, die für Kommunikation und Signalübertragung zwischen Nervenzellen wichtig sind.

Darüber hinaus wird Nickel mit der Regulation des Energiestoffwechsels sowie mit Prozessen in Verbindung gebracht, die die Funktion der Schilddrüse und die hormonelle Regulation beeinflussen können.

Kolloidales Nickel stellt dieses Spurenelement in einer Form bereit, die eine mögliche Aufnahme und Nutzung im Körper unterstützen kann.`,
    uses: [
      "Energie & Stoffwechsel",
      "Immunsystem",
      "Gehirn & Konzentration",
      "Stimmung & Wohlbefinden",
      "Hormonbalance",
      "Haut & Haare",
      "Antioxidativer Schutz",
      "Blutzucker",
    ],
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
      "Kolloidales Silber ist seit Jahrhunderten für seine antimikrobiellen Eigenschaften bekannt. Silberpartikel können mit Mikroorganismen interagieren und werden häufig mit einer hemmenden Wirkung auf Bakterien, Viren und andere Keime in Verbindung gebracht. Darüber hinaus wird kolloidales Silber für seine entzündungshemmenden und antioxidativen Eigenschaften geschätzt. Es kann dazu beitragen, das Immunsystem zu unterstützen, Entzündungsprozesse zu regulieren und den Körper vor den Auswirkungen freier Radikale zu schützen. Durch seine kolloidale Form wird Silber in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Nutzung im Körper unterstützen kann.",
    longDescription: `Kolloidales Silber

Silber wird seit vielen Jahrhunderten wegen seiner antimikrobiellen Eigenschaften geschätzt. Historisch wurde es verwendet, um Wasser länger haltbar zu machen oder Lebensmittel vor dem Verderben zu schützen. Moderne Untersuchungen zeigen, dass Silberpartikel mit Mikroorganismen interagieren können.

Dabei können Silberpartikel Ionen freisetzen, die in Bakterienzellen eindringen und deren Stoffwechselprozesse beeinflussen. Diese Eigenschaft wird mit einer möglichen hemmenden Wirkung auf verschiedene Mikroorganismen wie Bakterien, Viren und Pilze in Verbindung gebracht.

Neben seinen antimikrobiellen Eigenschaften wird kolloidales Silber auch für seine entzündungshemmende Wirkung geschätzt. Es kann dazu beitragen, Entzündungsprozesse im Körper zu regulieren und das Immunsystem bei der Abwehr von Krankheitserregern zu unterstützen.

Ein weiterer möglicher Wirkbereich ist der antioxidative Schutz. Kolloidales Silber kann dazu beitragen, freie Radikale zu neutralisieren, die Zellschäden verursachen können und mit Alterungsprozessen in Verbindung gebracht werden.

Darüber hinaus wird kolloidales Silber häufig im Zusammenhang mit der Hautpflege und Wundheilung erwähnt. Es wird zur Unterstützung bei Hautproblemen, kleinen Verletzungen oder Hautreizungen eingesetzt.

Auch bei der Unterstützung der Atemwege sowie bei bestimmten Verdauungsbeschwerden wird kolloidales Silber in verschiedenen Anwendungen genutzt.

Durch seine kolloidale Form wird Silber in einer Struktur bereitgestellt, die eine mögliche Aufnahme und Nutzung im Körper unterstützen kann.`,
    uses: [
      "Immunsystem",
      "Antioxidativer Schutz",
      "Haut & Haare",
      "Verdauung & Wohlbefinden",
      "Atemwege",
      "Entzündungen",
    ],
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
