---
name: list-recent-bookmark-raindrop
description: List recent bookmarks from Raindrop.io sorted by created
argument-hint: "[collection]"
related:
  - deep-review-codebase
  - report
---

## Goal

Fetch recent bookmarks from Raindrop.io sorted by `created` newest first, with a single command

## Scope

Use with the `raindrop` CLI (`raindrop list`) — all collections or a specified collection

## Execute

### 1. List Bookmarks

> Goal: fetch recent bookmarks with one command

1. Run this directly:
   ```sh
   raindrop list --json --all --sort="-created" | jq -r '.[0:30] | .[] | [.title, .link, (.tags | join(", ")), .created] | @tsv'
   ```
2. Specific collection → `raindrop list <collection> --json --all --sort="-created" | jq ...`
3. Sort by latest update → `--sort="-lastUpdate"` or adjust `.[0:30]` to the desired row count
4. Auth error → `raindrop auth status` then login with `RAINDROP_ACCESS_TOKEN` via `--token-stdin`

### 2. Report

> Goal: show a table

1. Use `/report` to build a table: No, Title, Link, Tags, Created

## Rules

### 1. Sorting

- Default: `--sort="-created"` (new → old)
- Always state the sort field in the report

### 2. Read Only

- Read-only — never use `--force`
- Never expose `RAINDROP_ACCESS_TOKEN` in command history

### 3. Output

- `--json` + `jq -r` by default
- Full JSON: `raindrop list --json --all --sort="-created"`

- Use /search-raindrop if needed
- Use /deep-review-codebase if needed

## Expected Outcome

- A list of recent bookmarks sorted new → old, parsed via `jq` or shown as a table
- No token or secret leaked
