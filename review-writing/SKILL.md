---
name: review-writing
description: Review writing — docs and UX copy clarity and accuracy — with evidence
argument-hint: "[scope]"
related:
  - deep-review
  - update-review-cli
  - run-review
  - report-review
  - use-subagents
  - review-issues
  - review-gaps
  - improve
  - suggest-next-action
---

## Goal

Review the `writing` dimension of a scope — documentation and UX copy for clarity, accuracy, and actionability — and return evidence-backed findings with severity — a thin entry that resolves its matrix rows and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope's written content needs review on its own — before its gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-writing`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `docs` | `always` | `cli` + `manual` | `quality` | `/improve docs` |
| `ux-writing` | `artifact-match` | `manual` | `quality` | `/improve writing` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is these rows plus the five other `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`), which `/deep-review` adds itself
- the rows mix routes — `docs` uses the `quality` slice from `/update-review-cli` and `/run-review`; `ux-writing` reads every user-facing string against the `improve-writing` criteria; a missing slice or rule pack → `/update-review-cli`
- fixes are out of scope — the owner routes are `/improve docs` and `/improve writing`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `writing` risks this artifact can carry (stale claim, unclear step, hidden destructive action, inconsistent term), and whether any row's `N/A condition` applies
2. `/deep-analyze` — every doc surface and every user-facing string, plus the code they describe
3. `/deep-validate` — the analyzer slice and the claim checks before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> docs, ux-writing` — the canonical run for these rows; it adds the other `always` rows and owns every check
2. `cli` row → take the `/run-review` slice (`--domain quality`); `manual` side → run `/check-reference` on every claim and an `/improve-writing` pass over the microcopy, then pass the verdicts in as the evidence slice
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve docs` or `/improve writing` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line`; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-writing` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against rows `docs` and `ux-writing` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve docs` and `/improve writing`, then closed with `/suggest-next-action`
