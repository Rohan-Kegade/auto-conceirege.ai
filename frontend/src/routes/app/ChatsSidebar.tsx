import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, type Chat } from "./AppStore";
import { SHORT, type Upload } from "./appData";

const MONO_LABEL =
  "font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-2";

/** Names the brochures in a chat's context, collapsing to a count past two. */
function contextSummary(ids: string[], uploads: Upload[]): string {
  if (ids.length === 0) return "no context";
  if (ids.length > 2) return `${ids.length} brochures`;
  return ids
    .map((id) => SHORT[id] ?? uploads.find((u) => u.id === id)?.name ?? "Upload")
    .join(" · ");
}

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "Today" / "Yesterday" / a short date, for grouping chats by creation day. */
function dayBucket(iso: string): string {
  const then = new Date(iso);
  const diff = Math.round(
    (startOfDay(new Date()) - startOfDay(then)) / 86_400_000,
  );
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return then.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Chats in list order, split into day groups (order of first appearance). */
function groupByDay(chats: Chat[]): { label: string; items: Chat[] }[] {
  const groups: { label: string; items: Chat[] }[] = [];
  for (const chat of chats) {
    const label = dayBucket(chat.createdAt);
    const group = groups.find((g) => g.label === label);
    if (group) group.items.push(chat);
    else groups.push({ label, items: [chat] });
  }
  return groups;
}

export function ChatsSidebar() {
  const navigate = useNavigate();
  const { state, chats, newChat, selectChat } = useApp();
  const { activeChatId, uploads } = state;

  const [chatQuery, setChatQuery] = useState("");
  const q = chatQuery.trim().toLowerCase();
  const shown = q
    ? chats.filter((c) => c.title.toLowerCase().includes(q))
    : chats;

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-line bg-panel">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3 pt-3">
        <div className="px-2 pb-2">
          <input
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full rounded-lg border border-stroke bg-canvas px-3 py-1.5 text-[12.5px] outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-2 pb-1">
          <span className={MONO_LABEL}>Recent chats</span>
          <button
            type="button"
            onClick={() => {
              newChat();
              navigate("/app");
            }}
            aria-label="New chat"
            title="New chat"
            className="flex h-5 w-5 flex-none cursor-pointer items-center justify-center rounded-md border border-stroke bg-canvas text-[13px] leading-none text-muted transition-colors hover:border-ink hover:text-ink"
          >
            +
          </button>
        </div>
        {shown.length === 0 ? (
          <div className="px-2 py-2 text-[12.5px] text-muted-3">
            No chats match “{chatQuery}”.
          </div>
        ) : null}
        {groupByDay(shown).map((group) => (
          <div key={group.label} className="flex flex-col">
            <div className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-3">
              {group.label}
            </div>
            <div className="flex flex-col gap-1 pl-3">
              {group.items.map((chat) => {
                const active = chat.id === activeChatId;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => {
                      selectChat(chat.id);
                      navigate("/app");
                    }}
                    className={`flex flex-col gap-0.5 rounded-lg px-2 py-2 text-left transition-colors ${
                      active
                        ? "bg-panel-hover text-ink"
                        : "text-label hover:bg-panel-hover"
                    }`}
                  >
                    <span className="truncate text-[13.5px]">{chat.title}</span>
                    <span className="truncate font-mono text-[10px] uppercase tracking-[0.04em] text-muted-3">
                      {contextSummary(chat.selected, uploads)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
