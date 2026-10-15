---
name: list-raindrop-favorite
description: List favorite (important) bookmarks from Raindrop.io
argument-hint: "[collection]"
related:
  - list-recent-bookmark-raindrop
  - search
  - report
---

## Goal

Fetch bookmarks marked as favorite (`important:true`) from Raindrop.io with a single command

## Scope

Use with the `raindrop` CLI v0.1.x — `raindrop list --favorites` (server-side filter) or `raindrop search "important:true"` when combining search operators

## Execute

### 1. List Favorites

> Goal: fetch favorite bookmarks with one command

1. Run this directly:
   ```sh
   raindrop list --favorites --json --all --sort="-created" | jq -r '.[] | [.title, .link, (.tags | join(", ")), .created] | @tsv'
   ```
2. Specific collection → `raindrop list <collection> --favorites --json --all | jq ...`
3. Additional filters on favorites: `--type article`, `--tag <tag>`, `-s "<query>"`
4. Count: `raindrop list --favorites --json --all | jq 'length'`
5. Auth error → `raindrop auth status` then login with `raindrop auth token "$RAINDROP_ACCESS_TOKEN"` or `raindrop auth login` (OAuth)

### 2. Alternative — Search

> Goal: search favorites when list is not enough

1. `raindrop search "tag:rust" --type link --collection <id> --json` when combining operators like `tag:rust` + `--collection` (note: `raindrop search` has no `--favorites`/`important:` operator — for favorites use `raindrop list --favorites` only)

### 3. Report

> Goal: show a table

1. Use `/report` to build a table: No, Title, Link, Tags, Created

## Rules

### 1. Server-Side Filter Only

- Use `--favorites` (`-f`) or `important:true` only — never filter `important` client-side in `jq` because pagination can cause misses

### 2. Pagination

- `list`/`search` default returns only the first 50 entries — always add `--all` when you need everything

### 3. Read Only

- Read-only — never use `--force`
- Never expose `RAINDROP_ACCESS_TOKEN` in command history

### 4. Output

- `--json` + `jq -r` by default

- Use /search-raindrop if needed
- Use /list-recent-bookmark-raindrop if needed

## Expected Outcome

- A complete list of favorite bookmarks across all pages, sorted newest → oldest
- No token or secret leaked
