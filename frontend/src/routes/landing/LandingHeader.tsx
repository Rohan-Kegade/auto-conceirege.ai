import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Wordmark } from "../../components/Wordmark";

export function LandingHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-[5] flex flex-wrap items-center justify-between gap-5 border-b border-line bg-canvas/90 px-6 py-[22px] backdrop-blur-md sm:px-12">
      <Wordmark />
      <nav className="flex flex-wrap items-center justify-end gap-7">
        <a href="#how-it-works" className="text-sm text-muted hover:text-ink">
          How it works
        </a>
        <a href="#library" className="text-sm text-muted hover:text-ink">
          Library
        </a>
        <a href="#faq" className="text-sm text-muted hover:text-ink">
          FAQ
        </a>
        <Button
          variant="outline"
          className="px-[18px] py-[9px] text-sm"
          onClick={() => navigate("/login")}
        >
          Sign in
        </Button>
        <Button
          className="px-5 py-2.5 text-sm"
          onClick={() => navigate("/register")}
        >
          Create account
        </Button>
      </nav>
    </header>
  );
}
