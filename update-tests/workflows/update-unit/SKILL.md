---
name: update-tests-update-unit
description: Update unit tests to match refactored/signature-changed code — mocks, assertions, test structure — while asserting behavior, not internals
related:
  - update-tests
---

## Goal

Update unit tests to match refactored/signature-changed code — mocks, assertions, test structure — while asserting behavior, not internals

## Scope

- Use when a refactor, rename, signature change, or restructure causes unit tests to fail/become outdated
- Covers: Vitest/Jest/bun test/pytest as the project uses — mocks, fixtures, parameterized tests
- e2e → `workflows/update-e2e/SKILL.md`; snapshots → `workflows/update-snapshot/SKILL.md`

## Execute

### 1. Map Breakage To Changes

> Goal: Know which test fails because of which change

1. Run `/run-test` — collect failing tests with errors
2. Map failures to the code diff — signature changed, module moved, behavior changed intentionally, or behavior lost
3. Separate: outdated test (update the test) vs genuine regression (app bug → `/resolve-errors` or report)

### 2. Update Tests To New Contracts

> Goal: Tests match the new public contract

1. Update imports/paths to the new structure — following the project's original conventions
2. Update calls to the new signature — params, return shape, error types
3. Update mocks to match the new boundary — mock only external deps, never mock internal pure functions
4. If behavior changed intentionally → update expectations; if a test reveals lost logic → flag before deleting

### 3. Cover New Paths

> Goal: New code paths have complete tests

1. A refactor that adds new branches/functions → add test cases per `/update-tests`' code-path map
2. Preserve the AAA pattern and `should [expected] when [condition]` test names per the project
3. Run `/deep-review-codebase` — no shared state, complete cleanup

### 4. Run And Verify

> Goal: The suite is green and deterministic

1. `/run-test` passes the scope you changed, then re-run 2-3 times — no flaky
2. `/run-check` lint/typecheck passes on the test files you changed
3. `/report-before-after` — tests updated/added/removed per module

## Rules

- Assert behavior/output + error shape — never assert internals or private state
- Never change source to make a test pass — if a test reveals a regression → fix the bug separately
- Never delete tests covering existing behavior — delete only genuinely cut behavior
- Fix-verify loop up to 3 rounds per test → if it still fails, stop and report

## Expected Outcome

- Unit tests match the new implementation and pass deterministically
- Coverage doesn't drop below pre-refactor — new paths have tests
- The report summarizes tests changed/added/removed with reasons
