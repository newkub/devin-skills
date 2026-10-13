---
name: update-create-analyze-cli
description: Create/update tools/analyze analyzers for current features: 60+ categories across 5 domains
argument-hint: "[category-or-domain]"
related:
  - report
  - resolve-errors
  - suggest-next-action
  - run-test

---

## Goal

Create or update the `tools/analyze` analyzers so they cover the codebase's current features — 60+ categories across 5 domains — while reducing false positives and analyzer errors

## Scope

Applies to `tools/analyze` in a monorepo: detect features, add/fix analyzer categories, tune rules, and validate with the review CLI

## Execute

### 1. Detect Codebase Features

> Goal: Know which features need analysis

1. Read the root `package.json`, `moon.yml`, `turbo.json`
2. Build the list of workspaces: `apps`, `packages`, `integrations`, `tools`
3. Identify the tech stack: framework, database, API, auth, payments, realtime, search, integrations, notifications, mobile, AI, SEO
4. Create keyword/file patterns for each feature

### 2. Plan Analyzers

> Goal: Know which analyzers to add or change

1. Read `tools/analyze/src/domain/analyzers/index.ts` to see the analyzer groups
2. Count the current categories
3. Identify categories that are missing or score 0 as false negatives
4. Identify categories mapped to the wrong domain
5. Plan the additions to reach 60+ categories

### 3. Implement Analyzers

> Goal: Add/change analyzer code

1. Fix the regexes to handle both Windows and Unix paths using `[\/]`
2. Normalize paths in the context loader when needed
3. Add analyzer functions to the group files, e.g. `features.ts`, `architecture.ts`, `security.ts`
4. Add a `Finding` with `evidence`: file path, line, message, severity
5. Set the correct `reviewWorkflow`
6. Use `countMatches`, `matchStats`, `countWordOccurrences` from `helpers.ts`

### 4. Tune Rules

> Goal: Reduce false positives and analyzer errors

1. Check that the regex patterns match correctly on Windows
2. Wrap analyzer functions in `try/catch` so they cannot crash
3. Check that exceptions are caught in `runAllAnalyzers`
4. Reduce false positives with stricter patterns
5. Check `analyzerErrors` in the report

### 5. Validate

> Goal: Confirm the analyzers work

1. Run `bun --filter tools-analyze lint`
2. Run `bun --filter tools-analyze typecheck`
3. Run `bun --filter tools-analyze test`
4. Run `bun --filter tools-review-codebase review-codebase`
5. If it fails → `/resolve-errors` then fix (max 3)

### 6. Report

> Goal: Summarize the results

1. Run `/report` showing categories before/after, score, falsePositiveRate
2. Run `/suggest-next-action`

## Rules

### 1. Path Compatibility

- Use the regex `[\/]` instead of a literal `\` or `/`
- Normalize paths before matching where possible
- Test on both Windows and Unix paths

### 2. Evidence-Based

- Every finding must have a file path
- Use real metrics from the codebase
- No guessing

### 3. Category Count

- target 60+ categories
- categories must spread across all 5 domains
- no duplicate categories

### 4. No Crash

- Catch exceptions in `runAllAnalyzers`
- Use safe access
- Never throw from an analyzer

### 5. Minimal

- Change only the categories the metrics point to
- Do not rewrite all the analyzers
- Reuse the helpers
- Use /deep-test cli if needed
- Use /run-test if needed


## Expected Outcome

- `tools/analyze` has 60+ categories
- The categories cover the current features
- falsePositiveRate <= 20%
- analyzerErrors = 0
- review score >= 70
- build, typecheck, tests pass
