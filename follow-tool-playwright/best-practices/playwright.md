# Playwright — Best Practices

E2E testing — locators, isolation, and flake elimination

## Recommended Patterns

- Primary locators: `getByRole` > `getByLabel`/`getByText` > `getByTestId` — resilient to DOM changes; CSS/XPath selectors are a last resort
- Web-first assertions: `await expect(locator).toBeVisible()` — auto-retry built in; never fixed `waitForTimeout`
- Test isolation: each test creates its own state (storage state, API seeding) — never depend on a previous test
- `test.beforeEach` for shared setup; `page.goto` inside the test for explicitness when flows differ
- Playwright Test fixtures (`test.extend`) for authenticated contexts — login once per worker

## Common Pitfalls

- Flakiness origins: hard sleeps, race conditions, animations — use `toBeVisible`/`waitFor` auto-retry instead
- Parallel tests collide on shared backend state — isolate data per test (unique users/records)
- `page.waitForSelector` then interact immediately — a visible element ≠ actionable; auto-waiting locators already handle it
- Trace/video/screenshot on-failure config — debug artifacts are essential in CI
- `test.describe.serial` = smell — fix isolation instead of serializing

## CI Discipline

- `workers` + `fullyParallel` — sharding (`--shard`) across runners for big suites
- `retries` in CI only (1-2), local = 0 — flakes must stay visible
- Browser projects: chromium first, add webkit/firefox per the risk matrix, not every PR
- `playwright install --with-deps` cached in CI — browsers stay pinned per version

## Do / Don't

| Do | Don't |
|----|-------|
| Role/label locators | Brittle CSS/XPath selectors |
| Web-first auto-retry assertions | `waitForTimeout` |
| Isolated test state | Inter-test dependencies |
| Trace on-first-retry in CI | Debugging flakes with re-runs |
