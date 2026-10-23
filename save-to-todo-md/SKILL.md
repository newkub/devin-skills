---
name: save-to-todo-md
description: Save pending/unfinished session work into TODO.md as tracked items
argument-hint: "[title-or-auto]"
related:
  - update-docs
  - update-todo-md
  - implement-to-production
  - report-progress
  - report

---

## Goal

Record unfinished work — pending items, blocked tasks, follow-ups — from the current task into the project’s `TODO.md` so no pending work is lost when the session ends

## Scope

- Use when: a task ends with work left over, a session is about to end, work is blocked awaiting input, or the user asks to save work for later
- Write to `TODO.md` at the project root — unlike `/update-todo-md`, which takes a single request, this skill stores the whole set of remaining work from the current context
- If `--drive` is given → write to `D:\TODO.md` (drive-level inbox), first running `/enhance-prompt` on the content, and stop if a title duplicates
- Does not implement work — stores tracked items only

## Execute

### 1. Report Progress First

> Goal: Summarize the current work status before storing items

1. Always run `/report-progress` first — summarize completed/pending work to see the big picture before writing TODO
2. Use the report result as input for remaining work

### 2. Collect Remaining Work

> Goal: Gather pending work from context

1. Check the current todo list — items still `pending`/`in_progress`
2. Check blockers and deferred items found while working
3. Include follow-ups that were suggested but not yet done (from reports/suggestions)
4. If the argument gives a title → store under that heading; if not → use the current task name

### 3. Normalize Items

> Goal: Convert pending work into TODO items that can be continued

1. Each item must be actionable: state what + why pending (blocked by X / out of scope / deferred)
2. Drop items that are done or no longer relevant
3. Include enough context to continue without reading the session — related reference files/decisions
4. Set priority: `high` (blocker/critical path), `medium`, `low` (nice-to-have)

### 4. Write To TODO.md

> Goal: Append items to TODO.md without overwriting existing ones

1. Choose the target: default = `TODO.md` at the project root; if `--drive` is given → `D:\TODO.md`
2. In `--drive` mode → first run `/enhance-prompt` to turn the content into a numbered list, and stop if a duplicate title is found in `D:\TODO.md`
3. Read the target `TODO.md` if it exists — keep the existing structure
4. If it does not exist yet → create it with a header per the `/update-todo-md` convention:
   ```markdown
   | Title | Description | Status | Priority | Created |
   |---|---|---|---|---|
   ```
5. Append new rows — never overwrite existing items
6. Format: `| <title> | <description + why pending> | pending | <priority> | <YYYYMMDD> |`
7. If several related items exist → group them with a shared prefix in the title

### 5. Dedupe And Report

> Goal: Avoid duplicating existing items and report the results

1. Compare against existing rows — skip or merge duplicates (update status/priority instead of re-adding)
2. Use `/report` to summarize: `No.`, `Item`, `Priority`, `Why Pending`, `Action`
3. Give the path and the count of items added/skipped

## Rules

### 1. Append Only

- Never delete or overwrite existing items in TODO.md — merge only when clearly the same item
- Respect the file’s existing format (table or checkbox style)

### 2. Actionable Items

- Every item must be continuable without reading the session — full context/reference included
- Always state why it is pending — blocked, deferred, or out of scope

### 3. Session Aware

- Invoke only when work is genuinely left pending — never create TODO items from fully completed work
- If nothing is pending → report that there is nothing; don’t force writing
- Use /update-docs if needed

## Expected Outcome

- All pending work is stored in `TODO.md` as tracked items with priority and reason
- No items duplicate the existing ones
- The next session can resume from TODO.md via `/update-todo-md` and `/implement-to-production`

