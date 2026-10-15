---
name: list-devin-session
description: List all Devin sessions with title, mode, model, and last activity time
argument-hint: "[limit] [keyword]"
related:
  - list-devin
  - list-request-devin-session
  - search-request-in-devin-session
  - report
  - report-todo
  - search
  - suggest-next-action
  - follow-context-engineering
  - use-bun-shell
---

## Goal

List all Devin sessions from `%APPDATA%\devin\cli\sessions.db` with `id`, `title`, `working_directory`, `agent_mode`, `model`, `created_at`, and `last_activity_at`

## Scope

- Use to search, filter, or review the history of sessions ever created; supports a max count and a keyword to filter `title` or `working_directory`
- Use to summarize a past session or context into an action plan — do `### Session To Action Plan`
- To list or search only user requests → use `/list-request-devin-session` or `/search-request-in-devin-session`

## Execute

### 1. Locate Sessions Database

> Goal: find the authoritative sessions data

1. Set the sessions database path to `%APPDATA%\devin\cli\sessions.db`
2. Verify the file exists with `find_file_by_name` or `exec`
3. If the file exists → open it `readonly` with `bun:sqlite` or the `sqlite3` CLI
4. If the file is missing or unreadable → fall back to listing `history_*.md` files in `%APPDATA%\devin\cli\summaries`

### 2. Parse Arguments

> Goal: take limit and keyword

1. Accept optional arguments from the user:
   - `limit`: maximum number of sessions (default `50`)
   - `keyword`: search term within `title` or `working_directory`
2. When `limit` is unspecified use `50`
3. When `keyword` is unspecified, do not filter

### 3. Query Sessions

> Goal: pull the session list from the database

1. Build the SQL query:
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
2. With a `keyword`, add `AND (title LIKE ? OR working_directory LIKE ?)` before `ORDER BY`
3. Use `bun:sqlite` or the `sqlite3` CLI to run the statement and get JSON output

### 4. Fallback From History Summaries

> Goal: show sessions when the database is unavailable

1. Use `search` or `exec` to find `%APPDATA%\devin\cli\summaries\history_*.md`
2. Sort by `LastWriteTime`, newest first
3. For each file:
   - Use the part of the file name after `history_` as the `id`
   - Read the first line of content starting with `=== MESSAGE` or `Summary:`
   - Use `LastWriteTime` as `last_activity`
4. Cap the count by `limit`

### 5. Format And Report

> Goal: present the results readably

1. Do `/report` with columns: No, Session ID, Title, Working Directory, Mode, Model, Created, Last Activity
2. When `title` or `working_directory` exceeds 60 characters, truncate to 60 and append `...`
3. Sort by `last_activity`, newest first
4. State the statistic: the total number of sessions shown

### 6. Handle Empty Or Error

> Goal: report the correct status

1. If no sessions are found → report none found
2. If the database is locked or unreadable → report the error and try the fallback
3. If the query fails → show the SQL error and stop

### Session To Action Plan

> Goal: summarize a past session/context into an action plan — merged from from-chat-session

1. Read the target session's context or summary — identify the session from `### 3. Query Sessions` or a history file per `### 4. Fallback`
2. State the current status: done/pending/blocked work, and the files/skills involved
3. If the context is long or near full → do `/follow-context-engineering`
4. Do `/suggest-next-action` + `/use-related-skills` to find next actions — split into items, one thing per item; if a question is unclear → do `/ask-me`
5. Do `/report-todo` with columns `No.`, `Action`, `Before`, `After`, `Why`, `File Change`, `Risk` — below the table do `/report numbered`
6. Only answer when the user asks or clearly says not to act now — do not perform the actions yourself; do not guess which files will change

## Rules

- Always open the database `readonly`
- Never edit, delete, or hide sessions
- Use `bun:sqlite` as the primary tool for reading `sessions.db`
- For the fallback use `search` or `use-pwsh-shell` to list `history_*.md`
- When the user gives no `limit`, use `50`
- Use `/report` for the output

- Use /list-request-devin-session if needed
- Use /list-devin-global-skills if needed
- Use /use-bun-shell if needed

## Expected Outcome

- The Devin session list in a table with key metadata
- Supports `limit` and `keyword` filtering
- Statistics and error status reported clearly
