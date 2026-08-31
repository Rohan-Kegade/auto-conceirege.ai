import { useState } from "react";

const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "Where do the indexed brochures come from?",
    answer:
      "Publicly distributed manufacturer and dealer brochures, parsed page by page. Each document keeps its version and publication date so you always know how current a figure is.",
  },
  {
    question: "Can it read spec tables and footnotes?",
    answer:
      "Yes — tables, footnotes and trim matrices are extracted as structured rows, not flattened text, which is why comparisons line up correctly across two different layouts.",
  },
  {
    question: "Are my uploaded brochures shared with anyone?",
    answer:
      "No. Uploads are indexed to your account only and never added to the public library unless you explicitly publish them.",
  },
  {
    question: "What happens when the brochure doesn't say?",
    answer:
      "It tells you the figure is absent rather than estimating. Unsourced claims are the one thing this tool refuses to make.",
  },
  {
    question: "How many brochures can I compare at once?",
    answer:
      "Up to eight in a single chat — mix your uploads and library brochures freely. Past that, retrieval quality drops and it will ask you to narrow the set.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.question}
            onClick={() => setOpen(isOpen ? -1 : i)}
            className="cursor-pointer border-t border-line py-[22px]"
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className="text-[18.5px] font-medium tracking-[-0.012em]">
                {faq.question}
              </span>
              <span className="font-mono text-[15px] text-muted-2">
                {isOpen ? "−" : "+"}
              </span>
            </div>
            {isOpen ? (
              <p className="m-0 mt-3 max-w-[46em] text-[15.5px] leading-[1.62] text-slate [animation:riseIn_0.22s_ease_both] [text-wrap:pretty]">
                {faq.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
