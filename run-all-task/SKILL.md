---
name: run-all-task
description: Run all pending tasks from queue in order
allowed-tools:
  - read
  - edit
  - write
  - grep
  - exec
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Execute all pending tasks from a task queue without manual intervention

## Scope

Use when there are multiple queued tasks to complete in one pass

## Execute

### 1. Read queue

> Goal: read queue

1. Read QUEUE.md or task list
1. Filter status: pending
1. Sort by priority/created

### 2. Execute tasks

> Goal: execute tasks

1. Run each task with appropriate skill
1. Update status to in-progress
1. Handle errors with /resolve-errors

### 3. Verify

> Goal: verify

1. Run /run-check and /run-test after tasks
1. Compare results with expected
1. Retry failed tasks up to 3 times

### 4. Update and report

> Goal: update and report

1. Mark completed tasks in queue
1. Report summary
1. Call /suggest-next-action

## Rules

- Run one task at a time unless tasks are independent
- Ask user before destructive actions
- Stop and report if a task fails after max retries
- Update queue status after each task

## Expected Outcome

- All pending tasks are executed
- Queue status reflects results
- Verification passes
