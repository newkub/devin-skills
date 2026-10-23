---
name: review-dot-agents-global-and-fix-review
description: Review harness layers, list findings with evidence, then fix confirmed items
argument-hint: "[skills|agents|hooks|mcp|rules|broken-refs|relations|all]"
related:
  - review-dot-agents-global-and-fix
  - update-agents-skills-global
  - deep-validate
  - report

---

## Goal

Review every layer of `~/.agents` against one checklist set, report findings with evidence, then route and apply only the fixes the user confirms

## Scope

- Layers: `skills`, `agents` (subagents), `hooks`, `mcp`, `rules` (global `AGENTS.md`)
- Cross-layer: alignment, redundancy, references integrity, context rot, coverage
- Checklists and scoring live in [references/checklists.md](../../references/checklists.md)
- Boundary: rule-level lint → `/check-agents-lint`; inventory → `/list-dot-agents-global`

## Execute

### 1. Inventory

> Goal: know every layer before judging any of them

1. Follow the `review-*` convention: `/deep-thinking` → `/deep-analyze` → `/deep-validate` before findings
2. Collect roots: `~/.agents/skills`, `~/.agents/agents`, `~/.agents/hooks/hooks.json`, `~/.agents/mcp/mcp_config.json`, `~/.agents/AGENTS.md`
3. List skills grouped by prefix and record the total
4. Read `AGENTS.md` so the current standard is explicit

### 2. Run The Script

> Goal: get mechanical findings without hand parsing

1. `bun run review` in this skill package — entry point `src/index.ts` — covers frontmatter, sections, line count, style, references, package files, parallel markers, and cross-skill checks
2. `bun run review:ci` for the gate before an update — exits 1 on Critical or High
3. The script prints its report to stdout and writes no file; that output is the input for step 3
4. Hooks, MCP, rules, and template compliance have no script — they stay manual

### 3. Review Each Layer

> Goal: check each layer against its own checklist

1. `skills` — interpret the script output, then apply only the manual quality checks the script cannot make
2. `agents` — every `AGENT.md` in `~/.agents/agents`: frontmatter, sections, line count, style, and safety (destructive defaults, over-broad tools)
3. `hooks` — per `Hooks` in the checklist reference
4. `mcp` — per `Mcp` in the checklist reference
5. `rules` — per `References Integrity` item 4: skills referenced exist, Execute order does not conflict, no stale names

### 4. Cross-Layer Alignment

> Goal: check the layers agree with each other

1. `AGENTS.md` references → every name has a real skill
2. Skill `related` ↔ reverse related → symmetric
3. Subagent profiles named in skills ↔ `~/.agents/agents` → match
4. `AGENTS.md` catalog ↔ actual directories → in sync

### 5. Interpret

> Goal: remove false positives before reporting

1. Verify the evidence behind every finding
2. Apply `Content Quality` and `Parallel And Scripts` from the checklist reference
3. Run `/check-my-global-cli` to confirm its tool map still matches the installed CLI

### 6. References Integrity

> Goal: catch broken and looping references

1. The script covers mechanical existence; manual checks cover semantics
2. `bun run src/broken-skills-references.ts [path]` for the full pass — Critical = broken `related`, Warning = broken body ref
3. Filter URL, file path, npm, and placeholder false positives
4. Score per `Scoring` and report per `References Integrity`

### 7. Context Rot And Coverage

> Goal: find content that decayed and domains with no skill

1. `Context Rot`: stale claims, incorrect claims, dead weight, bloat
2. `/deep-review` domain `gaps` for coverage, and domain `usage` for stale content
3. Report both as separate sections

### 8. Score And Report

> Goal: one report, one priority list

1. Score per `Scoring`, separately per layer
2. `/report-review` (chat table, no files) with sections skills, agents, hooks, mcp, rules, cross-layer; columns No./Layer/Category/Severity/Finding/Evidence/Action
3. Summarize the skills that should be refactored and the improvement items → `/suggest-next-action`

### 9. Plan And Execute Fix

> Goal: fix only after confirmation

1. Run only after the user confirms the findings
2. Apply `Refactor Guide`: plan → execute → cross-skill consistency
3. Route each finding: layer misalignment → `/review-dot-agents-global-and-fix` domain `update`; one package → `/update-agents-skills-global`; broken refs → `/update-references`
4. Structural fixes run one skill at a time with a commit checkpoint; independent targets → `/use-subagents`
5. Rerun `bun run review` plus `/deep-validate` after each batch; a finding that recurs means the checklist missed it

## Rules

- Review before fix; never modify the harness during steps 1-8
- Every finding needs a layer, file path, and evidence — no evidence, no finding
- Cover every layer in the inventory or state why one was skipped
- Report the same finding once, at the root cause
- Create a commit checkpoint before any structural fix
- Never use `**` bold; report as tables via `/report-review`

## Expected Outcome

- A layer-by-layer review with score, grade, and evidence
- Cross-layer alignment status and broken-reference counts
- A confirmed fix list with owners, applied batch by batch
