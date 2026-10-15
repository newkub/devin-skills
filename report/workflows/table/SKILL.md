---
name: report-table
description: Reply in chat as a table with the `No.` column first, numbered 1, 2, 3, ...
related:
  - report
---

## Goal

Reply in chat as a table with the `No.` column first, numbered 1, 2, 3, ...

## Scope

Use for data that needs multi-column comparison or a complete status view in one table

## Execute

### 1. Prepare Data

> Goal: Gather and prepare the data

1. Collect the data to report
2. Group by category
3. Assign priority
4. Decide the fitting columns

### 2. Build Table

> Goal: Build a readable table

1. The first column must be `No.` numbered 1, 2, 3, ...
2. Use clear headers
3. Order columns by importance
4. Use alignment appropriate to the data types

### 3. Group And Sort

> Goal: Group and order

1. Group data by category
2. Use headers to separate groups
3. Sort within a group by priority
4. When status exists, sort: `✅ completed` → `⏳ in_progress` → `⚠️ pending` → `❌ blocker`

### 4. Add Summary

> Goal: Summarize for fast understanding

1. Start with 2-3 key findings
2. State the overall status with emoji
3. Run `/suggest-next-action` if there are next steps

### 5. Validate

> Goal: Check quality before sending

1. Check `No.` ordering
2. Check grouping and sorting
3. Check emoji follow the legend
4. Run `/deep-review-codebase` if needed

## Rules

- Every table must have the `No.` column first
- If unsure of the format, use `/report` to dispatch per context
- Use backticks for code, paths, skill names
- Use symbols ✅ ❌ ⚠️ for status
- Do not use bold markers
- Reply in chat only

## Expected Outcome

- Table with the `No.` column numbered correctly
- Clear grouping and sorting
- Data easy to read
