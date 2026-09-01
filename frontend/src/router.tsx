import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "./routes/landing/LandingPage";
import { AuthPage } from "./routes/auth/AuthPage";
import { AppLayout } from "./routes/app/AppLayout";
import { ChatView } from "./routes/app/ChatView";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  {
    path: "/app",
    element: <AppLayout />,
    children: [{ index: true, element: <ChatView /> }],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
