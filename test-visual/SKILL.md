---
name: test-visual
description: Run visual regression tests — screenshot diffs, design-system regression via browser
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-e2e
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-playwright
  - create-report-in-dot-devin
  - report
---

## Goal

Run visual regression tests — screenshot diffs, design-system regression via browser — signals: `playwright` screenshots, Storybook, design system dirs, `*-snapshots/`

## Scope

Use when visual regression tests must be run — run-only, never edits tests (deep analysis → `/deep-test visual`)

## Execute

> Pre-Run: Always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect

`*-snapshots/`, `toHaveScreenshot`, Storybook config, Percy/Argos; runner: Playwright screenshots → `bunx playwright test`, Storybook → visual addon/chromatic, Percy → `percy exec -- <cmd>`; no baseline → the first round creates the baseline, it is not a verify

### 2. Run

Same environment as the baseline (browser, viewport, OS, fonts); record per-snapshot status, diff %, diff image paths; platform-tagged snapshots → run only the baseline's platform

### 3. Classify

Intentional UI change → test outdated → `/update-tests` regenerate (confirm the change is correct); layout break/missing style → source regression → `/resolve-errors`; font/render/timing noise → environment stabilize (fixed fonts, wait conditions); never loosen thresholds; same failure repeating ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/visual-test-<time>.md` with diff images; all passed → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test visual`)
- Never regenerate snapshots without inspecting the diff — update = accepting every image
- Never expand thresholds without a reason
- Snapshots must be reproducible — disable animations, fixed viewport, wait-for-idle
- The baseline must match the environment of the real run

## Expected Outcome

- Visual tests fully run for every snapshot with diff % and diff images
- Failures classified as source/test/environment
- Report persisted in `.devin/temp/report/` with diff images
