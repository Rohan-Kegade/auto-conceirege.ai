import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { BRAND_NAME } from "../../lib/brand";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const COPY = {
  login: {
    kicker: "Welcome back",
    title: `Sign in to ${BRAND_NAME}.`,
    sub: "Your chats, uploads and saved comparisons are where you left them.",
    cta: "Sign in",
    alt: "Create a new account",
  },
  register: {
    kicker: "Create your account",
    title: "Research without the guesswork.",
    sub: "Free while you're shopping. Your uploads stay private to your account.",
    cta: "Create account",
    alt: "I already have an account",
  },
} satisfies Record<Mode, Record<string, string>>;

function Field({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-label">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="rounded-[10px] border border-stroke bg-canvas px-[15px] py-[13px] text-[15px] outline-none focus:border-accent"
      />
    </label>
  );
}

export function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const copy = COPY[mode];

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => setError(""), [mode]);

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const submit = () => {
    if (isRegister && !form.name.trim()) {
      return setError("Tell us your name so answers can be addressed to you.");
    }
    if (!EMAIL_RE.test(form.email)) {
      return setError("That email doesn't look right.");
    }
    if (form.password.length < 8) {
      return setError("Passwords need at least 8 characters.");
    }
    navigate("/app");
  };

  return (
    <div
      data-screen="auth"
      data-mode={mode}
      className="grid min-h-screen bg-canvas md:grid-cols-[0.9fr_1.1fr]"
    >
      {/* Left — brand / testimonial panel */}
      <aside className="hidden flex-col justify-between bg-ink p-12 text-canvas md:flex">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-baseline gap-2.5 bg-transparent text-left"
        >
          <span className="text-[19px] font-semibold">{BRAND_NAME}</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-2">
            back to site
          </span>
        </button>

        <div>
          <p className="m-0 mb-[22px] max-w-[22em] text-[30px] font-normal leading-[1.28] tracking-[-0.02em]">
            &ldquo;The safety-kit gap between two trims was buried in a footnote.
            It found it in four seconds.&rdquo;
          </p>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-2">
            R. Alvarez · shopping a compact SUV
          </div>
        </div>

        <div className="flex gap-[26px] font-mono text-[11px] uppercase tracking-[0.1em] text-muted-2">
          <span>1,240 brochures</span>
          <span>62 marques</span>
        </div>
      </aside>

      {/* Right — form */}
      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[420px]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-8 flex cursor-pointer items-baseline gap-2.5 bg-transparent md:hidden"
          >
            <span className="text-[17px] font-semibold">{BRAND_NAME}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-2">
              back to site
            </span>
          </button>

          <div className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {copy.kicker}
          </div>
          <h1 className="m-0 mb-3 text-[38px] font-medium leading-[1.12] tracking-[-0.024em]">
            {copy.title}
          </h1>
          <p className="m-0 mb-[34px] text-[15.5px] leading-[1.6] text-slate">
            {copy.sub}
          </p>

          <div className="flex flex-col gap-[18px]">
            {isRegister ? (
              <Field
                label="Full name"
                value={form.name}
                placeholder="Riya Alvarez"
                onChange={set("name")}
              />
            ) : null}
            <Field
              label="Email"
              value={form.email}
              placeholder="you@email.com"
              onChange={set("email")}
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              placeholder="At least 8 characters"
              onChange={set("password")}
            />

            {error ? (
              <div className="rounded-[9px] border border-danger-border bg-danger-bg px-[13px] py-2.5 text-[13.5px] text-danger">
                {error}
              </div>
            ) : null}

            <Button
              variant="solid"
              className="mt-1.5 w-full py-[15px] text-[15.5px]"
              onClick={submit}
            >
              {copy.cta}
            </Button>

            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-3">
                or
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <button
              type="button"
              onClick={() => navigate(isRegister ? "/login" : "/register")}
              className="w-full cursor-pointer rounded-[10px] border border-stroke bg-transparent py-3.5 text-[15px] transition-colors hover:border-ink"
            >
              {copy.alt}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
