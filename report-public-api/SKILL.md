---
name: report-public-api
description: Report the public API of a project or library as a markdown table
argument-hint: "[scope]"
related:
  - scan-codebase
  - check-code-structure
  - report
---

## Goal

Analyze and report clearly the public API (exports, functions, types, classes) of a project or library

## Scope

For libraries, packages, or modules that need a public surface summary

## Execute

### 1. Collect Public API

> Goal: Find all public exports

1. Run `/scan-codebase` or `/check-code-structure` to find exports
2. Read barrel files (`index.ts`, `index.js`, `mod.rs`, `lib.rs`)
3. Classify: function, class, type, interface, constant, enum, macro
4. State the module/file exporting each one

### 2. Classify API

> Goal: Group the public API

1. Group by domain/module
2. State stability: stable, experimental, deprecated
3. State required parameters and return type when present

### 3. Report With Markdown Table

> Goal: Build the public API report

1. Use `/report` to show:
   - `| API | Type | Module | Description | Stability |`
2. Group by domain with a `## <domain>` heading
3. Summarize the public API count, breaking changes, and deprecations

## Rules

- Show only public exports, never internals
- Wrap API names in backticks
- State stability explicitly
- Do not create separate files unless the user wants them

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A complete public API table
- Grouped by domain
- Stability and description stated
- `/report` as the primary tool
