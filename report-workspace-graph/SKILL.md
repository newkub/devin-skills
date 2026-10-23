---
name: report-workspace-graph
description: Report the relations between workspaces in a monorepo with a dependency graph
argument-hint: "[scope]"
related:
  - check-monorepo
  - list-workspaces
  - refactor
  - all-workspace

  - report
  - suggest-next-action
  - follow-tasks
  - follow-monorepo
  - run-build
  - run-test
---

## Goal

Report the relations between workspaces in a monorepo, to reveal their mutual dependencies, imports, and shared dependencies

## Scope

For monorepos with many workspace packages — not duplicating `/list-workspaces` which lists workspaces; this focuses on relations between workspaces

## Execute

### 1. Detect Workspace Structure

> Goal: Detect the workspace structure in the project

1. Run `/check-monorepo` to verify whether it is a monorepo
2. Read the root `package.json` for `workspaces`, or `pnpm-workspace.yaml`, or `turbo.json`
3. Identify each workspace's `name` and `path`
4. If not a monorepo, report the status and stop

### 2. Collect Workspace Metadata

> Goal: Collect each workspace's basic data

1. Read each workspace's `package.json`
2. Record `name`, `version`, `dependencies`, `devDependencies`, `peerDependencies`
3. Record `exports`, `main`, `types` if present
4. Identify the workspace type: `app`, `package`, `tool`, `config`

### 3. Analyze Internal Dependencies

> Goal: Analyze dependencies inside the monorepo

1. Find `workspace:*` or other workspace names in `dependencies` and `devDependencies`
2. Build a directed graph of internal dependencies
3. Identify parent-child relations
4. Identify workspaces that are leaves or roots

### 4. Analyze External References

> Goal: Analyze imports or references between workspaces through source code

1. Use `grep` to find `from '<workspace-name>'` or `from '<workspace-path>'`
2. Count imports between workspaces
3. Identify the files and paths holding the references
4. Distinguish direct imports from re-exports

### 5. Identify Shared Dependencies

> Goal: Find dependencies shared across multiple workspaces

1. Compare dependencies between workspaces
2. Identify dependencies with differing versions
3. Identify dependencies fully shared across workspaces
4. Recommend hoisting when necessary

### 6. Detect Circular Dependencies

> Goal: Detect circular dependencies between workspaces

1. Run `/follow-tool-madge` across workspaces
2. Identify every cycle if any
3. State the severity of each cycle
4. Recommend fixes

### 7. Categorize Relations

> Goal: Classify the relations between workspaces

1. Group by relation type: `depends-on`, `imports-from`, `shared-dep`, `peer`, `circular`
2. Group by direction: `inbound`, `outbound`, `bidirectional`
3. State coupling strength by reference count
4. Identify loosely coupled and tightly coupled workspaces

### 8. Format Report

> Goal: Format the report

1. Run `/report` to format the table
2. Define columns: `No.`, `Source`, `Target`, `Relation`, `Strength`, `Files`, `Notes`
3. Show the dependency graph with text or mermaid
4. Split into sections: Internal Relations, Shared Dependencies, Circular, Recommendations

## Rules

### Report UX/UI

> Goal: report easy to read, key findings summarized at the top, leading to action (workspace graph)

1. Summarize key findings at the top before details (workspace graph)
2. Use `/report` for comparison tables with multiple columns (workspace graph)
3. Use `/report` for status/progress/logs reports
4. Use the "No." column as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (workspace graph)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always run `/suggest-next-action` at the end of the report

### 1. Workspace Detection

- Always verify monorepo status first
- Support `npm/yarn/pnpm workspaces` and `turbo`
- Do not run if it is not a monorepo

### 2. Relation Analysis

- Combine `workspace:*` data with source imports
- Count coupling strength by reference number
- Separate `devDependencies` from `dependencies`

### 3. Circular Dependencies

- Use `/follow-tool-madge`
- State the severity of each circular dependency
- Recommend the next step clearly

### 4. Output Format

- Use `/report` for tables
- Use mermaid or a text graph for relations
- Use symbols: `➡️` depends, `↔️` circular, `🔗` shared

### 5. Non-Redundancy

- Do not duplicate `/list-workspaces`
- Do not duplicate `/follow-tool-madge`
- Take those skills' results, then add relation analysis

### 6. Chat-Only Output

- The whole report must stay in chat only
- Never open a browser, web preview, or HTML report
- Never call `/open-web`, `/visualize-in-web`, `/open-dot-agents-web`, `/report html`
- If the graph is truly complex, use mermaid or a text graph in markdown instead

- Use /refactor (workspace scope — split/merge/relocate members) if needed
- Use /all-workspace if needed
- Use /follow-tasks if needed
- Use /follow-monorepo if needed
- Use /run-build if needed
- Use /run-test all if needed

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A report of all relations between workspaces
- A dependency graph between workspaces
- Shared dependencies used by multiple workspaces
- Circular dependencies if any, with severity
- Recommendations for reducing coupling or refactoring
- Report easy to read with key findings at the top
- The whole report stays in chat — no browser or web preview opened
- Clear next action
