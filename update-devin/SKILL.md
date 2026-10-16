---
name: update-devin
description: Update Devin config — MCP, rules, subagents, hooks via top-level skills
argument-hint: "[domain]"
related:
  - update-devin-global-skills
  - update-devin-global-rules
  - update-devin-harness
  - list-devin
  - use-subagents
  - update-references
  - deep-validate
  - report
  - ask-me

---

## Goal

Dispatch to the target skill by Devin config domain — the parent only does routing

## Scope

- The argument is the domain; if omitted → use `/ask-me` to pick a domain
- `update-devin-global-skills` remains a separate skill (skills catalog lifecycle)

## Execute

### Skills

| Domain | Skill |
|---|---|
| `global-mcp` | /update-devin-global-mcp — global MCP server config |
| `global-rules` | /update-devin-global-rules — global rules (`global_rules.md`) |
| `global-subagents` | /update-devin-global-subagents — global subagent profiles |
| `harness` | /update-devin-harness — agent harness config |
| `project-hooks` | /update-devin-project-hooks — project-level hooks |
| `project-mcp` | /update-devin-project-mcp — project-level MCP config |
| `project-rules` | /update-astgrep-rules — project-level ast-grep rules (`rules/` at root) |

1. Determine the domain from the argument (e.g. `/update-devin-harness`)
2. If the domain is supported → follow the full `/update-devin-<domain>` flow
3. If the domain is missing or unknown → use `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- After changing devin config → `/update-references` + verify there are no stale refs

- Use /list-devin if needed
- Use /update-devin-global-subagents if needed
- Use /use-subagents if needed
- Use /deep-validate if needed
- Use /report if needed

## Expected Outcome

- The caller is dispatched to the target skill matching the domain and the config is updated via that flow
