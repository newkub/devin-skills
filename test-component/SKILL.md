---
name: test-component
description: Run isolated component tests: DOM render, user events, props/states (Testing Library, Playwright CT)
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-unit
  - test-e2e
  - test-visual
  - test-a11y
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run component tests — render a single component isolated from the app (DOM isolation), test props, states, user events — signals: `@testing-library/*`, `*.test.tsx` that render, Playwright CT (`ct`/experimental), Storybook test-runner, Vitest browser mode

## Scope

Use when component-level tests must be run — run-only, does not fix tests (deep analysis → `/deep-test`)

- Pure logic not touching the DOM → `/test-unit`; full user flows across the app → `/test-e2e`; screenshot diffs → `/test-visual`; axe checks on a rendered component → `/test-a11y`

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix it or report it before running (the test)

### 1. Detect

`@testing-library/{react,vue,solid,dom}`, `vitest --browser`, `playwright/experimental-ct-*`, `@storybook/test-runner`, `happy-dom`/`jsdom` in test config; runner: Vitest → `bunx vitest run`, Playwright CT → `bunx playwright test -c playwright-ct.config.*`, Storybook → `bunx test-storybook`

### 2. Run

run only component specs (pattern filter per scope); the env must match — jsdom/happy-dom tests must not rely on real browser APIs, browser-mode tests need a headless config; record per-spec status, duration, errors

### 3. Classify

render crash/prop contract fail → source → `/resolve-errors`; selector outdated/wait timing → test → `/update-tests`; mismatched DOM env (browser API missing in jsdom) → environment; flaky repeats ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/component-test-<time>.md` — per-spec status + classification; all passing → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test`)
- Component tests isolate a single component — mock providers/stores/network, never render the whole app
- Choose queries by accessibility (role/label), not css selectors — check this during classify
- never use `.skip`/`.only` to avoid failures

## Expected Outcome

- Component tests fully run per scope with per-spec status
- Failures classified as source/test/environment
- Report persisted under `.devin/temp/report/`
