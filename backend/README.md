# auto.concierge.ai — backend

FastAPI + LangChain RAG service. Users add car brochures (uploaded PDFs or
picks from an indexed library) to a chat, then ask questions; answers are
grounded in the selected brochures with page-level citations.

> Scaffold only — every `.py` is a stub. No implementation yet.

## Layout

```
backend/
├── app/
│   ├── main.py            # FastAPI app factory + lifespan
│   ├── config.py          # settings (env)
│   ├── dependencies.py    # shared FastAPI deps (db session, current user, ...)
│   │
│   ├── api/
│   │   ├── router.py      # mounts every route module
│   │   └── routes/        # health, auth, chats, messages, library, uploads, query
│   │
│   ├── core/              # security (JWT/hashing), logging, exception handlers
│   ├── schemas/           # Pydantic request/response models (the API contract)
│   ├── models/            # SQLAlchemy tables (user, chat, message, brochure, chunk, upload)
│   ├── db/                # engine, session, bootstrap
│   ├── repositories/      # data-access layer (no business rules)
│   ├── services/          # business logic: chat_service orchestrates a RAG query
│   │
│   ├── rag/               # LangChain pipeline
│   │   ├── loaders.py         # PDF -> Documents (page metadata)
│   │   ├── splitters.py       # chunking
│   │   ├── embeddings.py      # embedding model factory
│   │   ├── vectorstore.py     # pgvector / Chroma client
│   │   ├── retriever.py       # retriever filtered to a chat's selected brochures
│   │   ├── prompts.py         # grounded-answer + citation prompts
│   │   ├── chains.py          # LCEL RAG chain (+ streaming)
│   │   ├── ingestion.py       # load -> split -> embed -> upsert (+ progress)
│   │   └── citations.py       # chunks -> page-level citations + source list
│   │
│   ├── workers/           # background ingestion jobs
│   └── utils/             # pdf / text helpers
│
├── alembic/              # migrations
├── scripts/             # ingest_library.py, seed_db.py
├── data/
│   ├── uploads/          # raw uploaded PDFs (gitignored)
│   └── vectorstore/      # local vector db files if not using pgvector (gitignored)
├── tests/
├── requirements.txt
├── pyproject.toml
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

## Request flow (ask a question)

1. `POST /chats/{id}/query` with the question.
2. `chat_service` loads the chat's **selected** brochure ids.
3. `rag.retriever` pulls top-k chunks from the vector store, filtered to those ids.
4. `rag.chains` formats context + calls the LLM (streaming).
5. `rag.citations` turns the used chunks into page-level citations + a source list.
6. The user message and the structured answer are persisted via `repositories.messages`.

## Ingestion flow (add a brochure)

`POST /uploads` stores the PDF and queues a job in `workers/` →
`rag.ingestion`: load pages → split → embed → upsert to the vector store,
updating the upload's stage (`uploading → parsing → embedding → ready`).
