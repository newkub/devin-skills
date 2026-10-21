---
name: review-security
description: Review security — authz, input, secrets, supply chain — with evidence
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

Review the `security` dimension of a scope — authorization, input handling, secrets, supply chain — and return evidence-backed findings with severity — a thin entry that resolves its matrix row and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope needs the `security` dimension reviewed on its own — before its gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-security`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `security` | `always` | `cli` + `capture` | `security` | `/improve security` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is this row plus the five other `always` rows (`correctness`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the row takes the `cli` plus `capture` route — use the `security` slice built by `/update-review-cli` and run by `/run-review`, then add the capture passes (`/scan-security`, `/follow-tool-semgrep`, `/follow-tool-gitleaks`); a missing slice or rule pack → `/update-review-cli`
- fixes are out of scope — the owner route is `/improve security`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `security` risks this artifact can carry (exploitable path, missing check, leaked secret, poisoned dependency), and whether the row's `N/A condition` applies
2. `/deep-analyze` — trust boundaries, entry points, auth model, and the secret surface
3. `/deep-validate` — the analyzer slice and scanner output before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> security` — the canonical run for this row; it adds the other `always` rows and owns every check
2. `cli` row → take the `/run-review` slice (`--domain security`); `capture` side → run `/scan-security`, `/follow-tool-semgrep`, and `/follow-tool-gitleaks` (plus `/follow-tool-deepsec` for a full pass) and pass that output in as the evidence slice
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve security` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line` and the exploit path; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-security` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against row `security` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve security`, then closed with `/suggest-next-action`
