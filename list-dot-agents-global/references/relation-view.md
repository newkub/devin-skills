# Skill Relation View

Build a directed graph of skills from `related` frontmatter and inline `/skill-name` references, then report a 3-column table plus flow chains.

## Steps

1. Glob `*/SKILL.md` under the target root (default `~/.agents/skills`)
2. Parse `name`, `description`, and `related` from each frontmatter
3. Scan each body for `/skill-name` references and merge them with `related` into outgoing edges
4. Invert the edges to build incoming edges (skills that call this skill)
5. Run DFS for chains of 2-3 edges, drop duplicates, and cap the output at 50 chains
6. Write the result to `skills-relation.json` in the OS temp directory

## Table

| No. | Skill | Contains | Called By |
|---|---|---|---|
| 1 | `<skill>` | `<outgoing skills>` | `<incoming skills>` |

## Rules

- Use a script for the scan; never parse hundreds of files by hand
- Read-only — never modify a skill file during the scan
- Show the table first, then the flow chains below it
- When the skills root is missing → stop and report
- For an interactive graph → `/open-dot-agents-web`; for cycle detection → `/follow-tool-madge`
