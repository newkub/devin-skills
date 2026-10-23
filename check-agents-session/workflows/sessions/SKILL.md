---
name: check-agents-session-sessions
description: List Devin sessions with mode, model, and last activity
related:
  - check-agents-session
  - report

---

## Goal

List sessions from `%APPDATA%\devin\cli\sessions.db` with id, title, working directory, mode, model, created, and last activity

## Scope

- Supports `[limit]` (default 50) and `[keyword]` matched against title or working directory
- Falls back to `history_*.md` summaries when the database is unavailable
- Boundary: message content search → `check-agents-session` domain `search`

## Execute

### 1. Locate Database

> Goal: find the authoritative session data

1. Set the path to `%APPDATA%\devin\cli\sessions.db`
2. Verify the file exists
3. When present → open it `readonly` with `bun:sqlite` or the `sqlite3` CLI
4. When missing or unreadable → use the summary fallback in step 4

### 2. Parse Arguments

> Goal: take limit and keyword

1. `limit`: maximum rows, default `50`
2. `keyword`: filter on `title` or `working_directory`
3. When `keyword` is absent → no filter

### 3. Query Sessions

> Goal: pull the session list

```sql
SELECT id,
       title,
       working_directory,
       agent_mode,
       model,
       datetime(created_at, 'unixepoch', 'localtime') AS created,
       datetime(last_activity_at, 'unixepoch', 'localtime') AS last_activity
FROM sessions
WHERE hidden = 0
ORDER BY last_activity_at DESC
LIMIT ?
```

1. With a keyword, add `AND (title LIKE ? OR working_directory LIKE ?)` before `ORDER BY`
2. Run with JSON output

### 4. Fallback From Summaries

> Goal: show sessions when the database is unavailable

1. List `%APPDATA%\devin\cli\summaries\history_*.md`
2. Sort by `LastWriteTime`, newest first
3. Use the file name after `history_` as the `id`
4. Read the first `=== MESSAGE` or `Summary:` line as the title
5. Use `LastWriteTime` as last activity and cap by `limit`

### 5. Report

> Goal: present the results readably

1. Follow `/report`; table columns: No., Session ID, Title, Working Dir, Mode, Model, Last Activity
2. Truncate title and path at 60 characters with `...`
3. Sort by last activity, newest first
4. Add the count of sessions shown

## Rules

- Open the database readonly only
- Never edit, delete, or hide sessions
- When locked or unreadable → report the error and try the fallback
- When the query fails → show the SQL error and stop
- Never use `**` bold

## Expected Outcome

- A numbered session table with key metadata
- `limit` and `keyword` supported
- Explicit fallback or error status when the database is unusable
