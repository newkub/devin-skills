---
name: list-workspaces
description: List all workspaces in a monorepo with a dependencies graph
argument-hint: "[scope]"
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - report
  - run-build
  - run-test
---

## Goal

List all workspaces in a monorepo so the user sees an overview and dependency graph

## Scope

Use for monorepos with multiple workspace packages

## Execute

### 1. Discover Workspaces

> Goal: Discover Workspaces

Find all workspaces in the monorepo

1. Read root `package.json` for the workspaces configuration
2. Find `package.json` files in every workspace per the workspaces pattern
3. Identify workspace names and paths
4. Check for workspaces without a package.json (orphaned)

### 2. Analyze Dependencies

> Goal: Analyze Dependencies

Analyze dependencies between workspaces

1. Read each workspace's dependencies
2. Identify workspace dependencies (`workspace:*`)
3. Build a dependency graph between workspaces
4. Identify circular dependencies if any

### 3. Categorize Workspaces

> Goal: Categorize Workspaces

Group workspaces by type

1. Group by directory structure (apps, packages, tooling)
2. Group by purpose (cli, core, data, network, terminal)
3. Identify workspaces that are libraries (no bin)
4. Identify workspaces that are CLI tools (have bin)

### 4. Identify Issues

> Goal: Identify Issues

Find problems in workspaces

1. Check for workspaces nobody uses (orphaned)
2. Check for workspaces with circular dependencies
3. Check for workspaces with inconsistent versions
4. Check for workspaces missing required dependencies

## Rules

### 1. Workspace Discovery

Discover workspaces correctly

- Read workspaces configuration from root `package.json`
- Find `package.json` in every workspace per pattern
- Clearly identify workspace names and paths
- Check for workspaces without a package.json

### 2. Dependency Analysis

Analyze dependencies between workspaces

- Identify workspace dependencies (`workspace:*`)
- Build a clear dependency graph
- Identify circular dependencies if any
- Show dependency depth and levels

### 3. Categorization

Group workspaces systematically

- Group by directory structure
- Group by purpose and functionality
- Identify libraries and CLI tools
- Separate production and development workspaces

### 4. Issue Identification

Find problems in workspaces

- Check orphaned workspaces
- Check circular dependencies
- Check version inconsistencies
- Check missing dependencies

### 5. Report Formatting

Format output per `/report`

1. Define table structure with "No." as the first column (No. | Name | Path | Type | Dependencies | Status)
2. Use standard markdown table format with clear headers
3. Use appropriate alignment (left for text, right for numbers)
4. Use bold for headers and important keywords
5. Use backticks for workspace names and paths
6. Use symbols (✅, ❌, ⚠️) for status indicators
7. Group workspaces by category (Apps, Packages, Tooling)
8. Sort within a group by importance
9. Use separators to clearly divide groups
10. Ensure the table is readable on every device

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed
- Use /run-build if needed
- Use /run-test all if needed

## Expected Outcome

- The user sees an overview of all workspaces in the monorepo
- The user sees the dependency graph between workspaces
- The user knows which workspace is orphaned or has issues
- The user can organize workspaces effectively
