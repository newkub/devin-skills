---
name: list-todo-from-planso
description: List Plane.so Todo items, projects, states, labels, and comments via MCP
argument-hint: "[workitems|projects|states|labels|comments|relations|pages] [filters]"
related:
  - create-todo-in-planso
  - implement-todo-from-planso
  - update-planso
  - save-to-backlog-in-planso
  - report
  - ask-me
---

## Goal

Show the current state of the Plane.so workspace - Todo work items by default, plus projects, states, labels, comments, relations, or pages when asked - scoped to one project, with identifiers the user can act on immediately

## Scope

- Use when: the user asks what is in Plane, wants to browse or filter work items, or needs an identifier before another action
- Reads through the Plane MCP: `mcp__plane__workspace`, `mcp__plane__project`, `mcp__plane__workitem`, `mcp__plane__workitem_relation`, `mcp__plane__workitem_comment`, `mcp__plane__state`, `mcp__plane__label`, `mcp__plane__page`, and `mcp__plane__member`
- Read-only - this skill never creates, updates, or deletes anything; new Todo items -> `/create-todo-in-planso`, edits -> `/update-planso`, deferred work -> `/save-to-backlog-in-planso`
- Not a planner or executor -> `/create-todo-in-planso plan`, `/implement-todo-from-planso`

## Execute

### 1. Resolve The Workspace And Project

> Goal: every query is scoped to the right workspace and project

1. `mcp__plane__workspace` action `retrieve` to confirm the workspace
2. `mcp__plane__project` action `list` (paginate with `cursor` and `per_page`) and match `identifier` or `name`
3. No argument -> derive a candidate from the current repository name; one clear match -> use it; several or none -> `/ask-me` with the project names and identifiers - never guess
4. Default scope is the resolved project; workspace-wide only when the user asks

### 2. Pick The Entity

> Goal: query only the entity the user asked for

1. Default is `workitems`; accept `projects`, `states`, `labels`, `comments`, `relations`, `pages`, or `members`
2. No entity given -> list the project's Todo work items - state group `unstarted` - and say so; `started` items only when the user asks for in-progress work
3. `backlog` items are listed only on an explicit request such as `backlog`, never mixed into the default Todo list

### 3. Query With Filters

> Goal: a narrow, paginated result set

1. Work items -> `mcp__plane__workitem` action `list` with `project_id`, optional `pql`, `per_page` (<=100), and `cursor`; check `mcp__plane__get_pql_reference` when the filter syntax is uncertain
2. Todo items -> filter on `state__group` `unstarted`; resolve the group's state UUIDs with `mcp__plane__state` action `list` when PQL is not used
3. One work item -> `mcp__plane__workitem` action `retrieve_by_identifier` with an identifier such as `ENG-12`, or action `retrieve` with its UUID
4. Relations -> `mcp__plane__workitem_relation` action `list`; relation types -> action `list_definitions`
5. Comments -> `mcp__plane__workitem_comment` action `list` with `project_id` and `workitem_id`
6. Projects -> `mcp__plane__project` action `list`; one project -> action `retrieve`
7. Labels -> `mcp__plane__label` action `list` `project_id=...`; states -> `mcp__plane__state` action `list` `project_id=...`
8. Pages -> `mcp__plane__page` action `list` `project_id=...`; one page -> action `retrieve`
9. Members -> `mcp__plane__member` action `list_project`; current user -> action `me`
10. Follow `next_cursor`; archived work items only with `mcp__plane__workitem` action `list_archived` when the user asks

### 4. Present The Result

> Goal: the user can pick an identifier and act

1. Work items table: `| Identifier | Name | State | Priority | Assignees | Labels | Target date |`
2. Nest sub-work items under their parent and show the parent identifier
3. Projects table: `| Identifier | Name | Status | Priority | Lead | Target date |`
4. Close with total count, whether more pages exist, and the next action - `/implement-todo-from-planso` for a Todo item, `/update-planso` to change one, or a narrower filter

## Rules

### 1. Read Only

- Never call `workitem` create/update/delete/archive, `project` create/update/delete, `state` create/update/delete, `label` create/update/delete, `workitem_comment` create/update/delete, or `workitem_relation` create/delete from this skill
- If the user asks to change something -> hand off to `/update-planso`; new work -> `/create-todo-in-planso`; deferral -> `/save-to-backlog-in-planso`

### 2. Scope And Identity

- Resolve project, state, label, and member names to UUIDs before filtering; never invent one
- `<PROJECT>-<n>` is the work item identifier; the project identifier is `<PROJECT>` - do not mix them
- Priority values are `urgent`, `high`, `medium`, `low`, and `none`
- State groups are `backlog`, `unstarted`, `started`, `completed`, and `cancelled` - never assume a state name
- Todo means the `unstarted` group; `backlog` is never the default listing

### 3. Output Discipline

- Page at 100 rows or fewer; never dump the whole workspace unpaginated
- Show identifiers exactly as Plane returns them
- No secrets, tokens, or customer data in output

- Use /ask-me if needed
- Use /report if needed

## Expected Outcome

- The requested Plane entities are listed with identifiers, state, and priority, defaulting to the project's Todo items
- Pagination status is explicit, and the user knows the exact next action
