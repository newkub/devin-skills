---
name: test-e2e
description: Run E2E tests via browser — real user flows from entry to outcome (Playwright/Cypress/agent-browser)
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-playwright
  - use-agent-browser
  - use-chrome-devtools
  - use-midscenejs
  - create-report-in-dot-devin
  - report
---

## Goal

Run end-to-end tests through a browser — real user flows from entry to outcome — signals: `playwright.config`, `cypress.config`, `e2e/` dirs, web frontend; no suite but need smoke/interact → `agent-browser` headless per `/use-agent-browser`; smoke/debug via already-registered MCP → `chrome-devtools-mcp` per `/use-chrome-devtools`; natural-language flows (vision/NL assertions not tied to fixed selectors) → Midscene agent on Playwright per `/use-midscenejs`

## Scope

Use when running e2e tests — run-only, does not modify tests (deep analysis → `/deep-test e2e`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`playwright.config.*`, `cypress.config.*`, `e2e/`/`tests/e2e/`; Playwright → `bunx playwright test`; Cypress → `bunx cypress run`; check prerequisites — dev server/start command, baseURL, seed data

### 2. Run

Start the app as the suite requires (webServer config or manual), then run; `--reporter=line` + `--retries=0` for honest results — never let retries mask flakiness; record per-spec status, screenshots/traces, duration

### 3. Classify

Element missing/flow broken → source → `/resolve-errors`; outdated selector/timing → test → `/update-tests`; flaky → report + `/deep-review`, never add retries; server won't start/port conflict → environment; repeats ≥3 times → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/e2e-test-<time>.md` with trace paths; all pass → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test e2e`)
- Never use `.skip`/`xit`/added retries
- Never depend on real external services — staging/local only, never hit production

## Expected Outcome

- E2E tests fully run for every spec with screenshots/traces
- Failures classified as source/test/environment (flaky reported separately)
- Report persisted in `.devin/temp/report/` with trace paths
