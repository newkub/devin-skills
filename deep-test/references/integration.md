# Deep Test — Integration Domain

Run integration tests to verify how modules, data flow, and integration points work together — excludes unit tests and E2E tests

- If integration tests need updating/writing → `/update-tests` (run-only, does not fix tests)

> Pre-Run: always run `/deep-review-codebase` (domain `review-test`) first — never skip; if findings are blockers, fix or report before running

## Run Quick Path

> Goal: run the existing integration suite only (merged from `/test-integration`) — use steps 1-4 below for the deep pass

1. Detect — `*.integration.test.*`, `tests/integration/`, testcontainers, compose files; the dependencies that must be up (DB, cache, queue); runner scope (`bunx vitest run '*.integration.test.*'`, `pytest -m integration`, `go test -tags=integration ./...`); monorepo → the workspaces with shared/service modules
2. Run — start dependencies (testcontainers auto-start or `compose up`) → verify health before running; record per-test status and dependency logs on failure; clean teardown, never leave containers/ports dangling
3. Classify — boundary/logic failure → source → `/resolve-errors`; wrong fixture/seed or outdated assertion → test → `/update-tests`; dependency won't start / port conflict / timeout → environment; shared-state interference → report + `/deep-review-codebase`; repeats ≥3 → stop+report
4. Report — persist → `.devin/temp/report/<workspace>/integration-test-<time>.md`; all pass → `/run-verify`

## 1. Detect Test Framework

> Goal: Detect the integration test framework the project uses

1. Check `package.json` for test dependencies
2. Check config files (`vitest.config.ts`, `jest.config.js`)
3. Check integration test file patterns (`*.integration.test.ts`, `test/integration/`)
4. Check test setup files for the integration environment

## 2. Setup Integration Environment

> Goal: Prepare the environment for integration tests

1. Check the test database setup (SQLite, PostgreSQL test instance)
2. Check mock servers or test containers
3. Check environment variables for the test environment
4. Check test fixtures and seed data

## 3. Run Integration Tests

> Goal: Run integration tests per framework

1. Run `bun run test:integration` if the script exists
2. If there is no script, run `bunx vitest run --config vitest.config.ts test/integration/`
3. Run `pytest tests/integration/` for Python
4. Record results, duration, and the list of failing tests

## 4. Review Test Results

> Goal: Inspect the results

1. View the test report from the framework
2. Inspect failed tests and error messages
3. Identify the failing integration points
4. Check the database state after the tests

## Rules

### 1. Test Scope

- Integration tests test interactions between modules
- Use a real database or a test database (not mocks)
- Test data flow from input to output
- Test error handling at integration points

### 2. Environment Isolation

- Use a separate test database, never production
- Clean up data after each test suite
- Use transactions and rollback where possible
- Do not share state between tests

### 3. Performance

- Integration tests may be slower than unit tests (< 100ms per test)
- Use parallel execution with caution
- If tests share a database, run them sequentially

- Use /run-check if needed
- Use /run-verify if needed
- Use /suggest-next-action if needed

## Expected Outcome

- All integration tests pass
- The test report clearly shows the results
- Failing integration points are identified
- The database state is correct after the tests
