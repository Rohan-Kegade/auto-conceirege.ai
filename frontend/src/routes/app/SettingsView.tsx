import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { isStarted, useApp, type AnswerStyle, type Prefs } from "./AppStore";

const ANSWER_STYLES: Array<[AnswerStyle, string]> = [
  ["concise", "Concise — just the answer and its citations"],
  ["balanced", "Balanced — a short explanation with the figures"],
  ["detailed", "Detailed — full comparison with tables"],
];

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex min-w-0 flex-col">
        <span className="text-[13px] font-medium">{title}</span>
        <span className="mt-0.5 text-[11.5px] leading-[1.5] text-muted-2">
          {desc}
        </span>
      </div>
      <div className="flex-none pt-0.5">{children}</div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-[22px] w-[38px] flex-none cursor-pointer rounded-full transition-colors ${
        on ? "bg-accent" : "bg-stroke"
      }`}
    >
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-canvas transition-[left] ${
          on ? "left-[19px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-label">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[9px] border border-stroke bg-canvas px-3 py-2 text-[13px] outline-none focus:border-accent"
      />
    </label>
  );
}

function Section({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-line pt-5">
      <div
        className={`font-mono text-[10.5px] uppercase tracking-[0.16em] ${
          accent ? "text-accent" : "text-muted-3"
        }`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

/** Wrapper for a settings tab — drops the leading section's top rule. */
function TabBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 [&>*:first-child]:border-t-0 [&>*:first-child]:pt-0">
      {children}
    </div>
  );
}

/** Chat & answer behaviour, plus clearing conversation history. */
export function ChatSettings() {
  const { state, chats, setPrefs, clearChats } = useApp();
  const { prefs } = state;

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs({ [key]: value } as Partial<Prefs>);

  const startedCount = chats.filter(isStarted).length;
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <TabBody>
      <Section label="Answers" accent>
        <label className="flex flex-col gap-1.5 py-1">
          <span className="text-[13px] font-medium">Answer style</span>
          <select
            value={prefs.answerStyle}
            onChange={(e) => set("answerStyle", e.target.value as AnswerStyle)}
            className="rounded-[9px] border border-stroke bg-canvas px-3 py-2 text-[13px] outline-none focus:border-accent"
          >
            {ANSWER_STYLES.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>

        <div className="divide-y divide-line-soft">
          <Row
            title="Always show citations"
            desc="Attach the source brochure and page to every figure in an answer."
          >
            <Toggle
              label="Always show citations"
              on={prefs.citationsAlways}
              onChange={(v) => set("citationsAlways", v)}
            />
          </Row>
          <Row
            title="Region-aware pricing"
            desc="Bias pricing, tax and availability answers to your profile region."
          >
            <Toggle
              label="Region-aware pricing"
              on={prefs.regionAware}
              onChange={(v) => set("regionAware", v)}
            />
          </Row>
          <Row
            title="Compact message density"
            desc="Tighter spacing between messages in the chat window."
          >
            <Toggle
              label="Compact message density"
              on={prefs.compactMessages}
              onChange={(v) => set("compactMessages", v)}
            />
          </Row>
        </div>
      </Section>

      <Section label="History">
        <Row
          title="Clear all chats"
          desc={`Removes all ${startedCount} conversations and starts a fresh one. Uploaded brochures stay in the library.`}
        >
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearChats();
                  setConfirmClear(false);
                }}
                className="cursor-pointer rounded-[9px] bg-danger px-3 py-1.5 text-[12.5px] font-medium text-canvas transition-colors hover:bg-danger-ink"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="cursor-pointer bg-transparent text-[12.5px] text-muted-2 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="cursor-pointer rounded-[9px] border border-stroke bg-canvas px-3 py-1.5 text-[12.5px] transition-colors hover:border-ink"
            >
              Clear
            </button>
          )}
        </Row>
      </Section>
    </TabBody>
  );
}

/** Email notification preferences. */
export function NotificationSettings() {
  const { state, setPrefs } = useApp();
  const { prefs } = state;

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs({ [key]: value } as Partial<Prefs>);

  return (
    <TabBody>
      <Section label="Notifications" accent>
        <div className="divide-y divide-line-soft">
          <Row
            title="Product updates"
            desc="Occasional email when new marques or features land."
          >
            <Toggle
              label="Product updates"
              on={prefs.productUpdates}
              onChange={(v) => set("productUpdates", v)}
            />
          </Row>
          <Row
            title="Weekly digest"
            desc="A summary of the brochures added to the library each week."
          >
            <Toggle
              label="Weekly digest"
              on={prefs.weeklyDigest}
              onChange={(v) => set("weeklyDigest", v)}
            />
          </Row>
        </div>
      </Section>
    </TabBody>
  );
}

/** Password, sign out and account deletion. */
export function AccountSettings() {
  const navigate = useNavigate();

  // --- Change password (UI-only in this build) ---
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (pwMsg?.kind !== "ok") return;
    const t = setTimeout(() => setPwMsg(null), 2400);
    return () => clearTimeout(t);
  }, [pwMsg]);

  const updatePassword = () => {
    if (!pw.current)
      return setPwMsg({ kind: "err", text: "Enter your current password." });
    if (pw.next.length < 8)
      return setPwMsg({
        kind: "err",
        text: "New password must be at least 8 characters.",
      });
    if (pw.next !== pw.confirm)
      return setPwMsg({ kind: "err", text: "New passwords don't match." });
    setPw({ current: "", next: "", confirm: "" });
    setPwMsg({ kind: "ok", text: "Password updated." });
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  return (
    <TabBody>
      <Section label="Security" accent>
        <div className="flex flex-col gap-4 pt-1">
          <Field
            label="Current password"
            type="password"
            value={pw.current}
            placeholder="••••••••"
            onChange={(v) => setPw((p) => ({ ...p, current: v }))}
          />
          <Field
            label="New password"
            type="password"
            value={pw.next}
            placeholder="At least 8 characters"
            onChange={(v) => setPw((p) => ({ ...p, next: v }))}
          />
          <Field
            label="Confirm new password"
            type="password"
            value={pw.confirm}
            placeholder="Re-enter the new password"
            onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
          />

          {pwMsg ? (
            <div
              className={`rounded-[9px] px-[13px] py-2.5 text-[13px] ${
                pwMsg.kind === "ok"
                  ? "border border-accent-line bg-accent-tint text-accent-deep"
                  : "border border-danger-border bg-danger-bg text-danger"
              }`}
            >
              {pwMsg.text}
            </div>
          ) : null}

          <Button
            variant="solid"
            className="w-fit px-4 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={updatePassword}
            disabled={!pw.current && !pw.next && !pw.confirm}
          >
            Update password
          </Button>
        </div>
      </Section>

      <Section label="Session">
        <Row
          title="Sign out"
          desc="End this session on this device. Your chats and uploads are kept."
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer rounded-[9px] border border-stroke bg-canvas px-3 py-1.5 text-[12.5px] transition-colors hover:border-ink"
          >
            Sign out
          </button>
        </Row>
      </Section>

      {/* Danger zone */}
      <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-danger-border bg-danger-bg-2 p-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-danger">
          Delete account
        </div>
        <p className="m-0 text-[12px] leading-[1.55] text-slate">
          Permanently removes your profile, chats and uploaded brochures. This
          can't be undone.
        </p>

        {confirmDelete ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-label">
                Type <span className="font-mono text-danger">DELETE</span> to
                confirm
              </span>
              <input
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="rounded-[9px] border border-danger-border bg-canvas px-3 py-2 text-[13px] outline-none focus:border-danger"
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={deleteText !== "DELETE"}
                onClick={() => navigate("/")}
                className="cursor-pointer rounded-[9px] bg-danger px-4 py-2 text-[13px] font-medium text-canvas transition-colors hover:bg-danger-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete my account
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteText("");
                }}
                className="cursor-pointer bg-transparent text-[12.5px] text-muted-2 transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="w-fit cursor-pointer rounded-[9px] border border-danger-stroke bg-canvas px-3.5 py-2 text-[12.5px] font-medium text-danger transition-colors hover:bg-danger-bg"
          >
            Delete account
          </button>
        )}
      </div>
    </TabBody>
  );
}
