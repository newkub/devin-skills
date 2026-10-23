---
name: create-task-in-planso
description: Create a Plane.so task with optional subtasks and blocked-by links
argument-hint: "[content-or-file] [project-or-parent]"
related:
  - list-planso
  - create-plan-in-planso
  - implement-from-planso
  - update-planso
  - deep-plan
  - save-to-todo-md
  - save-to-todo-gist
  - update-todo-md
  - report-progress
  - report
  - ask-me
---

## Goal

Create one Plane.so task from findings, decisions, or a requirement - with optional subtasks and explicit `blocked_by` links - in the project that owns it, asking when ownership or scope is unclear

## Scope

- Use when: the user says "save to Plane" or "create a task in Plane", or a session produced work that belongs in a Plane project but does not need a full plan hierarchy
- Writes through the Plane MCP: `mcp__plane__project`, `mcp__plane__workitem`, `mcp__plane__state`, `mcp__plane__label`, `mcp__plane__workitem_relation`
- One task plus at most one level of subtasks; a multi-level plan belongs to `/create-plan-in-planso`
- Does not implement work and does not create a project without explicit confirmation
- Browse first with `/list-planso`, change existing items with `/update-planso`, and leave deep analysis to `/deep-plan`
- Not a general TODO store -> `/save-to-todo-md`, `/save-to-todo-gist`, or `/update-todo-md`

## Execute

### 1. Prepare The Task

> Goal: know exactly what will be created

1. Take the argument: a file path -> read it; plain text -> use as-is; no argument -> summarize the session's findings, decisions, and pending items with `/report-progress`
2. Normalize the task: name, what, why it matters, source/evidence, priority (`urgent`/`high`/`medium`/`low`), effort (`S`/`M`/`L`), target date, optional parent, and optional subtasks
3. A subtask is allowed only when the step can be verified on its own; otherwise fold it into the task description
4. Drop completed or speculative items; never save secrets, tokens, credentials, or customer data

### 2. Resolve The Project

> Goal: the task lands in the project that owns it

1. Explicit project name or identifier -> `mcp__plane__project` action `list` and match `identifier` or `name`
2. No explicit project -> derive the candidate from the current repository name and compare it with the Plane project list; state the match and continue when it is unambiguous
3. Several or no candidates -> `/ask-me` with project names, identifiers, and descriptions - never write into a guessed project
4. Creating a missing project needs an explicit yes; only then `mcp__plane__project` action `create` with `name` and `identifier`
5. Resolve the project's states with `mcp__plane__state` action `list` `project_id=...`; resolve labels with `mcp__plane__label` action `list` when the task needs them

### 3. Choose The Parent

> Goal: the task hangs off the right work item or none

1. Default: a top-level task in the resolved project with no `parent`
2. Explicit parent or plan work item -> `mcp__plane__workitem` action `retrieve_by_identifier` and keep its UUID as `parent`
3. Parent must live in the same project; different project -> stop and report the mismatch
4. Never create a page, epic, or module unless the user asked for it

### 4. Dedupe Before Writing

> Goal: create only what is new

1. Search with `mcp__plane__workitem` action `search` `query=<distinctive words>`, and list the project's open items for a broader comparison
2. Identical task with the same scope -> skip; similar task -> append the extra evidence via `/update-planso`
3. Never delete, archive, or renumber existing work items

### 5. Create Task And Subtasks

> Goal: every created item is traceable and implementable

1. `mcp__plane__workitem` action `create` with `project_id`, `name`, `description_stripped` (what, why, evidence, source, date), `priority`, optional `parent`, `labels`, `target_date`, and the `backlog` or `unstarted` state UUID
2. Capture the returned work item `id` (UUID) - it is the `parent` for any subtask
3. Subtasks: one `create` per subtask with `parent=<task id>`, `unstarted` state, effort, and its own verification step; no deeper nesting
4. Dependencies: `mcp__plane__workitem_relation` action `create` with `relation_type` `blocked_by` after resolving the related work item UUID - blockers outside the project need their own project id
5. Never guess a state UUID - resolve it from `mcp__plane__state` by `group`

### 6. Verify And Report

> Goal: the user knows exactly what landed in Plane

1. Retrieve each created task and subtask to confirm its identifier (`<PROJECT>-<n>`), parent, and state
2. Report via `/report`: project, parent, created/merged/skipped identifiers, and blocked relations
3. Name the next action: `/implement-from-planso` with the created identifier

## Rules

### 1. Project First

- Never write before the project is confirmed - ambiguity -> `/ask-me`
- Items owned by different projects -> split by project and report; never dump everything into one project
- Prefer the project the current repository maps to; recency breaks ties only when the topic also matches

### 2. One Level Of Subtasks

- A subtask needs its task parent to exist first and inherits the same project
- No sub-subtasks - a deeper breakdown is a plan, which goes to `/create-plan-in-planso`
- Every task and subtask carries evidence/source and a priority so `/implement-from-planso` can order it later

### 3. Append Only

- Merge duplicates instead of re-creating them; preserve existing names, identifiers, and descriptions
- No secrets, credentials, keys, or customer data in work items
- Never guess a state or parent UUID; resolve it first

### 4. Plane Ownership

- Do not implement; do not create a project, page, or epic without confirmation
- Status changes belong to the executor; do not mark items completed from this skill
- If a work item is stale or contradicts the codebase -> report it instead of saving contradictory items

- Use /ask-me if needed
- Use /report if needed

## Expected Outcome

- One task created in the correct Plane.so project, with optional subtasks and explicit `blocked_by` links
- The user knows the project, parent, created/merged/skipped identifiers, and dependencies
- `/implement-from-planso` can pick the work up without any local plan file
