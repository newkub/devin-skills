---
name: manage
description: Manage context and multiple tasks by rethinking, ordering, and dispatching the next work
argument-hint: "[context-or-tasks]"
related:
  - rethink
  - suggest-next-action
  - report-todo
  - continue
  - ship
  - follow-parallel
  - follow-enter-dot
  - report
  - ask-me
  - refactor
  - edit-only
  - move-to
  - rename
  - all-this-patterns
---

## Goal

Manage context and multiple tasks in an organized way by rethinking, ordering priority, and dispatching the next work correctly

## Scope

Use when there is context or multiple tasks to the point of not knowing what to do first, or when you want the agent to manage it instead. It does not edit code or files directly. It is an orchestrator only

## Execute

### 1. Gather Context

> Goal: gather what needs to be managed

1. Read the current todo list
2. Read `git status` and open files
3. Read the user's latest message/command
4. Do `/report` to summarize the entire context

### 2. Rethink And Prioritize

> Goal: know what is important first

1. Do `/rethink` to analyze the multiple context items
2. Order priority: urgent → high impact → blocking → low risk
3. Identify dependencies between tasks
4. If the context overlaps or conflicts → do `/ask-me`

### 3. Decide File Operation Mode

> Goal: if there are file operations, choose the appropriate form

1. If the work is not about file operations → skip to the next step
2. Do `/rethink` by asking which file op form to use:
   - `/edit-only` — edit only in place
   - `/refactor` — refactor code while preserving behavior
   - `/refactor` structure scope — move/restructure files
   - `/move-to` — move files/folders
   - `/rename` — rename identifiers/files including batch rename
   - `/all-this-patterns` — edit multiple places by pattern
3. Choose based on the `/rethink` result, with the user confirming if there are several closely comparable options

### 4. Dispatch Next Actions

> Goal: send work to the correct skill

1. If there is pending work to continue → `/continue`
2. If there are several independent tasks to do in parallel → `/follow-parallel`
3. If the work is done and should ship → `/ship`
4. If planning is needed → `/report-todo` then follow the order
5. If the work is long or must loop → `/loop-until-complete`

### 5. Track And Report

> Goal: track progress

1. Do `/report-todo` to refresh the plan table with the new `Before` → `After` state
2. Do `/suggest-next-action` when each round finishes
3. If the user presses `.` → `/follow-enter-dot`

## Rules

- Do not edit files directly. It is an orchestrator only
- Always do `/rethink` before deciding when there are multiple context items
- If the work is high risk → ask the user to confirm first
- Keep the todo list updated at all times
- Do not skip validation or `/report-progress`

## Expected Outcome

- Multiple context items are ordered and understood
- Work is dispatched to the appropriate skill
- The todo list is updated and clear
- The user knows the next action
