---
name: update-planso
description: Create or update Plane.so projects, work items, labels, priorities, and states
argument-hint: "[project|workitem|label] <target> <changes>"
related:
  - list-planso
  - create-task-in-planso
  - create-plan-in-planso
  - implement-from-planso
  - report
  - ask-me
---

## Goal

Apply explicit changes to Plane.so projects, work items, labels, priorities, states, assignees, estimates, and dates - verified with a before/after report

## Scope

- Use when: the user asks to create a project, change priority/labels/state/assignee on existing items, or adjust project metadata
- Writes through the Plane MCP: `mcp__plane__project`, `mcp__plane__workitem`, `mcp__plane__state`, `mcp__plane__label`, `mcp__plane__workitem_relation`, `mcp__plane__workitem_comment`, and `mcp__plane__workitem_type`
- Bulk edits, state or label creation, and every delete need explicit confirmation
- Browse with `/list-planso`, create items from findings with `/create-task-in-planso`, publish plans with `/create-plan-in-planso`; executing items -> `/implement-from-planso`

## Execute

### 1. Resolve The Entities

> Goal: every target exists before changing it

1. Project -> `mcp__plane__project` action `list` or `retrieve` -> `project_id`
2. States -> `mcp__plane__state` action `list` `project_id=...` -> state UUIDs and their groups (`backlog`, `unstarted`, `started`, `completed`, `cancelled`)
3. Labels -> `mcp__plane__label` action `list` `project_id=...`; members -> `mcp__plane__member` action `list_project`; work item types -> `mcp__plane__workitem_type` action `list` or `resolve` when the type changes
4. Work item target -> `mcp__plane__workitem` action `retrieve_by_identifier` or `retrieve`; missing target -> report and stop
5. Ambiguous target -> `/ask-me` - never guess

### 2. Choose The Operation

> Goal: one precise operation per request

1. Create or update a project -> `mcp__plane__project`:
   - Create requires `name` and `identifier` plus explicit confirmation; optional fields include `description`, `lead`, `target_date`, and `timezone`
   - Update requires `project_id` and only the changed fields; never resend the whole object
2. Update a work item -> `mcp__plane__workitem` action `update` with `project_id`, `workitem_id`, and only the changed fields:
   - `name`, `description_stripped`, `priority` (`urgent` / `high` / `medium` / `low` / `none`), `state` (state UUID), `parent`, `target_date`, `estimate_point`, `type_id`
   - Assignees -> action `manage_assignee` with member UUIDs resolved in step 1
   - Labels -> action `manage_label`, adding or removing resolved label UUIDs; never replace the whole set blindly
3. Create or update a label -> `mcp__plane__label` action `create` or `update`; create or edit a state only with explicit confirmation
4. Relations -> `mcp__plane__workitem_relation` action `create` or `delete`; use relation types from action `list_definitions`
5. Add or edit a note -> `mcp__plane__workitem_comment` action `create` or `update`
6. Never delete a project, work item, label, state, or comment without explicit confirmation

### 3. Dry Run And Confirm

> Goal: no accidental or bulk changes

1. Show target, current values, and proposed values as a table
2. One work item or one field -> proceed after the user's request
3. More than one work item, or any destructive change (delete, archive, clear fields) -> explicit confirmation first
4. Never batch-update without the confirmed list of identifiers

### 4. Apply And Verify

> Goal: the change is real and visible

1. Apply the exact tool call with the UUIDs and identifiers resolved in step 1
2. Confirm with `mcp__plane__workitem` action `retrieve_by_identifier` or `retrieve`, or `mcp__plane__project` action `retrieve`
3. Report a before/after table: target, field, old value, new value
4. If a call fails -> retry once after fixing the input; still failing -> stop and report, never guess values

## Rules

### 1. Explicit Targets

- Always resolve names to UUIDs or identifiers before writing; `<PROJECT>-<n>` for work items, `<PROJECT>` for the project identifier
- Never create a project, label, state, or work item type unless the user asked for it
- Never guess a state UUID; map it from `mcp__plane__state` by group

### 2. Field Semantics

- Priority values are `urgent`, `high`, `medium`, `low`, and `none`
- States belong to the project workflow - resolve the UUID and apply it; do not invent state names
- Work item bodies use `description_stripped`; page bodies use `description_html`, which replaces the whole body
- Use `manage_label` and `manage_assignee` for incremental changes; relations use the types returned by `list_definitions`

### 3. Safety

- No delete, archive, or bulk edit without explicit confirmation
- No commit or push; no secrets, credentials, or customer data in any field
- Stop and report on any contradiction between the request and the current Plane state

- Use /ask-me if needed
- Use /report if needed

## Expected Outcome

- Projects, work items, labels, priorities, states, and assignments are updated exactly as requested
- Every change is verified and reported as a before/after table
- No unintended items were modified
