---
name: test-property
description: Run property-based + fuzz tests — invariants on generated inputs, shrinking, seeds
argument-hint: "[scope] [--runs N] [--seed N]"
related:
  - run-test
  - test-all
  - test-unit
  - test-mutation
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - follow-lib-fast-check
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run property-based and fuzz tests — verify invariants on generated inputs instead of single examples, shrink to find the minimal counterexample — signals: `fast-check`, `proptest`, `hypothesis`, `go test -fuzz`, `cargo-fuzz`, `quickcheck`

## Scope

Use when property/fuzz tests must be run — run-only, never edits tests (deep analysis → `/deep-test`; writing new properties → `/update-tests` + `/follow-lib-fast-check`)

- Fixed example tests → `/test-unit`; assertion strength → `/test-mutation`; throughput fuzz → `/test-load`

## Execute

> Pre-Run: Always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

JS/TS → `fast-check` (`fc.assert`, `fc.property`); Rust → `proptest`/`cargo-fuzz` (`fuzz_targets/`); Python → `hypothesis` (`@given`); Go → `go test -fuzz=FuzzX`; runner for that ecosystem (`bunx vitest run`, `cargo test`, `pytest`, `go test`)

### 2. Run

Limit runs/duration to suit CI (`--runs`, `numRuns`, `-fuzztime`); record the seed/counterexample for every failure — the seed is essential for repro; fuzz targets → run time-boxed (e.g. `-fuzztime=60s`), not open-ended

### 3. Classify

counterexample/shrunk case → real source bug → `/resolve-errors` with the minimal input; generator wrong/contradicts the spec → test → `/update-tests`; timeout/env limit → environment; same failure repeating ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/property-test-<time>.md` — properties passed, seeds, minimal counterexamples; all passed → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test`)
- Every failure must record the seed + shrunk counterexample — never report "failed" without a repro input
- Never lower `numRuns`/add arbitrary constraints just to pass — that is equivalent to weakening the assertion
- Fuzz runs must always be time-boxed; never leave a fuzzer running

## Expected Outcome

- Property/fuzz tests fully run with reproducible seeds
- Failures classified with a minimal counterexample
- Report persisted in `.devin/temp/report/`
