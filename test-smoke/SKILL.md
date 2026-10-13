---
name: test-smoke
description: Run smoke tests — post-build/deploy sanity check that critical paths respond (fast gate)
argument-hint: "[scope|url]"
related:
  - run-test
  - test-all
  - test-load
  - test-api
  - deep-review
  - deep-test
  - check-open-ports
  - run-dev
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run smoke tests — minimal critical-path checks after build/deploy to confirm the system is alive and core flows respond — signals: `smoke` scripts/tags, `*.smoke.*`, health endpoints, deploy hooks

## Scope

Use when smoke/sanity tests must be run — run-only, never edits tests (deep analysis → `/deep-test`)

- Full functional coverage → `/test-unit` / `/test-e2e`; performance under load → `/test-load`
- Smoke = quick gate, not a correctness suite — select only critical paths (boot, health, auth, main flow)

## Execute

> Pre-Run: Always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`test:smoke`/`smoke` in package.json scripts, `*.smoke.*` files, tagged tests (`@smoke`, `-t smoke`), health endpoint (`/health`, `/healthz`, `/api/health`); if no suite exists → ad-hoc smoke: app responds + health 200 + critical route/endpoint OK

### 2. Run

runner tags → `--grep smoke` / `-t @smoke`; ad-hoc → `curl -sf <base>/health` + critical endpoints, or `autocannon -c 1 -d 5` for a response check; target <2 minutes — anything longer is not smoke; if the app is not running yet → `/check-open-ports` or `/run-dev`

### 3. Classify

app won't start/port conflict → environment; health 5xx or boot crash → source → `/resolve-errors`; smoke check outdated → test → `/update-tests`; same failure repeating ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/smoke-test-<time>.md` — checklist with pass/fail + latency per check; all passed → `/run-verify` or hand off to the deploy gate

## Rules

- run-only (deep analysis → `/deep-test`)
- Smoke must be fast and small — critical paths only; never run a full suite under the name of smoke
- Never hit production without explicit user approval — always state the target env in the report
- Never mask with `.skip`/retries — fail = fail

## Expected Outcome

- Smoke checklist pass/fail clearly reported as a fast gate
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/`
