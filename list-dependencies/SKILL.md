---
name: list-dependencies
description: List all dependencies in the project with data and analysis
argument-hint: "[scope]"
related:
  - alternative
  - run-audit
  - follow-tool-taze
  - review-use-lib-effective
  - report
  - run-install
---

## Goal

List all dependencies in the project so the user sees the full picture and can manage them

## Scope

For every workspace with a package manifest such as `package.json`, `Cargo.toml`, `pyproject.toml`

## Execute

### 1. Read Package Manifest

> Goal: Read Package Manifest

Read the package manifest to see all dependencies

1. Read the `package manifest` such as `package.json`, `Cargo.toml`, `pyproject.toml`
2. Identify the dependency types (dependencies, devDependencies, peerDependencies, optionalDependencies)
3. Collect the version of each dependency
4. In a monorepo, read every workspace

### 2. Categorize Dependencies

> Goal: Categorize Dependencies

Group dependencies by purpose

1. Group by type (framework, utilities, testing, linting, build tools)
2. Group by source (npm, GitHub, local packages)
3. Identify `workspace packages` in a monorepo
4. Separate `production` and `development` dependencies

### 3. Analyze Usage

> Goal: Analyze Usage

Analyze how dependencies are used

1. Do `/follow-tool-knip` to find unused dependencies
2. Find duplicated dependencies or ones doing similar work
3. Check dependencies with security vulnerabilities
4. Look at dependencies whose version is behind latest

### 4. Suggest Improvements

> Goal: Suggest Improvements

Recommend improvements for the dependencies

1. Do `/alternative` to compare with alternatives
2. Recommend dependencies that should be updated
3. Recommend dependencies that should be removed
4. Recommend dependencies that should be swapped for better alternatives
5. For a full effective-use review of the installed libraries → `/review-use-lib-effective`

## Rules

### 1. Manifest Reading

Read package manifests correctly

- Read from `package.json`, `Cargo.toml`, `pyproject.toml` per project type
- Identify every dependency type (dependencies, devDependencies, peerDependencies, optionalDependencies)
- Read every workspace in a monorepo
- Collect versions and semver ranges

### 2. Categorization

Group dependencies systematically

- Group by purpose (framework, utilities, testing, linting, build tools)
- Group by source (npm, GitHub, local packages)
- Separate `production` and `development` dependencies
- Identify `workspace packages` in a monorepo

### 3. Usage Analysis

Analyze how dependencies are used

- Use `/follow-tool-knip` to find unused dependencies
- Check for duplicated dependencies or ones doing similar work
- Check security vulnerabilities with `/run-audit`
- Look at dependencies whose version is behind latest

### 4. Improvement Suggestions

Recommend useful improvements

- Use `/alternative` to compare with alternatives
- Recommend dependencies to update via `/follow-tool-taze`
- Recommend dependencies to remove
- Recommend dependencies to swap for better alternatives

### 5. Report Formatting

Format the output per `/report`

1. Define the table structure with "No." as the first column (No. | Name | Version | Type | Purpose | Status)
2. Use standard markdown table format with clear headers
3. Use suitable alignment (left for text, right for versions)
4. Use bold for headers and key keywords
5. Use backticks for package names and versions
6. Use symbols (✅, ❌, ⚠️) for status indicators
7. Group dependencies by category (Production, Development, Workspace)
8. Order within a group by importance
9. Use separators for clear group breaks
10. Verify the table reads well on every device
- Use /run-install if needed

## Expected Outcome

- The user sees the full dependency picture of the project
- The user knows which dependencies are unused
- The user knows which dependencies are duplicated
- The user knows better alternatives
- The user can manage dependencies effectively
