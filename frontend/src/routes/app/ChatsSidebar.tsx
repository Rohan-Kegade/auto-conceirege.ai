import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../../lib/brand";
import { useApp, type Chat } from "./AppStore";
import { SHORT, type Upload } from "./appData";

const MONO_LABEL =
  "font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-2";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "RA";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

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
  const { user, activeChatId, uploads } = state;

  const [chatQuery, setChatQuery] = useState("");
  const q = chatQuery.trim().toLowerCase();
  const shown = q
    ? chats.filter((c) => c.title.toLowerCase().includes(q))
    : chats;

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-line bg-panel">
      <div className="flex h-[53px] flex-none items-center px-5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="cursor-pointer bg-transparent text-[20px] font-semibold tracking-[-0.01em]"
        >
          {BRAND_NAME}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3 pt-1">
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
                    className={`flex flex-col gap-0.5 rounded-lg border-l-2 py-2 pl-2.5 pr-2 text-left transition-colors ${
                      active
                        ? "border-accent bg-panel-hover font-medium text-ink ring-1 ring-inset ring-line"
                        : "border-transparent text-label hover:bg-panel-hover"
                    }`}
                  >
                    <span className="truncate text-[13.5px]">{chat.title}</span>
                    <span
                      className={`truncate font-mono text-[10px] uppercase tracking-[0.04em] ${
                        active ? "text-accent" : "text-muted-3"
                      }`}
                    >
                      {contextSummary(chat.selected, uploads)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Account */}
      <div className="flex flex-none items-center gap-2 border-t border-line bg-panel px-3 py-3">
        <button
          type="button"
          onClick={() => navigate("/app/profile")}
          title="Profile"
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 text-left transition-colors hover:bg-panel-hover"
        >
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent text-[11.5px] font-medium text-canvas">
            {initials(user.name)}
          </span>
          <span className="truncate text-[13.5px] font-medium">{user.name}</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/app/settings")}
          aria-label="Settings"
          title="Settings"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-stroke text-muted-2 transition-colors hover:border-ink hover:text-ink"
        >
          <GearIcon />
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Sign out"
          title="Sign out"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-stroke text-danger transition-colors hover:bg-danger-bg"
        >
          <SignOutIcon />
        </button>
      </div>
    </aside>
  );
}

function GearIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none"
      aria-hidden="true"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
