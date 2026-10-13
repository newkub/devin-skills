---
name: review-test
description: Review test strategy, test cases, test results, coverage, flaky — thin entry → /deep-review domain review-test
argument-hint: "[scope] [flaky|coverage|report-flaky]"
related:
  - deep-review
  - improve-tests
  - run-test
  - deep-test
  - update-tests
  - report
---

## Goal

Review test strategy and quality (before running/writing) + analyze test results after a run (pass/fail, coverage delta, flaky) — the canonical `review-test` domain lives in `deep-review/SKILL.md` `## Review Domains`

## Scope

- Use before `/run-test all`, `/update-tests`, `/deep-test` — check the strategy: coverage, edge cases, isolation, pyramid balance, regression
- Use after a test run — analyze results, coverage delta, flaky tests, and summarize the next actions
- If improvements need fixing → `/improve-tests`

## Execute

1. Run `/deep-review` domain `review-test` on the scope — canonical steps (prepare → coverage → edge cases → isolation → pyramid → results) live in `deep-review/SKILL.md` `## Review Domains` + `## Domain Pipeline`
2. If the argument matches a workflow (`flaky`, `coverage`/`improve-coverage`, `report-flaky`) → forward to that workflow of the original domain
3. Run `/report` to summarize findings + `/suggest-next-action`

## Rules

- Never duplicate review steps here — the canonical version is in `deep-review/SKILL.md` domain `review-test` only
- Review only — fix via `/deep-review-then-fix` or `/update-tests` after user confirmation

## Expected Outcome

- Test strategy/results reviewed through the canonical domain, with findings + next action
