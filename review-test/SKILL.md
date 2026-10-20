---
name: review-test
description: Review test strategy, cases, coverage, flaky — thin entry to the test dimension
argument-hint: "[scope] [flaky|coverage]"
related:
  - deep-review
  - update-review-cli
  - run-review
  - report-review
  - improve
  - run-test
  - deep-test
  - update-tests
  - use-subagents
---

## Goal

Review test strategy and quality (before running/writing) + analyze test results after a run (pass/fail, coverage delta, flaky) — the canonical `test` dimension contract is the matching row in `deep-review/references/dimension-matrix.md` (no inline domain catalog in `deep-review/SKILL.md`)

## Scope

- Use before `/run-test all`, `/update-tests`, `/deep-test` — check the strategy: coverage, edge cases, isolation, pyramid balance, regression
- merged label `coverage` routes here — pass `coverage` as the argument for the coverage-specific pass (`review-coverage` is an alias stub)
- Use after a test run — analyze results, coverage delta, flaky tests, and summarize the next actions
- The `cli` evidence behind the `test` row is built by `/update-review-cli` and run by `/run-review` (`CLI domain: quality`); a missing analyzer or rule pack is recorded through `/update-review-cli`, never patched here
- If improvements need fixing → `/improve tests`

## Execute

1. Run `/deep-review` with the `test` dimension on the scope — the `test` row of `deep-review/references/dimension-matrix.md` is the contract (evidence, severity, enforcement, gate); no steps are duplicated here
2. If the argument names a domain owned elsewhere (`flaky` → `/check-flaky-tests`, `coverage` → `/deep-test coverage`, `/improve coverage`) → forward to that owner
3. Run `/report-review` to summarize findings (chat table, no files) + `/suggest-next-action`

## Rules

- Deep pre-pass (`/deep-thinking` → `/deep-analyze` → `/deep-validate`) per the `review-*` convention (`update-devin-global-skills` `## Conventions → Templates`) — this thin entry forwards to canonical `/deep-review`, which holds those steps
- Never duplicate review steps here — the canonical version is the `/deep-review` run with the `test` dimension only
- Review only — fix via `/deep-review <scope> then-fix` or `/update-tests` after user confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Use `/use-subagents` if needed — review independent test areas in parallel, one subagent per area

## Expected Outcome

- Test strategy/results reviewed through the canonical domain, with findings + next action
