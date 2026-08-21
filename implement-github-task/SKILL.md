---
name: implement-github-task
description: Implement a task from a GitHub issue or project item
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

Read a GitHub issue or project task and implement the work

## Scope

Use to convert issue/task into code or documentation changes

## Execute

### 1. Read task

> Goal: read task

1. Run gh issue view or gh project item-list
1. Extract title, body, acceptance criteria

### 2. Plan

> Goal: plan

1. Call /create-plan if complex
1. Identify files and skills needed

### 3. Implement

> Goal: implement

1. Make changes according to task
1. Call /realize-implementation or /refactor

### 4. Verify

> Goal: verify

1. Run /run-check and /run-test
1. Update project status or close issue

### 5. Report

> Goal: report

1. Summarize changes and link to issue/PR

## Rules

- Ask user before destructive changes
- Close issue only after verification
- Update project status when done

## Expected Outcome

- Task implemented
- Issue closed or project status updated
- Verification passes