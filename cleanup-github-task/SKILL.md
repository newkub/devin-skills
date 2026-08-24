---
name: cleanup-github-task
description: Archive or delete tasks in GitHub Projects
---

## Goal

Remove or archive completed/stale tasks in GitHub Projects

## Scope

Use for project board cleanup

## Execute

### 1. List tasks
> Goal: list tasks

1. Run gh project item-list with filters
1. Identify stale or done tasks

### 2. Confirm
> Goal: confirm

1. Ask user before archive or delete

### 3. Execute
> Goal: execute

1. Run gh project item-archive or item-delete
1. Verify with item-list

### 4. Report
> Goal: report

1. Summary of cleaned tasks

## Rules

- Archive preferred over delete
- Confirm destructive actions
- Do not archive in-progress tasks without reason

## Expected Outcome

- Project board cleaned
- Archived/deleted tasks reported
