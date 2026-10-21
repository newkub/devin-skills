---
name: review-dot-devin
description: Review .devin assets — rules, skills, hooks, MCP wiring — with evidence
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

Review the `dot-devin` dimension of a scope — `.devin` rules, skills, hooks, MCP wiring, and agent guidance — and return evidence-backed findings with severity — a thin entry that resolves its matrix row and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a project's `.devin` assets need review on their own — before an agent-assisted change, after a harness update, or when `/deep-review` produced a finding whose owner is `review-dot-devin`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `ai-agent-assets` | `on-demand` | `manual` | `—` | `/improve devin-global-skills` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is this row plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the row takes the `manual` route — no analyzer slice exists (`—`), so read the assets and run the `review-devin-global-harness` checklist plus an MCP description audit; a missing tool or rule pack → `/update-review-cli` — the six `always` rows still get their `/run-review` analyzer slice
- fixes are out of scope — the owner route is `/improve devin-global-skills`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `ai-agent-assets` risks this artifact can carry (wrong guidance, stale reference, destructive default, dead hook), and whether the row's `N/A condition` applies
2. `/deep-analyze` — every asset under `.devin/` plus the global harness it depends on
3. `/deep-validate` — the referenced skills, hooks config, and MCP server entries before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> ai-agent-assets` — the canonical run for this row; it adds the `always` tier and owns every check
2. `manual` row → run the `review-devin-global-harness` checklist over the assets and audit every MCP tool description; pass the collected evidence in as the slice
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve devin-global-skills` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line`; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-dot-devin` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against row `ai-agent-assets` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve devin-global-skills`, then closed with `/suggest-next-action`
