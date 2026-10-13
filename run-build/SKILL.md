---
name: run-build
description: Run the build process systematically to produce production-ready artifacts
argument-hint: "[scope]"
related:
  - deep-review
  - run-typecheck
  - resolve-errors
  - run-clean

  - report
---

## Goal

Run the build process systematically to produce production-ready artifacts

## Scope

Use with projects that have a build script in the package manifest, optimizing build configuration before building

## Execute

### 1. Optimize Build

> Goal: Improve build configuration and reduce output size before building

1. Run `/deep-review` to analyze bundle size, build config, manual chunks, and externalization
2. Run `/deep-review` to improve build configuration, dependencies, imports, and assets
3. If `/deep-review` or `/deep-review` fails → stop and report

### 2. Typecheck

> Goal: Check TypeScript types before building

1. Run `/run-typecheck` to check TypeScript types
2. If there are type errors → run `/resolve-errors`, then retry from `/run-typecheck` (max 3 → stop)

### 3. Install Dependencies

> Goal: Install the required dependencies

1. Run `bun install`
2. Verify that all dependencies are installed

### 4. Clean Build Artifacts

> Goal: Remove old artifacts for a fresh build

1. Run `/run-clean` to remove old build artifacts and cache

### 5. Execute Build

> Goal: Run the build command per the package manifest

1. Run `bun run build` or the designated build script
2. Record the elapsed time
3. Capture stdout and errors separately

### 6. Verify Output

> Goal: Check the build artifacts

1. Verify that the build artifacts were created
2. Verify that file sizes and output file counts are appropriate

### 7. Report

> Goal: Summarize the build result

1. Run `/report` to show build metrics (time, size, files)
2. Run `/report` to show the result summary

## Rules

### 1. Build Order

- Optimize: run `/deep-review` first, then run `/deep-review`
- Typecheck: run `/run-typecheck` before building
- Install: install dependencies
- Clean: run `/run-clean` to remove old artifacts
- Build: run the build command
- Verify: check the output

### 2. Error Handling

- Typecheck fails: run `/resolve-errors` before building
- Build fails: run `/resolve-errors` to fix
- Warnings: record and consider fixing

### 3. Reporting

- Use `/report` for metrics
- Use `/report` for text summaries
- Do not report redundantly

## Expected Outcome

- Build succeeds with no errors
- Typecheck fully passes
- Build artifacts are correct
- Output size and build time are improved

## Example Template

```markdown
---
title: Run Build
description: Run the build process for production-ready artifacts
auto_execution_mode: 3
related:
  - /deep-review
  - /run-typecheck
  - /run-clean
  - /resolve-errors
---

### Goal

Run the build process for production-ready artifacts

### Scope

Use with projects that have a build script

### Execute

#### 1. Optimize Build

> Goal: build config ready

1. Run `/deep-review`

#### 2. Typecheck

> Goal: no type errors

1. Run `/run-typecheck`
2. If there are errors → run `/resolve-errors`

#### 3. Build

> Goal: build succeeds

1. Run `/run-clean`
2. Run the build command

#### 4. Report

> Goal: summarize results

1. Run `/report`
2. Run `/report`

### Rules

#### 1. Order

- Optimize before building

### Expected Outcome

- Build succeeds
```
