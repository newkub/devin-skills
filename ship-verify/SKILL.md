---
name: ship-verify
description: Verify gate before ship — review, validate, tests, dev run, usage checks until ready to push
argument-hint: "[scope]"
related:
  - follow-agents-md
  - update-agents-md
  - deep-review
  - deep-review-then-fix
  - deep-validate
  - update-tests
  - run-test
  - run-dev
  - test-usage
  - git-commit-and-push
  - report
  - refactor
  - update-project
  - follow-improve
  - follow-optimize
  - test-smoke
---

## Goal

A single verification gate before shipping any work — check `AGENTS.md`, review changes, validate correctness, pass tests, run the dev server, and confirm usage examples actually work — commit/push only once every gate passes

## Scope

- Use as the final gate before commit/push — every project being shipped must pass this skill
- **Verify only** — no commit/push in this skill (pushing happens in `/git-commit-and-push`)
- The canonical home of every verify step — other skills (e.g. `/update-agents-md`, `/new-skills`) reference here; never duplicate the verify workflow

## Execute

### 1. Follow AGENTS.md

> Goal: `AGENTS.md` is fresh and the source of truth before verify

1. Run `/follow-agents-md` — if `AGENTS.md` is missing or stale → always run `/update-agents-md` first
2. Read any additional ship/validate rules the project's `AGENTS.md` defines

### 2. Review Changes

> Goal: changes and `AGENTS.md` pass review before ship

1. Run `/deep-review` on the changed scope + `AGENTS.md` only
2. If there are findings → run `/deep-review-then-fix` until they all pass
3. Add `/review-devin-global-harness` when changing the devin skills repo

### 3. Validate

> Goal: correctness passes on every dimension

1. Run `/deep-validate` — cross-reference, type safety, conventions
2. Run the project's lint + typecheck — they must pass

### 4. Tests

> Goal: tests are complete and genuinely passing

1. Run `/update-tests` — test specs cover every layer of the changes
2. Run `/run-test all` — all suites must pass; on failure → fix the root cause and rerun

### 5. Runtime And Usage

> Goal: the app really runs and the docs match reality

1. Run `/run-dev` — the dev server must be healthy with no errors
2. Run `/test-usage` — usage examples from README/docs/`AGENTS.md` must actually work

### 6. Report

> Goal: summarize the verify result — ship or not

1. Run `/report` — table: `No. | Gate | Result | Evidence`
2. All passed → suggest `/git-commit-and-push` as the next action
3. Failed → report the blockers clearly; do not ship

## Rules

- Verify only — no `git commit`, `git push`, merge, or release in this skill
- Every gate must genuinely pass — never skip a failing gate; fix loop up to 3 rounds, then stop + report
- Skip a non-applicable gate only when the project truly lacks that artifact (e.g. no dev server → skip `/run-dev`) — state the reason in the report
- Never duplicate verify steps in other skills — reference `/ship-verify` only
- Use /test-smoke as a post-build sanity gate on critical paths

## Expected Outcome

- `AGENTS.md` fresh, review/validate/check passed, tests green, dev run works, usage matches reality
- A clear report of ready-to-ship status or the blockers found
- Ready to commit/push immediately once everything passes
