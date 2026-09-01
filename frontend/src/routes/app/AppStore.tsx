import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  buildAnswer,
  LIBRARY,
  UPLOAD_NAMES,
  type ChatMessage,
  type Upload,
} from "./appData";

type User = { name: string; email: string; shoppingFor: string; region: string };

/**
 * A conversation owns its own context. `docs` is every brochure added to the
 * chat (what the context panel lists); `selected` is the subset ticked to
 * actually feed the model. Invariant: `selected` ⊆ `docs`.
 */
export type Chat = {
  id: string;
  title: string;
  docs: string[];
  selected: string[];
  messages: ChatMessage[];
  createdAt: string;
};

const DAY_MS = 86_400_000;
const daysAgoISO = (n: number) =>
  new Date(Date.now() - n * DAY_MS).toISOString();

type State = {
  chats: Chat[];
  activeChatId: string;
  query: string;
  chatSearch: string;
  draft: string;
  thinking: boolean;
  thinkingLabel: string;
  uploads: Upload[];
  user: User;
  seq: number;
};

const SEED_CHATS: Chat[] = [
  {
    id: "c0",
    title: "New research chat",
    docs: ["d1", "d5", "d3"],
    selected: ["d1", "d5"],
    messages: [],
    createdAt: daysAgoISO(0),
  },
  {
    id: "c1",
    title: "Terra vs Volt — towing and cargo",
    docs: ["d3", "d5"],
    selected: ["d3", "d5"],
    messages: [],
    createdAt: daysAgoISO(0),
  },
  {
    id: "c2",
    title: "Kaelin S60 warranty fine print",
    docs: ["d4"],
    selected: ["d4"],
    messages: [],
    createdAt: daysAgoISO(1),
  },
  {
    id: "c3",
    title: "Which EX-7 trim gets the tow pack?",
    docs: ["d1", "d7"],
    selected: ["d1", "d7"],
    messages: [],
    createdAt: daysAgoISO(3),
  },
];

const INITIAL: State = {
  chats: SEED_CHATS,
  activeChatId: "c0",
  query: "",
  chatSearch: "",
  draft: "",
  thinking: false,
  thinkingLabel: "",
  uploads: [],
  user: {
    name: "Riya Alvarez",
    email: "riya@alvarez.co",
    shoppingFor: "7-seat family SUV",
    region: "Australia",
  },
  seq: 0,
};

type Action =
  | { type: "toggleDoc"; id: string }
  | { type: "addDoc"; id: string }
  | { type: "removeDoc"; id: string }
  | { type: "setQuery"; value: string }
  | { type: "setChatSearch"; value: string }
  | { type: "setDraft"; value: string }
  | { type: "sendUser"; text: string }
  | { type: "thinkingLabel"; label: string }
  | { type: "answer" }
  | { type: "newChat" }
  | { type: "deleteChat"; id: string }
  | { type: "renameChat"; id: string; title: string }
  | { type: "selectChat"; id: string }
  | { type: "startUpload" }
  | { type: "uploadTick" }
  | { type: "setUser"; patch: Partial<User> };

function stageFor(pct: number): Upload["stage"] {
  if (pct >= 100) return "ready";
  if (pct > 72) return "embedding";
  if (pct > 38) return "parsing";
  return "uploading";
}

function patchActive(state: State, fn: (chat: Chat) => Chat): State {
  return {
    ...state,
    chats: state.chats.map((c) => (c.id === state.activeChatId ? fn(c) : c)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "toggleDoc":
      // Checkbox in the context panel — flip membership in the model-fed subset.
      return patchActive(state, (c) => ({
        ...c,
        docs: c.docs.includes(action.id) ? c.docs : [...c.docs, action.id],
        selected: c.selected.includes(action.id)
          ? c.selected.filter((x) => x !== action.id)
          : [...c.selected, action.id],
      }));
    case "addDoc":
      // "Add" from the library search — list it and tick it by default.
      return patchActive(state, (c) => ({
        ...c,
        docs: c.docs.includes(action.id) ? c.docs : [...c.docs, action.id],
        selected: c.selected.includes(action.id)
          ? c.selected
          : [...c.selected, action.id],
      }));
    case "removeDoc":
      // "×" on a panel row — drop it from the chat entirely.
      return patchActive(state, (c) => ({
        ...c,
        docs: c.docs.filter((x) => x !== action.id),
        selected: c.selected.filter((x) => x !== action.id),
      }));
    case "setQuery":
      return { ...state, query: action.value };
    case "setChatSearch":
      return { ...state, chatSearch: action.value };
    case "setDraft":
      return { ...state, draft: action.value };
    case "sendUser":
      return {
        ...patchActive(state, (c) => ({
          ...c,
          messages: [...c.messages, { role: "user", text: action.text }],
        })),
        draft: "",
        thinking: true,
        thinkingLabel: "embedding query…",
      };
    case "thinkingLabel":
      return { ...state, thinkingLabel: action.label };
    case "answer":
      return {
        ...patchActive(state, (c) => ({
          ...c,
          messages: [...c.messages, buildAnswer(c.selected, state.uploads)],
        })),
        thinking: false,
        thinkingLabel: "",
      };
    case "newChat": {
      const seq = state.seq + 1;
      const id = `n${seq}`;
      return {
        ...state,
        seq,
        activeChatId: id,
        draft: "",
        chatSearch: "",
        chats: [
          {
            id,
            title: "New research chat",
            docs: [],
            selected: [],
            messages: [],
            createdAt: new Date().toISOString(),
          },
          ...state.chats,
        ],
      };
    }
    case "deleteChat": {
      const remaining = state.chats.filter((c) => c.id !== action.id);
      if (remaining.length === 0) {
        const seq = state.seq + 1;
        const id = `n${seq}`;
        return {
          ...state,
          seq,
          activeChatId: id,
          draft: "",
          chatSearch: "",
          chats: [
            {
              id,
              title: "New research chat",
              docs: [],
              selected: [],
              messages: [],
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      const activeChatId =
        state.activeChatId === action.id
          ? remaining[0].id
          : state.activeChatId;
      return { ...state, chats: remaining, activeChatId, chatSearch: "" };
    }
    case "renameChat": {
      const title = action.title.trim();
      if (!title) return state;
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id === action.id ? { ...c, title } : c,
        ),
      };
    }
    case "selectChat":
      return { ...state, activeChatId: action.id, draft: "", chatSearch: "" };
    case "startUpload": {
      const seq = state.seq + 1;
      const name = UPLOAD_NAMES[state.uploads.length % UPLOAD_NAMES.length];
      return {
        ...state,
        seq,
        uploads: [
          ...state.uploads,
          { id: `u${seq}`, name, pct: 0, stage: "uploading" },
        ],
      };
    }
    case "uploadTick": {
      let justReady: string | null = null;
      const uploads = state.uploads.map((u) => {
        if (u.stage === "ready") return u;
        const pct = Math.min(100, u.pct + 7 + Math.random() * 9);
        const stage = stageFor(pct);
        if (stage === "ready") justReady = u.id;
        return { ...u, pct, stage };
      });
      const next = { ...state, uploads };
      return justReady
        ? patchActive(next, (c) => {
            const id = justReady as string;
            return {
              ...c,
              docs: c.docs.includes(id) ? c.docs : [...c.docs, id],
              selected: c.selected.includes(id)
                ? c.selected
                : [...c.selected, id],
            };
          })
        : next;
    }
    case "setUser":
      return { ...state, user: { ...state.user, ...action.patch } };
    default:
      return state;
  }
}

type AppApi = {
  state: State;
  chats: Chat[];
  activeChat: Chat;
  messages: ChatMessage[];
  docs: string[];
  selected: string[];
  toggleDoc: (id: string) => void;
  addDoc: (id: string) => void;
  removeDoc: (id: string) => void;
  setQuery: (value: string) => void;
  setChatSearch: (value: string) => void;
  setDraft: (value: string) => void;
  send: (text?: string) => void;
  newChat: () => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  selectChat: (id: string) => void;
  startUpload: () => void;
  setUser: (patch: Partial<User>) => void;
  libraryResults: typeof LIBRARY;
};

const AppContext = createContext<AppApi | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Drive upload progress while anything is still processing.
  useEffect(() => {
    const busy = state.uploads.some((u) => u.stage !== "ready");
    if (!busy) return;
    const iv = setInterval(() => dispatch({ type: "uploadTick" }), 280);
    return () => clearInterval(iv);
  }, [state.uploads]);

  useEffect(() => () => clearTimers(), []);

  const activeChat =
    state.chats.find((c) => c.id === state.activeChatId) ?? state.chats[0];

  const api = useMemo<AppApi>(() => {
    const active =
      state.chats.find((c) => c.id === state.activeChatId) ?? state.chats[0];

    const send = (text?: string) => {
      const q = (text ?? state.draft).trim();
      if (!q) return;
      clearTimers();
      dispatch({ type: "sendUser", text: q });
      timers.current.push(
        setTimeout(
          () =>
            dispatch({
              type: "thinkingLabel",
              label: `retrieving 14 passages from ${active.selected.length} documents…`,
            }),
          700,
        ),
        setTimeout(() => dispatch({ type: "answer" }), 1900),
      );
    };

    const q = state.query.trim().toLowerCase();
    const libraryResults = q
      ? LIBRARY.filter((d) => `${d.title} ${d.meta}`.toLowerCase().includes(q))
      : LIBRARY;

    return {
      state,
      chats: state.chats,
      activeChat: active,
      messages: active.messages,
      docs: active.docs,
      selected: active.selected,
      toggleDoc: (id) => dispatch({ type: "toggleDoc", id }),
      addDoc: (id) => dispatch({ type: "addDoc", id }),
      removeDoc: (id) => dispatch({ type: "removeDoc", id }),
      setQuery: (value) => dispatch({ type: "setQuery", value }),
      setChatSearch: (value) => dispatch({ type: "setChatSearch", value }),
      setDraft: (value) => dispatch({ type: "setDraft", value }),
      send,
      newChat: () => {
        clearTimers();
        dispatch({ type: "newChat" });
      },
      deleteChat: (id) => {
        clearTimers();
        dispatch({ type: "deleteChat", id });
      },
      renameChat: (id, title) => dispatch({ type: "renameChat", id, title }),
      selectChat: (id) => {
        clearTimers();
        dispatch({ type: "selectChat", id });
      },
      startUpload: () => dispatch({ type: "startUpload" }),
      setUser: (patch) => dispatch({ type: "setUser", patch }),
      libraryResults,
    };
  }, [state]);

  return (
    <AppContext.Provider value={{ ...api, activeChat }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppApi {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppStoreProvider>");
  return ctx;
}
