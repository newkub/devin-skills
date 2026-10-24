---
name: update-tests
description: Write/update tests across all layers — unit, integration, e2e, contract, visual — until green
argument-hint: "[scope-or-files|strategy|setup|test-env]"
related:
  - deep-review
  - deep-test
  - run-test
  - follow-tool-playwright
  - follow-tool-vitest
  - update-specs
  - use-subagents
  - resolve-errors
  - run-check
  - follow-lib-tstyche
  - report
  - suggest-next-action

---

## Goal

Write and update tests to cover every test type and every layer — unit, integration, e2e, contract, property-based, mutation, performance, security, accessibility, visual — following the project's conventions, then run until the whole suite passes

## Scope

Use when you want tests written/updated comprehensively — pick layers by scope: if files are given, check which layer they belong to and write every suitable type, not just unit

- If the suite hasn't been reviewed → run `/deep-review` first
- If you only want to run tests → `/run-test <domain>` matching the layer, or `/run-test all`
- If you want to improve test suite quality → `/deep-review test then-fix`
- If the scope spans many modules → dispatch via `/use-subagents`
- No test framework or suite yet, or the level/runner/scripts/layout need repair → `workflows/setup-strategy/SKILL.md` (`/update-tests strategy|setup`)
- Env vars, fixtures, test database, or the CI test env are missing → `workflows/config-test-env/SKILL.md` (`/update-tests test-env`)

## Execute

### 1. Detect Framework And Strategy

> Goal: Reuse the project's existing setup and lay out the test pyramid

1. Check manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for test deps (`vitest`, `jest`, `bun test`, `pytest`, `go test`)
2. Check existing config + test files — naming, structure, assertion style, mock patterns
3. Fix the strategy level (minimal/standard/complete), the pyramid share, and the coverage floor per [references/strategy.md](references/strategy.md) `## 1`–`## 5`
4. Define the layers and types required by the scope — per [references/layers.md](references/layers.md)
5. Define the data strategy: `factories` (dynamic), `fixtures` (static), `builders` (complex)
6. Define the mock strategy: mock only external deps — use real internal pure functions
7. No runner, scripts, or `tests/<layer>/` layout at all → dispatch `workflows/setup-strategy/SKILL.md` instead of writing specs into nothing

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

Follow [references/layers.md](references/layers.md) — unit, integration, e2e (Playwright per `/follow-tool-playwright`, Vitest per `/follow-tool-vitest`), contract, type-level (tstyche per `/follow-lib-tstyche`), property-based, mutation, performance, security, accessibility, visual

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
2. Persist raw results → `.devin/temp/report/<workspace>/update-tests-<time>.md` per the `/create-report-to-dot-agents` format so `/update-docs` can reuse them
3. Run `/suggest-next-action`

### Subagents

> Goal: Parallelize suite updates when changes affect many suites

- Use the `suite-updater` profile (`workflows/suite-updater/SKILL.md`) when you must update many independent test suites (unit/integration/e2e/snapshot) — spawn one suite at a time via `/use-subagents`, with each agent editing a different set of test files, then combine results before `/run-test all`

### Workflows

> Goal: Dispatch update work to the workflow matching the test layer

| Topic | Workflow |
|-------|----------|
| Set up a suite from zero (level, runner, scripts, layout) | `workflows/setup-strategy/SKILL.md` — `/update-tests strategy` |
| Configure test env, fixtures, test db, CI test env | `workflows/config-test-env/SKILL.md` — `/update-tests test-env` |
| Update e2e specs after UI/route changes | `workflows/update-e2e/SKILL.md` |
| Update unit tests after a refactor | `workflows/update-unit/SKILL.md` |
| Safely regenerate/review snapshots | `workflows/update-snapshot/SKILL.md` |

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


## Expected Outcome

- Tests cover every layer the scope requires, with the project's conventions
- The strategy level, runner config, scripts, and `tests/<layer>/` layout are in place — set up through `workflows/setup-strategy/` when missing
- `/run-test all` passes — deterministic, no flaky
- Coverage meets the target, specs are synced with the test cases
- The report summarizes per layer, with raw results persisted in `.devin/temp/report/`
