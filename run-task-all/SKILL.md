---
name: run-task-all
description: Run all pending tasks from the queue, in order
argument-hint: "[target]"
related:
  - deep-review
  - run-verify
  - run-test
  - report
  - suggest-next-action
  - resolve-errors

---

## Goal

Run all pending tasks from the task queue without manual intervention

## Scope

Use when there are several tasks in the queue that must be completed in one pass

## Execute

> Pre-Run: Always run `/deep-review` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (task all)

### 1. Read queue

> Goal: Read the queue

1. Read `QUEUE.md` or the task list
1. Filter by status: pending
1. Sort by priority/created

### 2. Execute tasks

> Goal: Run the tasks

1. Run each task with the appropriate skill
1. Update the status to in-progress
1. Handle errors with `/resolve-errors`

### 3. Verify

> Goal: Verify

1. Run `/run-verify` and `/run-test` after each task finishes
1. Compare the results against what was expected
1. Retry failed tasks up to 3 times

### 4. Update and report

> Goal: Update and report

1. Mark completed tasks in the queue
1. Report a summary of the results
1. Invoke `/suggest-next-action`

## Rules

- Run one task at a time, unless the tasks are independent of each other
- Ask the user before performing a destructive action
- Stop and report if a task fails after the maximum number of retries
- Update the queue status after each task finishes

- Use /report if needed

## Expected Outcome

- All pending tasks have been run
- The queue status reflects the results
- Verification passes