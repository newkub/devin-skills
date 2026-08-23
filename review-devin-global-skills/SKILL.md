---
name: review-devin-global-skills
description: Review global Devin skills with CLI and manual issue review
allowed-tools:
  - read
  - write
  - edit
  - find_file_by_name
  - grep
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-create-bun-cli
  - follow-devin-skills-md
  - follow-write-devin-skills
  - review-issue
  - check-circular-dependencies
  - suggest-next-action
---

## Goal

Review and improve the global Devin skills repository so every skill has valid structure, consistent conventions, correct references, and high-quality actionable content

## Scope

All `SKILL.md` files and subdirectories under the skills repository, plus `global_rules.md` if referenced. Covers frontmatter, structure, line count, references, content quality, and repository consistency.

## Execute

### 1. Run Automated Checks And Fix
> Goal: Find structural and reference issues automatically

1. record the target skills directory (default: `%APPDATA%\devin\skills` or the current workspace `.devin/skills`)
2. run `bun run cli/index.ts all` to run every check at once
3. run `bun run cli/index.ts frontmatter` to validate frontmatter
4. run `bun run cli/index.ts content-structure` to validate section structure
5. run `bun run cli/index.ts file-structure` to validate directory and file names
6. run `bun run cli/index.ts long-files` to find files over 250 lines
7. run `bun run cli/index.ts missing-skills` to find broken skill references
8. group findings by severity and apply safe fixes in priority order: Critical → High → Medium → Low
9. re-run all checks until no Critical or High issues remain

### 2. Read All Skills And Review Issues Manually
> Goal: Catch quality issues and strategic gaps that scripts miss

1. run `find_file_by_name **/SKILL.md` to build a complete inventory
2. read a representative sample, or all `SKILL.md` files if the scope is a full review
3. for each skill, assess goal clarity, scope boundaries, actionability, and consistency with `follow-write-devin-skills`
4. collect issues in a draft `review-issue.md` or todo list, grouped by severity
5. run `/review-issue` on each draft issue to verify it is clear, scoped, and ready to fix
6. run `/check-circular-dependencies` to validate `related` links
7. run `/suggest-next-action` after all findings are recorded

## Rules

### 1. Evidence-Based Findings
- every issue must include file path and line number
- do not score a skill without reading or running a check
- mark uncertain findings as `⚠️` and explain the risk

### 2. Automated First
- use `bun run cli/index.ts all` or `bun run cli/index.ts <command>` before manual review
- re-run checks after any batch fixes
- keep check scripts in `cli/` and each script under 250 lines

### 3. Severity Classification
- Critical: missing frontmatter, missing required sections, `name` does not match directory, broken references that affect execution
- High: invalid `related`, broken slash commands, content over 250 lines, missing skill `description`
- Medium: content quality issues, missing `> Goal:` lines, out-of-order sections, vague instructions
- Low: unused `related`, naming inconsistencies, line ending or whitespace issues

### 4. No Modifications Without Scope
- do not edit skill content unless the review scope explicitly includes fixes
- if changes are made, re-run all checks and update references
- never commit fixes without `git diff --check`

## Expected Outcome

- complete inventory of all skills with category counts
- per-skill health score and repository grade (optional)
- table of issues sorted by severity with file paths and line numbers
- list of broken references, missing skills, and circular `related` links
- list of duplicate or overlapping skills
- action items split into quick wins and major improvements
- no Critical or High issues remaining
