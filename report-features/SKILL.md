---
name: report-features
description: Report all features in the project as a table from generated TypeScript files
argument-hint: "[scope]"
related:
  - update-docs
  - deep-review
  - all-workspace

  - report
  - suggest-next-action
---

## Goal

Report all features in the project as a chat table, reading from `.devin/features/` TypeScript files

## Scope

Read and display features from generated TypeScript files in `.devin/features/<workspace>/` as a chat table only

Does not include: scanning and creating feature files (use `/update-features-md`), analyzing and reviewing features (use `/deep-review`), checking coverage (use `/deep-review`)

## Execute

### 1. Ensure Features Generated

> Goal: Ensure Features Generated

Verify feature files exist and are current

1. Check whether `.devin/features/<workspace>/index.ts` exists
2. Missing or outdated → use `/update-features-md` to scan and create feature files
3. Present → skip to Step 2

### 2. Read Feature Files

> Goal: Read Feature Files

Read feature files from every workspace

1. Use `/all-workspace` to identify all workspaces
2. Read `.devin/features/<workspace>/index.ts` for the manifest and `allFeatures`
3. Read `.devin/features/<workspace>/types.ts` for the Feature interface
4. Collect features from all workspaces into a single list

### 3. Format Report Table

> Goal: Format Report Table

Format features as a chat table

1. Use `/report` to format the table
2. Columns: No. | Workspace | Feature | Description | Why | Solutions | Module | Route | API | DB | Topics | Status
3. Group by workspace then by module
4. Sort features by module and status (`active` first, `partial` next, `deprecated` last)

### 4. Report Summary

> Goal: Report Summary

Summarize the status of all features

1. Use `/report` to output in chat
2. Summarize feature count per workspace and per status
3. Identify `partial` or `deprecated` features in a separate group
4. Recommend `/deep-review` for `partial` features

## Rules

### Report UX/UI

> Goal: readable report — key findings on top, leading to action (features)

1. Summarize key findings above the details (features)
2. Use `/report` for multi-column comparison tables (features)
3. Use `/report` for status/progress/logs reports
4. Use "No." as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (features)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always use `/suggest-next-action` at the end of the report

### 1. Read-Only Action

- Read feature files only — never edit code or feature files
- Feature files missing → use `/update-features-md` rather than creating them manually
- Feature files outdated → use `/update-features-md` to refresh

### 2. Table Format

- Use columns per the `types.ts` Feature interface of each workspace
- Required fields: `id`, `name`, `description`, `why`, `solutions`, `module`, `status`
- Optional fields: `route`, `api`, `db`, `topics` — show when present
- Use symbols (✅, ⚠️, ❌) for `status`: `active`, `partial`, `deprecated`
- Group by workspace first, then by module

### 3. Data Source

- Read from `.devin/features/<workspace>/index.ts` only
- Never scan the codebase directly — use `/update-features-md` for scanning
- Workspace has no feature files → skip it and note in the summary

### 4. Completeness

- Report features from every workspace that has feature files
- Note workspaces without feature files in the summary
- No feature files at all → run `/update-features-md` first
- Use /update-docs if needed


- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A features table in chat, grouped by workspace and module
- Summary of feature status per workspace
- Recommended follow-up workflows (`/deep-review`)
- Report is readable with key findings on top
- Next action is clear
