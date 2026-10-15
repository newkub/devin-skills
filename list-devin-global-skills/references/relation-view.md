# list-devin-global-skills-relation (merged content)

- read
  - write
  - edit
  - grep
  - exec
  - skill
  - find_file_by_name
  - report
  - report-table
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-devin
  - review-devin-global-harness
  - use-scripts
  - report-table
  - open-devin-in-web
---

## Goal

Show a 3-column relation table of the devin global skills with `a -> b -> c` flows, using scripts that scan `related` and `/skill-name` references

## Scope

- Scan every `SKILL.md` in the target skills directory
- Extract `name`, `related`, and `/skill-name` references from the body
- Build reverse relations: skills that call this skill
- Find flow chains up to 3 levels deep
- Do not modify skill files

- See also: /list-devin-global-skills, /review-devin-global-harness, /use-scripts

## Execute

### 1. Scan Skills

> Goal: collect all metadata

1. `glob` for `*/SKILL.md` in the target directory (default: `%APPDATA%/devin/skills`)
2. `read` each file and parse the frontmatter `name`, `description`, `related`
3. Scan the body for `/skill-name` references
4. Merge `related` + `/skill-name` references into `outgoing` edges

### 2. Build Relation Map

> Goal: build the relation graph

1. Create nodes from `name`
2. Create directed edges from `outgoing`
3. Create `incoming` (skills that call this skill)
4. Store the data as `skills-relation.json`

### 3. Detect Flow Chains

> Goal: find skill flows a -> b -> c

1. DFS for paths of 2-3 edges from every node
2. Drop duplicate paths
3. Save into `skills-relation.json`

### 4. Report Table

> Goal: present the output as a table

1. Build a 3-column table:
   - `Skill`
   - `Contains` (skills inside this skill)
   - `Called By` (skills that call this skill)
2. Show the flow chains below the table
3. Do `/report table`

### 5. Optional Visualize

> Goal: view the graph when wanted

1. For an interactive graph → do `/open-devin-in-web`
2. To check circular dependencies → do `/follow-tool-madge`

## Rules

- Use `tools/scan-relations.ps1` or an equivalent script only; never parse by hand
- Do not modify skill files during the scan
- Support a target directory via argument
- The report must have the 3 main columns: Skill, Contains, Called By
- Show at most 50 flow chains to avoid clutter
- If the skills directory is missing → stop and report

## Expected Outcome

- A `skills-relation.json` file in the OS temp directory
- A Skill / Contains / Called By table
- The list of flow chains `a -> b -> c`
- A report of skill, edge, and isolated-skill counts
