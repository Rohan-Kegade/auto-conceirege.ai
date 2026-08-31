import type { ReactNode } from "react";
import { CitationChip } from "../../components/CitationChip";

const VISUAL_BOX = "mt-5 rounded-[10px] border border-line bg-canvas p-3";

/** Step 1 — a shortlist of brochures with two picked for context. */
function SourcesVisual() {
  const rows: Array<[string, boolean]> = [
    ["Creta SX Premium", true],
    ["Seltos HTX", true],
    ["Search the library…", false],
  ];
  return (
    <div className={`${VISUAL_BOX} flex flex-col gap-2`}>
      {rows.map(([label, on]) => (
        <div key={label} className="flex items-center gap-2.5">
          <span
            className={`h-[9px] w-[9px] flex-none rounded-[3px] ${
              on
                ? "border border-accent bg-accent"
                : "border border-stroke-dashed"
            }`}
          />
          <span className={`text-[12.5px] ${on ? "text-ink" : "text-muted-2"}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Step 2 — a question typed into the composer. */
function AskVisual() {
  return (
    <div className="mt-5 flex items-center gap-2 rounded-[10px] border border-stroke bg-canvas p-2.5">
      <span className="flex-1 text-[12.5px] text-muted-2">
        How do the safety features compare?
      </span>
      <span className="flex-none rounded-[7px] bg-ink px-2.5 py-1 font-mono text-[11px] text-canvas">
        Ask
      </span>
    </div>
  );
}

/** Step 3 — an answer line with its citation. */
function ResultVisual() {
  return (
    <div
      className={`${VISUAL_BOX} text-[12.5px] leading-[1.55] text-ink-soft`}
    >
      Both get six airbags and Level 2 ADAS as standard.
      <CitationChip className="ml-1">CRETA p.14</CitationChip>
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
    title: "Choose your sources",
    body: "Drop in a dealer brochure or search the indexed library by make, year and body type. Stack up to eight documents in one chat.",
    visual: <SourcesVisual />,
  },
  {
    n: "02",
    title: "Ask a question",
    body: "Ask in plain language. Retrieval runs over spec tables, footnotes and trim charts — the parts of a brochure a search box can't reach.",
    visual: <AskVisual />,
  },
  {
    n: "03",
    title: "Get a verified result",
    body: "Every answer comes back with the brochure page behind each figure, so you can check it against the source. Nothing is estimated.",
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
