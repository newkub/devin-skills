---
name: update-devin
description: Route config updates to global harness skills or the project .agents layout
argument-hint: "[domain]"
related:
  - update-devin-global-mcp
  - update-devin-global-rules
  - update-agents-skills-global
  - update-devin-global-subagents
  - review-dot-agents-global-and-fix
  - update-dot-agents-project
  - deep-validate
  - report
  - ask-me
---

## Goal

Dispatch a config update to the skill that owns the domain — the parent only routes

## Scope

- Global domains live under `~/.agents/` and are owned by `update-devin-global-*` skills
- Project domains live under `<project>/.agents/` and are owned by `/update-dot-agents-project`
- The argument is the domain; if omitted → `/ask-me` to pick a domain

## Execute

### 1. Pick The Target

> Goal: map every domain to exactly one skill

| Domain | Skill |
|---|---|
| `global-mcp` | `/update-devin-global-mcp` |
| `global-rules` | `/update-devin-global-rules` |
| `global-skills` | `/update-agents-skills-global` |
| `global-subagents` | `/update-devin-global-subagents` |
| `harness` | `/review-dot-agents-global-and-fix` |
| `project` | `/update-dot-agents-project scaffold` |
| `project-hooks` | `/update-dot-agents-project hooks` |
| `project-mcp` | `/update-dot-agents-project mcp` |
| `project-rules` | `/update-dot-agents-project rules` (markdown) or `/update-astgrep-rules` (enforcement) |
| `project-references` | `/update-dot-agents-project references` |
| `project-skills` | `/update-dot-agents-project skills` |

1. Read the first argument as the domain
2. Pass any remaining arguments through to the target skill
3. When the domain is unknown → `/ask-me` to pick one

### 2. Validate And Report

> Goal: prove the change and report it

1. Run `/deep-validate` on the touched tree
2. Run `/update-references` when a file moved, was renamed, or was deleted
3. Follow `/report` so every table starts with `No.`

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Global MCP config is `~/.agents/mcp/mcp_config.json`; project MCP config is `.agents/mcp/mcp_config.json`
- Never write secrets into any config; reference environment variables
- Markdown rules and ast-grep rules coexist — never delete one to make room for the other

## Expected Outcome

- The caller reaches the owning skill with the domain and remaining arguments intact
- The config is updated through that flow, validated, and reported
