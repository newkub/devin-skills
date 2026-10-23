---
name: review-dot-agents-global-and-fix
description: Review the harness at ~/.agents, score its health, then fix what is confirmed
argument-hint: "[review|health|update|knowledge] [layer]"
related:
  - check-agents-lint
  - list-dot-agents-global
  - report

---

## Goal

Review the harness at `~/.agents`, score its health, keep its layers aligned, and fix only what the user confirms

## Scope

- Harness layers: skills, subagents, hooks, MCP, and global rules
- Root: `~/.agents` (`skills/`, `agents/`, `hooks/`, `mcp/`, `AGENTS.md`)
- Domains: `review`, `health`, `update`, `knowledge`
- Checklists: [references/checklists.md](references/checklists.md); reviewer profile: [references/harness-reviewer.md](references/harness-reviewer.md)
- Boundary: rule-level lint → `/check-agents-lint`; inventory only → `/list-dot-agents-global`

## Execute

### 1. Pick Domain

> Goal: route to the requested pass

| Domain | Use when | Workflow |
|---|---|---|
| `review` | review layers and list findings before fixing | [workflows/review](workflows/review/SKILL.md) |
| `health` | one scorecard across validation, refs, git, activity | [workflows/health](workflows/health/SKILL.md) |
| `update` | align rules, skills, and subagents after a change | [workflows/update](workflows/update/SKILL.md) |
| `knowledge` | check knowledge notes for stale or conflicting content | [workflows/knowledge](workflows/knowledge/SKILL.md) |

1. Read the argument; when empty use `review`
2. When the domain is unknown → `/ask-me`
3. Pass the layer argument through to the workflow

### 2. Confirm Before Fixing

> Goal: never change the harness on a guess

1. Present findings first; review stays report-only
2. Ask the user to confirm the fixes worth applying
3. Apply one confirmed batch at a time and rerun the check after each batch

### 3. Report

> Goal: consistent output across domains

1. Follow `/report` so every table starts with `No.`
2. Every finding carries a layer, file path, and evidence
3. End with the next action via `/suggest-next-action`

## Rules

- Review before fix; never refactor during a review pass
- Destructive actions need a dry run and user confirmation
- Never use `**` bold; use backticks for paths and names
- Use `~/.agents` paths, never `%APPDATA%\devin\*` as the review root

## Expected Outcome

- A review report per layer with severity, evidence, and action
- A health scorecard with grade and top issues
- Layers aligned after the confirmed fixes, with no broken references
