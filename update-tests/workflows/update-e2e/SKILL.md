---
name: update-tests-update-e2e
description: Update e2e specs to match the latest UI/route changes — selectors, navigation, assertions, waits — then run until they pass deterministically
related:
  - update-tests
---

## Goal

Update e2e specs to match the latest UI/route changes — selectors, navigation, assertions, waits — then run until they pass deterministically

## Scope

- Use when UI, routes, or user flows changed and the e2e specs fail/are outdated
- Covers: Playwright specs, selectors, page objects, fixtures, visual/interaction flows
- unit/integration → `workflows/update-unit/SKILL.md`; snapshots → `workflows/update-snapshot/SKILL.md`

## Execute

### 1. Diff UI Changes To Specs

> Goal: Know which specs are affected by which change

1. Run `/run-test e2e` — collect failing specs with errors and traces
2. Map failures back to the latest UI/route changes (git diff) — selector changed, route moved, flow changed, copy changed
3. Separate spec bug (outdated test) vs app bug (genuinely broken app) — split app bugs out via `/resolve-errors`

### 2. Update Selectors And Flows

> Goal: Specs reference the real UI per conventions

1. Change brittle selectors to user-facing locators (`getByRole`, `getByLabel`, `getByText`) per `/follow-tool-playwright`
2. Update the paths/routes that changed — use route constants if the project has them
3. Update the flows that changed (steps added/removed) to match the new behavior — assert the original outcome or the newly intended outcome

### 3. Fix Waits And Stability

> Goal: Specs are deterministic, not flaky

1. Replace `waitForTimeout`/sleep with auto-waiting locators or `expect(...).toBeVisible()` patterns
2. Add network waits (`waitForResponse`) on async flows
3. Re-run 2-3 times — must pass every time with no order dependence

### 4. Run And Verify

> Goal: The suite is green and covers the new flows

1. `/run-test e2e` passes the whole suite — fix one spec at a time per the failures
2. If the new UI has no coverage yet → add specs per the project's conventions
3. `/report-before-after` — specs updated/added/removed, pass rate

## Rules

- Assert user-visible behavior — never assert implementation details or CSS internals
- Never change the app to make a spec pass — if a spec reveals a bug → fix the bug separately or report
- Never delete a failing spec without stating a reason — if a flow was genuinely cut, note it in the report
- Fix-verify loop up to 3 rounds per spec → if it still fails, stop and report

## Expected Outcome

- The e2e suite passes deterministically — no flaky waits
- Specs match the current UI/routes and cover the changed flows
- The report summarizes specs changed/added/removed with reasons
