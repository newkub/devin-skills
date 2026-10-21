---
name: review-mcp
description: Review the MCP surface — tools, schemas, permissions — with evidence
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

Review the `mcp` dimension of a scope — tool descriptions, input schemas, permissions, PII handling — and return evidence-backed findings with severity — a thin entry that resolves its matrix row and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope exposes an MCP server that needs review — before publishing it, after a tool change, or when `/deep-review` produced a finding whose owner is `review-mcp`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `mcp-surface` | `artifact-match` | `cli` + `manual` | `config` | `/improve mcp` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is this row plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the row takes the `cli` plus `manual` route — use the `config` slice built by `/update-review-cli` and run by `/run-review`, then audit every tool description by hand; a missing slice or rule pack → `/update-review-cli`
- fixes are out of scope — the owner route is `/improve mcp`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `mcp-surface` risks this artifact can carry (destructive tool misnamed, schema drift, over-broad permission, PII in prompts), and whether the row's `N/A condition` applies
2. `/deep-analyze` — every tool, resource, and prompt the server exposes, and its auth model
3. `/deep-validate` — the schema dump and the analyzer slice before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> mcp-surface` — the canonical run for this row; it adds the `always` tier and owns every check
2. `cli` row → take the `/run-review` slice (`--domain config`); `manual` side → dump the MCP schema and audit each description for a wrong or destructive steer, with `ui-inspector` where available
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve mcp` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line` or a schema entry; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-mcp` completed with a score, grade, and severity-ordered findings, each with `file:line` or a schema entry
- Coverage stated against row `mcp-surface` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve mcp`, then closed with `/suggest-next-action`
