---
name: report-todo
description: Action plan in chat as a No./Action/Before/After/Why/File Change/Risk table plus numbered summary
argument-hint: "[actions-or-context]"
related:
  - report
  - suggest-next-action
---

## Goal

Answer an action plan in chat as a table with columns `No.`, `Action`, `Before`, `After`, `Why`, `File Change`, `Risk`, plus a `/report numbered` summary below

## Scope

Use when answering a question or recommending actions without acting yet, or when summarizing the current state before proceeding

## Execute

### 1. Collect Actions

> Goal: Gather the actions to report

1. Take the context or actions from the user/skill
2. Run `/suggest-next-action` if there are no actions yet
3. Split each action to have single responsibility
4. Assign priority by impact/risk

### 2. Build Table

> Goal: Build the action plan table

1. Columns:
   - `No.` ordered 1, 2, 3, ...
   - `Action` short and clear
   - `Before` the state before doing it
   - `After` the state after doing it
   - `Why` the reason it should be done
   - `File Change` the files expected to change
   - `Risk` the risk or cautions
   - `Status` using emoji `✅` `⏳` `❌` `⚠️`
2. Order by priority and sort by `Status` with `✅` on top
3. Use backticks for paths, skill names, commands
4. Do not use bold markers

### 3. Add Numbered Summary

> Goal: Summarize below the table

1. Use `/report numbered` to summarize all actions in order
2. Emphasize the first next action
3. State dependencies between actions if any

### 4. Validate

> Goal: Check completeness

1. Verify every column has data
2. Verify `No.` is ordered correctly
3. Verify the numbered summary is below the table

## Rules

- Use when the user asks or needs a plan without acting yet
- Every action must have single responsibility
- Listed files must be reasonably guessable; if unsure write `TBD`
- A `/report numbered` is always required below
- If there are multiple statuses, use `/report table` for the same list
- Answer in chat only

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A table with all 8 columns: No., Action, Before, After, Why, File Change, Risk, Status
- A numbered list summary below
- Next action and dependencies identified
