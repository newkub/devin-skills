---
name: list-devin
description: List Devin resources — hooks, MCP, skills, subagents, sessions via top-level skills
argument-hint: "[domain]"
related:
  - update-devin-global-skills
  - follow-devin-global-skills
  - report
  - ask-me

---

## Goal

Dispatch to the top-level skill for the Devin resource to list — the parent only routes

## Scope

- The argument is the domain; if unspecified → `/ask-me` to pick a domain

## Execute

### List Skills

| Domain | Skill |
|---|---|
| `global-hooks` | /list-devin-global-hooks — global hooks config |
| `global-mcp` | /list-devin-global-mcp — global MCP servers |
| `global-skills` | /list-devin-global-skills — global skills catalog |
| `global-subagents` | /list-devin-global-subagents — global subagent profiles |
| `session` | /list-devin-session — Devin sessions |
| `user-requests` | /list-request-devin-session — user request history |

1. Identify the domain from the argument (e.g. `/list-devin-global-skills`)
2. When the domain is supported → call the `/list-<parent>-<domain>` skill and follow its flow
3. When the domain is missing or unknown → `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Output must be a table via `/report` per the target skill's convention

- Use /update-devin-global-skills if needed
- Use /follow-devin-global-skills if needed

## Expected Outcome

- The caller is dispatched to the top-level skill matching the domain and listed per that flow
