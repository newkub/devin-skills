---
name: list-dot-agents-global-skills
description: Inventory skill packages with descriptions, groups, and relation map
related:
  - list-dot-agents-global
  - search-skills
  - report

---

## Goal

List every skill package under `~/.agents/skills` with its description, group, and count

## Scope

- Read only directories that contain `SKILL.md`
- `--relation` mode builds the skill relation map
- Boundary: rule findings → `/check-agents-lint`; package structure → `/check-skills-structure`

## Execute

### 1. Scan Packages

> Goal: find every skill package

1. List directories in `~/.agents/skills/`
2. Keep only those containing `SKILL.md`
3. Read `name`, `description`, and `related` from each frontmatter
4. Skip `node_modules`, `target`, and dot-directories

### 2. Group

> Goal: group skills by type

1. Group by type: Frontend, Build Tools, Testing, Database, Code Quality, Frameworks, Runtime, Tooling, Other
2. Count skills per group

### 3. Report

> Goal: present the inventory

1. Follow `/report`; table columns: No., Skill, Description, Group
2. Sort by group then name
3. State the total package count

### 4. Relation View

> Goal: build the relation map when asked

1. Run only with `--relation`
2. Follow [references/relation-view.md](../../references/relation-view.md)
3. Report the Skill / Contains / Called By table plus flow chains

## Rules

- Show every package, filter none out
- Never use `**` bold; use backticks for names and paths
- Read-only — never edit a skill file while scanning
- Do not invent groups outside the fixed list

## Expected Outcome

- A numbered table of every skill package
- Per-group counts and a total
- Optional relation map with a 3-column table and flow chains
