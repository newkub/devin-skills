---
name: review-test
description: Review test strategy, cases, coverage, flaky — thin entry to the test dimension
argument-hint: "[scope] [flaky|coverage]"
related:
  - deep-review-codebase
  - improve
  - run-test
  - deep-test
  - update-tests
  - use-subagents
---

## Goal

Review test strategy and quality (before running/writing) + analyze test results after a run (pass/fail, coverage delta, flaky) — the canonical `test` dimension contract is the matching row in `deep-review-codebase/references/dimension-matrix.md` (no inline domain catalog in `deep-review-codebase/SKILL.md`)

## Scope

- Use before `/run-test all`, `/update-tests`, `/deep-test` — check the strategy: coverage, edge cases, isolation, pyramid balance, regression
- Use after a test run — analyze results, coverage delta, flaky tests, and summarize the next actions
- If improvements need fixing → `/improve tests`

## Execute

1. Run `/deep-review-codebase` with the `test` dimension on the scope — the `test` row of `deep-review-codebase/references/dimension-matrix.md` is the contract (evidence, severity, enforcement, gate); no steps are duplicated here
2. If the argument names a domain owned elsewhere (`flaky` → `/check-flaky-tests`, `coverage` → `/deep-test coverage`, `/improve coverage`) → forward to that owner
3. Run `/report-review` to summarize findings (chat table, no files) + `/suggest-next-action`

## Rules

- Deep pre-pass (`/deep-thinking` → `/deep-analyze` → `/deep-validate`) per the `review-*` convention (`update-devin-global-skills` `## Conventions → Templates`) — this thin entry forwards to canonical `/deep-review-codebase`, which holds those steps
- Never duplicate review steps here — the canonical version is the `/deep-review-codebase` run with the `test` dimension only
- Review only — fix via `/deep-review-codebase <scope> then-fix` or `/update-tests` after user confirmation
- Use `/use-subagents` if needed — review independent test areas in parallel, one subagent per area

## Expected Outcome

- Test strategy/results reviewed through the canonical domain, with findings + next action
