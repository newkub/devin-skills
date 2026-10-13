---
name: test-mutation
description: Run mutation tests — measure assertion strength with mutants (kill rate), complementing coverage
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-coverage
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-stryker-mutator
  - create-report-in-dot-devin
  - report
---

## Goal

Run mutation tests — measure assertion strength with mutants (kill rate), complementing coverage — signals: critical logic, `stryker.conf`, mutation config; tools: `stryker` (JS/TS — `/follow-tool-stryker-mutator`), `cargo-mutants` (Rust), `mutmut` (Python)

## Scope

Use when running mutation tests — run-only, does not modify tests (deep analysis → `/deep-test mutation`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`stryker.conf.*`, `mutmut` config, `cargo-mutants`; JS/TS → `bunx stryker run`, Rust → `cargo mutants`, Python → `mutmut run`; define the scope — mutation is slow, so pick the critical/highest-risk modules (payment, auth, domain logic); baseline unit suite failing → fix it first

### 2. Run

Capture the score (killed/survived/timeout/no-coverage); long runs → higher blocking+timeout or incremental mode; record survived mutants with file:line + type

### 3. Classify

Survived + behavior genuinely changed → missing assertions → `/update-tests`; survived + equivalent mutant → noise, don't write extra tests; a mutant reveals dead code/a bug → report or `/resolve-errors`; strengthen assertions → rerun → the score must actually rise

### 4. Report

persist → `.devin/temp/report/<workspace>/mutation-test-<time>.md` — score before→after, survived remaining + reasons, noise count; all pass → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test mutation`)
- Don't count equivalent mutants as failures
- Never lower thresholds — a low score is real data to report
- Complements `/test-coverage`, doesn't replace it
- Limit the scope per run

## Expected Outcome

- Mutation score measured, with survived mutants + file:line
- Score before→after strengthening assertions
- Report persisted in `.devin/temp/report/`
