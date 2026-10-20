---
name: review-events
description: Review event handling — ordering, idempotency, delivery — with evidence
argument-hint: "[scope]"
related:
  - deep-review
  - update-review-cli
  - run-review
  - report-review
  - use-subagents
  - improve
  - suggest-next-action
---

## Goal

Review the `events` dimension of a scope and return evidence-backed findings with severity — a thin entry that delegates the checks to the `/deep-review` row(s) `events` instead of keeping its own catalog

## Scope

Use when a scope needs the `events` dimension reviewed on its own — before a release gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-events`

- resolves to the matrix row(s) `events` in `deep-review/references/dimension-matrix.md` — that row's `Tier`, `Applies to`, `Evidence` (`manual`), `Default severity`, and `N/A condition` decide eligibility; this skill never re-decides them
- this dimension has no CLI slice (`CLI domain: —`) — gather evidence with the matrix `Tool/skill` under the `manual` route, and record any missing tool as a gap through `/update-review-cli`
- fixes are out of scope — the owner route is `/improve events`; apply them only after the user confirms via `/deep-review <scope> then-fix`
- whole-scope, multi-dimension review → `/deep-review`; provably wrong behavior only → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: Understand the scope before judging it

1. `/deep-thinking` on the scope — which `events` risks this artifact can actually carry, and whether the matrix `N/A condition` applies
2. `/deep-analyze` for the structure, stack, and the files this dimension touches
3. `/deep-validate` on the evidence sources — the analyzer output, the `reports/review-report.json` slice, or the named files — before trusting them

### 2. Review The Dimension

> Goal: Evidence-backed findings, no guessing

1. Take the CLI slice through `/run-review` (`--domain <domain>`, plus `--severity` to narrow); no slice → run the matrix `Tool/skill` first and review that output as the evidence source
2. Use `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
3. Cross-check every finding in the real file; a finding without `file:line` is dropped, never downgraded
4. Take the severity from the matrix `Default severity` plus its upgrade/downgrade trigger — the only legal way to move off the default
5. Score the dimension: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: One chat table, then the next action

1. Report via `/report-review` — summary (score/grade, findings by severity, scope) then the findings table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve events` as the owner route, `/update-review-cli` when the analyzer lacks this dimension

## Rules

- Evidence first — every finding cites `file:line`; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill is a thin entry and must not restate them
- Skip only for the matrix `N/A condition`, and quote it as the reason
- Use `/use-subagents` if needed — independent areas are reviewed in parallel, one subagent per area
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after the user confirms
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-events` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against the matrix row(s) `events` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve events` and closed with `/suggest-next-action`
