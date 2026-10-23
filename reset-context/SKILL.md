---
name: reset-context
description: Delete session context and/or reset the target file view, re-analyze from disk
argument-hint: "[optional-target-or-task]"
allowed-tools:
  - read
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - scan-codebase
  - use-astgrep
  - review-dot-agents-global-and-fix
  - deep-thinking
  - follow-best-practice
  - deep-review
  - plan
  - refactor
  - use-scripts
  - implement-to-production
  - deep-validate
  - run-verify
  - ask-me
---

## Goal

Delete all context from the previous conversation and/or reset the view of the target file, starting a complete fresh analysis from the current file system and the user's new input

## Scope

Use when the user says `reset-context`, wants to discard the previous analysis, or starts new work

- If no target is specified → reset at the session level
- If a target file or directory is specified → reset the view of that file/directory by following the `Assume Reset Context For Target` steps below
- Does not delete any files, but simulates resetting the conversation's or file's understanding

See also: `/scan-codebase`, `/use-astgrep`, `/review-dot-agents-global-and-fix`, `/deep-thinking`, `/plan`, `/refactor`, `/use-scripts`, `/implement-to-production`, `/deep-validate`, `/run-verify`

## Execute

### 1. Reset Mental Context

> Goal: Clear all assumptions from the previous context

1. Disregard the conclusions, analysis, plans, and partial results from previous turns
2. Do not assume the previous state is still true
3. Treat the target file or next task as the first file/task of a new session
4. Do not reference previous decisions unless the user explicitly asks to reference them

### 2. Identify Reset Scope

> Goal: Identify which level to reset

1. If the user does not specify a target → go to `Re-Read State From Disk` for the entire workspace
2. If the user specifies a target file or directory → go to `Assume Reset Context For Target`
3. If unsure → ask the user with `/ask-me`

### 3. Re-Read State From Disk

> Goal: Read the new state from the file system

1. Do not rely on memory for file contents, workspace state, or tool results
2. Re-read the specified files or directories
3. Use `todo_write` to track only the new work, not the old work

### 4. Re-Plan From Scratch

> Goal: Plan the new work from the current file state

1. If the user gives new work, plan that work independently
2. Use `/deep-thinking` to analyze the new problem without bias from before
3. Use `/plan` to create a new plan from the current file state
4. Do not reuse the old plan unless the user asks to

### 5. Assume Reset Context For Target

> Goal: Analyze and fix the target as if for the first time

1. Read the entire target file, skipping no lines
2. Read `imports`, `exports`, dependencies, and reverse dependencies
3. Run `/scan-codebase` along with `/use-astgrep` and `/review-dot-agents-global-and-fix`
4. Run `/deep-thinking` to analyze the structure, issues, and improvements
5. Run `/follow-best-practice` and `/deep-review` to compare against standards
6. Run `/plan` to plan the fixes according to the new findings
7. Run `/refactor` and `/use-scripts` before implementing if needed
8. Run `/implement-to-production` to deliver complete code

### 6. Confirm Before Continuing

> Goal: Confirm before proceeding

1. Summarize your understanding of the new work or target
2. Ask the user to confirm or clarify if the work is large or risky
3. Start work once the target and scope are clear

### 7. Validate

> Goal: Validate all the new results

1. Run `/deep-validate` to check correctness
2. Run `/run-verify` to run lint, typecheck, scan

## Rules

### 1. No Memory Assumptions

- Do not assume files, errors, or previous fixes still apply
- Re-read files before referencing them
- Re-check the workspace state before running a command

### 2. No Context Reference

- Never reference conclusions, analysis, or decisions from the previous conversation
- Never assume previous `code` is correct without proving it
- Every decision must come from reading the actual current files

### 3. Fresh Analysis

- Analyze the new work from the beginning
- If a file has been mentioned before, read that file again
- If a command was run before and its result matters, re-run it
- Read the whole file, skipping no part
- Analyze everything again as if you had never seen this file

### 4. Evidence-Based

- Every assumption must have evidence from the real files
- Every decision must cite code that was actually read
- Do not guess from context or memory

### 5. Complete Independence

- If there are progress notes or shared notes from the old context, read them but do not believe them without proof
- If there is a `TODO` or `FIXME` in a file, check whether it is still relevant
- If there are `comments` explaining a previous fix, check whether they are still correct

### 6. Independence And Safety

- Do not inherit leftover todos, pending actions, or unresolved problems from previous turns
- Create a new `todo_write` list for the new work
- If the user wants to resume old work, they must say so explicitly
- Do not perform destructive actions based on assumptions from the previous context
- Always confirm the target and action before changing files
- If in doubt, ask rather than assume

## Expected Outcome

- The conversation continues without assumptions from previous turns
- Files and workspace state are re-read from disk before deciding
- The new work or target is planned and tracked independently
- The user receives a short confirmation that the context has been reset
- Analysis and fixes of the target are not constrained by the old context
- Reduces confirmation bias and wrong assumptions
- Discovers problems that were overlooked due to the old context
