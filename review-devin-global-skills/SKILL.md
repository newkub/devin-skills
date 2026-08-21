---
name: review-devin-global-skills
description: Review global Devin skills for structure, valid references, and quality with scores and actions
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-skills
  - check-reference
  - follow-content-quality
  - report-table
  - report-ansi
  - report
  - suggest-next-action
  - follow-devin-skills-md
  - follow-write-devin-skills
  - follow-create-bun-cli
  - follow-create-cli
  - validate
  - use-scripts
  - deep-analyze-by-use-scripts
  - ask-me
---

## Goal

Review and improve the global Devin skills repository so every skill has valid structure, consistent conventions, correct references, and high-quality actionable content

## Scope

All `SKILL.md` files and subdirectories under the skills repository, plus `global_rules.md` if referenced. Covers frontmatter, structure, line count, references, content quality, and repository consistency

## Execute

### 1. Prepare Review

> Goal: Set the baseline and scope

> Goal: know which rules to enforce and which files to review

1. read the latest `global_rules.md` and `follow-write-devin-skills`
2. run `git status --short` and `git diff --check` to catch pending issues
3. confirm whether to review all skills or a specific subset
4. record the target directory path

### 2. Inventory And Classify

> Goal: Build the list of skills to review

> Goal: have a complete, categorized inventory

1. use `glob **/SKILL.md` to list all skills
2. classify by prefix: `follow-`, `report-`, `check-`, `review-`, `improve-`, `run-`, `use-`, `deep-`, etc.
3. count totals and flag categories with zero or excessive skills
4. note any directories without a `SKILL.md`

### 3. Validate Frontmatter

> Goal: Check metadata for every skill

> Goal: frontmatter is complete, correct, and consistent

1. `name` matches the parent directory name
2. `description` is `<=100` characters
3. `allowed-tools` lists only tools actually used in the skill
4. `triggers` contains `user`, `model`, or both
5. `related` contains only existing skills and only direct dependencies
6. `related` does not include the skill itself
7. no unknown frontmatter keys

### 4. Validate Structure

> Goal: Check sections and file limits

> Goal: every skill follows the required structure

1. sections in order: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
2. optional `## Guide` only after `## Expected Outcome` or as a reference section
3. `SKILL.md` and all `.md` files are `<=250` lines
4. file and directory names are `kebab-case`
5. no duplicate `name` values across skills
6. headings are Title Case for English, Thai for lists

### 5. Run Automated Reference Checks

> Goal: Find broken and invalid references

> Goal: no broken internal or external references

1. use `use-scripts` or Python to extract slash commands
2. only treat as skill references:
   - backticked ` /skill-name `
   - slash after command verbs such as `ทำ /`, `ใช้ /`, `เรียก /`, `ตาม /`
3. ignore placeholders: `workflow-name`, `skill-name`, `xxx`, `old-name`, `new-name`, wildcard `*`
4. ignore common tool and path tokens: `edit`, `dist`, `target`, `assets`, `fetch`, `node`, `bun`, `localhost`
5. verify the target skill directory exists
6. use `check-reference` to find broken Markdown links
7. check `related` for circular dependencies and self-references
8. check for empty or malformed backticks

### 6. Review Content Quality

> Goal: Evaluate usefulness and clarity

> Goal: content is precise, actionable, and free from filler

1. use `follow-content-quality` on a representative sample
2. scan for actual placeholders, not skill names containing `todo` or `mock`
3. flag emojis unless the user explicitly requested them
4. identify duplicate content across skills
5. flag vague instructions such as "do the right thing" or "best practice" without specifics
6. check that commands, tools, paths, and skill references use backticks
7. verify examples are short, realistic, and runnable

### 7. Analyze Distribution And Redundancy

> Goal: Find gaps and overlaps

> Goal: the repository is balanced and skills are not duplicated

1. list skills with similar names or descriptions
2. find category gaps with no skills or too many similar skills
3. find skills with no `related` entries
4. find `related` links that are not mutual when they should be
5. identify orphan skills that no other skill references
6. compare `Scope` and `Goal` of similar skills to detect overlap

### 8. Calculate Health Score

> Goal: Score each skill and the repository

> Goal: produce a ranked, evidence-based quality report

1. define metrics and weights:
   - frontmatter (15%)
   - structure (15%)
   - references (20%)
   - content quality (20%)
   - consistency (15%)
   - file naming and limits (15%)
2. score each metric: `✅` = 1, `⚠️` = 0.5, `❌` = 0
3. calculate skill score (0-100%)
4. calculate repository average and category averages
5. assign grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 9. Create Missing CLI

> Goal: Create CLI for skills that require one

> Goal: skills that need a CLI also have a working CLI package

1. list skills with `## Execute` sections mentioning CLI but missing `src/presentation/cli.ts`
2. use `use-scripts` to detect missing CLI entry points
3. for each missing CLI, run `/follow-create-bun-cli` or `/follow-create-cli`
4. keep generated CLI files under 250 lines and within `src/presentation/cli.ts`
5. re-run validation after CLI creation

### 10. Generate Report And Actions

> Goal: Summarize findings and next steps

> Goal: the report drives the next action

1. use `report-table` for issues, scores, and action items
2. use `report-ansi` for summary, grade, and progress
3. list top findings at the top with file paths and line numbers
4. group issues by severity: Critical, High, Medium, Low
5. separate quick wins from major improvements
6. run `suggest-next-action` at the end

## Rules

### 1. Evidence-Based Findings

- every issue must include file path and line number
- do not score a skill without reading or running a check
- mark uncertain findings as `⚠️` and explain the risk

### 2. Automated First

- use `use-scripts`, `grep`, `glob`, and `exec` before manual review
- re-run checks after any batch fixes
- keep scripts in a temporary file and delete them before commit

### 3. Severity Classification

- Critical: missing frontmatter, missing required sections, `name` does not match directory, broken references that affect execution
- High: invalid `related`, broken slash commands, content over 250 lines, missing skill `description`
- Medium: content quality issues, duplicate sections, vague instructions, minor structural issues
- Low: naming inconsistencies, line ending or whitespace issues

### 4. Scoring Consistency

- use the same rubric for every skill
- round percentages to one decimal place
- do not inflate scores for skills with incomplete sections
- document any false positives

### 5. No Modifications Without Scope

- do not edit skill content unless the review scope explicitly includes fixes
- CLI creation is in scope when the skill has CLI references but no `src/presentation/cli.ts`
- if changes are made, re-run all checks and update references
- never commit fixes without `git diff --check`

## Expected Outcome

- complete inventory of all skills with category counts
- per-skill health score and repository grade
- table of issues sorted by severity with file paths and line numbers
- list of broken references, missing skills, and circular `related` links
- list of duplicate or overlapping skills
- missing CLI packages created for skills that need them
- action items split into quick wins and major improvements
- no broken references in the reviewed set
