---
name: review-migration
description: Review migrations — reversibility, data safety, rollout — with evidence
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

Review the `migration` dimension of a scope — reversibility, data safety, rollout and dual-write windows — and return evidence-backed findings with severity — a thin entry that resolves its matrix row and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope contains schema or config migrations that need review on their own — before its gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-migration`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `migration` | `artifact-match` | `manual` | `config` | `/improve migration` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is this row plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the row takes the `manual` route — read every migration and its down path against the rollout plan; a missing tool or rule pack → `/update-review-cli` — the six `always` rows still get their `/run-review` analyzer slice
- fixes are out of scope — the owner route is `/improve migration`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `migration` risks this artifact can carry (irreversible drop, missing rollback, lock-heavy change, unbatched backfill), and whether the row's `N/A condition` applies
2. `/deep-analyze` — every migration in order, plus the deploy plan that runs it
3. `/deep-validate` — the migration diff and down scripts before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> migration` — the canonical run for this row; it adds the `always` tier and owns every check
2. `manual` row → audit each up/down pair and the flag gating (`/migration-with-astgrep` where the change is mechanical), then pass the verdicts in as the evidence slice
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve migration` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line`; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-migration` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against row `migration` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve migration`, then closed with `/suggest-next-action`
