import { useState } from "react";
import type { ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppStoreProvider, useApp } from "./AppStore";
import { ChatsSidebar, contextSummary } from "./ChatsSidebar";

function TopBar() {
  const { state, activeChat, setChatSearch, deleteChat, renameChat } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const isChat = pathname !== "/app/profile" && pathname !== "/app/settings";
  const title =
    pathname === "/app/profile"
      ? "Profile"
      : pathname === "/app/settings"
        ? "Settings"
        : activeChat.title;

  const startRename = () => {
    setNameDraft(activeChat.title);
    setRenaming(true);
  };
  const commitRename = () => {
    renameChat(activeChat.id, nameDraft);
    setRenaming(false);
  };

  return (
    <header className="flex h-16 flex-none items-center gap-4 border-b border-line bg-canvas px-7">
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          {renaming ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              className="min-w-0 flex-1 rounded-md border border-stroke bg-canvas px-2 py-0.5 text-[15px] font-medium outline-none focus:border-accent"
            />
          ) : (
            <span className="truncate text-[15px] font-medium leading-tight">
              {title}
            </span>
          )}
          {isChat && !renaming ? (
            <button
              type="button"
              onClick={startRename}
              aria-label="Rename chat"
              title="Rename chat"
              className="flex-none cursor-pointer bg-transparent p-1 text-muted-3 transition-colors hover:text-ink"
            >
              <PencilIcon />
            </button>
          ) : null}
        </div>
        {isChat ? (
          <span className="truncate pl-2 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-3">
            {contextSummary(activeChat.selected, state.uploads)}
          </span>
        ) : null}
      </div>

      {isChat ? (
        <div className="ml-auto flex flex-none items-center gap-2">
          <div className="flex w-[220px] items-center gap-2 rounded-lg border border-stroke bg-canvas px-3 focus-within:border-accent">
            <SearchIcon />
            <input
              value={state.chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search in chat"
              className="w-full bg-transparent py-1.5 text-[12.5px] outline-none"
            />
            {state.chatSearch ? (
              <button
                type="button"
                onClick={() => setChatSearch("")}
                aria-label="Clear search"
                className="flex-none cursor-pointer bg-transparent font-mono text-[13px] leading-none text-muted-3 transition-colors hover:text-ink"
              >
                ×
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              deleteChat(activeChat.id);
              navigate("/app");
            }}
            aria-label="Delete chat"
            title="Delete chat"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-stroke text-muted-2 transition-colors hover:border-danger hover:bg-danger-bg hover:text-danger"
          >
            <TrashIcon />
          </button>
        </div>
      ) : null}
    </header>
  );
}

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
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
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none text-muted-3"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const NAV = [
  { to: "/app", label: "Chats", icon: <ChatIcon /> },
  { to: "/app/profile", label: "Profile", icon: <UserIcon /> },
];

function ActivityRail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const item = (to: string, label: string, icon: ReactNode) => {
    const active = pathname === to;
    return (
      <button
        key={to}
        type="button"
        onClick={() => navigate(to)}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        title={label}
        className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl transition-colors ${
          active
            ? "bg-accent-tint text-accent-deep"
            : "text-muted-2 hover:bg-panel-hover hover:text-ink"
        }`}
      >
        {icon}
      </button>
    );
  };

  return (
    <nav className="hidden w-14 flex-none flex-col items-center gap-1 border-r border-line bg-panel py-3 md:flex">
      {NAV.map((n) => item(n.to, n.label, n.icon))}
      <div className="mt-auto">{item("/app/settings", "Settings", <GearIcon />)}</div>
    </nav>
  );
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppStoreProvider>
      <div
        data-screen="app"
        className="flex h-screen overflow-hidden bg-canvas"
      >
        <ActivityRail />
        <div
          className={`hidden min-h-0 flex-none overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none md:block ${
            collapsed ? "md:w-14" : "md:w-[248px]"
          }`}
        >
          <ChatsSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
          />
        </div>
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar />
          <Outlet />
        </main>
      </div>
    </AppStoreProvider>
  );
}

function ChatIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
