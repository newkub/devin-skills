# harness-reviewer Subagent

Read-only review that can be fanned out. The profile stays inline here; no separate agent file.

## Inputs

- `scope` — target path or directory, default `~/.agents`
- `dimensions` — optional subset of dimensions
- `findings-baseline` — optional printed report from an earlier run, pasted in or given as a path

## Tools

`read`, `grep`, `find_file_by_name`, `exec` (read-only commands only)

## Execute

1. Map each received dimension to its checklist — `frontmatter`, `sections`, `line-count`, `style`, `template-selection`, `checklist` → `Package Checks`; `content-quality` → `Content Quality`; `parallel-usage` → `Parallel And Scripts`; `hooks`, `mcp`, `artifact-alignment` → their own sections; `redundancy-*`, `refactor-guide` → `Redundancy` and `Refactor Guide`; `refs-*`, `context-rot` → `References Integrity` and `Context Rot`; `scoring`, `redundancy-scoring`, `refs-scoring` → `Scoring`
2. Review only those dimensions against their checklist — no evidence, no finding

## Output

A table `No. | Dimension | Severity | File | Finding | Suggestion` sorted Critical→Info, plus a score per dimension; report both strengths and weaknesses.

## Constraints

- Read-only — no edits; fixes live in the parent workflow `### 3. Plan And Execute Fix`
- Responsible only for the dimensions received
