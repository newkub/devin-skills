---
name: list-devin-global-skills
description: List all Devin global skills with descriptions
argument-hint: "[scope] [--relation]"
related:
  - report
  - search
  - search-skills

---

## Goal

List all skills in the `skills` directory

## Scope

Use to see the available skills before choosing ones for `AGENTS.md`

## Execute

### 1. List Skill Directories

> Goal: List Skill Directories

Read every directory in the `skills` directory

1. Read all directories in `%APPDATA%\devin\skills\`
2. Keep only those containing a `SKILL.md` file
3. Read each `SKILL.md` frontmatter for `title` and `description`

### 2. Categorize Skills

> Goal: Categorize Skills

Group skills by type

1. Group by type: `Frontend`, `Build Tools`, `Testing`, `Database`, `Code Quality`, `Frameworks`, `Runtime`, `Tooling`, `Other`
2. Show the skill count per group

### 3. Report Skills

> Goal: Report Skills

Show the full skill list

1. Present a table: skill name, description, group
2. Do `/report` for formatting
3. Do `/search-skills` to show a map by task or ecosystem when the user wants it
4. To inspect skill relations/flow → use this skill's `--relation` mode (see [references/relation-view.md](references/relation-view.md))

## Rules

- Read only directories containing `SKILL.md` in the `skills` directory
- Show every skill, filter none out
- Group by skill type
- Use `/report` for the output
- To search skills from an external registry use `/search-skills`

## Expected Outcome

- The full skill list with descriptions
- Grouped by type
- Data for the `AGENTS.md` `## Skills` section
