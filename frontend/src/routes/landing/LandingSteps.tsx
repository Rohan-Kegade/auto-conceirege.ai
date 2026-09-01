import type { ReactNode } from "react";
import { CitationChip } from "../../components/CitationChip";
import { Logo } from "../../components/Logo";

const CARD = "mt-5 overflow-hidden rounded-xl border border-line bg-canvas";
const MONO_LABEL =
  "font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-2";

function PdfMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 flex-none text-muted-3"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SearchMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SendMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

/** Step 1 — a miniature of the right-hand Chat context panel. */
function SourcesVisual() {
  const docs: Array<[string, string]> = [
    ["Aurora EX-7 — Range & Trims", "AURORA · 2026 · SUV · 48 p"],
    ["Orbis Volt e-SUV Pricing & Options", "ORBIS · 2026 · EV SUV · 40 p"],
  ];
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className={MONO_LABEL}>Chat context</span>
        <span className="font-mono text-[10px] text-muted-2">2/9</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {docs.map(([title, meta]) => (
          <div key={title} className="flex items-start gap-2">
            <span className="mt-0.5 h-[13px] w-[13px] flex-none rounded-[4px] border border-accent bg-accent" />
            <PdfMark />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[12px] leading-tight text-ink">
                {title}
              </span>
              <span className="mt-0.5 truncate font-mono text-[9px] tracking-[0.04em] text-muted-2">
                {meta}
              </span>
            </span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-stroke px-2.5 py-1.5 text-[11px] text-muted-3">
          <SearchMark />
          Search brochure library
        </div>
      </div>
    </div>
  );
}

/** Step 2 — a miniature of the composer, follow-up chips and all. */
function AskVisual() {
  return (
    <div className="mt-5 flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {["Compare running costs", "Which holds value better?"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-line px-2 py-0.5 text-[10.5px] text-muted"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="flex items-end gap-2 rounded-xl border border-stroke bg-canvas p-2 pl-3">
        <span className="flex-1 py-1 text-[12px] leading-snug text-muted-2">
          How do the safety features compare across trims?
        </span>
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-ink text-canvas">
          <SendMark />
        </span>
      </div>
    </div>
  );
}

/** Step 3 — a miniature of an assistant reply with its citations. */
function ResultVisual() {
  return (
    <div className={`${CARD} p-3`}>
      <div className="flex items-center gap-2">
        <Logo size={16} />
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-2">
          answered from 2 sources · 14 passages · 1.9s
        </span>
      </div>
      <p className="m-0 mt-2.5 text-[12px] leading-[1.55] text-ink-soft">
        Both list Level 2 ADAS and six airbags as standard; only the EX-7 keeps a
        360° camera below the top trim.
        <CitationChip className="ml-1">EX-7 p.12</CitationChip>
        <CitationChip className="ml-1">VOLT p.28</CitationChip>
      </p>
    </div>
  );
}

const STEPS: Array<{
  n: string;
  title: string;
  body: string;
  visual: ReactNode;
}> = [
  {
    n: "01",
    title: "Build the chat's context",
    body: "Search the indexed library by make, year or body type, or upload a dealer PDF. Tick the brochures you want in scope — up to eight per chat — and untick any to leave them out.",
    visual: <SourcesVisual />,
  },
  {
    n: "02",
    title: "Ask in plain language",
    body: "Type a question the way you'd put it to a salesperson. Retrieval runs across spec tables, footnotes and trim charts, and the model answers only from the brochures you've ticked.",
    visual: <AskVisual />,
  },
  {
    n: "03",
    title: "Trace every figure",
    body: "Each claim carries the brochure and page it came from, shown as a chip you can open to the exact passage. Nothing is estimated or filled in from general knowledge.",
    visual: <ResultVisual />,
  },
];

export function LandingSteps() {
  return (
    <div className="grid gap-10 sm:grid-cols-3">
      {STEPS.map((step) => (
        <div key={step.n} className="flex flex-col border-t border-ink pt-[22px]">
          <div className="mb-3.5 font-mono text-[12px] text-accent">{step.n}</div>
          <h3 className="m-0 mb-3 text-[22px] font-medium tracking-[-0.015em]">
            {step.title}
          </h3>
          <p className="m-0 text-[15.5px] leading-[1.6] text-slate [text-wrap:pretty]">
            {step.body}
          </p>
          <div className="mt-auto">{step.visual}</div>
        </div>
      ))}
    </div>
  );
}
