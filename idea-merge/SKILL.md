---
name: idea-merge
description: Generate ideas to merge or consolidate redundant things according to context
argument-hint: "[skills|features|workspaces|files|folders|modules|workflows|configs|all|<path>]"
related:
  - scan-codebase
  - follow-single-of-source
  - review-dot-agents-global-and-fix
  - check-skills-structure
  - check-monorepo
  - analyze-file-structure
  - simplify
  - report
  - suggest-next-action
  - merge-files
  - rename
---

## Goal

Generate ideas for merging or consolidating redundant things into a single unit, in a context-aware way with continuous numbering

## Scope

Use when you want to analyze what should be merged together:
- files, skills, folders, workflows, configs
- code modules, libraries, services
- features and workspaces
- or any redundant repository artifacts

Accept one or more arguments — `/idea-merge skills`, `/idea-merge files folders`, `/idea-merge all`, or a path. Without an argument, infer the scope from the current workspace.

Don't execute the merge yourself — hand off to `/merge-files` only once you have ideas and the user confirms

## Execute

### 1. Resolve Argument

> Goal: Turn the argument into a concrete scope and route

1. Parse the argument list; support multiple values such as `skills files`
2. Map each value to its scope and first route:

   | Argument | Scope | First route |
   | --- | --- | --- |
   | `skills` | `D:\dot-agents\skills\*` | `/review-dot-agents-global-and-fix`, `/check-skills-structure` |
   | `features` | feature surface of the project | `/deep-analyze`, `/idea-features` |
   | `workspaces` | monorepo packages and workspace roots | `/check-monorepo`, `/all workspace` |
   | `files` | duplicate or near-duplicate files | `/scan-codebase`, `/check-file-relation` |
   | `folders` | nested, duplicated, or single-file directories | `/analyze-file-structure` |
   | `modules` | code modules, libraries, services | `/scan-codebase`, `/check-code-structure` |
   | `workflows` | `workflows/` directories in skills and projects | `/scan-codebase` |
   | `configs` | config files (tsconfig, biome, mcp, hooks) | `/report-config-files` |
   | `all` | every type above | run the routes in table order |
   | `<path>` or free text | the named path or described area | infer from the path; `/ask-me` if ambiguous |

3. If no argument → infer from the current workspace: directories and skills first, then files and configs
4. If the value is unknown → run `/ask-me` instead of guessing
5. Report the resolved scope in one line before analyzing

### 2. Analyze Context

> Goal: Gather context before generating merge ideas

1. If the scope is a repo or folder → run `/scan-codebase`
2. If the scope is skills → run `/review-dot-agents-global-and-fix`
3. If the scope is workspaces → run `/check-monorepo`
4. If the scope is features → map the feature surface with `/deep-analyze`
5. Read the files/artifacts of each candidate to compare Goal, Scope, Execute
6. Check line counts, references, and section overlap

### 3. Identify Merge Candidates

> Goal: Identify pairs or groups that should be merged

1. Identify things whose description, purpose, or behavior overlaps
2. Identify things in the same group that are frequently invoked together
3. Identify things that reference each other densely (references, imports, calls)
4. Identify things with a small line count that are a subset of something larger
5. Identify spelling inconsistencies or names that should be renamed along with a merge

### 4. Evaluate Merge Options

> Goal: Assess the appropriate approaches

1. Assess each opportunity against the conditions:
   - `merge` — if redundant or changes together
   - `rename` — if the name is wrong or unclear
   - `keep` — if cohesion is high and there's no clear benefit
2. Run `/simplify guard` to filter out overly complex ideas
3. Consider the target (the receiver) and the source(s) (what will be deleted/absorbed)
4. Check that the merged output won't exceed 250 lines/the specified limit

### 5. Plan Merge Strategy

> Goal: Plan the merge for each pair/group

1. Specify the target and source(s) clearly
2. Specify the sections, files, or config that will move
3. Specify the references, imports, links that must be updated
4. Plan the deletion of the source after the merge is done
5. Specify the merge order if there are multiple pairs

### 6. Generate Ideas

> Goal: Generate actionable merge ideas

1. Generate an idea for each opportunity
2. Use continuous numbering continuing from previous ideas if any
3. Specify scope: `quick win`, `short-term`, `long-term`
4. Specify impact, effort and action: `merge`, `rename`, `keep`
5. Specify the target, source(s), and what will move

### 7. Report

> Goal: Report ideas and the next action

1. Run `/report table`
2. Columns: No., Source(s), Target, Issue, Idea, Action, Scope, Impact, Effort
3. Sort by impact/effort ratio
4. If there is a follow-up action from the previous idea → use `/follow-your-suggestion`
5. Run `/suggest-next-action`
6. If ready to execute → recommend running `/merge-files` or `/rename`

## Rules

### 1. Argument-Aware

- Accept `skills`, `features`, `workspaces`, `files`, `folders`, `modules`, `workflows`, `configs`, `all`, a path, or free text
- Accept several arguments at once and analyze each scope separately
- Resolve the scope before analyzing; never silently pick a different one

### 2. Context-Aware

- Don't limit to files or skills — support any artifact according to context
- Specify the type of target and source in each idea
- Use `/ask-me` if the target is unclear
- Use `/follow-single-of-source` if necessary

### 3. Evidence-Based

- Every idea must come from real analysis
- Specify file paths, skill names, section overlap, or the relevant references
- Cite line counts, duplicates, or description overlap

### 4. Actionable And Numbered

- Use continuous numbering
- Specify the action clearly: `merge`, `rename`, `keep`
- Specify the target, source(s), and the content that will move

### 5. No Over-Engineering

- Don't propose a merge without a clear benefit
- Don't merge just to reduce the count
- Run `/simplify guard`

### 6. Line Count Safety

- Check that the merged output won't exceed 250 lines
- If it exceeds → recommend trimming or splitting before merging
- Specify the estimated line count after the merge

## Expected Outcome

- A resolved scope reported before analysis
- A list of merge ideas with continuous numbering
- Every idea has source(s), target, action, scope, impact, effort
- A `/report` table with the next action
- Ideas ready to execute with `/merge-files`
