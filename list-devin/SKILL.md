---
name: list-devin
description: Route list requests to list-dot-agents-global or check-agents-session by domain
argument-hint: "[domain]"
related:
  - list-dot-agents-global
  - check-agents-session
  - report
  - ask-me
---

## Goal

Dispatch a read-only inventory request to the top-level skill that owns the domain — the parent only routes

## Scope

- Harness domains: skills, subagents, hooks, MCP servers, and the combined inventory
- Session domains: sessions, user requests, and message search
- The argument is the domain; if unspecified → `/ask-me` to pick a domain

## Execute

### 1. Pick The Target

> Goal: map every domain to exactly one skill

| Domain | Skill |
|---|---|
| `global-hooks` | `/list-dot-agents-global hooks` |
| `global-mcp` | `/list-dot-agents-global mcp` |
| `global-skills` | `/list-dot-agents-global skills` |
| `global-subagents` | `/list-dot-agents-global subagents` |
| `harness` | `/list-dot-agents-global all` |
| `session` | `/check-agents-session sessions` |
| `user-requests` | `/check-agents-session requests` |
| `search` | `/check-agents-session search <query>` |

1. Read the first argument as the domain
2. Pass any remaining arguments through to the target skill
3. When the domain is unknown → `/ask-me` to pick one

### 2. Report

> Goal: one table per invocation

1. Follow `/report` so every table starts with `No.`
2. Report only what the target skill returned; never add rows the target did not produce

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Read-only: never create, update, or delete harness or session records
- MCP config paths are `~/.agents/mcp/mcp_config.json`; never read a client mirror
- Session transcripts may contain secrets — redact values in the report

## Expected Outcome

- The caller reaches the owning skill with the domain and remaining arguments intact
- Output is a `No.`-prefixed table from the target skill
