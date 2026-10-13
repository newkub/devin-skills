# Plan File Template

## Goal

Create a plan file in `.devin/temp/plan/<workspace>/` that is easy to read, easy to scan, and whose results can be tracked with `/implement-to-production`

## Section Layout

1. `## Goal` — a short 1-3 line paragraph
2. `## Architecture` — ANSI diagram or reference if available
3. `## Idea Features` — scoring formula + features table
4. `## File Changes` — `No. | File | Action | What | How | Acceptance | Risk` table
5. `## TODO` — task table with `Status` (starts as `pending`)
6. `## Task Graph` — dependencies between tasks + critical path
7. `## Risks` — risk, impact, mitigation table
8. `## Test Strategy` — coverage, fixtures, regression
9. `## Assumptions And Unknowns` — assumptions made + open questions
10. `## Acceptance Criteria` — checkboxes
11. `## Execution Order` — task order that `/implement-to-production` uses to arrange the critical path

## Features Table

| Icon | No. | Feature | Description | Files Change | Impact | Risk | Effect | Score | Phase |
|------|-----|---------|-------------|--------------|--------|------|--------|-------|-------|
| [icon] | 1 | ... | ... | ... | High | Low | High | 6.7 | MVP |

- `Icon` is always the first column
- Use an Iconify CDN icon URL with a color query when you want emphasis
- `Score` is computed from the formula
- Add a `Dependencies` column if there are dependencies between features

## File Changes Table

| No. | File | Action | What | How | Acceptance | Risk |
|-----|------|--------|------|-----|------------|------|
| 1 | `path/to/file.ts` | create / update / delete | API signature/types | pattern used | observable result | Low |

- `Action` uses `create`, `update`, `delete`, `rename` to match the actual work
- `What` lists the API signatures/types to add or change
- `How` references the pattern/abstraction reused from the codebase
- Every row must have evidence from deep-analyze — never guess paths

## TODO Table

| No. | Task | Status | Depends On | Expected Outcome |
|-----|------|--------|------------|------------------|
| 1 | ... | pending | - | ... |

- `Status` uses `pending`, `in-progress`, `completed` to match what `/implement-to-production` reads
- `Expected Outcome` is measurable

## Task Graph

- Specify dependencies between tasks by `No.` (e.g. `1 → 2, 3 → 4`)
- Identify the longest critical path
- Identify tasks that can run in parallel
- A depended-on task must always come first

## Risks Table

| Risk | Impact | Likelihood | Mitigation | Rollback |
|------|--------|------------|------------|----------|
| ... | High | Medium | ... | ... |

- `Mitigation` must be a concrete action, not a broad description
- `Rollback` states how to revert if the risk actually occurs

## Test Strategy

- Coverage target required after implementation
- Fixtures / test data to prepare
- Regression tests to add or update
- List the actual test file paths from the codebase

## Assumptions And Unknowns

- `Assumptions` — what is assumed, with reasons
- `Unknowns` — open questions that require `/ask-me` before implementing
- Never leave unknowns empty when there is risk — ask before writing the plan

## Acceptance Criteria

- Use a checkbox list `- [ ]`
- Focus on observable results
- One checkbox per criterion

## Execution Order

- Write a numbered list of task `No.` ordered along the critical path
- Note tasks that can run in parallel if any

## UX/UI Tips

- Use clear heading levels
- Use tables to compare
- Center diagrams with `<div align="center">`
- Do not use bold markers `**` in the body
- Use bullets or checklists for actions
