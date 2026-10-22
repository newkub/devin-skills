---
name: save-to-planso
description: Save findings or tasks into the right Plane.so project via MCP
argument-hint: "[content-or-file] [project-or-parent]"
related:
  - list-planso
  - create-plan-to-planso
  - implement-from-planso
  - update-planso
  - deep-plan
  - save-to-todo-md
  - save-to-todo-gist
  - update-todo-md
  - report-progress
  - report
  - ask-me
  - plan
---

## Goal

Save findings, decisions, requirements, or follow-up tasks as work items in the correct Plane.so project, choosing the project first and asking when ownership is unclear

## Scope

- Use when: the user says "save to Plane" or "save to plan", or a session produced findings that belong in a Plane project
- Writes through the Plane MCP: `mcp__plane__project`, `mcp__plane__workitem`, `mcp__plane__state`, `mcp__plane__label`, `mcp__plane__workitem_relation`, `mcp__plane__workitem_comment`, and `mcp__plane__page`
- Creates work items by default; appends to an existing Plane page only when the user chooses a plan page
- Does not implement work and does not create a project without explicit confirmation - a local plan file belongs to `/create-plan-in-dot-devin`, a published plan to `/create-plan-to-planso`
- Browse first with `/list-planso`, change existing items with `/update-planso`, and leave deep research to `/deep-plan`
- Not a general TODO store -> `/save-to-todo-md`, `/save-to-todo-gist`, or `/update-todo-md`

## Execute

### 1. Prepare The Content

> Goal: know exactly what will be saved

1. Take the argument: a file path -> read it; plain text -> use as-is; no argument -> summarize the session's findings, decisions, and pending items with `/report-progress`
2. Normalize into items: name, what, why it matters, source/evidence, priority (`urgent`/`high`/`medium`/`low`), effort (`S`/`M`/`L`), target date, and optional parent
3. Drop completed or speculative items; never save secrets, tokens, credentials, or customer data

### 2. Resolve The Project

> Goal: items land in the project that owns them

1. Explicit project name or identifier -> `mcp__plane__project` action `list` and match `identifier` or `name`
2. No explicit project -> derive the candidate from the current repository name and compare it with the Plane project list; state the match and continue when it is unambiguous
3. Several or no candidates -> `/ask-me` with project names, identifiers, and descriptions - never write into a guessed project
4. Creating a missing project needs an explicit yes; only then `mcp__plane__project` action `create` with `name` and `identifier`
5. Resolve the project's states with `mcp__plane__state` action `list` `project_id=...`; resolve labels with `mcp__plane__label` action `list` when the items need them

### 3. Pick The Container

> Goal: items go where the plan already lives

1. Default container is a work item in the resolved project; an explicit parent or epic -> `mcp__plane__workitem` action `retrieve_by_identifier` and use its UUID as `parent`
2. When the user names a plan page -> `mcp__plane__page` action `list` `project_id=...` and match by name; several -> `/ask-me`
3. Read the chosen page with `mcp__plane__page` action `retrieve` before editing - `description_html` replaces the whole body
4. Never create a page, epic, or module unless the user asked for it

### 4. Dedupe Before Writing

> Goal: append only what is new

1. Search each item with `mcp__plane__workitem` action `search` `query=<distinctive words>`, and list the project's open items for a broader comparison
2. Identical item with the same scope -> skip; similar item -> update the existing work item description with the extra evidence
3. Never delete, archive, or renumber existing work items

### 5. Create Or Append

> Goal: every item is traceable and implementable

1. `mcp__plane__workitem` action `create` with `project_id`, `name`, `description_stripped` (what, why, evidence, source, date), `priority`, optional `parent`, `labels`, `target_date`, and the `backlog` or `unstarted` state UUID
2. Keep one outcome per work item so `/implement-from-planso` can order and close it independently
3. Dependencies: `mcp__plane__workitem_relation` action `create` with `relation_type` `blocked_by` after resolving the related work item UUID
4. Page chosen instead -> `mcp__plane__page` action `update` with the retrieved body plus the new section; create a page only when none exists and the user approved it
5. Never guess a state UUID - resolve it from `mcp__plane__state` by `group`

### 6. Verify And Report

> Goal: the user knows exactly what landed in Plane

1. Retrieve each created work item or list the project to confirm its identifier (`<PROJECT>-<n>`) and state
2. Report via `/report`: project, container, created/merged/skipped identifiers, and blocked relations
3. Name the next action: `/implement-from-planso` with the project identifier

## Rules

### 1. Project First

- Never write before the project is confirmed - ambiguity -> `/ask-me`
- Items owned by different projects -> split by project and report; never dump everything into one project
- Prefer the project the current repository maps to; recency breaks ties only when the topic also matches

### 2. Append Only

- Merge duplicates instead of re-creating them; preserve existing names, identifiers, and descriptions
- Every item needs evidence/source and a priority so `/implement-from-planso` can order it later
- No secrets, credentials, keys, or customer data in work items or pages

### 3. Plane Ownership

- Do not implement; do not create a project, page, or epic without confirmation
- Status changes belong to the executor; do not mark items completed from this skill
- If a work item is stale or contradicts the codebase -> report it instead of saving contradictory items

- Use /ask-me if needed
- Use /report if needed

## Expected Outcome

- Items saved as work items in the correct Plane.so project, deduplicated and traceable
- The user knows the project, container, created/merged/skipped identifiers, and dependencies
- `/implement-from-planso` can pick the project up without any local plan file
