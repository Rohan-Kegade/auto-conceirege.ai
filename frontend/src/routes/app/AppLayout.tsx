import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppStoreProvider, useApp } from "./AppStore";
import { ChatsSidebar, contextSummary } from "./ChatsSidebar";
import { ProfileView } from "./ProfileView";
import {
  AccountSettings,
  ChatSettings,
  NotificationSettings,
} from "./SettingsView";

/** Sections of the Settings modal — also its left-rail tabs. */
export type SettingsTab = "profile" | "chat" | "notifications" | "account";

function TopBar() {
  const { state, activeChat, setChatSearch, deleteChat, renameChat } = useApp();
  const navigate = useNavigate();

  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

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
              {activeChat.title}
            </span>
          )}
          {!renaming ? (
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
        <span className="truncate pl-2 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-3">
          {contextSummary(activeChat.selected, state.uploads)}
        </span>
      </div>

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
    </header>
  );
}

const SETTINGS_TABS: Array<{
  id: SettingsTab;
  label: string;
  icon: ReactNode;
}> = [
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "chat", label: "Chat", icon: <ChatDotsIcon /> },
  { id: "notifications", label: "Notifications", icon: <BellIcon /> },
  { id: "account", label: "Account", icon: <ShieldIcon /> },
];

function SettingsOverlay({
  tab,
  onTabChange,
  onClose,
}: {
  tab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-shell/35 p-4 backdrop-blur-[1.5px]"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onClick={onClose}
    >
      <div
        className="relative flex h-[80vh] max-h-[640px] w-full max-w-[800px] overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tab rail */}
        <nav className="flex w-[150px] flex-none flex-col gap-0.5 border-r border-line bg-panel p-3 sm:w-[196px]">
          <div className="px-2 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-3">
            Settings
          </div>
          {SETTINGS_TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors ${
                  active
                    ? "bg-accent-tint font-medium text-accent-deep"
                    : "text-label hover:bg-panel-hover"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 flex-none items-center justify-between border-b border-line px-6">
            <span className="text-[15px] font-semibold tracking-[-0.01em]">
              {SETTINGS_TABS.find((t) => t.id === tab)?.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-2 transition-colors hover:bg-panel-hover hover:text-ink"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 text-[13px]">
            <div className="mx-auto max-w-[520px]">
              {tab === "profile" ? (
                <ProfileView />
              ) : tab === "chat" ? (
                <ChatSettings />
              ) : tab === "notifications" ? (
                <NotificationSettings />
              ) : (
                <AccountSettings />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab | null>(null);

  return (
    <AppStoreProvider>
      <div data-screen="app" className="flex h-screen overflow-hidden bg-canvas">
        <div
          className={`hidden min-h-0 flex-none overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none md:block ${
            collapsed ? "md:w-14" : "md:w-[248px]"
          }`}
        >
          <ChatsSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
            onOpenSettings={setSettingsTab}
          />
        </div>
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopBar />
          <Outlet />
        </main>
      </div>

      {settingsTab ? (
        <SettingsOverlay
          tab={settingsTab}
          onTabChange={setSettingsTab}
          onClose={() => setSettingsTab(null)}
        />
      ) : null}
    </AppStoreProvider>
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

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
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

function ChatDotsIcon() {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function BellIcon() {
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
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </svg>
  );
}

function ShieldIcon() {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
