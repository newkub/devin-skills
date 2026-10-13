---
name: test-coverage
description: Run coverage and add tests, looping until every category hits the target (default 100%)
argument-hint: "[scope] [target%]"
related:
  - run-test
  - test-all
  - test-unit
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run coverage and add tests, looping until `100%` in every category — Lines, Statements, Functions, Branches — or the target from the argument (`[target%]`); never lower the target just to pass; never hit production/external services

## Scope

Use when measuring and closing coverage gaps — run+loop; deep analysis → `/deep-test coverage`; signals: a coverage config or target is defined (default target 100%)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Define Scope

Audit the existing coverage config (`vitest.config`, `jest.config`, `nyc`, `c8`, `cargo-llvm-cov`) with `/deep-review` before measuring; define include/exclude from argument+signals — "logic-only" → drop UI/runtime-bound modules that genuinely can't be tested, and record the reason; always exclude tests/generated/type-only; set `thresholds` = the target so failures are explicit

### 2. Baseline

Run coverage, collect the summary for every category + per-file uncovered; persist raw (`coverage-final.json`, lcov); every category at target → skip to step 5

### 3. Close Gaps (Loop)

Feed the uncovered analysis into `/deep-review coverage`, the loop owner (prioritize → write tests via `/update-tests` → re-measure); a test exposes a source bug → `/resolve-errors`, don't adjust the assertion; loop until the target; ≥3 iterations without progress → stop+report the blocker

### 4. Validate

Verify uncovered = 0 from the raw JSON (watch for files missing because they weren't included); every branch side covered (ternary/optional-chain/short-circuit); run the suite 2 more times to confirm determinism

### 5. Report

persist → `.devin/temp/report/<workspace>/test-coverage-<time>.md` — baseline→final delta, files added, source bugs, exclusions+reasons

## Rules

- Default 100% for every category
- Never lower the target, disable thresholds, or add exclusions just to pass
- Tests must assert behavior — import smoke tests don't count
- A gap reveals dead code → report it, don't delete it yourself
- Remove temporary debug artifacts when done

## Expected Outcome

- Coverage reaches the target in every category (default 100%) with a baseline→final delta
- Source bugs exposed by tests are reported separately
- Report persisted in `.devin/temp/report/`
