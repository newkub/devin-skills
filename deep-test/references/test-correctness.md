# Deep Test — Test-Correctness Domain

Verify that test cases `assert what is truly correct`, not merely pass — expected values come from the requirement rather than copied from a buggy implementation, mocks/stubs match the real dependency's API, test names match what they verify, no vacuous tests (merged from the deleted `/check-test-correctness`)

- Static audit — answers "if the implementation were wrong, would this test actually fail?" without running the suite
- Covers: spec-first assertions, mock drift, vacuous/false-positive tests, name-vs-body, stale snapshots, floating async promises
- Complementary to `references/mutation.md`: this domain reads the assertions, mutation proves them empirically

> Pre-Run: run `/deep-review` (domain `review-test`) first for strategy/structure findings — never skip; blockers get fixed or reported before the audit

## Run Quick Path

> Goal: audit only the tests touched by the current diff

1. Scope — changed test files (`git diff --name-only -- '*test*' '*spec*'`); no test in the diff → report "nothing to audit" and stop
2. Extract intent — for each test, the claim from its name/describe block vs the assertions actually present
3. Flag — vacuous pattern list (`## 3`); every finding carries `file:line`
4. Report — chat table via `/report-review`; route fixes → `/update-tests` (never edit tests in this domain)

## 1. Extract Test Intent

> Goal: Understand what each test intends to verify

1. Read the test name/describe block — identify the expected behavior it claims
2. Identify the assertions actually present in the test body
3. Find the spec/requirement the test references (issue, docs, contract) if any
4. Run `/use-scripts` if you need to extract from multiple files

## 2. Verify Assertions Against Behavior

> Goal: Confirm the assertion checks the right thing, not what the implementation currently does

1. Expected values → compare against the spec/requirement/contract, not copied from implementation output
2. Mocks/stubs → signature and return shape match the real dependency (`grep` to compare against the dependency's source)
3. Assertions → genuinely cover the test name's claim (a test named "rejects invalid" must have a negative assertion)
4. Snapshot tests → snapshots are not stale and not auto-updated to mask bugs (`--ci` mode forbids `-u`)
5. Async tests → complete `await`/resolves assertions, not a floating promise that always passes

## 3. Detect Vacuous And False-Positive Patterns

> Goal: Find tests that pass without verifying anything

- No assertion at all, or only asserting "doesn't throw" without specifying the result
- Assertion on the mock itself (`expect(mock).toHaveBeenCalled` without checking args/effect)
- `expect(true).toBe(true)`, tautological assertions, try/catch that swallows failures
- Conditional assertions (`if (x) expect(...)`) that silently skip
- Copy-paste tests whose name doesn't match the body

## 4. Report And Route

> Goal: Report and route

1. Produce a `/report` table: No, File, Line, Test, Problem, Severity, Suggested Fix
2. Severity: `high` (vacuous/false-positive — the test doesn't guard against bugs), `medium` (weak assertion/mock drift), `low` (naming mismatch)
3. Route fixes → `/update-tests` or `/deep-review` for a redesign
4. If there are no findings → report "test assertions verified" — confirm the suite is still green with `/run-test unit`
5. Run `/suggest-next-action`

## Rules

### 1. Spec First

- Expected behavior follows the spec/requirement/contract — never treat the current implementation as truth (the implementation may be a bug the test is locking in)
- If there is no spec → mark "unverified" and note that a requirement source is needed

### 2. Evidence-Based

- Every finding must include `file:line`, the test name, and the reason the assertion doesn't check what it claims
- Mock drift must be compared against the dependency's real signature, not guessed

### 3. Discipline

- Check only, don't modify tests — fixes go through `/update-tests` or `/deep-review`
- Don't flag a test intended as a smoke/contract test as vacuous when its intent is clear

### 4. Static Domain

- This domain does not execute the suite — running belongs to `unit`/`integration`/`e2e`/`api`/`cli` and the `all` orchestrator's fail-fast order
- Use it as a gate before `/run-verify`, and pair it with `mutation` when a weak-assertion claim needs empirical proof

## Expected Outcome

- Every test in scope is verified as asserting the right thing, or marked unverified
- A list of vacuous/false-positive/mock-drift tests with file:line
- Routed to the correct fix skill (`/update-tests`, `/deep-review`)
