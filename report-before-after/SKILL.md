---
name: report-before-after
description: Report the work plan before acting and show a before-after comparison
argument-hint: "[scope]"
related:
  - deep-analyze
  - plan
  - report
  - suggest-next-action
  - update-devin-global-skills
---

## Goal

Explain the work plan before acting and show a before-after comparison without making actual changes

## Scope

Use for explaining the work plan before acting and showing before-after comparisons

## Execute

### 1. Analyze Request

> Goal: Analyze Request

Analyze what the user wants

1. Use `/deep-analyze` to analyze what the user wants
2. Identify what will change and the impact
3. Use `/plan` to create the work plan

### 2. Explain Plan

> Goal: Explain Plan

State what to do and how

1. Explain the work plan clearly
2. Identify affected files and the impact
3. Use the `/report-before-after` format for presentation

### 3. Show Before After

> Goal: Show Before After

Show the before-after comparison

1. Show the current state (`before`) and the state after the change (`after`)
2. Use a `table` or `code block` comparison when appropriate
3. Explain the reason and expected benefits

### 4. Confirm With User

> Goal: Confirm With User

Ask the user to confirm before acting

1. Ask the user to confirm before actually proceeding
2. Wait for user approval
3. Proceed once approved

## Rules

### Report UX/UI

> Goal: readable report — key findings on top, leading to action (before after)

1. Summarize key findings above the details (before after)
2. Use `/report` for multi-column comparison tables (before after)
3. Use `/report` for status/progress/logs reports
4. Use "No." as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (before after)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always use `/suggest-next-action` at the end of the report

### 1. Explain First

Must explain before acting

- Say what will be done
- Say how it will be done
- Say what is impacted
- Wait for user confirmation

### 2. Before After Format

The before-after display format

```markdown
### Before
[Current state]

### After
[State after the change]
```

Use `Before` and `After` as headers in markdown

### 3. No Actual Changes

Do not make actual edits yet

- Show the plan only
- Do not edit real files
- Wait for user confirmation first

### 4. Clear Comparison

Must show the difference clearly

- Use a `table` comparison when appropriate
- Use a `code block` to show before/after code
- Use bullet points to show changes

### 5. Use Workflows

Use the relevant workflows

- Use `/plan` to plan
- Use `/deep-analyze` to analyze
- Use `/update-devin-global-skills` to create a workflow

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- The user understands the work plan
- Before-after shown clearly
- No actual changes until approved
- User confirms before proceeding
- Report is readable with key findings on top
- Next action is clear
