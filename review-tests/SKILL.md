---
name: review-tests
description: Review test strategy, cases, coverage and flakiness, then fix the suite
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - review-test
  - check-flaky-tests
  - deep-test
  - update-tests
  - run-test
  - run-verify
  - improve
  - follow-tool-vitest
  - follow-tool-playwright
  - use-subagents
  - suggest-next-action
  - ask-me
---

## Goal

Review a test suite for false confidence — assertions that cannot fail, gaps that matter, flaky specs, and slow runs — then fix the confirmed findings through `/update-tests` and the suite's own tools

## Scope

Use before trusting a suite, after a green run that felt too easy, or when coverage/flakiness changed — a package, workspace, app, or diff

- Entered through `/deep-review` with the `tests` or `test` signal, or called by name; the dispatch keeps scope and flags intact
- The evidence pass is owned by `/review-test` (the `tests` and `test-data-hygiene` matrix rows) plus `/check-flaky-tests`; this preset runs them, confirms the findings, orders them by risk, and owns the fix and re-verify
- Fixing is owned by `/update-tests` (write/restructure specs) and `/improve tests` (suite health); `/deep-test` owns running the domains (`unit`, `integration`, `e2e`, `api`, `test-correctness`, `coverage`, `mutation`)
- Tests that are green but assert the wrong behavior are the highest-risk finding and outrank coverage numbers
- Production code that is wrong → `/deep-review-codebase-everything`; tests that fail because of a real bug are not "fixed" by editing the test
- Without `then-fix` the run is report-only: a findings table with `file:line` plus the run/re-run evidence

## Execute

### 1. Think

> Goal: know what the suite claims to protect and how it is run

1. Run `/deep-thinking` on the scope — which behaviors matter (money, auth, data, core flows), which layers exist (unit/integration/e2e), and what the suite is supposed to guarantee
2. Read the project `AGENTS.md` test commands and the test config (`vitest`, `playwright`, runner, coverage settings) — the suite is judged against its own declared intent
3. Identify the gate: what CI runs, what the local `run-test` runs, and where they differ — a test that never runs in CI protects nothing
4. Pick the mode: `[scope]` limits packages/files; `--diff` reviews the tests touched by the change plus the specs that cover the changed code

### 2. Establish The Baseline

> Goal: a green baseline and a coverage number before judging

1. Run `/run-test` for the scope — record pass/fail, duration, and skips; red → classify first (real bug vs broken test) before any review conclusion
2. Capture the current coverage number with the project's coverage command when one exists; no tooling → note it and continue with strategy evidence
3. Record the runner version and the exact commands used, so the re-run compares like for like

### 3. Scan

> Goal: one evidence pass over the test dimension

1. Run `/review-test` on the scope — it resolves the `tests` and `test-data-hygiene` rows through `/deep-review-codebase-everything`; read its findings, do not rerun the analyzer
2. Run `/check-flaky-tests` for re-run/CI-history evidence on the suspected specs — quarantine policy belongs to it, not here
3. Run `/deep-test test-correctness` for the static audit: assertions that cannot fail, tests with no assertion, catches that swallow, mocked-away subjects
4. Map the risk areas from step 1 to the specs that cover them — an untested money/auth/data path is a finding even at high line coverage

### 4. Confirm The Test Findings

> Goal: only findings that reduce real confidence enter the table

1. Classify each finding: `false-green` (asserts nothing/wrong thing), `gap` (critical behavior untested), `flaky` (non-deterministic), `brittle` (over-mocked, sleeps, ordering), `slow` (blocks the feedback loop), `hygiene` (shared state, leaked fixtures, no cleanup), `dead` (skipped forever, commented out)
2. Every finding cites the spec `file:line` plus evidence: the run result, the re-run inversion, or the assertion that cannot fail
3. Verify your own suspicion before reporting: run the spec, or show the exact assertion that makes the test unable to fail — a coverage number alone is not a finding
4. Cross-reference: one missing fixture cleanup often explains several flaky specs → one item with every affected spec
5. A failing spec caused by a real product bug → routed to the code owner, with the failure kept as the evidence

### 5. Order The Fix

> Goal: restore trust in the suite in the right order

1. Order by risk: `false-green` → `gap` on money/auth/data → `flaky` → `brittle` → `slow` → `hygiene` → `dead`
2. A flaky spec is quarantined with owner + expiry before it is fixed, per `/check-flaky-tests`, so it stops masking other failures
3. Coverage targets are not the goal — close the highest-risk gaps first, then re-measure; never raise a number by testing getters
4. Large suite work → `/create-plan-in-dot-agents`; a missing framework → `/follow-tool-vitest` (or the stack's runner), and browser flows → `/follow-tool-playwright`, before writing specs
5. Without `then-fix` → stop here, report the ordered table with evidence, and close with `/suggest-next-action`

### 6. Fix Through The Test Owners

> Goal: tests that lock behavior, not tests that lock implementation

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follow the report as-is
2. Hand the confirmed set to `/update-tests` — one behavior per test, assert the public contract, no placeholder assertions, no `expect(true)`; for a production behavior that is untested, write the failing test first and let the code owner make it pass
3. Suite-level health (speed, structure, fixtures, mutation score) → `/improve tests`; browser flows → `/deep-test e2e`; coverage floors → `/deep-test coverage`
4. Never loosen or delete a failing assertion to make the suite green — a wrong expectation is corrected with evidence, a flaky test is quarantined, and a real bug is routed
5. Tests added for a fixed bug must fail before the fix and pass after it — otherwise they prove nothing
6. Persist what should not recur: a suite-health convention (fixture scope, no sleeps, quarantine expiry) → `/update-dot-agents-project rules`; a mechanically detectable pattern (assertion-less test, skipped forever) → `/update-astgrep-rules`

### 7. Verify

> Goal: the fixed suite is proven by the same instruments

1. Run `/run-test` on the scope — green, with the previously skipped/false-green specs now asserting
2. Re-run the flaky candidates several times (`--repeat` or the project's mechanism) — an inverted result is still flaky, not fixed
3. Re-run `/deep-test test-correctness` — zero assertion-less or unfalsifiable tests in the touched scope
4. Re-measure coverage when it was part of the findings and compare against the step 2 baseline; report the delta, not just the number
5. Run `/run-verify` and the CI test command — a local green that CI cannot reproduce is not verified
6. Re-scan the touched scope only (`--diff`) — the confirmed findings must be gone; anything still open is reported with the reason

### 8. Report

> Goal: the suite's trust level is visible and the next action is clear

1. Run `/report-review`: counts per class, pass/duration/coverage before → after, and the verification status
2. List the quarantined specs with owner and expiry, and the real bugs routed to code owners
3. Name the gaps deliberately left open with the reason
4. Close with `/suggest-next-action`

## Rules

- Evidence over suspicion — a finding needs a failing run, a re-run inversion, or an assertion proven unable to fail
- False green outranks missing coverage; a high percentage over unfalsifiable tests is worse than a low honest one
- Never weaken a test to pass — correct it with evidence, quarantine flakiness with an expiry, or route the real bug
- Tests assert public behavior, never internal call sequences that freeze the implementation
- Coverage is a map, not a goal — close risk-first gaps, then measure
- One behavior per test; a test added for a fix must fail without the fix
- Report-only unless `then-fix`; with `then-fix`, only the confirmed set is changed, through the test owners
- Never commit or push unless asked; never leave a quarantined spec without an owner and expiry
- Use `/use-subagents` if needed — independent suites or packages repaired in parallel with disjoint file sets

## Expected Outcome

- A suite whose green means something: no unfalsifiable assertions in the reviewed scope, risk-first gaps closed, flaky specs quarantined or fixed
- Before → after evidence for pass rate, duration, and coverage, with the same commands and runner
- Remaining gaps and quarantined specs named with an owner and reason
- Without `then-fix`: an evidence-backed, risk-ordered test table and no edits
