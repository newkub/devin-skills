---
name: idea-merge
description: Generate ideas to merge or consolidate redundant things according to context
argument-hint: "[target]"
related:
  - scan-codebase
  - follow-single-of-source
  - review-dot-agents-global-and-fix
  - simplify
  - report
  - suggest-next-action
  - merge
  - rename
---

## Goal

Generate ideas for merging or consolidating redundant things into a single unit, in a context-aware way with continuous numbering

## Scope

Use when you want to analyze what should be merged together:
- files, skills, folders, workflows, configs
- code modules, libraries, services
- or any redundant repository artifacts

Don't execute the merge yourself — hand off to `/merge` only once you have ideas and the user confirms

## Execute

### 1. Analyze Context

> Goal: Gather context before generating merge ideas

1. Identify the target from the argument or current context
2. If the target is a repo/folder → run `/scan-codebase`
3. If the target is skills → run `/review-dot-agents-global-and-fix`
4. Read the files/artifacts of each candidate to compare Goal, Scope, Execute
5. Check line counts, references, and section overlap

### 2. Identify Merge Candidates

> Goal: Identify pairs or groups that should be merged

1. Identify things whose description, purpose, or behavior overlaps
2. Identify things in the same group that are frequently invoked together
3. Identify things that reference each other densely (references, imports, calls)
4. Identify things with a small line count that are a subset of something larger
5. Identify spelling inconsistencies or names that should be renamed along with a merge

### 3. Evaluate Merge Options

> Goal: Assess the appropriate approaches

1. Assess each opportunity against the conditions:
   - `merge` — if redundant or changes together
   - `rename` — if the name is wrong or unclear
   - `keep` — if cohesion is high and there's no clear benefit
2. Run `/simplify guard` to filter out overly complex ideas
3. Consider the target (the receiver) and the source(s) (what will be deleted/absorbed)
4. Check that the merged output won't exceed 250 lines/the specified limit

### 4. Plan Merge Strategy

> Goal: Plan the merge for each pair/group

1. Specify the target and source(s) clearly
2. Specify the sections, files, or config that will move
3. Specify the references, imports, links that must be updated
4. Plan the deletion of the source after the merge is done
5. Specify the merge order if there are multiple pairs

### 5. Generate Ideas

> Goal: Generate actionable merge ideas

1. Generate an idea for each opportunity
2. Use continuous numbering continuing from previous ideas if any
3. Specify scope: `quick win`, `short-term`, `long-term`
4. Specify impact, effort and action: `merge`, `rename`, `keep`
5. Specify the target, source(s), and what will move

### 6. Report

> Goal: Report ideas and the next action

1. Run `/report table`
2. Columns: No., Source(s), Target, Issue, Idea, Action, Scope, Impact, Effort
3. Sort by impact/effort ratio
4. If there is a follow-up action from the previous idea → use `/follow-your-suggestion`
5. Run `/suggest-next-action`
6. If ready to execute → recommend running `/merge` or `/rename`

## Rules

### 1. Context-Aware

- Don't limit to files or skills — support any artifact according to context
- Specify the type of target and source in each idea
- Use `/ask-me` if the target is unclear
- Use `/follow-single-of-source` if necessary

### 2. Evidence-Based

- Every idea must come from real analysis
- Specify file paths, skill names, section overlap, or the relevant references
- Cite line counts, duplicates, or description overlap

### 3. Actionable And Numbered

- Use continuous numbering
- Specify the action clearly: `merge`, `rename`, `keep`
- Specify the target, source(s), and the content that will move

### 4. No Over-Engineering

- Don't propose a merge without a clear benefit
- Don't merge just to reduce the count
- Run `/simplify guard`

### 5. Line Count Safety

- Check that the merged output won't exceed 250 lines
- If it exceeds → recommend trimming or splitting before merging
- Specify the estimated line count after the merge

## Expected Outcome

- A list of merge ideas with continuous numbering
- Every idea has source(s), target, action, scope, impact, effort
- A `/report` table with the next action
- Ideas ready to execute with `/merge`
