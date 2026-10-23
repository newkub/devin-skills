---
name: report-todo
description: Plan table: architecture, tasks, priority, acceptance criteria, verification
argument-hint: "[actions-or-context]"
related:
  - report
  - suggest-next-action
---

## Goal

Answer with the target architecture picture and a numbered task-plan table — one task per row, each row stating what changes, where, and how it is accepted — before any work starts

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

### 2. Draw The Architecture

> Goal: show the image of what it should be before listing tasks

1. Draw this section before the table whenever the plan changes structure (folders, modules, dependency direction, data flow)
2. Pick the fitting form: a file tree for layout changes, an ANSI box diagram for flows and dependencies — every outer box uses uniform width and stays undistorted (fix with `/draw-ansi` when needed)
3. When a relation flips direction (a dependency reverses, a module moves sides), show `before` then `after` as two diagrams
4. No emoji and no `**` bold inside diagrams
5. Skip this section when nothing structural changes

### 3. Build The Table

> Goal: show each task with its type, priority, place, and acceptance

1. Follow `/report` so the table starts with `No.` numbered 1, 2, 3, ...
2. Required columns (8): No., Task, Type, Priority, Location, Status, Solution, Acceptance Criteria
   - `Task` — one short imperative phrase
   - `Type` — feat, fix, refactor, chore, docs, test, or delete
   - `Priority` — P0, P1, P2 by impact
   - `Location` — the exact paths or module the task touches; `TBD` when unknown
   - `Status` — todo, doing, done, blocked
   - `Solution` — the approach in one clause
   - `Acceptance Criteria` — the observable condition that closes the row
3. Optional columns — Problem, Root Cause, Purpose, Expected, Dependencies, Verification, Resolution, Examples, Skill, Risk — add only the ones that carry information for this plan
4. Keep the table at most 9 columns; when more are needed, move the overflow into a second detail table keyed by `No.`
5. Use backticks for paths, commands, and skill names

Example A — 8 required plus one optional:

| No. | Task | Type | Priority | Location | Status | Solution | Acceptance Criteria | Risk |
|---|---|---|---|---|---|---|---|---|
| 1 | Centralize harness paths | refactor | P0 | `skills/*/SKILL.md` | todo | Point skills at `~/.agents` | No stale `%APPDATA%` path remains | Medium — stale links break routing |
| 2 | Remove absorbed skill dirs | delete | P1 | `skills/update-dot-agents-project/` | todo | Merge duplicates into one package | Tree has one package per skill | Low — backup exists |
| 3 | Verify the tree | test | P2 | none | todo | Run lint and structure checks | Both checks pass clean | Low — read-only |

Example B — overflow into a detail table keyed by `No.`:

| No. | Task | Type | Priority | Location | Status | Solution | Acceptance Criteria | Dependencies |
|---|---|---|---|---|---|---|---|---|
| 1 | Split worker into modules | refactor | P0 | `src/worker/` | todo | One handler per file behind a fetch router | Each file exports one handler group | — |
| 2 | Recover unique sources first | chore | P0 | `src/worker/{ai,deploy,github,mcp,shared}.ts` | todo | Copy split before deleting the old workspace | All 5 files present in target | No. 1 |

| No. | Root Cause | Verification |
|---|---|---|
| 1 | One file mixed OAuth, proxy, and save logic | Import graph shows no cross-handler cycles |
| 2 | Old copy was the only place holding the split | `diff -rq` between backup zip and target is clean |

### 4. Add The Numbered Summary

> Goal: give a short read-aloud version below the table

1. Add a `Summary` line, then a numbered list from `/report` with one line per row
2. Keep each line to task, target, and reason
3. Close with `Start at No. N: ...`

### 5. Validate

> Goal: check the answer before sending

1. The architecture diagram (when structural change exists) comes before the table and its outer boxes are uniform width
2. `No.` is the first column and counts from 1 with no gaps
3. Every row carries all 8 required columns
4. The main table has at most 9 columns; any overflow lives in a detail table keyed by `No.`
5. Every path is plausible; unknown ones say `TBD`
6. No `**` bold, no emoji status

## Rules

- Answer in chat only; never create a report file from this skill
- One task per row, single responsibility
- Architecture first, table second; diagrams use file tree or ANSI with uniform outer boxes, before/after when a direction flips
- `Location` names paths the task really touches; read-only tasks say `none`
- Never invent a file path — use `TBD` when it cannot be known yet
- Prefer the 8 required columns; add optional columns only when they answer a question the reader has
- The plan stays read-only; start work only after the user confirms

## Expected Outcome

- An architecture picture of what it should be, drawn before the plan table when structure changes
- A table with `No.` first, the 8 required columns filled with evidence, optional columns chosen for fit, capped at 9 columns with overflow in a keyed detail table
- A numbered summary and a start line below the table
- A plan the user can approve row by row without asking what each change touches
