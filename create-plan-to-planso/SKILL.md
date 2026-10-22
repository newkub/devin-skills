---
name: create-plan-to-planso
description: Analyze a scope, then publish an implementation-ready plan to Plane.so work items
argument-hint: "[goal-or-scope]"
related:
  - save-to-planso
  - list-planso
  - implement-from-planso
  - update-planso
  - deep-plan
  - create-plan-in-dot-devin
  - ask-me
---

## Goal

Turn a goal into a verified, ordered plan and publish it into a Plane.so project as parent work items with sub-work items (one task per item), so `/implement-from-planso` can execute it without any local plan file

## Scope

- Use when: the user wants a plan or breakdown saved into Plane.so rather than a local file
- Reads the codebase and Plane; writes only through `/save-to-planso` (`mcp__plane__*`)
- Stops at planning - never implements, commits, or pushes
- A local plan file instead -> `/create-plan-in-dot-devin`; a plan already written -> `/save-to-planso`

## Execute

### 1. Analyze The Scope

> Goal: the plan is grounded in the real codebase

1. Read `AGENTS.md`, the project manifest, and the files the goal touches
2. Identify the current behavior, constraints, public API, test commands, and risks
3. Run the project's read-only check (`check`, `typecheck`, `test`) via `/run-check` and record the baseline
4. Note anything that contradicts the request; contradictions -> `/ask-me` before planning

### 2. Draft The Plan

> Goal: every task is independently implementable and verifiable

1. Write: goal, scope, non-goals, ordered tasks, dependencies, and the final verification command
2. Each task gets: files to touch, acceptance criteria, verification, effort (`S` <=30 min, `M` <=2 h, `L` >2 h), and blockers (`Depends on <PROJECT>-<n>`)
3. Group tasks into workstreams - one parent work item per workstream, one sub-work item per task
4. Order tasks quick wins first without breaking dependencies
5. Keep one outcome per sub-work item; split anything that has two reasons to change

### 3. Confirm The Shape

> Goal: no surprise work items in Plane

1. Ambiguous scope, several valid project homes, or no matching project -> `/ask-me`
2. Otherwise present the workstream/task tree and the target project, then continue
3. Resolve the project with `mcp__plane__project` action `list` and match `identifier` or `name`; creating a missing project needs explicit confirmation
4. Load the project's states with `mcp__plane__state` action `list` `project_id=...`; map the `backlog` and `unstarted` groups to their UUIDs
5. Resolve labels with `mcp__plane__label` action `list` `project_id=...` and members with `mcp__plane__member` action `list_project`

### 4. Publish With save-to-planso

> Goal: the plan exists in Plane exactly as approved

1. Run `/save-to-planso` with the workstream tree, effort, priority (`urgent` / `high` / `medium` / `low`), labels, and the chosen project
2. Parent work items go to the `backlog` state; sub-work items are created with `parent`
3. Dependencies are written with `mcp__plane__workitem_relation` action `create` `relation_type: "blocked_by"` - never left only in the description
4. Reference touched files and verification commands in each sub-work item description so it is self-contained

### 5. Verify And Hand Off

> Goal: the user can start execution immediately

1. Confirm each workstream and sub-work item identifier (`<PROJECT>-<n>`) with `mcp__plane__workitem` action `list` or `retrieve_by_identifier`
2. Report the tree: parent, sub-work items, effort, priority, dependencies
3. Name the next action: `/implement-from-planso` with the first identifier

## Rules

### 1. Plan Only

- Never edit project code, commit, or push from this skill
- Never create a Plane project or work item without the steps above
- New scope discovered during analysis belongs in the plan, not in a silent implementation

### 2. Plane Is The Source

- Resolve the project, state, label, member, and work item IDs before writing
- Every sub-work item must be executable on its own and linked back to its parent
- Dependencies must be explicit `workitem_relation` entries, not prose only
- Never guess a state UUID; map it from `mcp__plane__state` by group

### 3. No Duplicate Plans

- Search Plane first with `/list-planso` or `mcp__plane__workitem` action `search` and a distinctive `query`
- An existing plan with the same scope -> extend it with `/update-planso` instead of creating a parallel one

- Use /ask-me if needed
- Use /deep-plan if needed

## Expected Outcome

- A verified plan published as parent work items with sub-work items in the target Plane.so project
- Each sub-work item has files, acceptance criteria, verification, effort, and explicit dependencies
- `/implement-from-planso` can start from the reported identifier
