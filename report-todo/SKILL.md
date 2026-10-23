---
name: report-todo
description: Plan table: architecture, then tasks with why, before and after
argument-hint: "[actions-or-context]"
related:
  - report
  - suggest-next-action
---

## Goal

Answer with the target architecture picture and a numbered task-plan table — one task per row, each row stating why it exists, what it looks like now, and what it becomes — before any work starts

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

> Goal: show each task with its reason and the state change

1. Follow `/report` so the table starts with `No.` numbered 1, 2, 3, ...
2. Required columns (5): No., Task, Why, Before, After
   - `Task` — one short imperative phrase
   - `Why` — the reason the task exists, in one clause; never a restatement of `Task`
   - `Before` — the current state as evidence: the path, symbol, count, or observed behavior
   - `After` — the resulting state that closes the row, observable and checkable
3. Optional columns — Root Cause, Dependencies, Verification, Skill, Risk, Examples — add only the ones that carry information for this plan
4. Keep the main table at most 7 columns (5 required + 2 optional); when more are needed, move the overflow into a second detail table keyed by `No.`
5. Use backticks for paths, commands, and skill names

Example A — 5 required plus two optional:

| No. | Task | Why | Before | After | Verification | Risk |
|---|---|---|---|---|---|---|
| 1 | Centralize harness paths | Skills still point at the old per-tool config dir | `skills/*/SKILL.md` uses `%APPDATA%\devin\skills` | Every path uses `~/.agents` | `grep -r %APPDATA%` returns none | Medium — stale links break routing |
| 2 | Remove absorbed skill dirs | `AGENTS.md` says merged but the dirs still exist | 4 dirs under `resolve-*-fails/` | Only `resolve-errors` and `resolve-cicd` remain | `ls -d resolve-*` lists the kept set | Low — backup exists |
| 3 | Verify the tree | A merge is not done until the checks pass | checks not run | Both checks run clean | `/check-skills-structure` + `/check-reference` pass | Low — read-only |

Example B — overflow into a detail table keyed by `No.`:

| No. | Task | Why | Before | After | Dependencies |
|---|---|---|---|---|---|
| 1 | Split worker into modules | One file mixes OAuth, proxy, and save logic | `src/worker/index.ts` handles every route | Each file exports one handler group | — |
| 2 | Recover unique sources first | The old copy is the only place holding the split | `src/worker/` missing the 5 split files | All 5 files present in target | No. 1 |

| No. | Root Cause | Verification |
|---|---|---|
| 1 | One file mixed OAuth, proxy, and save logic | Import graph shows no cross-handler cycles |
| 2 | Old copy was the only place holding the split | `diff -rq` between backup zip and target is clean |

### 4. Add The Numbered Summary

> Goal: give a short read-aloud version below the table

1. Add a `Summary` line, then a numbered list from `/report` with one line per row
2. Keep each line to task, reason, and the resulting state
3. Close with `Start at No. N: ...`

### 5. Validate

> Goal: check the answer before sending

1. The architecture diagram (when structural change exists) comes before the table and its outer boxes are uniform width
2. `No.` is the first column and counts from 1 with no gaps
3. Every row carries all 5 required columns
4. The main table has at most 7 columns (5 required + 2 optional); any overflow lives in a detail table keyed by `No.`
5. Every `Before` cell states real evidence; never invent a file path — use `TBD` when it cannot be known yet
6. Every `After` cell is checkable — it says how to tell the row is done
7. No `**` bold, no emoji status

## Rules

- Answer in chat only; never create a report file from this skill
- One task per row, single responsibility
- Architecture first, table second; diagrams use file tree or ANSI with uniform outer boxes, before/after when a direction flips
- `Before` shows the current state with evidence and `After` shows the state that closes the row; the two cells never say the same thing
- `Why` gives the reason, not a restatement of `Task`
- Prefer the 5 required columns; add optional columns only when they answer a question the reader has
- The plan stays read-only; start work only after the user confirms

## Expected Outcome

- An architecture picture of what it should be, drawn before the plan table when structure changes
- A table with `No.` first, the 5 required columns filled with evidence, optional columns chosen for fit, capped at 7 columns with overflow in a keyed detail table
- A numbered summary and a start line below the table
- A plan the user can approve row by row, seeing why each row exists and what changes from before to after
