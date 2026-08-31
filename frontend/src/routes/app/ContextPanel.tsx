import { useApp } from "./AppStore";
import { LIBRARY } from "./appData";

const MONO_LABEL =
  "font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-2";

/**
 * The right-hand context sidebar — scoped to the active chat. Mirrors the
 * left chats sidebar: full height, flush to the edge, hairline divider.
 */
export function ContextPanel() {
  const { state, selected, libraryResults, toggleDoc, setQuery, startUpload } =
    useApp();
  const { query, uploads } = state;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-l border-line bg-panel">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
        {/* Upload dropzone */}
        <button
          type="button"
          onClick={startUpload}
          className="mb-4 w-full cursor-pointer rounded-xl border border-dashed border-stroke-dashed bg-canvas p-[18px] text-left transition-colors hover:border-accent hover:bg-panel-tint"
        >
          <div className="mb-1 text-[14px] font-medium">Upload a brochure</div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-2">
            drag &amp; drop · max 40 mb
          </div>
        </button>

        {/* Uploads */}
        {uploads.length > 0 ? (
          <div className="mb-3.5 flex flex-col gap-2">
            <div className={MONO_LABEL}>Your uploads</div>
            {uploads.map((u) => {
              const ready = u.stage === "ready";
              const inContext = selected.includes(u.id);
              return (
                <div
                  key={u.id}
                  className="rounded-[10px] border border-line bg-canvas px-3 py-[11px]"
                >
                  <div className="flex justify-between gap-2.5 text-[13px]">
                    <span className="truncate">{u.name}</span>
                    <span className="flex-none font-mono text-[10.5px] text-muted-2">
                      {ready
                        ? "INDEXED"
                        : `${u.stage.toUpperCase()} ${Math.round(u.pct)}%`}
                    </span>
                  </div>
                  {!ready ? (
                    <div className="mt-[9px] h-[3px] overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full bg-accent transition-[width] duration-300 ease-linear"
                        style={{ width: `${Math.round(u.pct)}%` }}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleDoc(u.id)}
                      className="mt-[9px] cursor-pointer bg-transparent text-[12.5px] text-accent"
                    >
                      {inContext ? "In context — remove" : "Add to context"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* In context — the vehicles this chat is scoped to */}
        <div className="mb-4 flex flex-col gap-2">
          <div className={MONO_LABEL}>In context</div>
          {selected.length === 0 ? (
            <div className="text-[12.5px] text-muted-3">
              Nothing yet — add brochures from the library below.
            </div>
          ) : (
            selected.map((id) => {
              const doc = LIBRARY.find((d) => d.id === id);
              const label =
                doc?.title ?? uploads.find((u) => u.id === id)?.name ?? id;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 rounded-[10px] border border-line bg-canvas px-3 py-2"
                >
                  <span className="truncate text-[13px]">{label}</span>
                  <button
                    type="button"
                    onClick={() => toggleDoc(id)}
                    aria-label={`Remove ${label} from context`}
                    className="flex-none cursor-pointer bg-transparent px-1 font-mono text-[13px] text-muted-3 transition-colors hover:text-ink"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Indexed library */}
        <div className="flex min-h-0 flex-1 flex-col gap-2.5">
          <div className={MONO_LABEL}>Indexed library</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model, year"
            className="rounded-[9px] border border-stroke bg-canvas px-3 py-2.5 text-[13.5px] outline-none focus:border-accent"
          />
          <div className="flex flex-col gap-1.5 overflow-y-auto pb-1">
            {libraryResults.map((doc) => {
              const on = selected.includes(doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDoc(doc.id)}
                  className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-line bg-canvas px-3 py-2.5 text-left transition-colors hover:border-stroke-dashed"
                >
                  <span
                    className={`mt-1 h-[9px] w-[9px] flex-none rounded-[3px] ${
                      on
                        ? "border border-accent bg-accent"
                        : "border border-stroke-dashed"
                    }`}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[13.5px] leading-[1.35]">
                      {doc.title}
                    </span>
                    <span className="mt-[3px] font-mono text-[10.5px] tracking-[0.06em] text-muted-2">
                      {doc.meta}
                    </span>
                  </span>
                </button>
              );
            })}
            {libraryResults.length === 0 ? (
              <div className="px-0.5 py-2 text-[13px] text-muted-2">
                No brochure matches “{query}”. Upload it instead.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
