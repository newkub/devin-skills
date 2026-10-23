---
name: report-todo
description: Plan table: architecture, file tree, tech stack, tasks with why, before and after
argument-hint: "[actions-or-context]"
related:
  - report
  - report-file-structure
  - refactor
  - suggest-next-action
---

## Goal

Answer with the target architecture picture, the file structure, and the tech stack, then a numbered task-plan table — one task per row, each row stating why it exists, what it looks like now, and what it becomes — before any work starts

## Scope

- Use when the user asks what to do, wants a plan, or wants the current state summarized without execution
- Chat only; this skill never creates or edits files
- Boundary: a long-form report file → `/report`; scanning an existing tree deep → `/report-file-structure`; discovering the actions → `/suggest-next-action`

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
2. Pick the fitting form: an ANSI box diagram for flows and dependencies — every outer box uses uniform width and stays undistorted (fix with `/draw-ansi` when needed)
3. When a relation flips direction (a dependency reverses, a module moves sides), show `before` then `after` as two diagrams
4. No emoji and no `**` bold inside diagrams
5. Skip this section when nothing structural changes

### 3. Draw The File Structure

> Goal: show the target layout of the scope as an ANSI file tree

1. Draw this section after the architecture diagram whenever the plan changes the layout (new folders, moved modules, renamed packages)
2. Use an ANSI file tree (`├──`, `│`, `└──`) of the target structure — one root line, a `#` comment after each folder that carries a role
3. Annotate only what the plan touches; keep unrelated branches out of the tree
4. When files move, show `before` and `after` as two trees, never one mixed tree
5. The deep scan of an existing tree belongs to `/report-file-structure`; this section shows only the target layout of the plan
6. Skip this section when the layout does not change

### 4. State The Tech Stack

> Goal: name the stack the plan runs on and what each layer is for

1. Draw this section after the file tree whenever the plan adds, changes, or locks a technology choice
2. Use a table from `/report`: first column `No.`, then Layer, Tech, Status, Role — `Status` is `existing`, `new`, or `decision` (an open question the plan must close)
3. State the boundary on the same row when a library is allowed in one layer only (e.g. a runtime lib confined to the server layer)
4. Before proposing a new dependency run `/follow-my-techstack` and `/use-lib-effective`; reuse what exists first
5. Skip this section when the stack is unchanged and no choice is open

### 5. Build The Table

> Goal: show each task with its reason and the state change

1. Follow `/report` so the table starts with `No.` numbered 1, 2, 3, ...
2. Required columns (5): No., Task, Why, Before, After
   - `Task` — one short imperative phrase
   - `Why` — the reason the task exists, in one clause; never a restatement of `Task`
   - `Before` — the current state as evidence: the path, symbol, count, or observed behavior
   - `After` — the resulting state that closes the row, observable and checkable
3. When the plan touches code, read `/refactor` first and make row `No. 1` the baseline task: run `/run-verify` to green and record the baseline sha (or the clean-tree state when the target has no repo yet) — every later row depends on it
4. Optional columns — Root Cause, Dependencies, Verification, Skill, Risk, Examples — add only the ones that carry information for this plan
5. Keep the main table at most 7 columns (5 required + 2 optional); when more are needed, move the overflow into a second detail table keyed by `No.`
6. Use backticks for paths, commands, and skill names

Example A — 5 required plus two optional:

| No. | Task | Why | Before | After | Verification | Risk |
|---|---|---|---|---|---|---|
| 1 | Record the refactor baseline | Later rows have no green state to return to | `git status` dirty, checks not run | Checks green, baseline sha recorded | `/run-verify` passes vs baseline | Low — read-only |
| 2 | Centralize harness paths | Skills still point at the old per-tool config dir | `skills/*/SKILL.md` uses `%APPDATA%\devin\skills` | Every path uses `~/.agents` | `grep -r %APPDATA%` returns none | Medium — stale links break routing |
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

### 6. Add The Numbered Summary

> Goal: give a short read-aloud version below the table

1. Add a `Summary` line, then a numbered list from `/report` with one line per row
2. Keep each line to task, reason, and the resulting state
3. Close with `Start at No. N: ...`

### 7. Validate

> Goal: check the answer before sending

1. Section order is fixed: architecture diagram, file-structure tree, tech-stack table, plan table, summary — each skipped only when its scope does not change
2. The architecture diagram (when structural change exists) comes before the table and its outer boxes are uniform width
3. The file-structure tree (when the layout changes) and the tech-stack table (when a choice is added or open) sit between the diagram and the plan table
4. When the plan touches code, row `No. 1` is the `/refactor` baseline task and no build row precedes it
5. `No.` is the first column and counts from 1 with no gaps
6. Every row carries all 5 required columns
7. The main table has at most 7 columns (5 required + 2 optional); any overflow lives in a detail table keyed by `No.`
8. Every `Before` cell states real evidence; never invent a file path — use `TBD` when it cannot be known yet
9. Every `After` cell is checkable — it says how to tell the row is done
10. No `**` bold, no emoji status

## Rules

- Answer in chat only; never create a report file from this skill
- One task per row, single responsibility
- Architecture first, file tree second, tech stack third, table fourth; diagrams use ANSI with uniform outer boxes, before/after when a direction or a layout flips
- A code-touching plan reads `/refactor` first and opens with the baseline row; no implementation row precedes it
- Tech-stack rows name the boundary of every confined library on the same row
- `Before` shows the current state with evidence and `After` shows the state that closes the row; the two cells never say the same thing
- `Why` gives the reason, not a restatement of `Task`
- Prefer the 5 required columns; add optional columns only when they answer a question the reader has
- The plan stays read-only; start work only after the user confirms

## Expected Outcome

- An architecture picture of what it should be, drawn before the plan table when structure changes
- An ANSI file-structure tree of the target layout when the layout changes, before/after when files move
- A tech-stack table naming layer, choice, status, and boundary whenever the plan adds or locks a choice
- A table with `No.` first, the 5 required columns filled with evidence, optional columns chosen for fit, capped at 7 columns with overflow in a keyed detail table
- A baseline row from `/refactor` as `No. 1` whenever the plan touches code
- A numbered summary and a start line below the table
- A plan the user can approve row by row, seeing why each row exists and what changes from before to after
