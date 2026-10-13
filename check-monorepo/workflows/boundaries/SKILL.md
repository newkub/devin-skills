---
name: check-monorepo-boundaries
description: Check cross-workspace-boundary imports in a monorepo for layering or visibility violations
argument-hint: "[workspace-or-package]"
related:
  - follow-tool-madge
  - list-workspaces
  - report
  - run-build
  - run-test
---

## Goal

Check dependency direction between packages in the monorepo — find imports that cross boundaries illegally, such as an app importing from an app, `shared` importing from a feature, or bypassing a package entry point.

## Scope

- Applies to detected monorepos (`pnpm-workspace.yaml`, `turbo.json`, `moon.yml`, `nx.json`, `lerna.json`)
- Checks: cross-package imports, deep imports (`pkg/src/internal`), layer violations (app→app, infra→domain), circular workspace deps
- Read-only: report violations — do not fix imports

## Execute

### 1. Map Workspace Topology

> Goal: Build the package map and the boundary rules

1. Use `/list-workspaces` to find all packages
2. Read the workspace config (`pnpm-workspace.yaml`, `moon.yml`, `turbo.json`, `nx.json`) to see declared deps
3. Build a layer map from convention, e.g. `apps/*` → `packages/*` → `shared/*`, or from the tags/constraints the project defines

### 2. Scan Cross-Package Imports

> Goal: Find every import that crosses a package boundary

1. Use `use-astgrep` or `search-files-patterns` to find import statements pointing at other packages
2. Cover both package-name imports (`@org/pkg`) and relative imports that cross a boundary (`../../other-pkg/`)
3. Check deep imports: `pkg/src/...` or subpaths not exported via `package.json` exports

### 3. Evaluate Violations

> Goal: Compare imports against the boundary rules

1. Flag imports of packages not declared in `dependencies`/`devDependencies` (phantom deps)
2. Flag imports from a lower layer up to a higher one (e.g. `shared` importing from `features`)
3. Flag app→app imports (apps should not depend on each other)
4. Flag deep imports that bypass a package's public API
5. Use `/follow-tool-madge` and `/follow-tool-madge` to check workspace-level cycles

### 4. Report

> Goal: Report violations with fix guidance

1. Use `/report` with columns: `No.`, `Importer`, `Imported`, `Violation`, `Severity`, `Fix`
2. Severity: `critical` (circular, app→app), `high` (layer violation, phantom dep), `medium` (deep import)
3. Suggest fixes such as moving code to shared, declaring the dep, or exporting through the entry point

## Rules

### 1. Evidence-Based

- Every violation must include the file:line of the actual import
- State the exact rule violated (declared deps, layer order, exports map)

### 2. Read-Only

- Do not fix imports or package.json — after reporting, let `/refactor` or `/update-config` apply the fixes

### 3. Context Aware

- If the project defines no layer rules → infer them from convention and mark them as inferred rules
- dev/test imports (fixtures, test-utils) may be exempt per project convention
- Use /run-build if needed
- Use /run-test all if needed

## Expected Outcome

- Workspace dependency graph with violations grouped by type
- List of phantom deps, layer violations, deep imports, and cycles with severity
- A fix suggestion for each violation
