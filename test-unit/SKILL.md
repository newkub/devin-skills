---
name: test-unit
description: Run unit/fast tests — auto-detect framework, classify failures with root cause
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-install
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

Run the project's unit tests — pure functions, edge cases, parameterized tests — auto-detect the runner, split failures into source vs test issues, and report results with root cause

## Scope

Default domain of `/run-test` — used for running unit/fast tests (no real database, network, file I/O)

Covers framework detection: Vitest, Jest, Bun test, Node test runner, Mocha, pytest, go test, cargo test, dotnet test, cargo nextest

- To update/write tests → `/update-tests` (this skill is run-only, it does not edit tests)
- For deep analysis → `/deep-test`
- Other domains → `/run-test <domain>` → `/test-<domain>`

## Execute

> Pre-Run: Always run `/deep-review` first — `test-*` skills must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (test)

### 1. Detect Test Framework

> Goal: Determine the test framework the project actually uses

1. Check `package.json` — `scripts.test`, `scripts.test:unit`, devDependencies (`vitest`, `jest`, `@vitest/*`, `mocha`, `tap`, `ava`)
2. Check config files — `vitest.config.ts`, `vite.config.ts` (test block), `jest.config.*`, `pytest.ini`, `pyproject.toml` ([tool.pytest]), `go.mod`, `Cargo.toml`, `*.csproj`
3. Check test file patterns — `*.test.*`, `*.spec.*`, `test_*.py`, `*_test.go`, `#[cfg(test)]`, `*_test.rs`, `__tests__/`
4. If monorepo → use the workspace runner (`moon run :test`, `turbo run test`, `bun run --filter '*' test`, `pnpm -r test`)
5. If multiple frameworks → run every one found, report separately

### 2. Run Tests

> Goal: Run tests with the correct command

1. Always prefer the script from `package.json` / task runner config (e.g. `bun run test`, `bun test`)
2. Fallback per framework:
   - Vitest → `bunx vitest run`
   - Jest → `bunx jest --runInBand` (serial if flaky) or `bunx jest`
   - Bun → `bun test`
   - Node → `node --test`
   - Python → `pytest` / `python -m pytest`
   - Go → `go test ./...`
   - Rust → `cargo test` or `cargo nextest run`
   - .NET → `dotnet test`
3. Use `--reporter=verbose` or the equivalent when per-test results are needed
4. Use filter/pattern when a scope is given (`bunx vitest run src/foo`, `pytest tests/unit/test_x.py::test_y`, `go test ./pkg/... -run TestX`)
5. Record results, duration, and the list of failing tests

### 3. Classify Failures

> Goal: Separate source issues from test issues

1. Classify each failure:
   - assertion fail → check whether expected or actual is wrong
   - error/exception → read the stack trace to find file:line
   - timeout → performance or hanging async
   - environment → missing deps, wrong cwd, missing fixtures
2. Never edit an assertion just to pass — if the source is wrong → fix the source (`/resolve-errors`); if the test is outdated → `/update-tests`
3. If the same failure recurs → stop and report instead of looping fixes

### 4. Report

> Goal: Report results clearly

1. Summary: passed/failed/skipped/total, duration, framework used
2. List failures with file:line and classification (source/test/environment)
3. persist raw results → if the runner is Vitest, keep JSON via `vitest run --reporter=json --outputFile=.devin/temp/report/<workspace>/vitest-<time>.json` then write summary `.devin/temp/report/<workspace>/unit-test-<time>.md` following the `/create-report-in-dot-devin` format — so `/update-docs` can reuse it (other runners write only the summary md)
4. If a coverage flag exists → continue with `/test-coverage`
5. If all tests pass and full verification is wanted → `/run-verify`

## Rules

### 1. Test Scope

- Unit tests test pure functions only — no real database, network, or file I/O
- Use mocks/stubs for dependencies
- Each test must be independent and runnable separately

### 2. Performance

- Unit tests must be fast (< 10ms per test on average)
- No unnecessary `setTimeout`/`sleep`
- Use parallel execution if the framework supports it

### 3. Edge Cases

- Test happy path, edge cases, and error cases
- Test boundary values, null/undefined/empty inputs
- Test parameterized cases

### 4. Failure Discipline

- Never use `.skip`, `.only`, `xit`, `xtest` to avoid failures
- Never edit a test or source without evidence from inspection
- If a failure comes from a missing dependency → `/run-install`
- Use `/test-all` when multiple domains must run
- Use /run-check if needed
- Use /run-watch if needed
- Use /suggest-next-action if needed

## Expected Outcome

- Unit tests run with the correct runner — the report is clear and persisted in `.devin/temp/report/`
- Failures classified as source/test/environment with file:line
- No failure suppression
