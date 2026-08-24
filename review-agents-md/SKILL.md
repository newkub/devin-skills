---
name: review-agents-md
description: Review AGENTS.md for structure, valid references, and workspace coverage
---

## Goal

Review `AGENTS.md` files to ensure they follow the correct format, reference valid skills, and cover all workspaces in monorepo

## Scope

Review root and workspace `AGENTS.md` files in `.devin/` or project root. Does not modify source code logic

## Execute

### 1. Locate AGENTS.md

> Goal: Find all `AGENTS.md` files in the project
> Goal: know which files to review

1. use `glob` to find `**/AGENTS.md`
2. identify root `AGENTS.md` and workspace-level files
3. if no `AGENTS.md` exists, stop and report

### 2. Validate Frontmatter

> Goal: Check frontmatter for each `AGENTS.md`
> Goal: frontmatter is complete and consistent

1. check `name` matches workspace or project
2. check `description` is present and concise
3. check `related` contains only existing skills
4. check `auto_execution_mode` if present

### 3. Validate Sections

> Goal: Ensure required sections exist in correct order
> Goal: `AGENTS.md` follows the standard structure

1. verify `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
2. verify `## Rules` has `### Architecture` with `tech: /follow-<tech>`
3. verify `### Skills` maps `skill-name: /skill-name`
4. verify no `## Workflows` or `### Workflows` section

### 4. Check References

> Goal: Validate all skill references in `AGENTS.md`
> Goal: no broken skill slash commands

1. extract all `skill-name` references
2. verify each target skill directory exists
3. check `tech: /follow-<tech>` and `skill-name: /skill-name` mappings
4. report missing or invalid references

### 5. Check Workspace Coverage

> Goal: For monorepo, verify each workspace has an `AGENTS.md`
> Goal: every workspace is covered

1. use `/check-monorepo` to confirm workspace list
2. compare workspace directories against `AGENTS.md` locations
3. for each workspace `AGENTS.md`, verify it references used workspaces
4. ensure workspace-level `AGENTS.md` does not duplicate root content

### 6. Report Findings

> Goal: Summarize review results
> Goal: actionable report with severity

1. use `/report-table` for issues
2. group issues by severity: critical, high, medium, low
3. include file path and line number for each finding
4. suggest next action

## Rules

### 1. Format Compliance

- `AGENTS.md` must follow `/follow-devin-skills-md` format
- frontmatter `name`, `description`, `related` required
- sections in order: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- no `## Workflows` section

### 2. Reference Validity

- all `skill-name` must be existing skills
- `tech: /follow-<tech>` should map to a real `follow-*` skill if possible
- `skill-name: /skill-name` should map to a real skill

### 3. Workspace Rules

- root `AGENTS.md` must have `### Workspaces` listing each workspace
- each workspace `AGENTS.md` must reference the workspaces it uses
- workspace `AGENTS.md` must not duplicate root conventions

### 4. High Impact

- report only issues that affect execution or correctness
- avoid style-only nitpicks unless they break parsing
- include evidence with file path and line number

## Expected Outcome

- `AGENTS.md` files follow the standard format
- all skill references are valid
- every workspace has a workspace-level `AGENTS.md` in monorepo
- report with findings and next actions
