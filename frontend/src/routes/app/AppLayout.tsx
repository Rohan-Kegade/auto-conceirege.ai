import { Outlet, useLocation } from "react-router-dom";
import { AppStoreProvider, useApp } from "./AppStore";
import { ChatsSidebar } from "./ChatsSidebar";
import { ContextPanel } from "./ContextPanel";

function Header() {
  const { activeChat, selected } = useApp();
  const { pathname } = useLocation();

  const title =
    pathname === "/app/profile"
      ? "Profile"
      : pathname === "/app/settings"
        ? "Settings"
        : activeChat.title;

  return (
    <header className="flex h-[53px] flex-none items-center gap-3 border-b border-line bg-canvas px-7">
      <span className="truncate text-[15px] font-medium">{title}</span>
      <span className="flex-none whitespace-nowrap rounded-full border border-line px-[9px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-2">
        {selected.length} {selected.length === 1 ? "source" : "sources"}
      </span>
    </header>
  );
}

export function AppLayout() {
  return (
    <AppStoreProvider>
      <div
        data-screen="app"
        className="grid h-screen grid-cols-1 overflow-hidden bg-canvas md:grid-cols-[248px_1fr] lg:grid-cols-[248px_1fr_340px]"
      >
        <div className="hidden min-h-0 md:block">
          <ChatsSidebar />
        </div>
        <main className="flex min-h-0 min-w-0 flex-col">
          <Header />
          <Outlet />
        </main>
        <div className="hidden min-h-0 lg:block">
          <ContextPanel />
        </div>
      </div>
    </AppStoreProvider>
  );
}
