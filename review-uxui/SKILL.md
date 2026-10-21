---
name: review-uxui
description: Review UX/UI — flows, states, consistency, visual gaps — with evidence
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

Review the `uxui` dimension of a scope — flows, states, consistency, visual gaps — and return evidence-backed findings with severity — a thin entry that resolves its matrix rows and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope needs the `uxui` dimension reviewed on its own — before its gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-uxui`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `uxui` | `artifact-match` | `capture` + `manual` | `quality` | `/improve uxui` |
| `ux-writing` | `artifact-match` | `manual` | `quality` | `/improve writing` |
| `visual-regression` | `artifact-match` | `capture` | `—` | `/improve tests` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is these rows plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- the rows mix routes — the interface half runs `/deep-test website` roleplay and `/use-agent-browser` captures first; `visual-regression` runs `/follow-tool-argos` or `/deep-test visual`; the copy side reads every user-facing string; a missing tool or rule pack → `/update-review-cli` — the six `always` rows still get their `/run-review` analyzer slice
- fixes are out of scope — the owner routes are `/improve uxui`, `/improve writing`, and `/improve tests`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `uxui` risks this artifact can carry (stuck or data-losing flow, missing state, inconsistent pattern, unclear destructive copy), and whether any row's `N/A condition` applies
2. `/deep-analyze` — routes, states, components, and every user-facing string
3. `/deep-validate` — the captures and voice/tone criteria before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> uxui, ux-writing, visual-regression` — the canonical run for these rows; it adds the `always` tier and owns every check
2. `capture` rows → run `/deep-test website` `## 6 Roleplay Mode` and `/use-agent-browser` captures per state; `visual-regression` → `/follow-tool-argos` or `/deep-test visual`; `manual` row → read every microcopy and error string against `/improve-writing` criteria; pass all output in
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve uxui`, `/improve writing`, or `/improve tests` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line` or a capture; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-uxui` completed with a score, grade, and severity-ordered findings, each with `file:line` or a capture
- Coverage stated against rows `uxui`, `ux-writing`, and `visual-regression` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve uxui`, `/improve writing`, and `/improve tests`, then closed with `/suggest-next-action`
