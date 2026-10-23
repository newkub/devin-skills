---
name: check-agents-session-plan
description: Turn one past session into a numbered action plan without acting
related:
  - check-agents-session
  - report-todo
  - follow-context-engineering

---

## Goal

Summarize a past session into current status and next actions, reported as a numbered plan

## Scope

- Input: one session id, or the newest session when unspecified
- Report only — never perform the actions in this workflow
- Boundary: executing the plan → `/continue`; missing requirements → `/ask-me`

## Execute

### 1. Load Session

> Goal: get enough context to judge status

1. Resolve the session via `check-agents-session` domain `sessions`
2. Read its summary or history file
3. Extract: work done, work pending, work blocked, files touched, skills used

### 2. State Status

> Goal: separate facts from guesses

1. List done items with their evidence
2. List pending and blocked items with the reason
3. Mark anything uncertain instead of filling the gap

### 3. Build Actions

> Goal: derive next actions

1. When the context is long or near full → `/follow-context-engineering` first
2. Derive actions from the pending and blocked items only
3. Split one action per item; ask via `/ask-me` when a requirement is unclear
4. Order by impact and risk, highest first

### 4. Report

> Goal: hand back a plan, not an execution

1. Run `/report-todo` with the actions
2. Include the file each action will touch and the risk when it changes the decision
3. End with the single starting action

## Rules

- Never modify code or files in this workflow
- Never guess which files will change; mark unknown as `TBD`
- One action per row
- Never use `**` bold

## Expected Outcome

- Status split into done, pending, and blocked
- A numbered action table with file and risk per action
- A single recommended starting action
