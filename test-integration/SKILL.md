---
name: test-integration
description: Run integration tests — module boundaries, DB, external service adapters, wiring between components
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run integration tests — module boundaries, DB, external service adapters, wiring between components — signals: shared modules, DB clients, service adapters, `*.integration.test.*`, docker-compose test env

## Scope

Use when running integration tests — run-only, does not modify tests (deep analysis → `/deep-test integration`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`*.integration.test.*`, `tests/integration/`, testcontainers, compose files; the dependencies that must be up (DB, cache, queue); runner scope (`bunx vitest run '*.integration.test.*'`, `pytest -m integration`, `go test -tags=integration ./...`); monorepo → scope the workspaces that have shared/service modules

### 2. Run

Start dependencies (testcontainers auto-start or compose up) → verify health before running; record per-test status, dependency logs if a test fails; clean teardown, never leave containers/ports dangling

### 3. Classify

Boundary/logic failure → source → `/resolve-errors`; wrong fixture/seed, outdated assertion → test → `/update-tests`; dependency won't start/port conflict/timeout → environment; shared-state interference → report + `/deep-review`; repeats ≥3 times → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/integration-test-<time>.md`; all pass → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test integration`)
- Never mock what is itself the point of the test (e.g. a DB intended to be used for real)
- Tests isolated — fresh seed per test or transaction rollback
- Never hit real externals — local/testcontainers only

## Expected Outcome

- Integration tests fully run with a clean dependency lifecycle
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/`
