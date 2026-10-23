---
name: check-agents-session
description: Inspect Devin sessions, user requests, and search past messages
argument-hint: "[sessions|requests|search|plan] [args]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - follow-tool-ctx-rs
  - report
  - report-todo

---

## Goal

Read the local session history — session metadata, the user requests inside them, keyword or regex matches, and a session-to-plan summary — read-only

## Scope

- Session database: `%APPDATA%\devin\cli\sessions.db` (client-owned, read-only)
- Summaries: `%APPDATA%\devin\cli\summaries\history_*.md`, used as fallback and for request listing
- Domains: `sessions`, `requests`, `search`, `plan`
- Boundary: full-text indexed search → `/follow-tool-ctx-rs` (`ctx search`); harness inventory → `/list-dot-agents-global`

## Execute

### 1. Pick Domain

> Goal: route to the requested session view

| Domain | Use when | Workflow |
|---|---|---|
| `sessions` | list or filter sessions by limit and keyword | [workflows/sessions](workflows/sessions/SKILL.md) |
| `requests` | list user requests by scope all, session, or repo | [workflows/requests](workflows/requests/SKILL.md) |
| `search` | find which request and session contains a keyword | [workflows/search](workflows/search/SKILL.md) |
| `plan` | turn one past session into next actions | [workflows/plan](workflows/plan/SKILL.md) |

1. Read the argument; when empty use `sessions`
2. When the domain is unknown → `/ask-me` to pick one
3. Pass the remaining arguments to the chosen workflow

### 2. Report

> Goal: consistent output across domains

1. Follow `/report` so every table starts with `No.`
2. For the `plan` domain, end with the next-action table from `/report-todo`
3. Truncate long titles, paths, and matches at 80 characters with `...`
4. State the totals searched and shown

## Rules

- Always open `sessions.db` readonly; never edit, hide, or delete a session
- Never modify history files
- Prefer `/follow-tool-ctx-rs` when the history is indexed; use ripgrep on `history_*.md` only as fallback
- Never use `**` bold
- Never guess which session or request the user meant

## Expected Outcome

- A numbered table for the chosen domain with totals
- Clear no-result and error reporting for missing or locked data
- Pointers to the next workflow when the user wants to go deeper
