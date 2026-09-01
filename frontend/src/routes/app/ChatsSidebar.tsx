import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const q = chatQuery.trim().toLowerCase();
  const shown = q
    ? chats.filter((c) => c.title.toLowerCase().includes(q))
    : chats;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const goto = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

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
      <div className="relative flex-none border-t border-line bg-panel px-3 py-3">
        {menuOpen ? (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div
              role="menu"
              className="absolute inset-x-3 bottom-full z-20 mb-1.5 overflow-hidden rounded-xl border border-line bg-canvas py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => goto("/app/profile")}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink transition-colors hover:bg-panel-hover"
              >
                <UserIcon />
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => goto("/app/settings")}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink transition-colors hover:bg-panel-hover"
              >
                <GearIcon />
                Settings
              </button>
              <div className="my-1 border-t border-line-soft" />
              <button
                type="button"
                role="menuitem"
                onClick={() => goto("/")}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-danger transition-colors hover:bg-danger-bg"
              >
                <SignOutIcon />
                Sign out
              </button>
            </div>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex w-full items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 text-left transition-colors hover:bg-panel-hover"
        >
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink text-[11.5px] font-medium text-canvas">
            {initials(user.name)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13.5px] font-medium text-ink">
              {user.name}
            </span>
            <span className="truncate text-[11.5px] text-muted-2">
              {user.email}
            </span>
          </span>
          <ChevronIcon
            className={`flex-none text-muted-2 transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function UserIcon() {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
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
