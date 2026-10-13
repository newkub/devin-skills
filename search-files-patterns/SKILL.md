---
name: search-files-patterns
description: Search file name and content patterns across codebases with glob, grep, and ast-grep
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
  - run-review
  - refactor
  - fix
  - use-astgrep

---
## Goal

Search patterns in both file names and file contents using glob, regex, and ast-grep

## Scope

- Find files by name pattern, e.g. `*.test.ts`, `/{mock,fixture}.*`
- Find file content by regex or AST pattern
- Supports multiple ecosystems: TypeScript, JavaScript, Rust, Python, Go
- Use the results for review, refactor, debug, or audit

- See also: /use-astgrep

## Execute

### 1. Define Search Target

> Goal: Identify the pattern to search for

1. Ask the user or read the context to know whether to search files, content, or both
2. Choose the pattern type:
   - `filename`: use a glob pattern
   - `content`: use regex or ast-grep
   - `mixed`: use glob to limit scope, then search the content
3. Read `templates/common-patterns.md` for pattern examples

### 2. Search File Names

> Goal: Find files by name pattern

1. Use `find_file_by_name` with a glob pattern
2. Or use `exec` `ls`/`Get-ChildItem` for file system search
3. Filter results by extension, directory depth, or exclude patterns
4. Record file paths with line count if needed

### 3. Search File Contents

> Goal: Find content by pattern

1. Use `grep` for regex search in small-to-medium files
2. Use `ast-grep` for AST-based patterns when it is a code pattern
3. Use `code_search` when you need symbols, call sites, or definitions
4. Record the file path, line number, and code snippet for every match

### 4. Filter And Rank Results

> Goal: Reduce noise and highlight the important matches

1. Filter by file path (e.g. `node_modules`, `dist`, `.git`, `target`)
2. Filter by line count or file size if needed
3. State the severity or impact of each match
4. Order by directory, priority, or frequency

### 5. Report

> Goal: Summarize the search results

1. Run `/report` showing matches: File, Line, Pattern, Snippet, Severity
2. Run `/suggest-next-action` or `/run-review` if follow-up action is wanted
3. If matches exceed 100, summarize the top 20 with the total count

## Rules

### 1. Tool Selection

- Use `find_file_by_name` for glob-based file search
- Use `grep` for regex search across the whole codebase
- Use `ast-grep` or `use-astgrep` for AST-based patterns
- Use `code_search` for complex codebase exploration

### 2. Scope Control

- State the base directory before searching
- Use glob excludes to skip `node_modules`, `dist`, `coverage`, `.git`, `target`
- If the repo is large → limit depth or file extension first

### 3. Evidence

- Every match must have a file path and line number
- Use short code snippets of no more than 5 lines
- If using `ast-grep`, record the pattern used

### 4. Safety

- Search is read-only — files are not modified
- If changes are needed → run `/refactor` or `/fix` after the search
- Do not expose secrets or credentials in the report

### 5. Formatting

- Never use `` (bold markers) — use backticks for emphasis (files patterns)
- Use heading levels for structure
- Report as a table with `/report`

## Expected Outcome

- A complete match list with file path, line number, and snippet
- Irrelevant files are excluded
- A table-format report with the next action
- The user knows which tool each pattern used and why
