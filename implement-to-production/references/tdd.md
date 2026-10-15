# Implement To Production — TDD Loop

Detail for `/implement-to-production` `### 6` step 5 (merged from `/follow-tdd`) — write the test before the implementation so every feature and behavior change lands with regression confidence and a cleaner design. Use it whenever work creates or changes behavior; skip it only for pure docs/config/style edits with no runtime behavior.

> Pre-Run: check the project's test framework is present and runnable — no framework or no coverage tooling → run `/implement-to-production setup-coverage` first; unclear behavior contract → `/ask-me` before writing the test

## 1. Understand The Requirement

> Goal: know the exact behavior before writing any test

1. Read the spec, issue, plan item, or `TODO.md` row for the behavior — the expected input/output and error cases must be nameable in one sentence
2. Check existing tests for the same unit — extend instead of duplicating; find the framework the project actually uses (`vitest`, `cargo test`/`nextest`, `go test`, `pytest`)
3. No test framework yet → `/follow-tool-vitest` (Bun/Node), `/follow-tool-nextest` (Rust), `/follow-tool-mutants-rs` for mutation strength — or `/use-related-skills` to find the right `follow-tool-*`
4. Pick the smallest testable behavior — one function, one rule, one endpoint response, not the whole feature

## 2. Write The Failing Test

> Goal: a red test that proves the feature does not work yet

1. One test = one behavior (single responsibility) with a name that states the scenario and the expectation (`rejects expired token`, not `test1`)
2. Assert on the real public contract (return value, thrown error, HTTP status, rendered state), never on internal calls that can change without breaking behavior
3. Run it and confirm it fails for the expected reason — a pass on the first run means the test asserts nothing or the feature already exists
4. No placeholder assertions, no empty tests kept for later

## 3. Make It Pass

> Goal: the minimum implementation that turns the test green

1. Write only enough code to satisfy the current test — no speculative branches, no extra features
2. Do not refactor in this step (Two Hats): structure changes belong to `### 4`
3. Run the whole suite, not only the new test — other tests broke → fix them before continuing
4. Add a dependency only when the manifest/catalog already justifies it (`/use-lib-effective`, `/use-my-packages-on-registry` before any external dep)

## 4. Refactor

> Goal: clean the code without changing behavior

1. Rename, remove duplication, split by concern — apply `/refactor` `## Rules` and its smell → technique catalog (`refactor/references/smells.md`)
2. Re-run the tests after each single refactoring — a red suite mid-refactor → revert that step, not the whole batch
3. Stop when the code reads clearly — `/dont-over-engineer`, no abstraction without a real second consumer (rule of three)
4. Structural changes here stay in a separate commit from the implementation commit

## 5. Repeat And Integrate

> Goal: cover every behavior in scope, then prove the system is green

1. Take the next behavior → loop `### 2`–`### 4`; `/git-commit` after each green cycle so any step is revertible
2. Cover the boundary cases the implementation revealed: empty input, invalid input, concurrent/duplicate calls, permission denied, upstream failure
3. Property-based or fuzz cases → `/deep-test property`; database-backed behavior → `/deep-test database`; cross-module contracts → `/deep-test contract`
4. When the item is done: run the full suite, `/run-check` (lint, typecheck), then `/run-verify` for project-wide verification

## Rules

### 1. Test First Always

- No production code without a failing test that it makes pass — a test written after the code cannot prove the behavior was locked
- Characterization tests first on untested legacy code: pin current behavior before refactoring (`/update-tests`)

### 2. One Behavior At A Time

- One test asserts one behavior; several behaviors in one test → split it
- One cycle commits one concern — never mix refactor, fix, and feature in a single commit

### 3. Real Verification

- Every cycle ends with a green run of the suite, not a visual check of the code
- Assertions that cannot fail are dead tests → remove or strengthen via `/check-test-correctness`

## Expected Outcome

- Every implemented behavior has a test written before it and the suite is green
- No `TODO`/mock/placeholder left in the covered paths; each cycle checkpoint-committed
- Code passes lint/typecheck/`/run-verify` with no regression and a simpler design than the first draft
