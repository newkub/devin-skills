---
name: review-test
description: Review test strategy, cases, results, coverage, flaky — thin entry → /deep-review-codebase test domain
argument-hint: "[scope] [flaky|coverage|report-flaky]"
related:
  - deep-review-codebase
  - improve
  - run-test
  - deep-test
  - update-tests
  - report
---

## Goal

Review test strategy and quality (before running/writing) + analyze test results after a run (pass/fail, coverage delta, flaky) — the canonical `review-test` domain lives in `deep-review-codebase/SKILL.md` `## Review Domains`

## Scope

- Use before `/run-test all`, `/update-tests`, `/deep-test` — check the strategy: coverage, edge cases, isolation, pyramid balance, regression
- Use after a test run — analyze results, coverage delta, flaky tests, and summarize the next actions
- If improvements need fixing → `/improve tests`

## Execute

1. Run `/deep-review-codebase` domain `review-test` on the scope — canonical steps (prepare → coverage → edge cases → isolation → pyramid → results) live in `deep-review-codebase/SKILL.md` `## Review Domains` + `## Domain Pipeline`
2. If the argument matches a workflow (`flaky`, `coverage`/`improve coverage`, `report-flaky`) → forward to that workflow of the original domain
3. Run `/report-review` to summarize findings (chat table, no files) + `/suggest-next-action`

## Rules

- Deep pre-pass (`/deep-thinking` → `/deep-analyze` → `/deep-validate`) per the `review-*` convention (`update-devin-global-skills` `## Conventions → Templates`) — this thin entry forwards to canonical `/deep-review-codebase`, which holds those steps
- Never duplicate review steps here — the canonical version is in `deep-review-codebase/SKILL.md` domain `review-test` only
- Review only — fix via `/deep-review-codebase-then-fix` or `/update-tests` after user confirmation

## Expected Outcome

- Test strategy/results reviewed through the canonical domain, with findings + next action
