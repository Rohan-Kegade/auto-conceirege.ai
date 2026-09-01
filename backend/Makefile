.PHONY: install up down run worker migrate revision test lint fmt

install:
	pip install -r requirements.txt

up:              ## start dev infra (postgres, qdrant, redis)
	docker compose up -d db qdrant redis

down:
	docker compose down

run:             ## run the API with reload
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

worker:          ## run the arq ingestion worker (Phase 4+)
	arq app.workers.arq_worker.WorkerSettings

migrate:         ## apply migrations
	alembic upgrade head

revision:        ## autogenerate a migration: make revision m="add users"
	alembic revision --autogenerate -m "$(m)"

test:
	pytest -q

lint:
	ruff check .

fmt:
	ruff check --fix . && ruff format .
