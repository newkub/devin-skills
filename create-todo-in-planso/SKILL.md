---
name: create-todo-in-planso
description: Create a Plane.so work item in Todo, or a full plan hierarchy with subtasks and blocked-by links
argument-hint: "[content-or-file] [project-or-parent] [plan]"
related:
  - list-todo-from-planso
  - implement-todo-from-planso
  - update-planso
  - save-to-backlog-in-planso
  - deep-plan
  - run-check
  - save-to-todo-md
  - save-to-todo-md
  - update-todo-md
  - report-progress
  - report
  - ask-me
---

## Goal

Create one Plane.so work item in Todo status from findings, decisions, or a requirement - with optional subtasks and explicit `blocked_by` links - in the project that owns it, asking when ownership or scope is unclear; with the `plan` argument, publish a whole implementation-ready plan as a three-level hierarchy instead

## Scope

- Use when: the user says "save to Plane", "create a task in Plane", or "create a todo in Plane", or a session produced work that belongs in a Plane project - a single Todo work item or a full plan hierarchy (argument `plan`)
- Writes through the Plane MCP: `mcp__plane__project`, `mcp__plane__workitem`, `mcp__plane__state`, `mcp__plane__label`, `mcp__plane__workitem_relation`
- Two modes: default creates one work item in Todo (`unstarted`) status plus at most one level of subtasks; the `plan` argument publishes a fixed three-level hierarchy - plan work item -> task -> subtask, never deeper and never skipped
- Does not implement work and does not create a project without explicit confirmation
- Browse first with `/list-todo-from-planso`, change existing items with `/update-planso`, and leave deep analysis to `/deep-plan`
- Not for work that must wait -> the plan work item and deferred items go to `backlog` via `/save-to-backlog-in-planso`
- Not a general TODO store -> `/save-to-todo-md`, `/save-to-todo-md`, or `/update-todo-md`

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

1. `mcp__plane__workitem` action `create` with `project_id`, `name`, `description_stripped` (what, why, evidence, source, date), `priority`, optional `parent`, `labels`, `target_date`, and the `unstarted` (Todo) state UUID - never create directly in `backlog`, that is `/save-to-backlog-in-planso`
2. Capture the returned work item `id` (UUID) - it is the `parent` for any subtask
3. Subtasks: one `create` per subtask with `parent=<task id>`, `unstarted` state, effort, and its own verification step; no deeper nesting
4. Dependencies: `mcp__plane__workitem_relation` action `create` with `relation_type` `blocked_by` after resolving the related work item UUID - blockers outside the project need their own project id
5. Never guess a state UUID - resolve it from `mcp__plane__state` by `group`

### 6. Verify And Report

> Goal: the user knows exactly what landed in Plane

1. Retrieve each created task and subtask to confirm its identifier (`<PROJECT>-<n>`), parent, and state
2. Report via `/report`: project, parent, created/merged/skipped identifiers, and blocked relations
3. Name the next action: `/implement-todo-from-planso` with the created identifier

### 7. Plan Mode — Publish The Full Hierarchy

> Goal: a whole implementation-ready plan lands as plan work item -> task -> subtask, executable without any local plan file

1. Run steps 2-4 first (project, parent, dedupe); the plan argument replaces the single task - analyze scope before drafting: read `AGENTS.md`, the project manifest, and the files the goal touches, run the project's read-only check via `/run-check` and record the baseline; contradictions -> `/ask-me` before publishing
2. Draft the tree: level 1 is the plan work item (goal, scope, non-goals, ordering rationale, final verification command); level 2 tasks, one per workstream, quick wins first without breaking dependencies; level 3 subtasks only for a task with two or more independently verifiable steps, one outcome each, `S` (<=30 min) sized
3. A task with a single step stays a leaf - never create a subtask that repeats its parent; every task and subtask gets files, acceptance criteria, verification command, effort (`S`/`M`/`L`), and blockers (`Depends on <PROJECT>-<n>`)
4. Present the plan -> task -> subtask tree and the target project for confirmation; resolve `backlog`/`unstarted` state UUIDs by `group`, labels, and members with `mcp__plane__member` action `list_project`
5. An existing plan with the same scope -> extend it with `/update-planso` instead of creating a parallel hierarchy
6. Publish level by level: create the plan work item and capture its UUID, create tasks with `parent=<plan id>`, then subtasks with `parent=<task id>` after each task exists - never in parallel with its parent
7. The plan work item goes to `backlog`; tasks and subtasks go to `unstarted`; dependencies are explicit `mcp__plane__workitem_relation` `blocked_by` entries between resolved UUIDs, never prose only; reference touched files and verification commands in each leaf description so it is self-contained
8. Verify exactly three levels with no orphan task or subtask - a work item whose parent UUID was never captured is an orphan, re-read it with `retrieve_by_identifier`; report the tree with effort, priority, and dependencies, and name the next action: `/implement-todo-from-planso` with the first leaf identifier

## Rules

### 1. Project First

- Never write before the project is confirmed - ambiguity -> `/ask-me`
- Items owned by different projects -> split by project and report; never dump everything into one project
- Prefer the project the current repository maps to; recency breaks ties only when the topic also matches

### 2. One Level Of Subtasks

- A subtask needs its task parent to exist first and inherits the same project
- No sub-subtasks in task mode - a deeper breakdown is a full plan; run this skill with the `plan` argument (step 7)
- Every task and subtask carries evidence/source and a priority so `/implement-todo-from-planso` can order it later

### 3. Append Only

- Merge duplicates instead of re-creating them; preserve existing names, identifiers, and descriptions
- No secrets, credentials, keys, or customer data in work items
- Never guess a state or parent UUID; resolve it first

### 4. Plane Ownership

- Do not implement; do not create a project, page, or epic without confirmation
- Status changes belong to the executor; do not mark items completed from this skill
- If a work item is stale or contradicts the codebase -> report it instead of saving contradictory items

### 5. Plan Hierarchy Discipline

- In plan mode, exactly three levels: plan work item -> task -> subtask, never deeper and never skipped
- Never create a parallel plan - an existing plan with the same scope is extended with `/update-planso`
- New scope discovered during analysis belongs in the plan, not in a silent implementation; plan mode never edits project code, commits, or pushes
- Keep identifiers stable after creation - renames and moves go through `/update-planso`

- Use /ask-me if needed
- Use /report if needed
- Use /deep-plan if needed

## Expected Outcome

- One work item created in Todo (`unstarted`) status in the correct Plane.so project, with optional subtasks and explicit `blocked_by` links
- With the `plan` argument: one plan work item with its task children and subtask grandchildren, every leaf self-contained with files, acceptance criteria, verification, effort, and explicit `blocked_by` links
- The user knows the project, parent, created/merged/skipped identifiers, and dependencies
- `/implement-todo-from-planso` can pick the work up without any local plan file
