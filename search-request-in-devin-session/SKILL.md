---
name: search-request-in-devin-session
description: Search keyword/pattern in user requests across Devin sessions — find which request, session, when
argument-hint: "[keyword-or-pattern] [--scope all|session|repo]"
related:
  - list-devin-session
  - list-request-devin-session
  - report
  - search
  - follow-context-engineering
---

## Goal

Search requests the user has previously sent by matching a `keyword` or regex pattern against user-message content in `history_*.md` under `%APPDATA%\devin\cli\summaries` — answer which session, which message, and when the request appeared.

## Scope

- `keyword-or-pattern` (required): the text or regex to search for — always required
- `--scope all` (default): search every session
- `--scope session`: only the current session
- `--scope repo`: only sessions working in the current repo
- Search only user messages (`=== MESSAGE N - User ===`) — do not search assistant/system messages
- Read-only; never modify history files
- Want the full request list without filtering → use `/list-request-devin-session` instead

## Execute

### 1. Parse Arguments

> Goal: get a clear pattern and scope

1. Take `keyword-or-pattern` — if not given → ask the user via `/ask-me`
2. Decide the match mode:
   - Contains regex metachars (`.*`, `^`, `$`, `[`, `]`, `\d`, etc.) → regex search
   - Otherwise → literal/case-insensitive keyword search
3. Parse `--scope` (default `all`)

### 2. Discover Session Files

> Goal: find history files per scope — same as `/list-request-devin-session` `### 1`

1. Locate the directory `%APPDATA%\devin\cli\summaries`
2. `--scope all` → all `history_*.md` files
3. `--scope session` → the history file of the current session
4. `--scope repo` → filter sessions whose workspace matches the current repo
5. Sort by `LastWriteTime`, newest first

### 3. Search User Messages

> Goal: match only user message sections

1. Apply the `grep` (ripgrep) pattern to `history_*.md` — limit hits to the context of `=== MESSAGE N - User ===` sections
2. For large files → use `grep` to find line numbers of the `=== MESSAGE` markers first, then `read` only the user-message ranges that match
3. Record: session file (id from the file name), message number, matched line, surrounding context (±1 line), file `LastWriteTime`
4. Keep only matches inside `=== MESSAGE N - User ===` sections — discard hits from assistant/system sections

### 4. Format And Report

> Goal: present results that can be drilled into further

1. Run `/report` with columns: No., Session, Msg #, Matched Text, Context, Date
2. Truncate matched text longer than 80 characters and append `...`
3. Sort by date newest first, then message number
4. State the stats: number of sessions searched, number of matches, pattern used
5. Point out session id + msg # so the user can open and read on — or run `/list-devin-session` for session metadata

### 5. Handle No Match

> Goal: report honestly

1. If no match is found → report not found, along with the pattern and scope used
2. Offer alternatives: try a shorter keyword, a broader regex, or widen `--scope`
3. Do not guess which request the user might have meant

## Rules

- Search only `=== MESSAGE N - User ===` sections — never count assistant/system messages as matches
- Do not load all files at once — grep first, then read only the matching ranges
- Do not modify history files
- Always use `/report`
- Use `/list-devin-session` if you need the session metadata of a match
- Use `/use-bun-shell` or ripgrep for the search

## Expected Outcome

- A matches table with session id, message number, context and date
- Supports literal keywords and regex patterns plus scope filtering
- Clear stats and no-match reporting, with next-step alternatives
