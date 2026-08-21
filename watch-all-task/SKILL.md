---
name: watch-all-task
description: Watch task files and auto run pending tasks on changes
triggers:
- user
- model
allowed-tools:
- read
- edit
- write
- grep
- exec
- ask_user_question
---

## Goal

Monitor task queue files and run pending tasks automatically when changes are detected

## Scope

Use for workspaces with task queues or QUEUE.md that need continuous execution

## Execute

### 1. Read task queue

> Goal: read task queue

1. Read QUEUE.md or task list
1. Identify pending tasks
1. Sort by priority

### 2. Watch for changes

> Goal: watch for changes

1. Watch task queue file with file watcher
1. Detect new or modified tasks
1. Debounce rapid changes

### 3. Run pending tasks

> Goal: run pending tasks

1. Call /run-all-task or /implement-queue-md
1. Execute tasks in order
1. Stop on error or ask user

### 4. Report

> Goal: report

1. Log completed and failed tasks
1. Update QUEUE.md status
1. Suggest next action

## Rules

- Do not run destructive tasks without user confirmation
- Use polling or native file watcher based on environment
- Keep one watcher instance per queue file
- Retry failed tasks at most 3 times before stopping

## Expected Outcome

- Task queue is continuously monitored
- Pending tasks are executed automatically
- Status in queue file is up to date
