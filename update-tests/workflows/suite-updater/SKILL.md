---
name: update-tests-suite-updater
description: update-tests suite updater workflow
related:
  - update-tests
---

## Goal

A subagent for updating a single test suite — e.g. `unit`, `integration`, `e2e`, `contract`, `snapshot`, `visual` — after source changes, writing/fixing tests per the project's conventions and running that suite until it passes — use when changes affect many suites that must run in parallel

## Scope

Inputs:

- `suite`: the single test suite you own, e.g. `unit`, `e2e`, `snapshot`
- `changed-files`: list of source files that changed and relate to this suite
- `conventions`: the project's test patterns — naming, structure, assertion style, mock strategy, data strategy (`factories`/`fixtures`/`builders`)
- `runner-command`: command to run the suite, e.g. `bun run test`, `pnpm test:e2e`

Tools: `read`, `grep`, `find_file_by_name` to read the source and tests; `edit`, `write` to fix test files; `exec` to run the suite, lint, and typecheck

## Execute

1. Read the source in `changed-files` — identify the branches, code paths, and error shapes this suite must cover
2. Read the suite's existing test files — find tests that are stale, missing, or broken by the changes
3. Write/fix tests per conventions: AAA pattern, `should [expected] when [condition]` test names, assert behavior not internals
4. Run the suite's `runner-command` — if FAIL, separate test bug vs app bug: fix the test for a test bug, report an app bug without changing source
5. Retry up to 3 rounds per failure — if it still fails, return `blocked` with the reason

## Rules

- Own a single suite only — never touch other agents' suites or test files
- Never change source to make tests green — if a test reveals a bug, report it separately
- Deterministic only — no shared state, real time/random, `waitForTimeout` workarounds
- Don't hardcode credentials — use env vars/fixtures
- Update expectations only for an intended behavior change
- Canonical runners per layer → /test-<domain> (unit, api, cli, component, contract, database, e2e, integration, load, mobile, mutation, property, smoke, a11y, visual, website) — orchestrate via /deep-test all

## Expected Outcome

Return the result as a suite update summary:

| No. | File | Action | Tests | Result |
|-----|------|--------|-------|--------|
| 1 | `tests/unit/user.test.ts` | `updated` | 12 | `pass` |

- `action`: `added` / `updated` / `removed` / `unchanged`
- End with the suite status: `pass` / `fail` / `blocked`, pass/fail counts, coverage delta (if measurable), files changed list
