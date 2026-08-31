import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { CitationChip } from "../../components/CitationChip";
import { BRAND_NAME } from "../../lib/brand";
import { LandingHeader } from "./LandingHeader";
import { LandingFaq } from "./LandingFaq";
import { LandingSteps } from "./LandingSteps";

const STATS = [
  { value: "1,240", label: "Brochures indexed" },
  { value: "62", label: "Marques covered" },
  { value: "2011–26", label: "Model years" },
  { value: "1.9s", label: "Median answer time" },
];

const SECTION = "mx-auto max-w-[1440px] px-6 py-[82px] sm:px-12";

const LIBRARY_BRANDS = [
  "Hyundai",
  "Kia",
  "Tata",
  "Mahindra",
  "Maruti Suzuki",
  "Toyota",
  "Honda",
  "Skoda",
  "Volkswagen",
  "MG",
  "Renault",
  "Nissan",
  "Jeep",
  "Citroën",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Land Rover",
  "Ford",
];

function HeroCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-canvas shadow-[0_24px_60px_-32px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-2.5 border-b border-line-soft px-5 py-3.5">
        <span className="h-2 w-2 rounded-full bg-teal" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-2">
          2 sources in context
        </span>
      </div>
      <div className="flex flex-col gap-[18px] px-[22px] pb-[26px] pt-6">
        <div className="max-w-[80%] self-end rounded-[14px_14px_4px_14px] border border-line bg-panel px-4 py-3 text-[14.5px] leading-[1.5]">
          Compare the features on the Seltos HTX and the Creta SX Premium.
        </div>
        <div className="text-[14.5px] leading-[1.62] text-ink-soft">
          On the headline kit the two are line-for-line: the{" "}
          <strong className="font-semibold">Seltos HTX</strong> and the{" "}
          <strong className="font-semibold">Creta SX&nbsp;Premium</strong> both
          get Level&nbsp;2 ADAS, a panoramic sunroof, dual 10.25″ displays,
          ventilated front seats and Bose audio. The Seltos' edge is a 360°
          camera where the Creta gives you a rear camera with sensors; the
          Creta's is a rear wireless charging pad the Seltos leaves out.
          <CitationChip className="ml-1">CRETA p.14</CitationChip>
          <CitationChip className="ml-1">SELTOS p.9</CitationChip>
        </div>
        <div className="overflow-hidden rounded-[12px] border border-line-soft">
          <div className="grid grid-cols-[1.25fr_1fr_1fr] bg-canvas px-3.5 py-[9px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
            <span>Feature</span>
            <span>Creta SX Prem</span>
            <span>Seltos HTX</span>
          </div>
          {[
            ["Level 2 ADAS", "Standard", "Standard"],
            ["Panoramic sunroof", "Yes", "Yes"],
            ["Displays", "10.25″ + 10.25″", "10.25″ + 10.25″"],
            ["Parking camera", "Rear + sensors", "360° view"],
            ["Ventilated seats · Bose", "Yes", "Yes"],
            ["Wireless charger", "Front + rear", "Front"],
          ].map(([k, a, b]) => (
            <div
              key={k}
              className="grid grid-cols-[1.25fr_1fr_1fr] border-t border-line-soft px-3.5 py-2.5 text-[13px]"
            >
              <span className="text-muted">{k}</span>
              <span>{a}</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div data-screen="landing" className="min-h-screen bg-canvas">
      <LandingHeader />

      {/* Hero */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] items-center gap-[72px] px-6 pb-[104px] pt-24 sm:px-12">
        <div>
          <div className="mb-[26px] font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            Ask the brochures directly
          </div>
          <h1 className="m-0 mb-[26px] text-[clamp(42px,4.4vw,68px)] font-medium leading-[1.04] tracking-[-0.028em]">
            Every spec, every trim
            <br />— answered from the
            <br />source document.
          </h1>
          <p className="m-0 mb-[38px] max-w-[30em] text-[18.5px] leading-[1.6] text-slate [text-wrap:pretty]">
            Upload a manufacturer brochure or pull one from the 1,240 already
            indexed. Compare models side by side, with the brochure page number
            behind every figure.
          </p>
          <div className="flex items-center gap-3.5">
            <Button
              className="px-[30px] py-[15px] text-[15.5px]"
              onClick={() => navigate("/register")}
            >
              Create account
            </Button>
            <Button
              variant="outline"
              className="px-[26px] py-[15px] text-[15.5px]"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How it works
            </Button>
          </div>
          <div className="mt-[52px] flex flex-wrap gap-x-[34px] gap-y-2 font-mono text-[11.5px] tracking-[0.06em] text-muted-2">
            <span>NO SPEC HALLUCINATION</span>
            <span>PAGE-LEVEL CITATIONS</span>
            <span>BROCHURE STAYS PRIVATE</span>
          </div>
        </div>
        <HeroCard />
      </section>

      {/* How it works */}
      <section id="how-it-works" className={`${SECTION} border-t border-line`}>
        <div className="mb-11 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-2">
          How it works
        </div>
        <LandingSteps />
      </section>

      {/* Stats + library */}
      <section id="library" className="border-t border-line bg-panel">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-[42px] font-medium tracking-[-0.03em]">
                  {stat.value}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-2.5 border-t border-line pt-10">
            {LIBRARY_BRANDS.map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-line bg-canvas px-4 py-2 text-[14px] text-muted transition-colors hover:border-ink hover:text-ink"
              >
                {brand}
              </span>
            ))}
            <span className="rounded-full border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-muted-2">
              +42 more
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${SECTION} border-t border-line`}>
        <div className="mx-auto grid max-w-[1040px] gap-x-16 gap-y-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <h2 className="m-0 max-w-[9em] text-[38px] font-medium leading-[1.12] tracking-[-0.024em] lg:sticky lg:top-28 lg:self-start">
            Frequently asked questions
          </h2>
          <LandingFaq />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-ink text-canvas">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-12 px-6 py-24 sm:px-12">
          <div>
            <h2 className="m-0 mb-4 text-[46px] font-medium leading-[1.1] tracking-[-0.026em]">
              Stop scrolling brochures.
              <br />Start asking them.
            </h2>
            <p className="m-0 max-w-[34em] text-[17px] text-[#9BA8B6]">
              Free while you research your next car. No card, no dealer
              follow-up.
            </p>
          </div>
          <Button
            variant="light"
            className="px-[34px] py-4 text-[16px]"
            onClick={() => navigate("/register")}
          >
            Create account
          </Button>
        </div>
        <div className="border-t border-shell">
          <div className="mx-auto flex max-w-[1440px] justify-between px-6 py-[22px] font-mono text-[11px] uppercase tracking-[0.1em] text-muted-2 sm:px-12">
            <span>{BRAND_NAME} © 2026</span>
            <span>Privacy · Terms · Contact</span>
          </div>
        </div>
      </section>
    </div>
  );
}
