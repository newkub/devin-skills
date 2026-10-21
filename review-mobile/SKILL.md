---
name: review-mobile
description: Review mobile code — platform guidelines and store rules — with evidence
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

Review the `mobile` dimension of a scope — platform guidelines, store rules, permissions, native behavior — and return evidence-backed findings with severity — a thin entry that resolves its matrix rows and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope needs the `mobile` dimension reviewed on its own — before a store submission, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-mobile`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `mobile` | `artifact-match` | `capture` | `—` | `/improve mobile-app` |
| `native-permissions` | `artifact-match` | `cli` | `config` | `/improve mobile-app` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is these rows plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the rows mix routes — `native-permissions` uses the `config` slice from `/update-review-cli` and `/run-review`; `mobile` runs `/follow-tool-maestro` flows first and passes the captures in; a missing slice or rule pack → `/update-review-cli`
- fixes are out of scope — the owner route is `/improve mobile-app`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `mobile` risks this artifact can carry (store rejection, unjustified permission, platform-pattern break, crash on a device state), and whether any row's `N/A condition` applies
2. `/deep-analyze` — app entry points, manifests, and the platform surfaces these rows touch
3. `/deep-validate` — the permission manifests and flow captures before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> mobile, native-permissions` — the canonical run for these rows; it adds the `always` tier and owns every check
2. `cli` row → take the `/run-review` slice (`--domain config`) for the manifest audit; `capture` row → run the `/follow-tool-maestro` flows and pass the captures in as the evidence slice
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve mobile-app` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line` or a flow capture; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-mobile` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against rows `mobile` and `native-permissions` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve mobile-app`, then closed with `/suggest-next-action`
