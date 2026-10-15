---
name: report-progress
description: Report the agent session status and progress: completed, pending, blockers, and next actions
argument-hint: "[all|completed|pending|blockers]"
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
  - report
  - report-before-after
  - suggest-next-action
  - ask-me

---

## Goal

Report the current agent session status — what has been done, what percent is complete, what is still pending, and what to do next — and help the user decide whether to continue, stop, or ask for more information

## Scope

Use to summarize the status of the current Devin session from the available conversation history, git status, project state, todo list, and validation results

See also: /report-before-after

## Execute

### 1. Gather Session Context

> Goal: Know the context of the work in progress

1. Read the latest session summary from `%APPDATA%\devin\cli\summaries\`
2. Check the current working directory and `git status --short`
3. Read the project `AGENTS.md` or `global_rules.md` if present
4. Find todo/roadmap files such as `todo.md`, `ROADMAP.md`, `.devin\todo.md`
5. If the context is unclear → run `/ask-me` to ask the user

### 2. Identify Completed Work

> Goal: Know the work already done

1. Summarize the latest commits, work names, and changed files
2. Check the working tree status — clean or with uncommitted changes
3. Identify key checkpoints from the conversation history
4. Use `/report` to show completed work

### 3. Identify Pending Work

> Goal: Know the work still pending and the blockers

1. Check todo/roadmap items not marked completed
2. Identify uncommitted/unpushed changes
3. Identify tests, build, lint, or validation not yet passing
4. Identify dependencies or decisions waiting on the user

### 4. Calculate Progress

> Goal: Know the completion percentage

1. Count completed and pending items from the todo/roadmap
2. Compute the percentage: `completed / total * 100`
3. If there are sub-tasks, include them all together
4. Use a progress bar such as `████████████░░ 80%`
5. State the trend: ↑ ↓ → (improving, regressing, stable)

### 5. Report And Suggest Next Actions

> Goal: A clear report with next steps

1. Summarize the overall session status with a progress bar
2. Use `/report table` for the todo/roadmap, sorted by status with `completed` on top
3. Identify the priority of pending work
4. Run `/suggest-next-action` to propose the next step

### 6. Continue Or Stop

> Goal: Help the user decide after the report

1. If the user wants to keep fixing → use `/resolve-errors`, `/fix`, or the suitable skill
2. If the user wants to stop → report the status and the stopping point
3. If more information is needed → run `/deep-research` or `/ask-me`
4. If an action is risky → use `/ask-me` for approval before doing it

## Rules

### 1. Data Sources

- Use `%APPDATA%\devin\cli\summaries\` for session history
- Use `git status` and `git log` for committed/uncommitted changes
- Read `AGENTS.md` and project rules if present
- Ask the user if data is incomplete

### 2. Accuracy

- Do not claim work is done while git has not committed or it is not verified
- Do not hallucinate work that did not happen in the session
- Distinguish between finished work, pending work, and work waiting on the user

### 3. Progress Format

- Show a clear percentage such as `75%`
- Use a progress bar such as `████████████░░ 75%`
- Separate colors/status: ✅ done, ⚠️ pending, ❌ blocked
- If there are sub-tasks, split progress per category

### 4. Report Format

- Summarize key findings at the very top
- Use symbols ✅ ❌ ⚠️ for status
- Use `/report table` for the todo list, sorted by status: `completed` → `in_progress` → `pending` → `blocker`

### 5. Privacy

- Do not reference or reveal secrets, API keys, credentials
- Do not read unrelated files

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- The full current session status is known
- An accurate progress percentage
- Completed work, pending work, and blockers clearly reported
- Priorities and actionable next actions present
- The user can choose to continue, stop, or ask-for-more-info
