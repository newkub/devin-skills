---
name: report-file-structure
description: Show file and folder structure with metadata, statistics, and recommendations
argument-hint: "[scope]"
related:
  - scan-codebase
  - deep-review-codebase
  - use-scripts
  - report
  - suggest-next-action
---

## Goal

Show file and folder structure with metadata, statistics, and recommendations, clearly and easy to read

## Scope

Use for presenting:
- Project structure and file trees
- Directory organization and component hierarchy
- File counts, sizes, types, and statistics
- Organization analysis with recommendations

## Execute

### 1. Scan Project Structure

> Goal: Scan Project Structure

1. Run `/scan-codebase` to scan all files
2. Run `/deep-review-codebase` to analyze the structure
3. Define the root directory and depth for the tree
4. Filter out unnecessary files (`node_modules`, `.git`, `dist`, `build`)

### 2. Quick Tree Mode

> Goal: Show the tree quickly per args

1. Take `path` from the argument (default is the working directory)
2. Support the necessary flags:
   - `--depth=N` limit the tree depth
   - `--include=pattern` show only paths matching the pattern
   - `--exclude=pattern` exclude paths matching the pattern
3. Filter system files and build artifacts (`node_modules`, `.git`, `dist`, `.cache`)
4. If the output exceeds 100 entries, summarize the main structure first, then ask the user which parts to expand

### 3. Format Tree

> Goal: Format Tree

1. Use tree characters (`├──`, `└──`, `│`) for hierarchy
2. Use icons for file types (`📁`, `📄`, `🔧`, `📦`)
3. Sort in logical order (directories first, then files alphabetically)
4. Use depth limits for large projects (default: 3 levels)

### 4. Calculate Statistics

> Goal: Calculate Statistics

1. Count all files and directories
2. Count files by type (`.ts`, `.js`, `.json`, `.md`, etc.)
3. Compute total size and average file size
4. Identify the 5 largest files
5. If the project has more than 10 directories, run `/use-scripts` for aggregation

### 5. Analyze Organization

> Goal: Analyze Organization

1. Check whether the structure matches the project type:
   - Monorepo: `apps/`, `packages/`, `framework/`
   - Single project: `src/`, `tests/`, `docs/`
2. Check barrel files (`index.ts`) in each directory
3. Check empty directories and deeply nested files (> 5 levels)
4. Identify files out of place (out of convention)

### 6. Highlight Important Files

> Goal: Highlight Important Files

1. Identify entry points (`package.json`, `tsconfig.json`, `AGENTS.md`)
2. Identify config files (`.devin/`, `biome.jsonc`, `turbo.json`)
3. Identify documentation files (`README.md`, `CHANGELOG.md`)
4. Identify CI/CD files (`.github/`, `lefthook.yml`)
5. Use markers for highlight

### 7. Add Metadata

> Goal: Add Metadata

1. Add file sizes for large files
2. Add file counts for directories
3. Add summary statistics for overview
4. Show the number of filtered files in the summary

### 8. Report Output

> Goal: Report Output

1. Show the tree view with icons and hierarchy
2. Show statistics using `/report`:
   - Metric, Value (total files, total dirs, total size, file types)
3. Show the summary: structure health, issues found, recommendations
4. Run `/report` for the combined output format

## Rules

### Report UX/UI

> Goal: report easy to read, key findings summarized at the top, leading to action (file structure)

1. Summarize key findings at the top before details (file structure)
2. Use `/report` for comparison tables with multiple columns (file structure)
3. Use `/report` for status/progress/logs reports
4. Use the "No." column as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (file structure)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always run `/suggest-next-action` at the end of the report

### Tree Structure

- Use consistent tree characters
- Use proper indentation for depth
- Sort in logical order
- Use clear icons for file types

### Filtering

- Filter `node_modules`, `.git`, `dist`, `build`, `.cache` out of the tree
- Use `.gitignore` patterns as a reference
- Show the number of filtered files in the summary
- Do not show binary files in the tree

### Depth Control

- Set a depth limit for large projects (default: 3 levels)
- Use `...` for directories beyond the depth
- Show the number of hidden files in the summary
- If more depth is needed, specify it per directory

### Statistics Accuracy

- Count only unfiltered files
- Compute size from actual file sizes
- Separate source files from generated files
- State the percentage of each file type

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- Clear, easy-to-read tree view
- Complete statistics (file counts, sizes, types)
- Organization analysis with recommendations
- Important files highlighted
- Useful metadata
- Report easy to read with key findings at the top
- Consolidated capability from `list-file-structure` (tree args, quick mode, depth/include/exclude)
- Clear next action
