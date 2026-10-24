---
name: implement-todo-from-planso
description: Execute Plane.so Todo items, easiest quick wins first, with Plane state updates
argument-hint: "[project-or-workitem] [max-tasks]"
related:
  - create-todo-in-planso
  - list-todo-from-planso
  - update-planso
  - save-to-backlog-in-planso
  - implement-to-production
  - create-plan-in-dot-agents
  - deep-plan
  - run-check
  - run-verify
  - report-progress
  - report
  - refactor
  - resolve-errors
  - ask-me
  - git-commit
---

## Goal

Execute Plane.so work items that sit in Todo (`unstarted`) status one at a time through the Plane MCP, ordering easy quick wins first without breaking dependencies, moving each item to In Progress before the work and to Done with an evidence comment after it

## Scope

- Use when: the work lives in Plane.so as Todo items and the user wants them implemented
- Reads and writes Plane only through `mcp__plane__workitem`, `mcp__plane__project`, `mcp__plane__state`, `mcp__plane__workitem_relation`, and `mcp__plane__workitem_comment`
- Executes Todo items only - `backlog` items are never pulled; they become eligible after `/save-to-backlog-in-planso` or `/update-planso` moves them to Todo
- Lightweight executor: target discovery, ordering, implementation, verification, status updates - it never re-plans
- Browse and filter first with `/list-todo-from-planso`; planning belongs to `/create-todo-in-planso plan`, new items to `/create-todo-in-planso`, metadata edits to `/update-planso`, and local plans to `/create-plan-in-dot-agents` + `/deep-plan`
- Stops at production hardening (auth, infra, migrations, deploy) - hand the remaining items to `/implement-to-production`
- `max-tasks` limits how many items close in one run - default: all until blocked

## Execute

### 1. Resolve The Plane Target

> Goal: know exactly which Plane project and work items are authoritative

1. Argument is a work item identifier such as `ENG-42` -> `mcp__plane__workitem` action `retrieve_by_identifier`, then use its project
2. Argument is a project name or identifier such as `ENG` -> `mcp__plane__project` action `list` (paginate with `cursor` and `per_page`) and match `identifier` or `name`
3. No argument -> `mcp__plane__project` action `list`; one project -> use it; several or none -> `/ask-me` with project names and identifiers - never guess
4. Load the project's states with `mcp__plane__state` action `list` `project_id=...`; map the `unstarted` (Todo), `started` (In Progress), `completed`, and `cancelled` groups to their state UUIDs
5. Read `AGENTS.md` and `refactor/SKILL.md` `## Rules` before the first edit

### 2. Pull And Order The Work Items

> Goal: a dependency-safe queue that starts with Todo quick wins

1. `mcp__plane__workitem` action `list` with `project_id`, `per_page` 100, and cursor pagination; keep items whose state group is `unstarted` (Todo) and drop every `backlog` item
2. An item already in `started` is resumed only when the user names its identifier or it belongs to the current run - never pick one up from a previous session without saying so
3. Narrow the list with `pql` only after checking `mcp__plane__get_pql_reference`; the documented field is `state__group`
4. Read `mcp__plane__workitem_relation` action `list` for items that mention a blocker; also honour dependencies written in the description such as `Depends on ENG-12`
5. Classify effort: `S` (<=30 min), `M` (<=2 h), `L` (>2 h); prefer `estimate_point` or an `effort:S|M|L` label when the project uses one
6. Build the order: `S` items with no open blocker first, then `S` items that unblock the most work, then `M`, then `L`; within a band, overdue `target_date` first, then `urgent`/`high` priority
7. Never start an item whose `blocked_by` relation is still open; a dependency cycle -> report it and stop
8. Present the queue in chat with `/report-todo` (`No.`-first table, one row per work item: Identifier/Task/Effort/Priority/Blocked by) before coding — never `report-plan` (deleted); ask only when the source contradicts itself, and apply `max-tasks`

### 3. Baseline The Project

> Goal: know what passes before changing anything

1. Run the project's read-only check from its manifest (`check`, `typecheck`, `test`) via `/run-check`
2. Record failures as the baseline - do not fix pre-existing failures unless the current item owns them
3. Confirm files referenced by the work item still exist; stale items -> report and ask before proceeding

### 4. Implement One Item At A Time

> Goal: small, verified, traceable changes with a visible In Progress state

1. Move the item to the project's `started` (In Progress) state UUID through `mcp__plane__workitem` action `update` before the first edit
2. Read the affected code first; keep the public API and follow the approach stated in the item
3. Make the minimal change; write or update tests when the item changes behavior
4. Run the narrowest verification, then `/run-check`; on failure use `/resolve-errors`, max 3 attempts -> leave the item in `started`, comment the blocker, and stop

### 5. Close Each Item In Plane

> Goal: Plane reflects reality immediately, not at the end of the run

1. On success add a comment with `mcp__plane__workitem_comment` action `create`: touched files, verification command, result, and the date
2. Then set the `completed` state UUID via `mcp__plane__workitem` action `update` - the comment and the state change are both mandatory
3. For a blocked or skipped item, comment the reason and next action instead of deleting, archiving, or renaming it; an item that turns out to be premature goes back to `backlog` through `/save-to-backlog-in-planso`, never silently
4. Stop when `max-tasks` is reached or the next item is blocked

### 6. Refactor And Verify

> Goal: the touched code meets the project standard

1. Run `/refactor` with the SRP scope on every touched file - 1 unit = 1 reason to change, <=250 lines
2. Run `/run-verify` for the full gate; failures -> `/resolve-errors`, max 3 -> stop and report
3. Confirm no unrelated files changed (`git status`); do not commit unless the user asks (`/git-commit`)

### 7. Report And Hand Off

> Goal: the user knows what is done, blocked, and next

1. Report with `/report`: Identifier/Task/Effort/Status/Evidence, then the count closed/blocked/skipped
2. List the remaining Todo queue and the exact next work item identifier
3. If the remaining items are production-hardening, infra, migration, or deploy work -> recommend `/implement-to-production`

## Rules

### 1. Todo Only

- Pull work from the `unstarted` (Todo) group only; `backlog` items are out of scope until they are moved to Todo
- Never move an item out of `backlog` from this skill - that belongs to `/save-to-backlog-in-planso` or `/update-planso`
- Quick wins first: `S` before `M` before `L` - unless a dependency or an explicit order in the work item says otherwise

### 2. Ordering And Dependencies

- Dependency safety beats speed; a quick win that blocks an `L` item still goes first
- Skip an item that no longer makes sense; record why in a comment instead of deleting it

### 3. Plane Is The Single Source

- Never invent work items or edit scope silently; new items belong to `/create-todo-in-planso`
- Update state and comments immediately per item; a resumed session must be able to continue from Plane alone
- Resolve names to UUIDs first: `state`, `parent`, `labels`, and PQL filters require UUIDs
- Contradiction between a work item and the code -> stop and ask, never silently pick one

### 4. Safety

- No commits or pushes unless the user asks
- Never delete, archive, or bulk-update work items without explicit confirmation
- Destructive operations (schema drop, file deletion, force push) need explicit confirmation
- Never leave a red verification state; a blocked item must stay visibly open with a comment
- Always write the evidence comment before (or with) the state change - a closed item without evidence is incomplete

- Use /ask-me if needed
- Use /report-progress if needed

## Expected Outcome

- Todo items closed in dependency-safe quick-win order, each verified and moved through In Progress to Done
- Every item has an evidence comment with files, verification command, result, and date
- `backlog` items stay untouched and are reported as not eligible
- Touched files pass `/refactor` SRP and `/run-verify`
- Remaining work has an exact next item identifier and a hand-off when it belongs to `/implement-to-production`
