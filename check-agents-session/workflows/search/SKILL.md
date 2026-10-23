---
name: check-agents-session-search
description: Search user requests across sessions by keyword or regex
related:
  - check-agents-session
  - follow-tool-ctx-rs
  - report

---

## Goal

Find which request, in which session, and when a keyword or regex appeared in user messages

## Scope

- Argument: `keyword-or-pattern` (required) plus `--scope all|session|repo`
- Search only `=== MESSAGE N - User ===` sections
- Prefer `/follow-tool-ctx-rs` (`ctx search`) when the history is indexed; ripgrep is the fallback
- Read-only

## Execute

### 1. Parse Arguments

> Goal: get a clear pattern and scope

1. Take `keyword-or-pattern`; when missing → `/ask-me`
2. Regex metacharacters present → regex search; otherwise → literal case-insensitive search
3. Parse `--scope` (default `all`)

### 2. Discover Files

> Goal: find history files per scope

1. Locate `%APPDATA%\devin\cli\summaries`
2. `--scope all` → every `history_*.md`
3. `--scope session` → the current session's history file
4. `--scope repo` → filter by the current repo workspace
5. Sort newest first

### 3. Search

> Goal: match only user message sections

1. Try `ctx search <pattern>` first; it returns session id, message index, and timestamp
2. When the session is not indexed → ripgrep `history_*.md` for the pattern
3. For large files → grep the `=== MESSAGE` markers first, then read only matching ranges
4. Record session id, message number, matched line, context, and date
5. Discard hits outside user-message sections

### 4. Report

> Goal: present drillable results

1. Follow `/report`; table columns: No., Session, Msg, Match, Date
2. Truncate matches longer than 80 characters with `...`
3. Sort by date newest first
4. State sessions searched, matches found, and the pattern used

### 5. No Match

> Goal: report honestly

1. Report not found with the pattern and scope used
2. Offer a shorter keyword, broader regex, or wider scope
3. Never guess which request the user meant

## Rules

- Count only matches inside user-message sections
- Never load all files at once — grep first, then read matching ranges
- Never modify history files
- Never use `**` bold

## Expected Outcome

- A numbered matches table with session, message number, context, and date
- Literal and regex search with scope filtering
- Clear stats and a no-match report with alternatives
