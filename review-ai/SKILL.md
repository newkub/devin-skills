---
name: review-ai
description: Review AI/LLM code — prompts, evals, cost, memory, retrieval — with evidence
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

Review the `ai` dimension of a scope and return evidence-backed findings with severity — a thin entry that resolves its matrix rows and delegates every check to `/deep-review`; it keeps no catalog of its own

## Scope

Use when a scope needs the `ai` dimension reviewed on its own — before its gate, after a change in that area, or when `/deep-review` produced a finding whose owner is `review-ai`

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `llm-security` | `artifact-match` | `capture` | `security` | `/improve ai` |
| `llm-cost-latency` | `artifact-match` | `capture` | `—` | `/optimize llm` |
| `agent-memory-integrity` | `artifact-match` | `capture` | `security` | `/improve ai` |
| `llm-eval` | `on-demand` | `capture` | `—` | `/improve ai` |
| `rag-retrieval-quality` | `artifact-match` | `capture` | `—` | `/improve ai` |

- the row's `Applies to`, `Default severity`, and `N/A condition` in `deep-review/references/dimension-matrix.md` are the only eligibility rules applied here — this skill never re-decides them
- the seed is these rows plus the six `always` rows (`correctness`, `security`, `architecture`, `code-quality`, `dependencies`, `docs`), which `/deep-review` adds itself
- every row here takes the `capture` route — run the row's `Tool/skill` first (`promptfoo`, `garak`, provider usage CLI, `ragas`) and pass its output in; a missing tool or rule pack → `/update-review-cli` — the six `always` rows still get their `/run-review` analyzer slice
- fixes are out of scope — the owner routes are `/improve ai` and `/optimize llm`; apply only after confirmation via `/deep-review <scope> then-fix`
- boundaries: whole-scope multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`

## Execute

> Pre-Run: `/deep-thinking` → `/deep-analyze` → `/deep-validate` always first — every `review-*` runs the deep pre-pass, never skip

### 1. Deep Pre-Pass

> Goal: understand the scope before judging it

1. `/deep-thinking` — which `ai` risks this artifact can carry (injection, spend, memory, eval, retrieval), and whether any row's `N/A condition` applies
2. `/deep-analyze` — structure, stack, and the files these rows touch
3. `/deep-validate` — the analyzer output, the `reports/review-report.json` slice, or the named files before trusting them

### 2. Review The Dimension

> Goal: evidence-backed findings, no guessing

1. Invoke `/deep-review <scope> llm-security, llm-cost-latency, agent-memory-integrity, llm-eval, rag-retrieval-quality` — the canonical run for these rows; it adds the `always` tier and owns every check
2. `capture` rows → run the row's `Tool/skill` first (red-team probes, usage metrics, memory-store slice, eval suite, retrieval eval set) and pass that output in as the evidence slice
3. `/use-subagents` when the areas are independent — one reviewer per area, each reading only its slice or the files named in evidence
4. Cross-check every finding in the real file — no `file:line`, no finding; severity comes from the row's `Default severity` plus its stated upgrade/downgrade trigger
5. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 3. Report

> Goal: one chat table, then the next action

1. `/report-review` — summary (score/grade, findings by severity, scope) then the canonical table
2. Order by severity, Critical first; every row carries `file:line` and its `Owner skill`
3. Close with `/suggest-next-action` — `/deep-review <scope> then-fix` for the confirmed set, `/improve ai` or `/optimize llm` for a program of work, `/update-review-cli` when the analyzer lacks a row

## Rules

- Evidence first — every finding cites `file:line`; a claim without evidence is dropped
- No duplicated catalog — the checks live in `deep-review/references/dimension-checks.md`; this skill resolves rows and reports only
- Skip only for a row's `N/A condition`, quoted as the reason
- `/use-subagents` when the areas are independent — one subagent per area, no overlapping files
- Review only — never edit code here; fixes run through `/deep-review <scope> then-fix` after confirmation
- Analyzer or rule-pack gap → `/update-review-cli`; never patch analyzer logic in a review skill
- Never use `**` bold markers; report through `/report-review` only

## Expected Outcome

- `review-ai` completed with a score, grade, and severity-ordered findings, each with `file:line`
- Coverage stated against rows `llm-security`, `llm-cost-latency`, `agent-memory-integrity`, `llm-eval`, and `rag-retrieval-quality` — reviewed, or skipped with the `N/A condition` quoted
- Analyzer gaps routed to `/update-review-cli`
- Fix set handed to `/improve ai` and `/optimize llm`, then closed with `/suggest-next-action`
