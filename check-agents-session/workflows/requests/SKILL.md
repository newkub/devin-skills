---
name: check-agents-session-requests
description: List user requests by scope — all sessions, this session, or this repo
related:
  - check-agents-session
  - report

---

## Goal

List user requests from `history_*.md` under `%APPDATA%\devin\cli\summaries` for the chosen scope

## Scope

- `--scope all` (default): requests from every session
- `--scope session`: only the current session
- `--scope repo`: only sessions working in the current repo
- Read-only — never modifies history files

## Execute

### 1. Discover Files

> Goal: find history files per scope

1. Locate `%APPDATA%\devin\cli\summaries`
2. `--scope all` → every `history_*.md`
3. `--scope session` → the current session's history file
4. `--scope repo` → filter sessions whose workspace matches the current repo
5. Record the number of sessions found

### 2. Extract Requests

> Goal: pull user messages from each file

1. Search for `=== MESSAGE N - User ===` markers
2. Read until the next `=== MESSAGE` marker
3. Record session file, message number, and content
4. For large files → read headings first, then only the user-message ranges

### 3. Report

> Goal: summarize as a table

1. Follow `/report`; table columns: No., Session, Request, Length
2. Truncate requests longer than 80 characters with `...`
3. Sort by session newest first, then message number
4. State session count and request count

## Rules

- Never load all files at once; stream and grep first
- Exclude system and assistant messages
- Never modify history files
- Never use `**` bold

## Expected Outcome

- A numbered request table for the chosen scope
- Session and request totals
