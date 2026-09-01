import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { useApp } from "./AppStore";

const REGIONS = [
  "Australia",
  "United Kingdom",
  "United States",
  "India",
  "Germany",
  "Canada",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

type Form = {
  name: string;
  email: string;
  shoppingFor: string;
  region: string;
};

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
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-label">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-stroke bg-canvas px-[15px] py-3 text-[15px] outline-none focus:border-accent"
      />
    </label>
  );
}

export function ProfileView() {
  const navigate = useNavigate();
  const { state, chats, setUser } = useApp();
  const { user, uploads } = state;

  const [form, setForm] = useState<Form>(user);
  const [savedAt, setSavedAt] = useState(0);

  // Re-seed the form whenever the stored profile changes elsewhere.
  useEffect(() => {
    setForm(user);
  }, [user]);

  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(0), 2400);
    return () => clearTimeout(t);
  }, [savedAt]);

  const dirty = useMemo(
    () =>
      form.name !== user.name ||
      form.email !== user.email ||
      form.shoppingFor !== user.shoppingFor ||
      form.region !== user.region,
    [form, user],
  );

  const set = (key: keyof Form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const save = () => {
    setUser({
      name: form.name.trim() || user.name,
      email: form.email.trim(),
      shoppingFor: form.shoppingFor.trim(),
      region: form.region,
    });
    setSavedAt(Date.now());
  };

  const readyUploads = uploads.filter((u) => u.stage === "ready").length;

  const stats: Array<[string, number | string]> = [
    ["Chats", chats.length],
    ["Uploads indexed", readyUploads],
    ["Region", form.region || "—"],
  ];

  return (
    <div data-view="profile" className="flex-1 overflow-y-auto px-7 py-8">
      <div className="mx-auto flex max-w-[640px] flex-col gap-8">
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="flex w-fit cursor-pointer items-center gap-1.5 bg-transparent font-mono text-[11px] uppercase tracking-[0.12em] text-muted-3 transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to chats
        </button>

        {/* Identity header */}
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-ink text-[17px] font-semibold text-canvas">
            {initials(form.name || user.name)}
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="m-0 truncate text-[22px] font-semibold tracking-[-0.015em]">
              {form.name || user.name}
            </h2>
            <span className="truncate text-[13.5px] text-muted-2">
              {form.email || "no email set"}
            </span>
          </div>
        </div>

        {/* Snapshot */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-xl border border-line bg-canvas p-3.5"
            >
              <span className="truncate text-[17px] font-semibold">{value}</span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-3">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Editable details */}
        <div className="flex flex-col gap-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            Your details
          </div>

          <Field
            label="Full name"
            value={form.name}
            placeholder="Riya Alvarez"
            onChange={set("name")}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            placeholder="you@email.com"
            onChange={set("email")}
          />
          <Field
            label="What you're shopping for"
            value={form.shoppingFor}
            placeholder="7-seat family SUV"
            onChange={set("shoppingFor")}
          />

          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-label">Region</span>
            <select
              value={form.region}
              onChange={(e) => set("region")(e.target.value)}
              className="rounded-[10px] border border-stroke bg-canvas px-[15px] py-3 text-[15px] outline-none focus:border-accent"
            >
              {(REGIONS.includes(form.region)
                ? REGIONS
                : [form.region, ...REGIONS]
              ).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span className="text-[12px] text-muted-3">
              Used to bias pricing and availability answers.
            </span>
          </label>

          <div className="mt-1 flex items-center gap-3">
            <Button
              variant="solid"
              className="px-5 py-2.5 text-[14px] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={save}
              disabled={!dirty}
            >
              Save changes
            </Button>
            {dirty ? (
              <button
                type="button"
                onClick={() => setForm(user)}
                className="cursor-pointer bg-transparent text-[13px] text-muted-2 transition-colors hover:text-ink"
              >
                Discard
              </button>
            ) : null}
            {savedAt ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                Saved
              </span>
            ) : null}
          </div>
        </div>

        {/* Account actions */}
        <div className="flex flex-col gap-3 border-t border-line pt-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-3">
            Account
          </div>
          <p className="m-0 text-[13px] leading-[1.55] text-muted-2">
            Password, notifications, answer preferences and account deletion live
            in Settings.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/app/settings")}
              className="cursor-pointer rounded-[10px] border border-stroke bg-canvas px-4 py-2.5 text-[13.5px] transition-colors hover:border-ink"
            >
              Open settings
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="cursor-pointer rounded-[10px] border border-stroke bg-canvas px-4 py-2.5 text-[13.5px] text-danger transition-colors hover:bg-danger-bg"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
