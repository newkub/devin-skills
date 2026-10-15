# Deep Test — Coverage Domain

Analyze test coverage, detect the framework, and reach 100% coverage in every category.

## Run Quick Path

> Goal: measure and close to the target with the least setup (merged from `/test-coverage`) — steps 1-5 below are the deep pass

1. Scope — audit the coverage config with `/deep-review` first; include/exclude from the argument + signals ("logic-only" → drop UI/runtime-bound modules and record the reason); always exclude tests/generated/type-only; set `thresholds` to the target so failures are explicit
2. Baseline → close gaps → re-measure — feed the uncovered analysis into `/deep-review coverage`, the loop owner: prioritize, write tests via `/update-tests`, re-run; a test exposes a source bug → `/resolve-errors`, never adjust the assertion; ≥3 iterations without progress → stop + report the blocker
3. Validate — uncovered = 0 in the raw JSON (watch for files missing because they were never included); every branch side covered (ternary/optional-chain/short-circuit); re-run the suite 2 more times to confirm determinism
4. Report — persist → `.devin/temp/report/<workspace>/test-coverage-<time>.md` — baseline→final delta, files added, source bugs, exclusions + reasons

## 1. Detect Test Framework

> Goal: Detect Test Framework

1. Check `package.json` for test dependencies (`vitest`, `jest`, `mocha`, `pytest`, `go test`)
2. Check config files (`vitest.config.ts`, `jest.config.js`, `pytest.ini`, `go.mod`)
3. Check test file patterns (`*.test.ts`, `*_test.go`, `test_*.py`)
4. Check coverage tools supported by the framework (`c8`, `istanbul`, `coverage.py`, `go test -cover`)
5. Record the test framework and coverage tools in use

## 2. Setup Coverage Config

> Goal: Setup Coverage Config

1. Check the coverage config in the framework config
2. Set coverage thresholds to 100% for every category
3. Set the coverage output directory
4. Set coverage reporters (`html`, `json`, `text`, `lcov`)
5. Check coverage excludes for test files and config

## 3. Run Coverage Analysis

> Goal: Run Coverage Analysis

1. Run the coverage command for the framework (`bun run test:coverage`, `pytest --cov`, `go test -cover`)
2. Wait for the tests to finish
3. Verify the coverage report was generated
4. Record coverage metrics for every category
5. Record the report location

## 4. Verify And Loop Until 100% Coverage

> Goal: Verify And Loop Until 100% Coverage

Verify that coverage reaches 100% in every category; if not, write tests and re-run until 100%

1. Verify `lines` coverage reaches 100%
2. Verify `branches` coverage reaches 100%
3. Verify `functions` coverage reaches 100%
4. Verify `statements` coverage reaches 100%
5. If every category reaches 100% → go to Report
6. If coverage is below 100% → run `/deep-review` to analyze gaps and fill in the missing tests
7. If tests were written → go back to Step 3 and re-run Coverage Analysis
8. Loop at most 5 times; if exceeded → stop and report the remaining gaps

## 5. Report

> Goal: Report coverage result

1. If coverage reaches 100% → report framework, metrics, report location
2. If below 100% → report remaining gaps, failing categories, next step
3. Persist raw results → `.devin/temp/report/<workspace>/coverage-<time>.md` per the `/create-report-in-dot-devin` format — metrics table + gaps so `/update-docs` can reuse them
4. Run `/suggest-next-action`

## Rules

### 1. Coverage Metrics

- `lines` - % of lines executed
- `functions` - % of functions called
- `branches` - % of branches tested
- `statements` - % of statements executed
- Every category must reach 100%

### 2. Coverage Threshold And Loop

- Only 100% coverage in every category passes
- If coverage is below 100%, run `/deep-review` to analyze gaps and write the missing tests
- Loop run coverage → write tests → run coverage until 100%, at most 5 rounds
- If more than 5 rounds → stop and report the remaining gaps
- No exceptions for critical code, edge cases, or error paths

- Use /improve coverage if needed
- Use /deep-review if needed
- Use /run-check if needed
- Use /run-verify if needed
- Use /suggest-next-action if needed

## Expected Outcome

- The test framework is correctly identified
- Coverage config is set with 100% thresholds for every category
- A coverage report is generated
- Coverage reaches 100% in every category, or remaining gaps are reported with a next step
