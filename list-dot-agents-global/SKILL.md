---
name: list-dot-agents-global
description: Inventory the global agents harness — skills, subagents, MCP servers, hooks
argument-hint: "[all|skills|agents|mcp|hooks]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - check-agents-lint
  - check-agents-session
  - review-dot-agents-global-and-fix

---

## Goal

Report what the global harness at `~/.agents` currently contains — skill packages, subagents, MCP servers, and hooks — read-only, one domain per workflow

## Scope

- Source of truth is `~/.agents`; `%APPDATA%\devin\skills` is a client path and never the inventory root
- Domains: `skills`, `agents`, `mcp`, `hooks`; default is `all`
- Relation view: [references/relation-view.md](references/relation-view.md)
- Boundary: rule-level findings → `/check-agents-lint`; fixing them → `/review-dot-agents-global-and-fix`; session history → `/check-agents-session`

## Execute

### 1. Pick Domains

> Goal: decide which domains to inventory

| Domain | Path | Workflow |
|---|---|---|
| `skills` | `~/.agents/skills/` | [workflows/skills](workflows/skills/SKILL.md) |
| `agents` | `~/.agents/agents/` | [workflows/agents](workflows/agents/SKILL.md) |
| `mcp` | `~/.agents/mcp/mcp_config.json` | [workflows/mcp](workflows/mcp/SKILL.md) |
| `hooks` | `~/.agents/hooks/` | [workflows/hooks](workflows/hooks/SKILL.md) |

1. Read the argument; when empty use `all`
2. When the argument is not one of the four domains → `/ask-me` to pick one
3. Run the selected workflows in order skills → agents → mcp → hooks

### 2. Report

> Goal: one table per domain plus a roll-up

1. Follow `/report` so every table starts with `No.`
2. End with a one-line count per domain
3. Route non-trivial gaps to `/suggest-next-action`

## Rules

- Read-only — never edit, move, or delete harness files
- Never print secrets, tokens, or full env values; show `<redacted>`
- Use `~/.agents` paths, never `%APPDATA%\devin\*` as the inventory root
- Never use `**` bold
- When a path is missing → report it as missing, never create it

## Expected Outcome

- A numbered inventory table per requested domain
- Total counts for skills, subagents, MCP servers, and hooks
- Clear next actions for anything missing or broken
