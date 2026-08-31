type Props = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: Props) {
  return (
    <div data-screen="auth" data-mode={mode} className="min-h-screen bg-canvas">
      {/* Built in the "auth page" commit. */}
    </div>
  );
}
