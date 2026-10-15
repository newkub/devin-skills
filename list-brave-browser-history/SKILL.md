---
name: list-brave-browser-history
description: List web browsing history from the Brave browser
argument-hint: "[scope]"
related:
  - search
  - list-recent-bookmark-raindrop
  - run-dev
---

## Goal

Pull web browsing history from the Brave browser history database and report it as a list or table

## Scope

On Windows, read the Brave SQLite database (`History`) and report URL, title, timestamp, visit count

## Execute

### 1. Locate Brave History Database

> Goal: find the SQLite database path

1. Identify the OS:
   - Windows: `%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\Default\History`
   - macOS: `~/Library/Application Support/BraveSoftware/Brave-Browser/Default/History`
   - Linux: `~/.config/BraveSoftware/Brave-Browser/Default/History`
2. Verify the file exists
3. If the profile is not found → list profiles in `User Data/`

### 2. Copy Database Safely

> Goal: avoid locks while Brave is running

1. Create a temp copy with `cp` or `Copy-Item`
2. Place it at `%TEMP%\brave-history-<timestamp>.db`
3. Do not modify the original database

### 3. Query History

> Goal: pull history records

1. Use `sqlite3` or `bun sqlite` to query the copy
2. SQL:
   ```sql
   SELECT urls.url, urls.title, urls.visit_count, visits.visit_time
   FROM urls
   JOIN visits ON urls.id = visits.url
   ORDER BY visits.visit_time DESC
   LIMIT <limit>
   ```
3. Convert `visit_time` from microseconds to an ISO timestamp
Latest: `sqlite3@6.0.1` npm binding (verified 2026-09-12) — the built-in `bun:sqlite` also works

4. If `sqlite3` is missing → use `bun add -g sqlite3` or another tool

### 4. Filter And Format

> Goal: report only the wanted data

1. Filter by keyword, domain, or date range (when the user specifies)
2. Build a table: Time, Title, URL, VisitCount
3. Support markdown or JSON output

### 5. Report

> Goal: summarize the results

1. Report the number of records
2. Show the top recent visits
3. If a filter was applied → state the condition

## Rules

- Do not modify the original database
- Always copy the database before reading
- Do not expose sensitive URLs unnecessarily
- Never delete history
- When Brave is running → use a copy

- Use /search-raindrop if needed
- Use /list-recent-bookmark-raindrop if needed
- Use /run-dev if needed

## Expected Outcome

- A Brave browser history list
- Complete data: time, title, URL, visit count
- The original database left unmodified
