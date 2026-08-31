import { Outlet, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../../lib/brand";
import { AppStoreProvider, useApp } from "./AppStore";
import { ChatsSidebar } from "./ChatsSidebar";
import { ContextPanel } from "./ContextPanel";

function TopBar() {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <header className="flex h-[53px] flex-none items-center justify-between border-b border-line bg-canvas px-7">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="cursor-pointer bg-transparent text-[17px] font-semibold"
      >
        {BRAND_NAME}
      </button>

      <div className="flex items-center gap-4">
        <span className="truncate text-[13.5px] font-medium">
          {state.user.name}
        </span>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-lg border border-stroke px-3 py-1.5 text-[13px] text-danger transition-colors hover:bg-danger-bg"
        >
          <SignOutIcon />
          Sign out
        </button>
      </div>
    </header>
  );
}

export function AppLayout() {
  return (
    <AppStoreProvider>
      <div
        data-screen="app"
        className="flex h-screen flex-col overflow-hidden bg-canvas"
      >
        <TopBar />
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[248px_1fr] lg:grid-cols-[248px_1fr_340px]">
          <div className="hidden min-h-0 md:block">
            <ChatsSidebar />
          </div>
          <main className="flex min-h-0 min-w-0 flex-col">
            <Outlet />
          </main>
          <div className="hidden min-h-0 lg:block">
            <ContextPanel />
          </div>
        </div>
      </div>
    </AppStoreProvider>
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
