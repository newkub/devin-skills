---
name: update-github-task
description: Update fields and status of GitHub Project tasks
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

Update task status, priority, assignee, or custom fields

## Scope

Use when a project task needs metadata changes

## Execute

### 1. Find task
> Goal: find task

1. Run gh project item-list
1. Get item ID

### 2. Edit fields
> Goal: edit fields

1. Run gh project item-edit with field-id and value
1. Update status, priority, assignee

### 3. Verify
> Goal: verify

1. Run gh project item-list again
1. Confirm changes

### 4. Report
> Goal: report

1. Return updated task summary

## Rules

- Use --json to get field and item IDs
- Specify owner and project number
- Do not change status without context

## Expected Outcome

- Task fields updated
- Project reflects new state
