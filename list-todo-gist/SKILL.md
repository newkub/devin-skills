---
name: list-todo-gist
description: Show todo items from GitHub Gist `devin-todo.md` via `gh` — grouped by priority/status
argument-hint: "[--status|--project|--all]"
related:
  - save-to-todo-md
  - update-todo-md
  - implement-to-production
  - report
---

## Goal

Fetch and display todo items stored in the GitHub Gist `devin-todo.md` (created by `/save-to-todo-md`) as a readable table — used to resume pending work across machines/projects

## Scope

- Read-only — never edits items; add/update via `/save-to-todo-md` or `/update-todo-md`
- Requires `gh` authenticated (`gh auth status`) — absent → stop and recommend `gh auth login`
- Supports filters: `--status pending`, `--project <name>`, `--all` (include completed)

## Execute

### 1. Locate Gist

> Goal: find the `devin-todo` gist

1. `gh gist list --limit 100` then look for description `devin-todo` or file `devin-todo.md`
2. Not found → report no todo gist exists and recommend `/save-to-todo-md` — stop

### 2. Fetch And Parse

> Goal: fetch content and parse into items

1. `gh gist view <id-or-url> --filename devin-todo.md`
2. Parse the markdown table: `Title`, `Description`, `Status`, `Priority`, `Created`, `Project`
3. Apply filter from the argument: status, project; default shows only `pending` + `in-progress` (use `--all` for completed)

### 3. Report

> Goal: show a table

1. Use `/report` table columns: `No.`, `Title`, `Status`, `Priority`, `Project`, `Created`, `Why Pending`
2. Group by `Project` then sort by `Priority`: high → medium → low
3. Show summary counts at top: pending/in-progress/completed
4. Suggest next action: `/implement-to-production` to implement or `/save-to-todo-md` to add items

## Rules

### Read-Only

- Never edit the gist — report only
- Items stale or done → offer to use `/save-to-todo-md` to merge updated status

### Output

- Table always has `No.` as the first column, per `/report` conventions
- Items > 50 → show only `high` + `medium` and summarize the rest
- Always show the gist URL

## Expected Outcome

- A todo-items table from the gist matching the filter, with summary counts
- Cross-project pending work visible in one place
- Next action clearly stated at the end of the report
