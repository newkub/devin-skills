---
name: cleanup-github-issue
description: Close, delete, or organize stale GitHub issues
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

Clean up stale, duplicate, or resolved issues via gh CLI

## Scope

Use for issue backlog maintenance

## Execute

### 1. Identify targets

> Goal: identify targets

1. List open issues with filters
1. Find duplicates or stale issues

### 2. Confirm

> Goal: confirm

1. Ask user before close or delete
1. Prefer close over delete

### 3. Execute

> Goal: execute

1. Run gh issue close or gh issue delete
1. Add closing comment if needed

### 4. Report

> Goal: report

1. Summary of closed/deleted issues
1. Call /suggest-next-action

## Rules

- Never delete issues without explicit user confirmation
- Close with comment explaining reason
- Do not mass-close without approval

## Expected Outcome

- Stale issues closed or deleted
- Backlog cleaned with log
