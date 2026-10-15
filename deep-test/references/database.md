# Deep Test — Database Domain

Run database tests — migration up/down roundtrip, constraints/triggers, transaction integrity, query correctness on an ephemeral test database (merged from `/test-database`)

Signals: `migrations/` dir, ORM config (Drizzle, Prisma), `testcontainers`, `*.test` that touch the DB, `DATABASE_URL` test env

- Module wiring without drilling into DB semantics → `/deep-test integration`; API contracts → `/deep-test api` / `/deep-test contract`; schema design fixes → `/improve database`

## 1. Detect

> Goal: find the ORM/migration tooling and test DB scripts

1. `drizzle.config.*` / `prisma/schema.prisma` / `migrations/` / `sql` dirs, testcontainers config, test DB scripts (`db:test`, `test:db`), CI DB services
2. Runner: the normal suite runner (`bunx vitest run`, `cargo test`, `pytest`) + migration checks via the ORM CLI (`/follow-tool-drizzle-kit`, `prisma migrate`)

## 2. Run

> Goal: ephemeral DB only, full migration roundtrip

1. Provision an ephemeral DB first — testcontainers/docker compose/test schema only, never a dev/prod DB
2. Run migrations up→down→up as a roundtrip check if the suite does not cover it
3. Isolate per test with transaction rollback or a fresh schema
4. Record per-spec status + the migration log

## 3. Classify

> Goal: separate schema, source, test, and environment issues

1. Migration/constraint failure → schema issue → `/resolve-errors` (route `/improve database` if it is a design problem)
2. Wrong assertion/query logic → source
3. Stale fixtures/migration order → test → `/update-tests`
4. Connection/container/env → environment; repeats ≥3 → stop + report

## 4. Report

> Goal: persist the migration log and results

1. Persist → `.devin/temp/report/<workspace>/db-test-<time>.md` — migrations verified, per-spec status
2. Always tear down the container/DB when finished; all pass → `/run-verify`

## Rules

### 1. Ephemeral Only

- Never run tests against a dev/staging/production DB — ephemeral instances only

### 2. Down Migrations Too

- Migration tests must check down migrations, not just up

### 3. Clean State

- Always clean up test containers/schemas — never leave state behind

## Expected Outcome

- DB tests + migration roundtrip fully run on an ephemeral instance
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/` with the migration log
