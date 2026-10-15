---
name: update-tests
description: Write/update tests across all layers — unit, integration, e2e, contract, visual — until green
argument-hint: "[scope-or-files]"
related:
  - deep-review
  - run-test
  - follow-tool-playwright
  - follow-tool-vitest
  - update-specs
  - use-subagents
  - resolve-errors
  - run-check
  - report
  - suggest-next-action

---

## Goal

Write and update tests to cover every test type and every layer — unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility, visual — following the project's conventions, then run until the whole suite passes

## Scope

Use when you want tests written/updated comprehensively — pick layers by scope: if files are given, check which layer they belong to and write every suitable type, not just unit

- If the suite hasn't been reviewed → run `/deep-review` first
- If you only want to run tests → `/run-test <domain>` matching the layer, or `/run-test all`
- If you want to improve test suite quality → `/deep-review-then-fix`
- If the scope spans many modules → dispatch via `/use-subagents`

## Execute

### 1. Detect Framework And Strategy

> Goal: Reuse the project's existing setup and lay out the test pyramid

1. Check manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for test deps (`vitest`, `jest`, `bun test`, `pytest`, `go test`)
2. Check existing config + test files — naming, structure, assertion style, mock patterns
3. Define the test pyramid and the types required by the scope — per [## Merged Details → `### references/layers`](## Merged Details → `### references/layers`)
4. Define the data strategy: `factories` (dynamic), `fixtures` (static), `builders` (complex)
5. Define the mock strategy: mock only external deps — use real internal pure functions

### 2. Analyze Source

> Goal: Map code paths before writing

1. Read all source in scope — handlers, services, utils, types
2. Identify branches/code paths, external deps to mock, input validation rules, output/error shapes
3. Identify security-critical logic (auth checks, IDOR, sanitization, userId injection)
4. Build a code-path map → the minimum set of test cases required

### 3. Sync Specs

> Goal: Specs cover the tests

1. Run `/update-specs` to create/update `specs/overview.md` + `specs/<feature>.md`
2. Verify the spec covers the test files about to be written

### 4. Write Tests Per Layer

> Goal: Write every layer the scope requires

Follow [## Merged Details → `### references/layers`](## Merged Details → `### references/layers`) — unit, integration, e2e (Playwright per `/follow-tool-playwright`, Vitest per `/follow-tool-vitest`), contract, property-based, mutation, performance, security, accessibility, visual

Every handler/function must have: happy path, error path, edge cases, unauthorized, input validation + conditional categories as the logic warrants

### 5. Run Per-Layer Runners

> Goal: Every layer passes before combining

1. unit → `/run-test`; integration → `/run-test integration`; e2e → `/run-test e2e`; api → `/run-test api`
2. FAIL → separate test bug vs app bug: fix the test for a test bug, for an app bug → `/resolve-errors` or report
3. Retry up to 3 rounds per failure

### 6. Run All Tests

> Goal: The whole suite goes green together

1. Run `/run-test all` — the orchestrator picks the runners the project actually has and reports combined results
2. If there are cross-layer failures → return to Step 5 and fix only that layer

### 7. Verify Coverage And Quality

> Goal: Comprehensive and high quality

1. Run `/run-test coverage` — verify lines/statements/functions/branches up to the target (default 100%); if not yet reached, the skill loops back to write more tests through this skill itself
2. Re-run 2-3 times — deterministic, no flaky/order dependence
3. Run `/run-check` so lint/typecheck pass

### 8. Report

> Goal: Deliver

1. Run `/report` — tests added/updated/removed per layer, coverage delta, pass rate, pending items
2. Persist raw results → `.devin/temp/report/<workspace>/update-tests-<time>.md` per the `/create-report-in-dot-devin` format so `/update-docs` can reuse them
3. Run `/suggest-next-action`

### Subagents

> Goal: Parallelize suite updates when changes affect many suites

- Use the `suite-updater` profile (`## Merged Details → suite-updater`) when you must update many independent test suites (unit/integration/e2e/snapshot) — spawn one suite at a time via `/use-subagents`, with each agent editing a different set of test files, then combine results before `/run-test all`

### Workflows

> Goal: Dispatch update work to the workflow matching the test layer

| Topic | Workflow |
|-------|----------|
| Update e2e specs after UI/route changes | `## Merged Details → update-e2e` |
| Update unit tests after a refactor | `## Merged Details → update-unit` |
| Safely regenerate/review snapshots | `## Merged Details → update-snapshot` |

## Rules

### 1. All Layers Covered

- Never write only unit tests when the scope needs integration/e2e — pick every layer suited to the changed code
- Flows that just passed exploratory testing (e.g. `/deep-test website` Roleplay Mode) must be codified into Playwright specs

### 2. Behavior Over Implementation

- Assert behavior/output + error shape + side effects — never assert internals
- Test names state the behavior: `should [expected] when [condition]` + AAA pattern

### 3. Deterministic And Isolated

- No shared state, order dependence, real time/random — fake timers, seeded RNG, cleanup every test
- Never use `waitForTimeout`/sleep as a workaround — use proper waits/mocks at the boundary

### 4. No Code Changes To Pass

- Never change source just to make tests green — if a test reveals a bug → fix the bug separately or report
- Update expectations only for an intended behavior change

### 5. File Organization

- Follow the project pattern: colocated or `tests/unit|integration|e2e/` — don't mix conventions
- Test data in `tests/fixtures/`, helpers in `tests/utils/`, don't commit e2e artifacts

### 6. Security In Tests

- Never hardcode credentials — use env vars/test fixtures
- Security tests (auth bypass, IDOR, injection) must exist on the relevant handlers

## Merged Details

### update-e2e

##### Goal

Update e2e specs to match the latest UI/route changes — selectors, navigation, assertions, waits — then run until they pass deterministically

##### Scope

- Use when UI, routes, or user flows changed and the e2e specs fail/are outdated
- Covers: Playwright specs, selectors, page objects, fixtures, visual/interaction flows
- unit/integration → `## Merged Details → update-unit`; snapshots → `## Merged Details → update-snapshot`

##### Execute

###### 1. Diff UI Changes To Specs

> Goal: Know which specs are affected by which change

1. Run `/run-test e2e` — collect failing specs with errors and traces
2. Map failures back to the latest UI/route changes (git diff) — selector changed, route moved, flow changed, copy changed
3. Separate spec bug (outdated test) vs app bug (genuinely broken app) — split app bugs out via `/resolve-errors`

###### 2. Update Selectors And Flows

> Goal: Specs reference the real UI per conventions

1. Change brittle selectors to user-facing locators (`getByRole`, `getByLabel`, `getByText`) per `/follow-tool-playwright`
2. Update the paths/routes that changed — use route constants if the project has them
3. Update the flows that changed (steps added/removed) to match the new behavior — assert the original outcome or the newly intended outcome

###### 3. Fix Waits And Stability

> Goal: Specs are deterministic, not flaky

1. Replace `waitForTimeout`/sleep with auto-waiting locators or `expect(...).toBeVisible()` patterns
2. Add network waits (`waitForResponse`) on async flows
3. Re-run 2-3 times — must pass every time with no order dependence

###### 4. Run And Verify

> Goal: The suite is green and covers the new flows

1. `/run-test e2e` passes the whole suite — fix one spec at a time per the failures
2. If the new UI has no coverage yet → add specs per the project's conventions
3. `/report-before-after` — specs updated/added/removed, pass rate

##### Rules

- Assert user-visible behavior — never assert implementation details or CSS internals
- Never change the app to make a spec pass — if a spec reveals a bug → fix the bug separately or report
- Never delete a failing spec without stating a reason — if a flow was genuinely cut, note it in the report
- Fix-verify loop up to 3 rounds per spec → if it still fails, stop and report

##### Expected Outcome

- The e2e suite passes deterministically — no flaky waits
- Specs match the current UI/routes and cover the changed flows
- The report summarizes specs changed/added/removed with reasons

### update-snapshot

##### Goal

Update test snapshots (inline, file, visual) after output changes intentionally — review every snapshot diff before accepting, never blind-update

##### Scope

- Use when output/markup/serialization changes cause snapshot tests to fail
- Covers: serializer snapshots (Vitest/Jest), component snapshots, visual snapshots
- General unit tests → `## Merged Details → update-unit`; e2e → `## Merged Details → update-e2e`

##### Execute

###### 1. Collect Snapshot Failures

> Goal: Know which snapshots fail and why

1. Run `/run-test` — collect all snapshot mismatches
2. Map each mismatch to a code change — intended change vs unintended regression
3. Distinguish clearly: outdated snapshot (can accept) vs genuinely broken output (fix code separately)

###### 2. Review Diffs Before Accept

> Goal: Accept only the intended changes

1. Read the diff of every snapshot about to be updated — file by file, never mass-accept
2. Verify the diff matches only the intended change — keys added/missing, ordering, whitespace, non-deterministic ids/timestamps
3. If the diff has non-deterministic values → fix the test to serialize stably (mock time/ids) before re-snapshotting

###### 3. Regenerate

> Goal: New snapshots are clean and deterministic

1. Regenerate with the update flag of the runner the project uses (e.g. `vitest -u`, `jest -u`) — only for the reviewed scope
2. Visual snapshots → update via `/run-test visual`, then review the image diffs one by one
3. Delete orphan snapshot files (test deleted but snapshot left behind)

###### 4. Verify

> Goal: The suite is green and snapshots are stable

1. `/run-test` passes, then re-run 2-3 times — snapshots must match the original every time
2. git diff the snapshot files — exactly what was reviewed, no extra changes
3. `/report-before-after` — snapshots updated/removed, intended changes confirmed

##### Rules

- Never blind `-u` the whole suite — review every snapshot diff before accepting
- Snapshots must be deterministic — no timestamps, random ids, env-dependent values
- Never accept a diff that doesn't match the intended change — flag it as a regression separately
- A snapshot too large to review → recommend splitting into assertions instead, in the report
- Fix-verify loop up to 3 rounds → if it still fails, stop and report

##### Expected Outcome

- Snapshots match the new intended output — no unintended diffs slipped in
- The suite passes deterministically, with no orphan snapshot files
- The report summarizes the snapshots accepted/deleted along with regressions flagged

### update-unit

##### Goal

Update unit tests to match refactored/signature-changed code — mocks, assertions, test structure — while asserting behavior, not internals

##### Scope

- Use when a refactor, rename, signature change, or restructure causes unit tests to fail/become outdated
- Covers: Vitest/Jest/bun test/pytest as the project uses — mocks, fixtures, parameterized tests
- e2e → `## Merged Details → update-e2e`; snapshots → `## Merged Details → update-snapshot`

##### Execute

###### 1. Map Breakage To Changes

> Goal: Know which test fails because of which change

1. Run `/run-test` — collect failing tests with errors
2. Map failures to the code diff — signature changed, module moved, behavior changed intentionally, or behavior lost
3. Separate: outdated test (update the test) vs genuine regression (app bug → `/resolve-errors` or report)

###### 2. Update Tests To New Contracts

> Goal: Tests match the new public contract

1. Update imports/paths to the new structure — following the project's original conventions
2. Update calls to the new signature — params, return shape, error types
3. Update mocks to match the new boundary — mock only external deps, never mock internal pure functions
4. If behavior changed intentionally → update expectations; if a test reveals lost logic → flag before deleting

###### 3. Cover New Paths

> Goal: New code paths have complete tests

1. A refactor that adds new branches/functions → add test cases per `/update-tests`' code-path map
2. Preserve the AAA pattern and `should [expected] when [condition]` test names per the project
3. Run `/deep-review` — no shared state, complete cleanup

###### 4. Run And Verify

> Goal: The suite is green and deterministic

1. `/run-test` passes the scope you changed, then re-run 2-3 times — no flaky
2. `/run-check` lint/typecheck passes on the test files you changed
3. `/report-before-after` — tests updated/added/removed per module

##### Rules

- Assert behavior/output + error shape — never assert internals or private state
- Never change source to make a test pass — if a test reveals a regression → fix the bug separately
- Never delete tests covering existing behavior — delete only genuinely cut behavior
- Fix-verify loop up to 3 rounds per test → if it still fails, stop and report

##### Expected Outcome

- Unit tests match the new implementation and pass deterministically
- Coverage doesn't drop below pre-refactor — new paths have tests
- The report summarizes tests changed/added/removed with reasons

### references/layers

#### Test Layers Reference

Pick layers by scope — every handler/function has required categories first, then add conditional categories per the logic

##### Required Categories (every test)

1. Happy path — correct input → expected output
2. Error path — dependency throws → correct error response
3. Edge cases — empty/null/undefined, boundary values (min, max, min-1, max+1)
4. Unauthorized — auth missing/invalid → reject
5. Input validation — invalid input → validation error

##### Conditional Categories

- Permission/RBAC — user without permission → deny
- IDOR/Ownership — accessing another user's resource → deny
- Sanitization — malicious input → sanitized
- userId injection — userId must come from auth, not input
- Empty results, optional fields, concurrency, regression, contract, property-based, a11y, performance

Use `it.each`/table-driven for multiple boundary values, a validation matrix, a permission matrix (role × action)

##### Unit (70%)

- Scope: pure functions, handlers, utils — isolated
- Framework: `vitest`/`jest`/`bun test` (JS/TS), `pytest`, `go test`, `cargo test`, `xUnit`, `rspec`, `PHPUnit` by language
- Mock only external deps; `< 10ms` per test
- Location: colocated `__tests__/` or `tests/unit/` per project pattern
- Vitest setup/conventions → `/follow-tool-vitest`

##### Integration (20%)

- Scope: API endpoints, DB queries, service interactions — real/test DB, testcontainers
- Real implementations at the boundary; mock only uncontrollable third parties
- seed/cleanup per test — no data leaks; `< 100ms` per test
- Location: `tests/integration/`
- Runner: `/deep-test integration`; API-specific → `/deep-test api`

##### E2E (10%)

- Scope: user flows, critical paths, all routes — Playwright only (don't use Cypress)
- Selectors: `data-testid` or role-based (`getByRole`, `getByLabel`) — never fragile CSS selectors
- Reuse auth via `storageState`; fixtures/page objects per suite conventions
- Auto-waiting locators + `expect` polling — never blind `waitForTimeout`
- Send traces/videos/screenshots to the test-results dir — never commit artifacts
- Conventions → `/follow-tool-playwright`; runner → `/deep-test e2e`

##### Contract

- API schema compatibility between services — `pact` or schema validation
- Breaking changes → versioning/deprecation, don't remove immediately

##### Property-Based

- Invariants that must hold for every input — `fast-check` (JS/TS), `hypothesis` (Python), `proptest` (Rust)

##### Mutation

- Check test quality — `stryker` or `cargo-mutants` — run in CI

##### Performance / Security / Accessibility / Visual

- Performance: critical paths ≤ threshold — run in CI
- Security: auth bypass, IDOR, injection, rate limiting — run in CI
- Accessibility: WCAG/ARIA/keyboard nav on UI components
- Visual: screenshot regression via Playwright/component snapshots — `/deep-test visual`

### suite-updater

##### Role

A subagent for updating a single test suite — e.g. `unit`, `integration`, `e2e`, `contract`, `snapshot`, `visual` — after source changes, writing/fixing tests per the project's conventions and running that suite until it passes — use when changes affect many suites that must run in parallel

##### Inputs

- `suite`: the single test suite you own, e.g. `unit`, `e2e`, `snapshot`
- `changed-files`: list of source files that changed and relate to this suite
- `conventions`: the project's test patterns — naming, structure, assertion style, mock strategy, data strategy (`factories`/`fixtures`/`builders`)
- `runner-command`: command to run the suite, e.g. `bun run test`, `pnpm test:e2e`

##### Tools

- `read`, `grep`, `find_file_by_name` — read the original source and tests
- `edit`, `write` — write/fix test files
- `exec` — run the suite runner, lint, typecheck

##### Execute

1. Read the source in `changed-files` — identify the branches, code paths, and error shapes this suite must cover
2. Read the suite's existing test files — find tests that are stale, missing, or broken by the changes
3. Write/fix tests per conventions: AAA pattern, `should [expected] when [condition]` test names, assert behavior not internals
4. Run the suite's `runner-command` — if FAIL, separate test bug vs app bug: fix the test for a test bug, report an app bug without changing source
5. Retry up to 3 rounds per failure — if it still fails, return `blocked` with the reason

##### Output Contract

Return the result as a suite update summary:

| No. | File | Action | Tests | Result |
|-----|------|--------|-------|--------|
| 1 | `tests/unit/user.test.ts` | `updated` | 12 | `pass` |

- `action`: `added` / `updated` / `removed` / `unchanged`
- End with the suite status: `pass` / `fail` / `blocked`, pass/fail counts, coverage delta (if measurable), files changed list

##### Constraints

- Own a single suite only — never touch other agents' suites or test files
- Never change source to make tests green — if a test reveals a bug, report it separately
- Deterministic only — no shared state, real time/random, `waitForTimeout` workarounds
- Don't hardcode credentials — use env vars/fixtures
- Update expectations only for an intended behavior change
- Canonical runners per layer → /test-<domain> (unit, api, cli, component, contract, database, e2e, integration, load, mobile, mutation, property, smoke, a11y, visual, website) — orchestrate via /deep-test all

## Expected Outcome

- Tests cover every layer the scope requires, with the project's conventions
- `/run-test all` passes — deterministic, no flaky
- Coverage meets the target, specs are synced with the test cases
- The report summarizes per layer, with raw results persisted in `.devin/temp/report/`
