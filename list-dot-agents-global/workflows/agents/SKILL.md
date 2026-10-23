---
name: list-dot-agents-global-agents
description: Inventory global subagents with model, tools, and permissions
related:
  - list-dot-agents-global
  - update-devin-global-subagents
  - use-subagents

---

## Goal

List every global subagent in `~/.agents/agents` with name, description, model, allowed tools, and permissions

## Scope

- Scan only `~/.agents/agents`
- Show only subdirectories that contain `AGENT.md`
- Boundary: creating or editing a subagent → `/update-devin-global-subagents`

## Execute

### 1. Scan Agents Directory

> Goal: find all global subagents

1. Scan `~/.agents/agents` for subdirectories containing `AGENT.md`
2. Skip dot-directories and any directory without `AGENT.md`
3. When the directory is missing → report that there are no global subagents

### 2. Extract Metadata

> Goal: extract metadata from each subagent

1. Read each subagent's `AGENT.md`
2. Extract `name`, `description`, `model`, `allowed-tools`, and `permissions`
3. When the frontmatter is incomplete → note it on the row

### 3. Report

> Goal: present the global subagent list

1. Follow `/report`; table columns: No., Agent, Description, Model, Tools
2. Sort by name
3. State the total subagent count
4. When any frontmatter is incomplete → add a footer note

## Rules

- Scan only `~/.agents/agents`
- Never use `**` bold; use backticks for names and tool identifiers
- Read-only
- Sort by name, one row per subagent

## Expected Outcome

- A numbered table of every global subagent
- The total count of global subagents
- Incomplete frontmatter identified per row and in the footer
