import { Outlet, useLocation } from "react-router-dom";
import { AppStoreProvider, useApp } from "./AppStore";
import { ChatsSidebar } from "./ChatsSidebar";

function TopBar() {
  const { activeChat } = useApp();
  const { pathname } = useLocation();

  const title =
    pathname === "/app/profile"
      ? "Profile"
      : pathname === "/app/settings"
        ? "Settings"
        : activeChat.title;

  return (
    <header className="flex h-[53px] flex-none items-center border-b border-line bg-canvas px-7">
      <span className="truncate text-[15px] font-medium">{title}</span>
    </header>
  );
}

export function AppLayout() {
  return (
    <AppStoreProvider>
      <div
        data-screen="app"
        className="grid h-screen grid-cols-1 overflow-hidden bg-canvas md:grid-cols-[248px_1fr]"
      >
        <div className="hidden min-h-0 md:block">
          <ChatsSidebar />
        </div>
        <main className="flex min-h-0 min-w-0 flex-col">
          <TopBar />
          <Outlet />
        </main>
      </div>
    </AppStoreProvider>
  );
}

