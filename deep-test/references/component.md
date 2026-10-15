# Deep Test — Component Domain

Run component tests — render a single component isolated from the app (DOM isolation), test props, states, user events (merged from `/test-component`)

Signals: `@testing-library/*`, `*.test.tsx` that render, Playwright CT (`ct`/experimental), Storybook test-runner, Vitest browser mode

- Pure logic not touching the DOM → `/deep-test unit`; full user flows across the app → `/deep-test e2e`; screenshot diffs → `/deep-test visual`; axe checks on a rendered component → `/deep-test a11y`

## 1. Detect

> Goal: find the component runner and its environment

1. `@testing-library/{react,vue,solid,dom}`, `vitest --browser`, `playwright/experimental-ct-*`, `@storybook/test-runner`, `happy-dom`/`jsdom` in test config
2. Runner: Vitest → `bunx vitest run`; Playwright CT → `bunx playwright test -c playwright-ct.config.*`; Storybook → `bunx test-storybook` (`/follow-tool-storybook`)

## 2. Run

> Goal: run only the component specs with the right environment

1. Run only component specs (pattern filter per scope)
2. The env must match — jsdom/happy-dom tests must not rely on real browser APIs; browser-mode tests need a headless config
3. Record per-spec status, duration, errors

## 3. Classify

> Goal: separate source, test, and environment failures

1. Render crash / prop contract fail → source → `/resolve-errors`
2. Outdated selector / wait timing → test → `/update-tests`
3. Mismatched DOM env (browser API missing in jsdom) → environment
4. Flaky repeats ≥3 → stop + report (`/check-flaky-tests` to quarantine)

## 4. Report

> Goal: persist per-spec results

1. Persist → `.devin/temp/report/<workspace>/component-test-<time>.md` — per-spec status + classification
2. All passing → `/run-verify`

## Rules

### 1. Isolation

- Component tests isolate a single component — mock providers/stores/network, never render the whole app

### 2. Accessible Queries

- Choose queries by accessibility (role/label), not css selectors — check this during classify

### 3. No Suppression

- Never use `.skip`/`.only` to avoid failures

## Expected Outcome

- Component tests fully run per scope with per-spec status
- Failures classified as source/test/environment
- Report persisted under `.devin/temp/report/`
