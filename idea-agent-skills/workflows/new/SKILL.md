---
name: idea-agent-skills-new
description: Generate ideas for new skills or improvements — refactor, merge, rename, extract
related:
  - idea-agent-skills
  - review-dot-agents-global-and-fix
  - check-skills-structure
  - check-my-global-cli
  - follow-devin-global-skills
  - rethink
  - follow-single-responsibility
  - report
---

## Goal

Generate complete, non-redundant ideas for new or improved global skills

## Scope

- Analyzes the whole skills repo for duplicates, overlap, gaps, outdated content, and structure problems
- Produces proposals only — implementation is a separate step

## Execute

### 1. Analyze Current State

> Goal: understand the repo before proposing anything

1. Run `/review-dot-agents-global-and-fix` for quality conventions and current findings
2. Run `/check-skills-structure` to find broken references and structure gaps
3. Run `/scan-codebase` to find duplicated logic and overlapping skills
4. Run `/report-file-structure` to see the current layout
5. Run `/check-my-global-cli` to find tool coverage gaps and new skill ideas
6. Run `/follow-devin-global-skills` to confirm the current conventions

### 2. Identify Opportunities

> Goal: find what should change

1. Find skills with similar names or the same work
2. Find skills that reference each other redundantly or circularly
3. Find incomplete frontmatter or descriptions over 100 characters
4. Find skills that still force an old architecture without a condition
5. Find content that should move to `references/` or a template
6. When impact is uncertain → `/follow-math-concepts`

### 3. Generate Proposals

> Goal: one focused idea per row

1. Separate each idea per `/follow-single-responsibility`
2. Use `/report`; columns: No., Idea, Category, Impact, Effort, Scope
3. Categories: Merge/Remove, Rename, Extract references, Add missing skills, Update conventions
4. Attach the real `/<skill-name>`, file paths, and URLs as references

### 4. Prioritize

> Goal: rank by value and risk

1. Run `/rethink` on each idea and answer keep, revise, replace, or defer
2. Score impact against effort
3. Order foundation → high impact → low risk
4. Use `/follow-math-concepts` when there are many trade-offs

### 5. Present

> Goal: the user picks what to implement

1. Follow `/report` so every table starts with `No.`
2. Show a summary first, then the ideas in priority order
3. Cite the references for each idea
4. End with the next action via `/suggest-next-action`
5. Never start implementing before the user selects

## Rules

- One responsibility per idea — split anything joined by "and"
- Evidence only — cite real skills and files, never invent references
- Rename or merge ideas must state their migration steps
- Do not combine an idea with its implementation in one row
- Never use `**` bold; use backticks for names and paths

## Expected Outcome

- A prioritized, numbered idea list with impact, effort, and scope
- Each idea has a single responsibility and real references
- A user selection before any implementation
