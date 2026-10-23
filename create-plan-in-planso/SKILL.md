---
name: create-plan-in-planso
description: Publish an implementation-ready plan to Plane.so as tasks and subtasks
argument-hint: "[goal-or-scope]"
related:
  - create-task-in-planso
  - list-planso
  - implement-from-planso
  - update-planso
  - deep-plan
  - create-plan-in-dot-agents
  - ask-me
---

## Goal

Turn a goal into a verified, ordered plan and publish it into a Plane.so project as a three-level hierarchy — one plan work item, task children, and subtask grandchildren — so `/implement-from-planso` can execute it without any local plan file

## Scope

- Use when: the user wants a plan or breakdown saved into Plane.so rather than a local file
- Reads the codebase and Plane; writes only through `/create-task-in-planso` (`mcp__plane__*`)
- Hierarchy is fixed: plan work item -> task -> subtask, never deeper and never skipped
- Stops at planning - never implements, commits, or pushes
- A local plan file instead -> `/create-plan-in-dot-agents`; a single task with no plan -> `/create-task-in-planso`

## Execute

### 1. Analyze The Scope

> Goal: the plan is grounded in the real codebase

1. Read `AGENTS.md`, the project manifest, and the files the goal touches
2. Identify the current behavior, constraints, public API, test commands, and risks
3. Run the project's read-only check (`check`, `typecheck`, `test`) via `/run-check` and record the baseline
4. Note anything that contradicts the request; contradictions -> `/ask-me` before planning

### 2. Draft The Hierarchy

> Goal: every level has one clear owner and every leaf is independently verifiable

1. Level 1 - plan work item: the goal, scope, non-goals, ordering rationale, and the final verification command
2. Level 2 - tasks: one per workstream or cohesive change, ordered quick wins first without breaking dependencies
3. Level 3 - subtasks: only for a task with two or more independently verifiable steps; one outcome each, `S` (<=30 min) sized
4. A task with a single step stays a leaf - never create a subtask that repeats its parent
5. Every task and subtask gets: files to touch, acceptance criteria, verification command, effort (`S`/`M`/`L`), and blockers (`Depends on <PROJECT>-<n>`)

### 3. Confirm The Shape

> Goal: no surprise work items in Plane

1. Ambiguous scope, several valid project homes, or no matching project -> `/ask-me`
2. Otherwise present the plan -> task -> subtask tree and the target project, then continue
3. Resolve the project with `mcp__plane__project` action `list` and match `identifier` or `name`; creating a missing project needs explicit confirmation
4. Load the project's states with `mcp__plane__state` action `list` `project_id=...`; map the `backlog` and `unstarted` groups to their UUIDs
5. Resolve labels with `mcp__plane__label` action `list` `project_id=...` and members with `mcp__plane__member` action `list_project`

### 4. Publish The Hierarchy

> Goal: the plan exists in Plane exactly as approved, level by level

1. Run `/create-task-in-planso` for the plan work item - capture the returned work item `id` (UUID), not just the identifier
2. Tasks: `mcp__plane__workitem` action `create` with `parent=<plan work item id>`; the parent UUID from step 1 is the only valid link
3. Subtasks: same `create` with `parent=<task id>`; create them after their task exists, never in parallel with it
4. Plan work item goes to `backlog`; tasks and subtasks go to `unstarted`
5. Dependencies are written with `mcp__plane__workitem_relation` action `create` `relation_type: "blocked_by"` between the resolved UUIDs - never left only in the description
6. Reference touched files and verification commands in each leaf description so it is self-contained

### 5. Verify And Hand Off

> Goal: the user can start execution immediately

1. Confirm every identifier (`<PROJECT>-<n>`) and its parent with `mcp__plane__workitem` action `list` or `retrieve_by_identifier`
2. Check the tree has exactly three levels and no orphan task or subtask
3. Report the tree: plan, tasks, subtasks, effort, priority, dependencies
4. Name the next action: `/implement-from-planso` with the first leaf identifier

## Rules

### 1. Plan Only

- Never edit project code, commit, or push from this skill
- Never create a Plane project or work item without the steps above
- New scope discovered during analysis belongs in the plan, not in a silent implementation

### 2. Hierarchy Discipline

- Exactly three levels: plan work item -> task -> subtask; no task without a plan parent, no subtask without a task parent
- A work item whose parent UUID was never captured is an orphan - re-read it with `retrieve_by_identifier` before continuing
- One outcome per task and per subtask; a two-reason item is split, not merged
- Never guess a state UUID; map it from `mcp__plane__state` by group

### 3. Plane Is The Source

- Resolve the project, state, label, member, and work item IDs before writing
- Dependencies must be explicit `workitem_relation` entries, not prose only
- Keep identifiers stable after creation - renames and moves go through `/update-planso`

### 4. No Duplicate Plans

- Search Plane first with `/list-planso` or `mcp__plane__workitem` action `search` and a distinctive `query`
- An existing plan with the same scope -> extend it with `/update-planso` instead of creating a parallel hierarchy

- Use /ask-me if needed
- Use /deep-plan if needed

## Expected Outcome

- A verified plan published as one plan work item, its task children, and subtask grandchildren
- Every leaf has files, acceptance criteria, verification, effort, and explicit `blocked_by` links
- `/implement-from-planso` can start from the reported leaf identifier
