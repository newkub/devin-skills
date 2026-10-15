---
name: report-git-diff
description: Report a git diff with a summary of changes, statistics, and insights in an easy-to-read form
argument-hint: "[ref]"
related:
  - git-commit

  - report
  - suggest-next-action
  - follow-tool-git
---

## Goal

Report a git diff in an easy-to-read form, with a summary of changes, statistics, and insights, without editing files

## Scope

Use for reporting git diffs — staged, unstaged, between commits, and between branches — excluding committing or staging changes (use `/git-commit` instead)

## Execute

### 1. Determine Diff Scope

> Goal: Determine the scope of the diff to report

1. Ask the user or infer from context which diff is needed:
   - Unstaged: `git diff`
   - Staged: `git diff --cached`
   - All changes: `git diff HEAD`
   - Between commits: `git diff <commit-a> <commit-b>`
   - Between branches: `git diff <branch-a>..<branch-b>`
   - Specific file: `git diff <file>`
2. If unspecified → use `git diff HEAD` as the default
3. Run the chosen command to capture the raw diff

### 2. Collect Diff Statistics

> Goal: Collect change statistics

1. Run `git diff --stat` for per-file statistics (additions, deletions)
2. Run `git diff --shortstat` for the overall statistics
3. Run `git diff --name-status` for the change types (Added, Modified, Deleted, Renamed)
4. Run `git status --porcelain` for the full file status

### 3. Categorize Changes

> Goal: Group changed files by type

1. Group by change type:
   - Added (A): new files
   - Modified (M): edited files
   - Deleted (D): removed files
   - Renamed (R): renamed files
2. Group by category:
   - docs: `*.md`, `docs/`
   - config: `*.json`, `*.jsonc`, `*.yml`, `*.yaml`, `*.toml`, `.env*`
   - code: `src/`, `lib/`, `packages/`, `*.ts`, `*.tsx`, `*.js`, `*.jsx`
   - test: `*.test.*`, `*.spec.*`, `tests/`
   - chore: `scripts/`, `tools/`, build files
3. Count files and changed lines per group

### 4. Format Diff Report

> Goal: Format the report to be easy to read

1. Run `/report` to format the statistics as a table
2. Run `/report` to format the diff blocks
3. Present in order: Summary → Statistics Table → Changes by Category → Key Diffs
4. Use the `diff` language tag for diff code blocks

### 5. Highlight Key Changes

> Goal: Point out the important changes

1. Identify the most-changed files (top 5 by lines changed)
2. Identify breaking changes or things impacting API, schema, or config
3. Identify newly added files
4. Identify deleted files
5. If a file changed more than 100 lines → show only a summary, not the full diff

### 6. Provide Insights

> Goal: Provide insights on the changes

1. Summarize what kind of change this is (feature, fix, refactor, config, docs)
2. Identify the impact on different parts of the system
3. Identify risks the changes may introduce
4. Recommend next actions, e.g. check tests, review breaking changes

## Rules

### Report UX/UI

> Goal: report easy to read, key findings summarized at the top, leading to action (git diff)

1. Summarize key findings at the top before details (git diff)
2. Use `/report` for comparison tables with multiple columns (git diff)
3. Use `/report` for status/progress/logs reports
4. Use the "No." column as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (git diff)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always run `/suggest-next-action` at the end of the report

### Diff Scope

- Use `git diff` for unstaged changes
- Use `git diff --cached` for staged changes
- Use `git diff HEAD` for all changes, staged and unstaged combined
- State clearly in the report which diff scope was used

### Report Format

- Show the Summary first, then the Statistics Table, then the Details
- Use the `diff` language tag for diff code blocks
- Group changes by category (docs, config, code, test, chore)
- Use symbols: ✅ Added, ✏️ Modified, ❌ Deleted, 📝 Renamed

### High Impact Content

- Show only the changed files, not unrelated ones
- If the diff exceeds 500 lines → show only the summary and top 5 files
- Do not show the full diff of files changed beyond 100 lines → show only the summary
- Highlight breaking changes and things impacting API, schema, config

### Safety

- Do not edit, stage, or commit anything — use `/git-commit` for committing
- Do not run commands with side effects
- Report only — read-only operation

### Non-Redundancy

- Committing and staging live in `/git-commit`
- Viewing file history lives in `/follow-tool-git`
- Code block formatting lives in `/report`
- Table formatting lives in `/report`

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Change summary as an easy-to-read table
- Overall statistics: file count, additions, deletions
- Changes grouped by category and change type
- Key changes and their impacts highlighted
- No real files modified — read-only report
- Report easy to read with key findings at the top
- Clear next action
