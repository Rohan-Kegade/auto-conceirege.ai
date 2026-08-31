import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div data-screen="app" className="h-screen overflow-hidden bg-canvas">
      {/* Sidebar + header chrome built in the "app shell" commit. */}
      <Outlet />
    </div>
  );
}
