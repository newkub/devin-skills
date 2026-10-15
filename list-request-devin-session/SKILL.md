---
name: list-request-devin-session
description: List user requests by scope — all sessions, this session, or this repo
argument-hint: "[--scope all|session|repo]"
related:
  - report

---

## Goal

List user requests by reading `history_*.md` files in `%APPDATA%\devin\cli\summaries` per the chosen scope

## Scope

- `--scope all` (default): requests from every session — for analytics or pattern search
- `--scope session`: only the current session
- `--scope repo`: only sessions working in the current repo
- Read-only — never modifies history files

## Execute

### 1. Discover Session Files

> Goal: find history files per scope

1. Locate the directory `%APPDATA%\devin\cli\summaries`
2. `--scope all` → list all `history_*.md` files
3. `--scope session` → use the current session's history file
4. `--scope repo` → filter sessions whose workspace matches the current repo
5. Record the number of sessions found

### 2. Extract User Requests

> Goal: pull user messages from each file

1. Search for `=== MESSAGE N - User ===` in each file
2. Read content until the next `=== MESSAGE`
3. Record session file, message number, content
4. Large file → read headings first then read only user-message regions

### 3. Format And Report

> Goal: summarize as a table

1. Use `/report` columns: No., Session, Request, Type, Length
2. Truncate requests longer than 80 characters and append `...`
3. Sort by session (new → old) then message number
4. State stats: session count, request count

## Rules

- Never load all files at once; use streaming
- Exclude system or assistant messages
- Never modify history files
- Always use `/report`

## Expected Outcome

- A table of requests per scope with stats
