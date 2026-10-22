# Deep Test — E2E Domain

Run E2E tests for browser testing with Playwright across every route and user flow — including exploratory all-routes testing via headless `agent-browser` when no test suite exists yet

- Playwright is the primary framework — Cypress is not used
- `agent-browser` (headless) is used for exploratory route/action testing when no Playwright suite exists yet or for ad-hoc verification
- If Playwright tests need updating/writing → `/update-tests` (run-only, does not fix tests)

> Pre-Run: always run `/deep-review` (dimension `tests`) first — never skip; if findings are blockers, fix or report before running

## Run Quick Path

> Goal: run the existing E2E suite only (merged from `/test-e2e`) — use steps 1-6 below for the deep pass

1. Detect — `playwright.config.*` + its `testDir`, specs in `tests/e2e/` → `bunx playwright test`; prerequisites — dev server/start command, `baseURL`, seed data
2. Run — start the app as the suite requires (webServer config or manual), then run with `--reporter=line --retries=0` for honest results; record per-spec status, screenshots/traces, duration
3. Classify — element missing / flow broken → source → `/resolve-errors`; outdated selector/timing → test → `/update-tests`; flaky → report + `/deep-review`, never add retries; server won't start / port conflict → environment; repeats ≥3 → stop+report
4. Report — persist → `.devin/temp/report/<workspace>/e2e-test-<time>.md` with trace paths; all pass → `/run-verify`

## 1. Detect Setup

> Goal: Know whether the project already has a Playwright suite

1. Check `playwright.config.ts`/`playwright.config.js` and the `testDir` it points at — specs live in `tests/e2e/` (`testDir: 'tests/e2e'`), the same `tests/<layer>/` layout as every other layer
2. Check `package.json` — `@playwright/test`, scripts `test:e2e`, `e2e`
3. A root `e2e/` is a legacy layout — move it to `tests/e2e/` (dry run first), update `testDir` + scripts, then `/update-references`; never leave two e2e roots
4. If a suite exists → go to Step 3; if not → Step 2 (exploratory) or `/follow-tool-playwright` to set one up; no runner at all → `/deep-test strategy`

## 2. Exploratory All-Routes (agent-browser, headless)

> Goal: Test every route programmatically when no test suite exists yet

1. Start the dev server if needed (`/run-dev`) to get the base URL
2. List routes from `/report-uxui-all-routes` or `agent-browser snapshot -i` + `agent-browser links`
3. Open each route with `agent-browser open <url>` (headless is the default — no `--headed` needed)
4. Per route: `agent-browser snapshot -i` lists interactive elements → test click/toggle/select/fill/submit as found
5. `agent-browser console` + `agent-browser errors` capture page errors; `agent-browser screenshot` when an action fails
6. Finish with `agent-browser close`
7. Report a table: route → actions tested → pass/fail → console errors
8. Persist raw results → `.devin/temp/report/<workspace>/e2e-exploratory-<time>.md` per the `/create-report-in-dot-devin` format — clearly marked as exploratory (not a Playwright suite result)

## 3. Install Browser Dependencies

> Goal: Install browser binaries if needed

1. Run `bunx playwright install` for browsers
2. Run `bunx playwright install-deps` for system dependencies (Linux)
3. Verify the browser binaries are installed

## 4. Run E2E Tests

> Goal: Run Playwright tests

1. Prefer the script from `package.json` (`bun run test:e2e`, etc.)
2. Fallback: `bunx playwright test`
3. Headless is the default for CI; use `--headed` only when debugging
4. Use `--project`, file patterns, and `--grep` when a scope is specified
5. Use `--last-failed` to re-run only failures
6. Use `--ui` or `--debug` when authoring/troubleshooting

## 5. Cover All Routes And Flows

> Goal: full coverage of routes + critical flows

1. Compare test files against the route list from Step 2 — record any route without a test as a gap
2. Critical flows must always have tests: auth, main user journey, form submits, error states
3. If there are many routes → create a smoke spec that visits every route and asserts no console errors / 5xx

## 6. Review Test Results

> Goal: Inspect the test results

1. View the test report from the framework (`bunx playwright show-report` for the html report)
2. Inspect failed tests with screenshots, videos, and traces
3. Classify failures: source bug / outdated test / flaky / environment
4. Fix the root cause — if the test is wrong → `/update-tests`; if the source is wrong → `/resolve-errors`
5. Persist authoritative results → run Playwright with the JSON reporter (`bunx playwright test --reporter=json > .devin/temp/report/<workspace>/playwright-<time>.json` or `PLAYWRIGHT_JSON_OUTPUT_NAME`) then write a summary to `.devin/temp/report/<workspace>/e2e-<time>.md` per the `/create-report-in-dot-devin` format — stats (expected/unexpected/flaky/skipped/duration) + link to `playwright-report/` — this artifact is the real e2e result for `/update-docs`

## Rules

### 1. Test Framework

- Use Playwright only — if the project already has Cypress, recommend migrating to Playwright
- Location: `tests/e2e/` — one e2e root per repo, never a second next to `tests/`
- Configure browsers (`projects`), viewport, and device emulation per target
- `forbidOnly: !!process.env.CI` prevents `.only` from leaking into CI

### 2. Test Execution

- Headless for CI/normal runs — `--headed` for debugging only
- Use parallel execution and `retries: 2` on CI
- Use `webServer` in the config so Playwright starts the dev server itself (`reuseExistingServer` locally)

### 3. Test Isolation

- Each test is independent — use `beforeEach`/`afterEach` for setup/teardown
- Use `storageState` for auth reuse instead of logging in through the UI in every test
- Use isolated test data, seeded via the `request` fixture, not the UI

### 4. Locators And Assertions

- Use `getByRole`/`getByLabel`/`getByText`/`getByTestId` — avoid fragile CSS selectors
- Use auto-waiting web-first assertions (`toBeVisible`, `toHaveText`) — never `waitForTimeout`
- No conditional logic (`if`/`try-catch`) in test bodies

### 5. Failure Handling

- Look at the error, screenshot, video, and trace before fixing
- Fix the root cause, don't suppress; never use `.skip`/`.only` to avoid failures
- A flaky test that fails ≥3 times in a row → tag it and report instead of endlessly re-running
- Use /deep-review if needed
- Use /run-check if needed
- Use /run-verify if needed
- Use /use-agent-browser if needed
- Use /suggest-next-action if needed

## Expected Outcome

- All E2E tests pass on the configured browsers
- Every route has coverage: a Playwright spec or an exploratory pass via agent-browser
- Route gaps are clearly recorded
- Test report with screenshots/videos/traces for failed tests
- Console errors and page errors are captured and reported
