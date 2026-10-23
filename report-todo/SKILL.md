---
name: report-todo
description: Action plan table in chat: No., Action, Before, After, Why, File Change, Risk
argument-hint: "[actions-or-context]"
related:
  - report
  - suggest-next-action
---

## Goal

Answer with an action plan as a numbered table — one action per row, each row stating what changes and which files it touches — before any work starts

## Scope

- Use when the user asks what to do, wants a plan, or wants the current state summarized without execution
- Chat only; this skill never creates or edits files
- Boundary: a long-form report file → `/report`; discovering the actions → `/suggest-next-action`

## Execute

### 1. Collect Actions

> Goal: gather the work and split it cleanly

1. Take the actions from the user or the calling skill
2. When no action exists → run `/suggest-next-action` first
3. Split each action to one responsibility
4. Order by impact and risk, highest first

### 2. Build The Table

> Goal: show each action with its before/after and file impact

1. Follow `/report` so the table starts with `No.` numbered 1, 2, 3, ...
2. Use exactly these columns: No., Action, Before, After, Why, File Change, Risk
3. `Action` is one short imperative phrase
4. `Before` is the current state; `After` is the state once done
5. `Why` is the reason or the problem it solves — one clause
6. `File Change` lists the exact paths to create, edit, move, or delete; use `TBD` when unknown
7. `Risk` is low, medium, or high plus the failure mode when it matters
8. Use backticks for paths, commands, and skill names

Example:

| No. | Action | Before | After | Why | File Change | Risk |
|---|---|---|---|---|---|---|
| 1 | Centralize harness paths | Skills point at `%APPDATA%\devin\*` | Skills point at `~/.agents` | One source of truth | `skills/*/SKILL.md` | Medium — stale links break routing |
| 2 | Remove absorbed skill dirs | 19 duplicate packages | Merged packages only | Removes duplication | `skills/update-dot-agents-project/`, ... | Low — backup exists |
| 3 | Verify the tree | Unverified edits | Lint and structure clean | Prove the change | none | Low — read-only |

### 3. Add The Numbered Summary

> Goal: give a short read-aloud version below the table

1. Add a `Summary` line, then a numbered list from `/report` with one line per row
2. Keep each line to action, target, and reason
3. Close with `Start at No. N: ...`

### 4. Validate

> Goal: check the answer before sending

1. `No.` is the first column and counts from 1 with no gaps
2. Every row has one action and the seven columns
3. Every path is plausible; unknown ones say `TBD`
4. No `**` bold, no emoji status, no extra columns

## Rules

- Answer in chat only; never create a report file from this skill
- One action per row, single responsibility
- `File Change` names paths that the action really writes; read-only actions say `none`
- Never invent a file path — use `TBD` when it cannot be known yet
- The plan stays read-only; start work only after the user confirms

## Expected Outcome

- A table with `No.` first and the seven columns filled with evidence
- A numbered summary and a start line below the table
- A plan the user can approve row by row without asking what each change touches
