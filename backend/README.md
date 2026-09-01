# backend

## Tech stack

- **FastAPI** (async) — HTTP API
- **PostgreSQL** + **SQLAlchemy** (async) + **Alembic** — app data & migrations
- **LangChain** — RAG pipeline
- **Google Gemini** (`langchain-google-genai`) — answers (`gemini-2.0-flash`) and
  embeddings (`text-embedding-004`); `fastembed`/BGE-small local fallback
- **Qdrant** — vector store
- **arq** + **Redis** — background brochure ingestion

## Run locally

Requires Python 3.12 and Docker.

```bash
cd backend

# 1. infra
docker compose up -d db qdrant redis

# 2. env
cp .env.example .env        # set GOOGLE_API_KEY

# 3. deps
py -3.12 -m venv .venv
.venv\Scripts\activate      # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

# 4. database
alembic upgrade head

# 5. run
uvicorn app.main:app --reload      # http://localhost:8000/api/health
arq app.workers.arq_worker.WorkerSettings   # ingestion worker (separate shell)
```

`make up | migrate | run | worker | test | lint` wrap these.
