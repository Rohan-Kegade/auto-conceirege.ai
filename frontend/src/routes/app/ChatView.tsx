import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { CitationChip } from "../../components/CitationChip";
import { useApp } from "./AppStore";
import { ContextPanel } from "./ContextPanel";
import { FOLLOW_UPS, SUGGESTIONS, type ChatMessage } from "./appData";

const MONO = "font-mono uppercase tracking-[0.1em]";

function EmptyState({
  selectedCount,
  onPick,
}: {
  selectedCount: number;
  onPick: (text: string) => void;
}) {
  return (
    <div className="pb-2.5 pt-[46px]">
      <div className={`mb-5 text-[11px] tracking-[0.16em] text-accent ${MONO}`}>
        {selectedCount ? `${selectedCount} brochures in context` : "no sources yet"}
      </div>
      <h2 className="m-0 mb-3.5 text-[34px] font-medium leading-[1.16] tracking-[-0.022em]">
        What are you weighing up?
      </h2>
      <p className="m-0 mb-[30px] max-w-[34em] text-[16.5px] leading-[1.6] text-slate [text-wrap:pretty]">
        Pick brochures from the library on the left, or upload your own. Then ask
        anything — specs, trims, running costs, what the footnotes hide.
      </p>
      <div className="flex max-w-[560px] flex-col gap-[9px]">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onPick(text)}
            className="flex cursor-pointer justify-between gap-3.5 rounded-[11px] border border-line bg-canvas px-4 py-[13px] text-left text-[14.5px] transition-colors hover:border-accent"
          >
            <span>{text}</span>
            <span className="flex-none font-mono text-[11px] text-muted-3">→</span>
          </button>
        ))}
      </div>
    </div>
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
        <span className="h-5 w-5 flex-none rounded-md bg-accent" />
        <span className={`text-[10.5px] tracking-[0.12em] text-muted-2 ${MONO}`}>
          {message.retrieval}
        </span>
      </div>

      {message.paras.map((para, i) => (
        <div key={i} className="text-[15.5px] leading-[1.68] text-ink-soft">
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
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-line bg-canvas px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
              {message.table.cols.map((col) => (
                <span key={col}>{col}</span>
              ))}
            </div>
            {message.table.rows.map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-line-soft px-4 py-[11px] text-[14px] first:border-t-0"
              >
                {row.map((cell, k) => (
                  <span key={k} className={k === 0 ? "text-muted" : undefined}>
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
            className={`text-[10.5px] tracking-[0.1em] text-muted-3 ${MONO}`}
          >
            sources
          </span>
          {message.sources.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="rounded-full border border-line bg-canvas px-[11px] py-1 text-[12.5px] text-muted"
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Composer() {
  const { state, messages, setDraft, send } = useApp();
  const { draft, thinking } = state;
  const ref = useRef<HTMLTextAreaElement>(null);
  const showFollowUps = messages.length > 0 && !thinking;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-line bg-canvas px-7 pb-4 pt-3">
      <div className="mx-auto max-w-[1040px]">
        {showFollowUps ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {FOLLOW_UPS.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:border-accent hover:text-ink"
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex items-end gap-2.5 rounded-xl border border-stroke bg-canvas py-1.5 pl-4 pr-1.5 focus-within:border-accent">
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            placeholder="Ask about trims, features, warranty, running costs…"
            className="max-h-[120px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-[1.4] outline-none"
          />
          <button
            type="button"
            onClick={() => send()}
            aria-label="Send"
            className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-lg bg-ink text-canvas transition-colors hover:bg-accent-deep"
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
  const { thinking, thinkingLabel } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
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
          className="flex-1 overflow-y-auto px-7 pb-2.5 pt-[30px]"
        >
          <div className="mx-auto flex max-w-[780px] flex-col gap-[26px]">
            {isEmpty ? (
              <EmptyState
                selectedCount={selected.length}
                onPick={(text) => send(text)}
              />
            ) : null}

            {messages.map((message, i) =>
              message.role === "user" ? (
                <div key={i} className="flex flex-col gap-3">
                  <div className="max-w-[74%] self-end rounded-[15px_15px_5px_15px] border border-line bg-panel px-[17px] py-[13px] text-[15px] leading-[1.55]">
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
                <span className="font-mono text-[11.5px] tracking-[0.08em] text-muted-2">
                  {thinkingLabel}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <Composer />
      </div>

      <aside className="hidden w-[312px] flex-none lg:flex">
        <ContextPanel />
      </aside>
    </div>
  );
}
