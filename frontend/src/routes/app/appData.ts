/** Fixture data + canned-answer builder for the chat app, ported from
 *  `Brochure Research.dc.html`. The marques are placeholders on purpose —
 *  the demo answer must not read as a real spec claim. */

export type LibraryDoc = { id: string; title: string; meta: string };

export const LIBRARY: LibraryDoc[] = [
  { id: "d1", title: "Aurora EX-7 — Range & Trims", meta: "AURORA · 2026 · SUV · 48 p" },
  { id: "d2", title: "Meridian GT-Line Brochure", meta: "MERIDIAN · 2025 · SEDAN · 36 p" },
  { id: "d3", title: "Vantus Terra 4x4 Specification Guide", meta: "VANTUS · 2026 · PICKUP · 52 p" },
  { id: "d4", title: "Kaelin S60 Owner Handbook Extract", meta: "KAELIN · 2025 · SEDAN · 24 p" },
  { id: "d5", title: "Orbis Volt e-SUV Pricing & Options", meta: "ORBIS · 2026 · EV SUV · 40 p" },
  { id: "d6", title: "Norda Fjord Wagon Accessories", meta: "NORDA · 2025 · WAGON · 28 p" },
  { id: "d7", title: "Aurora EX-7 Towing Supplement", meta: "AURORA · 2026 · ADDENDUM · 12 p" },
];

export const SHORT: Record<string, string> = {
  d1: "AURORA EX-7",
  d2: "MERIDIAN GT",
  d3: "VANTUS TERRA",
  d4: "KAELIN S60",
  d5: "ORBIS VOLT",
  d6: "NORDA FJORD",
  d7: "EX-7 TOWING",
};

export const UPLOAD_NAMES = [
  "Meridian_GT_2025_AU.pdf",
  "Norda_Fjord_Wagon_2025.pdf",
  "Aurora_EX7_Dealer_Pack.pdf",
];

export const SUGGESTIONS = [
  "Compare the feature list across my selected brochures",
  "Which trim includes adaptive cruise as standard?",
  "Summarise the warranty and service intervals",
  "What options are bundled in the Premium pack, and what do they cost?",
];

/** Quick follow-ups offered above the composer once a chat is underway. */
export const FOLLOW_UPS = [
  "How do running costs compare over five years?",
  "Which one holds its value better?",
  "What's missing at this trim level?",
  "Show the safety ratings side by side",
];

export type UploadStage = "uploading" | "parsing" | "embedding" | "ready";
export type Upload = { id: string; name: string; pct: number; stage: UploadStage };

export type Citation = { label: string };
export type Paragraph = { text: string; cites: Citation[] };
export type AnswerTable = { cols: string[]; rows: string[][] };

export type ChatMessage =
  | { role: "user"; text: string }
  | {
      role: "bot";
      retrieval: string;
      paras: Paragraph[];
      table: AnswerTable | null;
      sources: string[];
    };

export function sourceLabel(id: string, uploads: Upload[]): string {
  return SHORT[id] ?? uploads.find((u) => u.id === id)?.name ?? "Upload";
}

/** Build the canned assistant reply for a question, given the active sources. */
export function buildAnswer(selected: string[], uploads: Upload[]): ChatMessage {
  const names = selected.map((id) => SHORT[id] ?? "UPLOAD").slice(0, 3);
  const a = names[0] || "SOURCE";
  const b = names[1] || names[0] || "SOURCE";

  return {
    role: "bot",
    retrieval: `answered from ${selected.length} sources · 14 passages · 1.9s`,
    paras: [
      {
        text: `Across the brochures in context, the clearest split is safety kit: the ${a} lists Level 2 ADAS and six airbags as standard, while the ${b} keeps ADAS to the top trim and starts four airbags lower down the range.`,
        cites: [{ label: `${a} p.12` }, { label: `${b} p.28` }],
      },
      {
        text: `For a family doing mostly urban driving, the bigger difference is convenience: only one of the two ships with ventilated front seats and a 360° camera as standard — the other lists both inside a paid technology pack.`,
        cites: [{ label: `${b} p.41` }],
      },
    ],
    table: {
      cols: ["Specification", names[0] || "Model A", names[1] || "Model B"],
      rows: [
        ["Level 2 ADAS", "Standard", "Top trim only"],
        ["Airbags", "6", "4–6"],
        ["Sunroof", "Panoramic", "Single-pane"],
        ["Boot (seats up)", "433 L", "465 L"],
      ],
    },
    sources: selected.map((id) => sourceLabel(id, uploads)),
  };
}
