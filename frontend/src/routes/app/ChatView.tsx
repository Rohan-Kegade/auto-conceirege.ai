import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CitationChip } from "../../components/CitationChip";
import { Logo } from "../../components/Logo";
import { BRAND_NAME } from "../../lib/brand";
import { useApp } from "./AppStore";
import { ContextPanel } from "./ContextPanel";
import { FOLLOW_UPS, SUGGESTIONS, type ChatMessage } from "./appData";

const MONO = "font-mono uppercase tracking-[0.1em]";

const SUGGESTION_ICONS = [CompareIcon, GaugeIcon, ShieldIcon, PackageIcon];

function EmptyState({
  userName,
  locked,
  onPick,
}: {
  userName: string;
  locked: boolean;
  onPick: (text: string) => void;
}) {
  const firstName = userName.trim().split(/\s+/)[0] || "there";
  return (
    <div className="mx-auto flex min-h-[66vh] max-w-[660px] flex-col items-center justify-center text-center">
      <Logo size={48} />
      <div className={`mt-4 text-[10.5px] tracking-[0.18em] text-muted-3 ${MONO}`}>
        {BRAND_NAME}
      </div>
      <h2 className="m-0 mt-3 bg-gradient-to-r from-accent to-accent-deep bg-clip-text text-[40px] font-medium leading-[1.12] tracking-[-0.022em] text-transparent [text-wrap:balance]">
        Hello, {firstName}
      </h2>
      <p className="m-0 mt-3 max-w-[30em] text-[16px] leading-[1.6] text-slate [text-wrap:pretty]">
        {locked
          ? "Add a car brochure to this chat from the panel on the right to start asking. Every answer cites the brochure pages it draws from."
          : "Ask anything about the brochures in this chat — every answer cites the pages it draws from."}
      </p>
      <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((text, i) => {
          const Icon = SUGGESTION_ICONS[i % SUGGESTION_ICONS.length];
          return (
            <button
              key={text}
              type="button"
              disabled={locked}
              onClick={() => onPick(text)}
              className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-canvas p-3.5 text-left transition-colors hover:border-accent hover:bg-panel-tint disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-canvas"
            >
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-panel text-muted-2 transition-colors group-hover:text-accent group-disabled:text-muted-2">
                <Icon />
              </span>
              <span className="text-[13.5px] leading-[1.4]">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function CompareIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 19V5M20 19V5M9 15V9M15 18V6" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 14 8 9" />
      <path d="M4 18a8 8 0 1 1 16 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  );
}

function BotMessage({
  message,
}: {
  message: Extract<ChatMessage, { role: "bot" }>;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2.5">
        <Logo size={20} />
        <span className={`text-[10.5px] tracking-[0.12em] text-muted ${MONO}`}>
          {message.retrieval}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 pl-[30px]">
        {message.paras.map((para, i) => (
          <div key={i} className="text-[15.5px] leading-[1.68] text-ink">
            {para.text}
            {para.cites.map((c, j) => (
              <CitationChip key={j} className="ml-1.5">
                {c.label}
              </CitationChip>
            ))}
          </div>
        ))}

        {message.table ? (
          <div className="overflow-x-auto rounded-[13px] border border-line bg-canvas">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-line bg-canvas px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
                {message.table.cols.map((col) => (
                  <span key={col}>{col}</span>
                ))}
              </div>
              {message.table.rows.map((row) => (
                <div
                  key={row[0]}
                  className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-line-soft px-4 py-[11px] text-[14px] text-ink first:border-t-0"
                >
                  {row.map((cell, k) => (
                    <span key={k} className={k === 0 ? "text-label" : undefined}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {message.sources.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span
              className={`text-[10.5px] tracking-[0.1em] text-muted-2 ${MONO}`}
            >
              sources
            </span>
            {message.sources.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="rounded-full border border-line bg-canvas px-[11px] py-1 text-[12.5px] text-label"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Composer() {
  const { state, messages, selected, setDraft, send } = useApp();
  const { draft, thinking } = state;
  const ref = useRef<HTMLTextAreaElement>(null);
  const showFollowUps = messages.length > 0 && !thinking;
  const noContext = selected.length === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!noContext) send();
    }
  };

  return (
    <div className="bg-canvas px-7 pb-7 pt-3">
      <div className="mx-auto max-w-[920px]">
        {showFollowUps && !noContext ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {FOLLOW_UPS.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[12.5px] text-label transition-colors hover:border-accent hover:text-ink"
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex items-end gap-2 rounded-xl border border-stroke bg-canvas p-2 pl-4 focus-within:border-accent">
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            placeholder={
              noContext
                ? "Add a brochure to the context to start asking…"
                : "Ask about trims, features, warranty, running costs…"
            }
            className="block max-h-[120px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-5 outline-none"
          />
          <button
            type="button"
            onClick={() => send()}
            disabled={noContext}
            aria-label="Send"
            className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-lg bg-ink text-canvas transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
          >
            <svg
              width="16"
              height="16"
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
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatView() {
  const { state, messages, selected, send } = useApp();
  const { thinking, thinkingLabel, user } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [ctxCollapsed, setCtxCollapsed] = useState(false);
  const isEmpty = messages.length === 0 && !thinking;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, thinkingLabel]);

  return (
    <div data-view="chat" className="flex min-h-0 flex-1">
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-7 pb-12 pt-[30px]"
        >
          <div className="mx-auto flex max-w-[920px] flex-col gap-[26px]">
            {isEmpty ? (
              <EmptyState
                userName={user.name}
                locked={selected.length === 0}
                onPick={(text) => send(text)}
              />
            ) : null}

            {messages.map((message, i) =>
              message.role === "user" ? (
                <div key={i} className="flex flex-col gap-3">
                  <div className="max-w-[74%] self-end rounded-[22px] rounded-br-md bg-panel px-[18px] py-3 text-[15px] leading-[1.55] text-ink ring-1 ring-inset ring-line">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col gap-3">
                  <BotMessage message={message} />
                </div>
              ),
            )}

            {thinking ? (
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent [animation:pulseDot_1.1s_ease-in-out_infinite]" />
                <span className="font-mono text-[11.5px] tracking-[0.08em] text-muted">
                  {thinkingLabel}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <Composer />
      </div>

      <aside
        className={`hidden flex-none overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:flex ${
          ctxCollapsed ? "w-[52px]" : "w-[312px]"
        }`}
      >
        <ContextPanel
          collapsed={ctxCollapsed}
          onToggle={() => setCtxCollapsed((v) => !v)}
        />
      </aside>
    </div>
  );
}
