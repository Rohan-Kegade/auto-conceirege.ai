import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "./routes/landing/LandingPage";
import { AuthPage } from "./routes/auth/AuthPage";
import { AppLayout } from "./routes/app/AppLayout";
import { ChatView } from "./routes/app/ChatView";
import { ProfileView } from "./routes/app/ProfileView";
import { SettingsView } from "./routes/app/SettingsView";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <ChatView /> },
      { path: "profile", element: <ProfileView /> },
      { path: "settings", element: <SettingsView /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
