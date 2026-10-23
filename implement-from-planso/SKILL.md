---
name: implement-from-planso
description: Execute open Plane.so work items, easiest quick wins first
argument-hint: "[project-or-workitem] [max-tasks]"
related:
  - create-task-in-planso
  - list-planso
  - create-plan-in-planso
  - update-planso
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

Execute open work items in a Plane.so project one at a time through the Plane MCP, ordering easy quick wins first without breaking dependencies, and keep every item's Plane state current so the work is resumable

## Scope

- Use when: the plan lives in Plane.so as work items and the user wants it implemented
- Reads and writes Plane only through `mcp__plane__workitem`, `mcp__plane__project`, `mcp__plane__state`, `mcp__plane__workitem_relation`, and `mcp__plane__workitem_comment`
- Lightweight executor: target discovery, ordering, implementation, verification, status updates - it never re-plans
- Browse and filter first with `/list-planso`; planning belongs to `/create-plan-in-planso`, new items to `/create-task-in-planso`, metadata edits to `/update-planso`, and local plans to `/create-plan-in-dot-agents` + `/deep-plan`
- Stops at production hardening (auth, infra, migrations, deploy) - hand the remaining items to `/implement-to-production`
- `max-tasks` limits how many items close in one run - default: all until blocked

## Execute

### 1. Resolve The Plane Target

> Goal: know exactly which Plane project and work items are authoritative

1. Argument is a work item identifier such as `ENG-42` -> `mcp__plane__workitem` action `retrieve_by_identifier`, then use its project
2. Argument is a project name or identifier such as `ENG` -> `mcp__plane__project` action `list` (paginate with `cursor` and `per_page`) and match `identifier` or `name`
3. No argument -> `mcp__plane__project` action `list`; one project -> use it; several or none -> `/ask-me` with project names and identifiers - never guess
4. Load the project's states with `mcp__plane__state` action `list` `project_id=...`; map the `backlog`, `unstarted`, `started`, `completed`, and `cancelled` groups to their state UUIDs
5. Read `AGENTS.md` and `refactor/SKILL.md` `## Rules` before the first edit

### 2. Pull And Order The Work Items

> Goal: a dependency-safe queue that starts with quick wins

1. `mcp__plane__workitem` action `list` with `project_id`, `per_page` 100, and cursor pagination; keep items whose state group is `backlog`, `unstarted`, or `started`
2. Narrow the list with `pql` only after checking `mcp__plane__get_pql_reference`; the documented field is `state__group`
3. Read `mcp__plane__workitem_relation` action `list` for items that mention a blocker; also honour dependencies written in the description such as `Depends on ENG-12`
4. Classify effort: `S` (<=30 min), `M` (<=2 h), `L` (>2 h); prefer `estimate_point` or an `effort:S|M|L` label when the project uses one
5. Build the order: `S` items with no open blocker first, then `S` items that unblock the most work, then `M`, then `L`; within a band, overdue `target_date` first, then `urgent`/`high` priority
6. Never start an item whose `blocked_by` relation is still open; a dependency cycle -> report it and stop
7. Present the queue (Identifier/Task/Effort/Priority/Blocked by) before coding; ask only when the source contradicts itself, and apply `max-tasks`

### 3. Baseline The Project

> Goal: know what passes before changing anything

1. Run the project's read-only check from its manifest (`check`, `typecheck`, `test`) via `/run-check`
2. Record failures as the baseline - do not fix pre-existing failures unless the current item owns them
3. Confirm files referenced by the work item still exist; stale items -> report and ask before proceeding

### 4. Implement One Item At A Time

> Goal: small, verified, traceable changes

1. Move the item to the project's `started` state UUID through `mcp__plane__workitem` action `update` before the first edit
2. Read the affected code first; keep the public API and follow the approach stated in the item
3. Make the minimal change; write or update tests when the item changes behavior
4. Run the narrowest verification, then `/run-check`; on failure use `/resolve-errors`, max 3 attempts -> leave the item in `started`, comment the blocker, and stop

### 5. Close Each Item In Plane

> Goal: Plane reflects reality immediately, not at the end of the run

1. On success add a comment with `mcp__plane__workitem_comment` action `create`: touched files, verification command, result, and the date
2. Then set the `completed` state UUID via `mcp__plane__workitem` action `update` - the comment and the state change are both mandatory
3. For a blocked or skipped item, comment the reason and next action instead of deleting, archiving, or renaming it
4. Stop when `max-tasks` is reached or the next item is blocked

### 6. Refactor And Verify

> Goal: the touched code meets the project standard

1. Run `/refactor` with the SRP scope on every touched file - 1 unit = 1 reason to change, <=250 lines
2. Run `/run-verify` for the full gate; failures -> `/resolve-errors`, max 3 -> stop and report
3. Confirm no unrelated files changed (`git status`); do not commit unless the user asks (`/git-commit`)

### 7. Report And Hand Off

> Goal: the user knows what is done, blocked, and next

1. Report with `/report`: Identifier/Task/Effort/Status/Evidence, then the count closed/blocked/skipped
2. List the remaining queue and the exact next work item identifier
3. If the remaining items are production-hardening, infra, migration, or deploy work -> recommend `/implement-to-production`

## Rules

### 1. Ordering

- Quick wins first: `S` before `M` before `L` - unless a dependency or an explicit order in the work item says otherwise
- Dependency safety beats speed; a quick win that blocks an `L` item still goes first
- Skip an item that no longer makes sense; record why in a comment instead of deleting it

### 2. Plane Is The Single Source

- Never invent work items or edit scope silently; new items belong to `/create-task-in-planso`
- Update state and comments immediately per item; a resumed session must be able to continue from Plane alone
- Resolve names to UUIDs first: `state`, `parent`, `labels`, and PQL filters require UUIDs
- Contradiction between a work item and the code -> stop and ask, never silently pick one

### 3. Safety

- No commits or pushes unless the user asks
- Never delete, archive, or bulk-update work items without explicit confirmation
- Destructive operations (schema drop, file deletion, force push) need explicit confirmation
- Never leave a red verification state; a blocked item must stay visibly open with a comment
- Always write the evidence comment before (or with) the state change - a closed item without evidence is incomplete

- Use /ask-me if needed
- Use /report-progress if needed

## Expected Outcome

- Work items closed in dependency-safe quick-win order, each verified and updated in Plane
- Every item has its state and an evidence comment with files and verification
- Touched files pass `/refactor` SRP and `/run-verify`
- Remaining work has an exact next item identifier and a hand-off when it belongs to `/implement-to-production`
