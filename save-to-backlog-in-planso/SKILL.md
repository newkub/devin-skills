---
name: save-to-backlog-in-planso
description: Park work in Plane.so Backlog - create a deferred item or move existing ones out of Todo
argument-hint: "[content-or-workitem] [project]"
related:
  - create-todo-in-planso
  - list-todo-from-planso
  - implement-todo-from-planso
  - update-planso
  - deep-plan
  - report
  - ask-me
---

## Goal

Park work in the Plane.so Backlog (`backlog` state group) so it stays visible and resumable without competing for execution time - either as a brand-new deferred work item or by moving existing items out of Todo

## Scope

- Use when: the user says "save to backlog", "put this on hold", "later", or something is premature, speculative, or blocked by an undecided question
- Writes through the Plane MCP: `mcp__plane__project`, `mcp__plane__workitem`, `mcp__plane__state`, `mcp__plane__label`, `mcp__plane__workitem_relation`
- Two modes: create a new Backlog work item (default), or move one or more existing work items into Backlog with argument `move`
- Never implements the work and never marks anything done - `/implement-todo-from-planso` only executes items that sit in Todo
- Items that are ready now belong in Todo through `/create-todo-in-planso`; edits to name, priority, labels, or dates go through `/update-planso`
- Deep analysis before writing a multi-step deferred plan -> `/deep-plan`
- Browse what is already parked or queued with `/list-todo-from-planso`

## Execute

### 1. Read The Request

> Goal: know whether this is a new item or a move

1. Argument starts with a work item identifier such as `ENG-42` or the word `move` -> move mode; one or more identifiers follow
2. No identifier -> create mode; the argument is either a file path to read or plain text to use as-is
3. No argument -> summarize the session's deferred findings, decisions, and open questions into one item, and state the summary you are about to save
4. Nothing genuinely deferred -> report that and stop; never park work just to close a conversation

### 2. Resolve The Project And Backlog State

> Goal: the item lands in a real project, in the real Backlog state

1. Explicit project name or identifier -> `mcp__plane__project` action `list` and match `identifier` or `name`
2. No explicit project -> derive the candidate from the current repository name, compare it with the Plane project list, and state the match
3. Several or no candidates -> `/ask-me` with project names, identifiers, and descriptions - never guess
4. Resolve states with `mcp__plane__state` action `list` `project_id=...`; take the UUID whose `group` is `backlog`; no `backlog` group in the workflow -> report it and stop, never substitute another state
5. Resolve labels with `mcp__plane__label` action `list` when the item needs them; members with `mcp__plane__member` action `list_project` when it needs an owner

### 3. Dedupe Before Writing

> Goal: the Backlog does not fill up with duplicates

1. Create mode -> `mcp__plane__workitem` action `search` `query=<distinctive words>` plus a listing of the project's `backlog` items
2. An identical parked item -> append the new evidence with `/update-planso` instead of creating a second one
3. Move mode -> `mcp__plane__workitem` action `retrieve_by_identifier` for each identifier to confirm it exists, belongs to the project, and is not already in `backlog`
4. Never delete, archive, or renumber an item to make room

### 4. Create A Deferred Work Item

> Goal: the parked item is self-contained enough to resume months later

1. `mcp__plane__workitem` action `create` with `project_id`, `name`, `description_stripped`, priority, optional `labels`, optional `target_date`, and the `backlog` state UUID
2. The description carries what, why it is deferred, the decision or blocker that must clear first, the evidence or source, and the date - no secrets, tokens, credentials, or customer data
3. Effort (`S`/`M`/`L`) goes in the description or a label when the project uses one, so later ordering stays possible
4. A deferred item with a known blocker -> `mcp__plane__workitem_relation` action `create` with `blocked_by` after resolving the blocker's UUID
5. Capture the returned work item `id` and identifier - the user needs both

### 5. Move Existing Items

> Goal: the move is explicit, verified, and reversible in the report

1. Show a dry-run table before writing: identifier, name, current state group, target `backlog` state UUID
2. One work item -> apply after the user's request; more than one -> explicit confirmation of the exact identifier list first
3. Apply with `mcp__plane__workitem` action `update` per item with `project_id`, `workitem_id`, and `state=<backlog UUID>`
4. Add a short comment with `mcp__plane__workitem_comment` action `create`: why it was parked, what must happen before it returns to Todo, and the date
5. Items in `started` -> confirm before parking, since the executor may be mid-work; never move them in bulk
6. Completed or cancelled items stay where they are - reopen and park only on an explicit request

### 6. Verify And Report

> Goal: the user knows what is parked and how it comes back

1. Retrieve each created or moved item to confirm its identifier, state group `backlog`, parent, and blockers
2. Report via `/report`: project, identifiers, mode (created or moved), blockers, and the condition that returns each item to Todo
3. Name the next action: `/list-todo-from-planso` to review the queue, `/create-todo-in-planso` when work becomes ready, or `/update-planso` to move a single item back to Todo

## Rules

### 1. Backlog Only

- Every write in this skill targets the `backlog` state group - never `unstarted`, `started`, `completed`, or `cancelled`
- Moving an item from Todo to Backlog is a decision, not housekeeping: say why and record it in a comment
- Returning an item to Todo is owned by `/update-planso`, not this skill

### 2. Resolve Before Writing

- Always resolve names to UUIDs: project, state, label, member, and blocker
- Never guess a state UUID; map it from `mcp__plane__state` by `group`
- Missing project, ambiguous target, or an item that does not exist -> report and stop

### 3. Append And Preserve

- Merge duplicates instead of re-creating them; preserve existing names, identifiers, descriptions, and relations
- No delete, archive, or bulk move without explicit confirmation and a dry-run table
- No commit or push; no secrets, credentials, or customer data in any field

### 4. Plane Ownership

- Never implement the parked work; `/implement-todo-from-planso` executes Todo items only
- Never mark an item completed or cancelled from this skill
- A parked item that contradicts the codebase -> report it instead of saving a contradictory item

- Use /ask-me when the project or the identifier list is ambiguous
- Use /report for the final summary
- Use /deep-plan when the deferred work needs a full implementation-ready plan before parking

## Expected Outcome

- Deferred work lives in the Backlog of the correct Plane.so project, with the reason and the unblocking condition in the description or a comment
- Moved items are verified in state group `backlog` and keep their parent, labels, and relations
- The user knows every identifier touched and the exact next action to bring the work back into Todo
