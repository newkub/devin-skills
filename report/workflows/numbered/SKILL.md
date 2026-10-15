---
name: report-numbered
description: Reply in chat as a numbered list to emphasize priority or steps
related:
  - report
---

## Goal

Reply in chat as a numbered list to emphasize priority or steps

## Scope

Use for data that needs ordering, steps, or priority emphasized rather than comparison

## Execute

### 1. Prepare Items

> Goal: Gather the items to report

1. Collect the data
2. Split each item to a single responsibility
3. Assign priority

### 2. Number And Group

> Goal: Order and group

1. Use 1, 2, 3, ... by priority
2. With multiple categories, separate groups with `##` headers
3. Within a group, sort by priority

### 3. Format

> Goal: Make it readable

1. Start with a 2-3 point summary before the numbered list
2. Use emoji per status: `✅` `⏳` `❌` `⚠️`
3. Use sub-bullets under each number if needed
4. Use backticks for code, paths, skill names
5. Use `/report table` if the data suits a table better
6. Use `/report codeblock` if there are commands or code snippets

### 4. Validate

> Goal: Check quality

1. Check numbering order
2. Check each item holds a single responsibility
3. Run `/suggest-next-action` if there are next steps

## Rules

- One number = one idea/step
- Sort by priority or status with `completed` first
- Use backticks for paths, commands, skill names
- Use emoji per the `/report` legend
- Do not use bold markers
- Reply in chat only

## Expected Outcome

- Numbered list in correct order
- Each item concise and clear
- Next action stated if any
