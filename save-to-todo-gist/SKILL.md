---
name: save-to-todo-gist
description: Save session pending work to a GitHub Gist (`devin-todo.md`) via `gh` — sync across machines
argument-hint: "[title-or-auto]"
related:
  - list-todo-gist
  - save-to-todo-md
  - update-todo-md
  - report-progress
  - report
---

## Goal

Record unfinished work — pending items, blocked tasks, follow-ups — into a single GitHub Gist file `devin-todo.md` via the `gh` CLI so work can be resumed from any machine (unlike `/save-to-todo-md`, which stores them in the project's `TODO.md`)

## Scope

- Use when: you want to keep pending work outside the repo, sync across machines/projects, or the user asks to store todos in a gist
- Does not implement work — stores tracked items only
- Requires an authenticated `gh` (`gh auth status`) — if missing → stop and suggest `gh auth login`

## Execute

### 1. Report Progress First

> Goal: Summarize the current work status before storing items

1. Always run `/report-progress` first — summarize completed/pending work
2. Use the report result as input for remaining work

### 2. Collect Remaining Work

> Goal: Gather pending work from context

1. Check the current todo list — items still `pending`/`in_progress`
2. Check blockers and deferred items found while working
3. Include follow-ups that were suggested but not yet done
4. If the argument gives a title → store under that heading; if not → use the current task name

### 3. Find Or Create Gist

> Goal: Find the existing gist or create a single new one per account

1. Search for the gist: `gh gist list --limit 100`, then look for description `devin-todo` or file `devin-todo.md`
2. If not found → create the `devin-todo.md` file with a header per convention:
   ```
   | Title | Description | Status | Priority | Created | Project |
   |---|---|---|---|---|---|
   ```
   then `gh gist create devin-todo.md --desc "devin-todo"` (default is a secret gist — never `--public` unless the user asks)
3. If found → pull the existing content: `gh gist view <id-or-url> --filename devin-todo.md` and keep it for merging

### 4. Append Items And Push

> Goal: Append items to the gist without overwriting existing ones

1. Normalize items: each item actionable — what + why pending + priority (`high`/`medium`/`low`) + project name
2. Append new rows after the existing table: `| <title> | <description + why pending> | pending | <priority> | <YYYYMMDD> | <project> |`
3. Dedupe against existing rows — merge/update status instead of adding duplicates
4. Push back with `gh gist edit <id> --filename devin-todo.md`, receiving the new content via stdin (pipe) — or `gh api gists/<id> -X PATCH -F 'files[devin-todo.md][content]=<content>'`

### 5. Report

> Goal: Report results

1. Use `/report` to summarize: `No.`, `Item`, `Priority`, `Why Pending`, `Action`
2. Give the gist URL and the count of items added/skipped/merged

## Rules

### 1. Single Gist, Append Only

- One gist per account — always look for description `devin-todo`; never create duplicates
- Never delete or overwrite existing items — merge only clearly identical items
- Secret gists only — todos may contain project context that shouldn’t be public

### 2. Actionable Items

- Every item must be continuable without reading the session — full context/reference included
- Always state the project because the gist aggregates across repos

### 3. Session Aware

- Invoke only when work is genuinely left pending — never create items from fully completed work
- If nothing is pending → report that there is nothing; don’t force writing

## Expected Outcome

- Pending work is stored in the gist `devin-todo.md` with priority, reason, and project
- No duplicate items; the existing gist is merged, not overwritten
- Work can be resumed via `/list-todo-gist` on any machine that has `gh` authenticated
