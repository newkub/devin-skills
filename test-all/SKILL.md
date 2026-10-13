---
name: test-all
description: Orchestrate the test suite — pick test-* domains from signals, run fail-fast
argument-hint: "[scope] [target%]"
related:
  - run-test
  - test-unit
  - test-integration
  - test-api
  - test-cli
  - test-contract
  - test-e2e
  - test-visual
  - test-coverage
  - test-mutation
  - test-load
  - test-smoke
  - test-component
  - test-a11y
  - test-property
  - test-database
  - test-mobile
  - deep-review
  - deep-validate
  - update-tests
  - resolve-errors
  - run-lint
  - run-typecheck
  - run-verify
  - create-report-in-dot-devin
  - report
  - ask-me
---

## Goal

Orchestrate the whole test suite — pick the relevant `test-*` domains from real signals (table in `## Scope` of `run-test`) then run them in fail-fast order — never runs tests itself, never runs every type without a signal

## Scope

Use when multiple test domains must run together (`/run-test all`) — delegates actual runs to `test-*` skills based on signals

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix it or report it before running (the test)

### 1. Lint+Typecheck First

`/run-lint` + `/run-typecheck` in every case; fix errors first (they aren't test failures)

### 2. Detect Applicable Types

Scan `package.json`, configs, test dirs, routes against the signals table (in `run-test/SKILL.md` `## Scope`); if there are no tests or coverage is incomplete → run `/update-tests` first; record the list + reasons

### 3. Run Fail-Fast Order

`/test-unit` → `/test-property` → `/test-component` → `/test-database`/`/test-integration` → `/test-api`/`/test-cli`/`/test-contract` (per signals) → `/test-e2e` → `/test-mobile` → `/test-visual` → `/test-a11y`; `/test-load` when there is a perf signal; `/test-smoke` serves as a post-deploy gate, not part of a suite run; record result/duration/failures per type

### 4. Validate+Classify

`/deep-validate` the source + review the tests; wrong source → `/resolve-errors`, wrong test → `/update-tests`, unclear → report; never fix without evidence

### 5. Fix+Rerun

Fix per the classification, then rerun; if the same failure repeats ≥3 times → stop+report

### 6. Coverage

If there is a target → measure+report via `/test-coverage`; run the gap-closing loop with `/deep-review coverage` (writing tests via `/update-tests`) until the target (default 100%) is met

### 7. Report

persist → `.devin/temp/report/<workspace>/test-all-<time>.md`; all passing → `/run-verify` (fail → `/resolve-errors` retry ≤3)

## Rules

- Pick domains only from real signals; unsure → ask the user
- No `.skip`/`.only`; never weaken assertions, never change source code to fit a wrong test
- Coverage below target → add tests, don't lower the target
- Report separates source/test issues with priority

## Expected Outcome

- Test suite fully run across every domain with a signal — fail-fast order
- Combined report persisted in `.devin/temp/report/`
- All passing → `/run-verify`; fail → `/resolve-errors`
