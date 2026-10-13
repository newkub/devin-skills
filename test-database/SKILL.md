---
name: test-database
description: Run database tests on an ephemeral DB — migrations up/down, constraints, transactions, queries
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-integration
  - test-contract
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - improve-database
  - follow-lib-drizzle
  - follow-tool-drizzle-kit
  - follow-lib-postgres
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run database tests — migrations up/down roundtrip, constraints/triggers, transaction integrity, query correctness on an ephemeral test database — signals: `migrations/` dir, ORM config (Drizzle, Prisma), `testcontainers`, `*.test` that touch the DB, `DATABASE_URL` test env

## Scope

Use when running DB-bound tests — run-only, does not modify tests (deep analysis → `/deep-test`; schema design fixes → `/improve-database`)

- Module wiring without drilling into DB semantics → `/test-integration`; API contracts → `/test-api`/`/test-contract`

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`drizzle.config.*`/`prisma/schema.prisma`/`migrations/`/`sql` dirs, testcontainers config, test DB scripts (`db:test`, `test:db`), CI DB services; runner: the normal suite runner (`bunx vitest run`, `cargo test`, `pytest`) + migration checks via ORM CLI (`drizzle-kit`, `prisma migrate`)

### 2. Run

Provision an ephemeral DB first — testcontainers/docker compose/test schema only, never a dev/prod DB; run migrations up→down→up as a roundtrip check if the suite doesn't cover it; isolate per test with transaction rollback or a fresh schema; record per-spec status + the migration log

### 3. Classify

Migration/constraint failure → schema issue → `/resolve-errors` (route `/improve-database` if it's a design problem); wrong assertion/query logic → source; stale fixtures/migration order → test → `/update-tests`; connection/container/env → environment; repeats ≥3 times → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/db-test-<time>.md` — migrations verified, per-spec status; always tear down the container/DB when finished; all pass → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test`)
- Never run tests against a dev/staging/production DB — ephemeral instances only
- Migration tests must check down migrations too, not just up
- Always clean up test containers/schemas — never leave state behind

## Expected Outcome

- DB tests + migration roundtrip fully run on an ephemeral instance
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/` with the migration log
