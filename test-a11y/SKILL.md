---
name: test-a11y
description: Run a11y tests — axe, keyboard nav, screen reader semantics, contrast via axe-core/pa11y/Lighthouse
argument-hint: "[scope|url]"
related:
  - run-test
  - test-all
  - test-component
  - test-e2e
  - test-visual
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - improve-a11y
  - improve-uxui
  - follow-tool-lighthouse
  - follow-tool-unlighthouse
  - create-report-in-dot-devin
  - report
---

## Goal

Run accessibility tests — WCAG violations, keyboard navigation, screen reader semantics, color contrast — signals: `axe`/`jest-axe`/`@axe-core/*`, `pa11y` config, Lighthouse a11y audits, `.a11y.` specs

## Scope

Use when accessibility tests must be run — run-only, does not fix tests (deep analysis → `/deep-test`; fix findings → `/improve-a11y` or `/deep-review` domain `review-accessibility`)

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix it or report it before running (the test)

### 1. Detect

`axe-core`, `jest-axe`, `@axe-core/playwright`, `pa11y`, `@storybook/addon-a11y`, Lighthouse a11y category; runner: axe in Playwright/Vitest → run the spec suite, pa11y → `bunx pa11y <url>`, site-wide → `/follow-tool-unlighthouse`, single page → `/follow-tool-lighthouse`

### 2. Run

axe suite → run the spec normally; ad-hoc on a running app → scan each route with `@axe-core/playwright` or `pa11y <url>`; manual checks where tools fall short → keyboard-only walkthrough, focus order, zoom 200%; record violations with WCAG rule id + severity

### 3. Classify

real violation (missing label, contrast, focus trap, missing landmark) → source → `/resolve-errors` or `/improve-a11y`; wrong rule config/false positive → test → `/update-tests`; scan env not ready (page didn't load) → environment; repeats ≥3 times → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/a11y-test-<time>.md` — violations per route/component with WCAG level (A/AA), severity (critical/serious/moderate/minor), element selector; all passing → `/run-verify`

## Rules

- run-only (deep analysis → `/deep-test`; fix findings → `/improve-a11y`)
- never disable axe rules without a justification in a config comment
- Severity ordering: critical/serious first — block merge if public-facing
- never rely on automated scans alone — axe covers ~40% of WCAG; flag points that need manual checks (focus order, screen reader flow)

## Expected Outcome

- A11y violations per route/component with WCAG ref + severity
- Failures classified as source/test/environment
- Report persisted under `.devin/temp/report/`
