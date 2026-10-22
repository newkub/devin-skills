---
name: scan-codebase
description: Quickly scan a codebase to understand its structure, patterns, and quality
argument-hint: "[scope]"
related:
  - code-search
  - git-search
  - web-search
  - deep-analyze
  - check-code-structure
  - use-astgrep
  - use-scripts
  - report
  - run-scan
---

## Goal

Quickly scan a codebase to understand its structure, patterns, and quality within 3 minutes

## Scope

Use for a quick overview before `/deep-analyze`, or as a fast standalone snapshot (a sub-step of `/deep-analyze` Step 2)

## Execute

### 1. File Structure Discovery (30 seconds)

> Goal: Understand the project structure, project type, and workspace layout

1. Use `/code-search` (`rg --files -g 'package.json' -g 'Cargo.toml' -g 'go.mod'`) to locate manifest files
2. Use `/code-search` (`rg --files`) to locate the directory structure (`src/`, `app/`, `lib/`, `components/`)
3. Identify the project type and monorepo structure

### 2. Pattern Search (1 minute)

> Goal: Discover code patterns and the domain’s key terms

1. Use `/code-search` in parallel for `import`, `export`, `function`, `class`, `const`, `interface`
2. Use `/code-search` for key terms related to the domain

### 3. Structural Analysis (1 minute)

> Goal: Get a symbol-level structure overview and outline

1. Run `/check-code-structure` to use `ast-grep outline`
2. Run `/use-astgrep` for ad-hoc AST patterns

### 4. Quality Check (30 seconds)

> Goal: Find quality issues and anti-patterns with priority

1. Run `/deep-review` to find duplicate code
2. Use `/code-search` to find anti-patterns (`any`, `console.log`, nested ternary)

### 5. Structured Data And Report (30 seconds)

> Goal: Summarize the scan into structured data and a readable report

1. Run `/use-scripts` to build structured data
2. Run `/report` to summarize the results

## Rules

- Process in parallel for speed
- Use `/code-search` for file names, text, and AST patterns — never raw `find`/`grep` ad hoc
- Use `ast-grep` through `/use-astgrep` for structural patterns beyond plain text
- Route history-related questions to `/git-search` and external sources to `/web-search`
- Use `/deep-analyze` when deeper analysis is needed
- Limit scope with path, type, glob to reduce noise
- Use /run-scan if needed

## Expected Outcome

- A clear project structure
- The code patterns in common use
- A structure overview via `ast-grep outline`
- Quality issues with priority
- Recommendations by impact
