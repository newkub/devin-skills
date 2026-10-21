---
name: review-dx
description: Review developer experience — onboarding, scripts, friction — with evidence
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
  - optimize
  - suggest-next-action
---

## Goal

Review the `dx` dimension of a scope — onboarding, scripts, build speed, repository hygiene — and return evidence-backed findings with severity — a thin entry that resolves its matrix rows and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope needs the `dx` dimension reviewed on its own — before its gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-dx`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `bundle-size` | `artifact-match` | `cli` | `quality` | `/optimize bundle` |
| `ci-cd` | `artifact-match` | `cli` | `config` | `/optimize ci` |
| `repo-hygiene` | `artifact-match` | `cli` | `config` | `/improve code-quality` |
| `onboarding-dx` | `on-demand` | `capture` | `—` | `/improve dx` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is these rows plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the rows mix routes — `cli` rows use the `quality`/`config` slice built by `/update-review-cli` and run by `/run-review`; `onboarding-dx` runs a fresh-clone trial via `/run-dev` first and passes the timing in; a missing slice or rule pack → `/update-review-cli`
- fixes are out of scope — the owner routes are `/optimize bundle`, `/optimize ci`, `/improve code-quality`, and `/improve dx`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `dx` risks this artifact can carry (slow onboarding, unreviewed deploy path, bloated bundle, dirty history), and whether any row's `N/A condition` applies
2. `/deep-analyze` — scripts, workflows, bundle output, and git history shape
3. `/deep-validate` — the analyzer slice and the fresh-clone measurement before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> bundle-size, ci-cd, repo-hygiene, onboarding-dx` — the canonical run for these rows; it adds the `always` tier and owns every check
2. `cli` rows → take the `/run-review` slice (`--domain quality`, `--domain config`); `capture` row → run the fresh-clone trial through `/run-dev` and pass the setup timing and failures in
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/optimize bundle`, `/optimize ci`, or `/improve dx` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line` or a measured setup time; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-dx` completed with a score, grade, and severity-ordered findings, each with `file:line` or a measurement
- Coverage stated against rows `bundle-size`, `ci-cd`, `repo-hygiene`, and `onboarding-dx` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/optimize bundle`, `/optimize ci`, `/improve code-quality`, and `/improve dx`, then closed with `/suggest-next-action`
