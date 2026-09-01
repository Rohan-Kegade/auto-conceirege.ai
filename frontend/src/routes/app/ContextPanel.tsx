import { useEffect, useRef, useState } from "react";
import { useApp } from "./AppStore";
import { LIBRARY } from "./appData";

const MONO_LABEL =
  "font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-2";

/**
 * The right-hand context sidebar — scoped to the active chat. The body lists
 * the brochures currently in context; the two entry points (search the indexed
 * library, upload a local file) sit pinned at the bottom.
 */
export function ContextPanel() {
  const { state, docs, selected, toggleDoc, removeDoc, startUpload } = useApp();
  const { uploads } = state;

  // The brochures added to this chat, resolved to display rows. Ids that don't
  // match the shared library are treated as the user's own uploads.
  const rows = docs.map((id) => {
    const doc = LIBRARY.find((d) => d.id === id);
    if (doc) return { id, label: doc.title, meta: doc.meta };
    const up = uploads.find((u) => u.id === id);
    return { id, label: up?.name ?? id, meta: "YOUR UPLOAD · INDEXED" };
  });

  const [libraryOpen, setLibraryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFilePicked = () => {
    // Demo store simulates parsing/indexing; the picked file is not read.
    if (fileRef.current?.files?.length) startUpload();
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-l border-line bg-panel">
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
        {/* Uploads still working through the pipeline */}
        {uploads.some((u) => u.stage !== "ready") ? (
          <div className="flex flex-col gap-2">
            <div className={MONO_LABEL}>Processing</div>
            {uploads
              .filter((u) => u.stage !== "ready")
              .map((u) => (
                <div
                  key={u.id}
                  className="rounded-[10px] border border-line bg-canvas px-3 py-[11px]"
                >
                  <div className="flex justify-between gap-2.5 text-[13px]">
                    <span className="truncate">{u.name}</span>
                    <span className="flex-none font-mono text-[10.5px] text-muted-2">
                      {u.stage.toUpperCase()} {Math.round(u.pct)}%
                    </span>
                  </div>
                  <div className="mt-[9px] h-[3px] overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full bg-accent transition-[width] duration-300 ease-linear"
                      style={{ width: `${Math.round(u.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : null}

        {/* Chat context — the brochures added to this chat */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className={MONO_LABEL}>Chat context</span>
            <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-muted-2">
              {selected.length}/{rows.length}
            </span>
          </div>
          {rows.length === 0 ? (
            <div className="text-[12.5px] text-muted-3">
              Nothing added yet — search the library or upload a brochure below.
            </div>
          ) : (
            rows.map(({ id, label, meta }) => {
              const on = selected.includes(id);
              return (
                <div
                  key={id}
                  className="flex items-start gap-2.5 rounded-[10px] border border-line bg-canvas px-3 py-2.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleDoc(id)}
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`${on ? "Exclude" : "Include"} ${label} ${
                      on ? "from" : "in"
                    } context`}
                    className={`mt-0.5 flex h-[15px] w-[15px] flex-none cursor-pointer items-center justify-center rounded-[4px] transition-colors ${
                      on
                        ? "border border-accent bg-accent text-canvas"
                        : "border border-stroke-dashed text-transparent hover:border-accent"
                    }`}
                  >
                    <CheckIcon />
                  </button>
                  <PdfIcon
                    className={`mt-0.5 flex-none ${
                      on ? "text-muted-2" : "text-muted-3"
                    }`}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={`truncate text-[13px] leading-[1.35] ${
                        on ? "" : "text-muted"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="mt-[3px] truncate font-mono text-[10px] tracking-[0.06em] text-muted-2">
                      {meta}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDoc(id)}
                    aria-label={`Remove ${label} from this chat`}
                    className="-mr-1 flex-none cursor-pointer self-center bg-transparent px-1 font-mono text-[14px] leading-none text-muted-3 transition-colors hover:text-ink"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Entry points, pinned to the bottom */}
      <div className="flex flex-none flex-col gap-2 border-t border-line bg-panel px-5 py-3">
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="flex w-full items-center gap-2 rounded-[10px] border border-stroke bg-canvas px-3 py-2.5 text-left text-[13px] text-muted-3 transition-colors hover:border-accent"
        >
          <SearchIcon />
          Search brochure library
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-stroke bg-canvas px-3 py-2 text-[13px] font-medium transition-colors hover:border-accent hover:bg-panel-tint"
        >
          <UploadIcon />
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFilePicked}
        />
        <p className="mt-0.5 text-center font-mono text-[10px]  tracking-[0.08em] text-muted-3">
          Context applies to this chat only
        </p>
      </div>

      {libraryOpen ? (
        <LibrarySearchModal onClose={() => setLibraryOpen(false)} />
      ) : null}
    </aside>
  );
}

function LibrarySearchModal({ onClose }: { onClose: () => void }) {
  const { state, docs, libraryResults, addDoc, setQuery } = useApp();
  const { query, uploads } = state;

  const q = query.trim().toLowerCase();
  const uploadMatches = uploads.filter(
    (u) => u.stage === "ready" && u.name.toLowerCase().includes(q),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the indexed library"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
      style={{ background: "rgba(0,0,0,0.42)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[68vh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-2xl"
      >
        <div className="flex-none border-b border-line p-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model, year"
            className="w-full rounded-[9px] border border-stroke bg-canvas px-3 py-2.5 text-[14px] outline-none focus:border-accent"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2">
          {libraryResults.map((doc) => (
            <LibraryRow
              key={doc.id}
              title={doc.title}
              meta={doc.meta}
              added={docs.includes(doc.id)}
              onAdd={() => addDoc(doc.id)}
            />
          ))}
          {uploadMatches.map((u) => (
            <LibraryRow
              key={u.id}
              title={u.name}
              meta="YOUR UPLOAD · INDEXED"
              added={docs.includes(u.id)}
              onAdd={() => addDoc(u.id)}
            />
          ))}
          {libraryResults.length === 0 && uploadMatches.length === 0 ? (
            <div className="px-2 py-3 text-[13px] text-muted-2">
              No brochure matches “{query}”. Upload it instead.
            </div>
          ) : null}
        </div>

        <div className="flex flex-none items-center justify-between border-t border-line px-3 py-2.5">
          <span className={MONO_LABEL}>{docs.length} added to chat</span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-[9px] border border-stroke bg-canvas px-3.5 py-1.5 text-[13px] font-medium transition-colors hover:border-accent"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function LibraryRow({
  title,
  meta,
  added,
  onAdd,
}: {
  title: string;
  meta: string;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-[10px] border border-line bg-canvas px-3 py-2.5">
      <PdfIcon className="mt-0.5 flex-none text-muted-3" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13.5px] leading-[1.35]">{title}</span>
        <span className="mt-[3px] font-mono text-[10.5px] tracking-[0.06em] text-muted-2">
          {meta}
        </span>
      </span>
      {added ? (
        <span className="flex-none cursor-default self-center rounded-[8px] border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-3">
          Added
        </span>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="flex-none cursor-pointer self-center rounded-[8px] border border-stroke bg-canvas px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Add
        </button>
      )}
    </div>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h6" />
      <path d="M9 18h6" />
      <path d="M9 12h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
