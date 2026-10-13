---
name: test-api
description: Run API/HTTP tests — endpoints, request/response contracts, OpenAPI conformance
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-hurl
  - follow-tool-bruno
  - create-report-in-dot-devin
  - report
---

## Goal

Run API/HTTP tests — endpoints, request/response contracts, OpenAPI conformance — signals: `routes/`, `controllers/`, `openapi.yaml`, `*.hurl`, `*.bru`, collection files

## Scope

Use when API/HTTP tests must be run — run-only, does not fix tests (write/change → `/update-tests`; deep analysis → `/deep-test api`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix it or report it before running (the test)

### 1. Detect

`*.hurl`, `*.bru`/Bruno collections, `*.api.test.*`, `*.http.test.*`, Postman/Newman; spec → `schemathesis run` fuzzing; framework tests (Playwright APIRequestContext, supertest, fastify inject, httpx); monorepo → scope only the workspace that has an API surface

### 2. Run

Hurl → `hurl --test <files>`; Bruno → `bru run`; Schemathesis → `schemathesis run <spec>`; framework → runner scope (`bunx vitest run '*.api.test.*'`, `pytest tests/api/`); record per-endpoint status, status codes, mismatches

### 3. Classify

`5xx`/unhandled → source → `/resolve-errors`; schema/assertion mismatch → did the contract really change (source) or is the test outdated → `/update-tests`; connection refused/missing env → environment; repeats ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/api-test-<time>.md`; all passing → `/run-verify`

## Rules

- run-only (write/change → `/update-tests`; deep analysis → `/deep-test api`)
- no `.skip`/`xit`; never weaken assertions
- never hit real external services — local server/fixtures only

## Expected Outcome

- API tests fully run across every endpoint with per-endpoint status and mismatches
- Failures classified as source/test/environment
- Report persisted under `.devin/temp/report/`
