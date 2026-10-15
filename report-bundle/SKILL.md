---
name: report-bundle
description: Summarize bundle size per chunk, dependency, and tree-shaking effectiveness
argument-hint: "[scope]"
related:
  - run-build

  - follow-tool-sonda
  - follow-tool-node-modules-inspector
  - report
  - suggest-next-action
---

## Goal

Report the project's bundle size: per chunk, per dependency, tree-shaking effectiveness, and insights

## Scope

Use for reporting bundle size after build — excludes build optimization (use `/deep-review-codebase` for optimization)

## Execute

### 1. Build Project

> Goal: Build the project to produce a bundle

1. Use `/run-build` to build the project
2. Identify the output directory from build config (`dist/`, `.output/`, `build/`)
3. Build fails → report the error and stop

### 2. Collect Bundle Statistics

> Goal: gather bundle statistics

1. Run `du -sh <output-dir>` for total size
2. Run `du -sh <output-dir>/*` for per-subdirectory size
3. Identify the largest files (top 10) with `du -a <output-dir> | sort -n -r | head -10`
4. Identify chunk files: `*.js`, `*.css`, `*.woff2`, `*.png`
5. Separate gzipped size when available (`.gz` files)
6. `sonda` plugin exists in bundler config → use `.sonda/*.json` report as the source of truth for sizes instead of `du` estimates; not yet installed → recommend installing per `/follow-tool-sonda` (more accurate — reads final source maps)

### 3. Analyze Chunks

> Goal: analyze the bundle's chunks

1. Identify vendor chunks and sizes (e.g. `solid-vendor.js`, `tanstack-router.js`)
2. Identify application chunks and sizes
3. Identify async/lazy chunks and sizes
4. Identify CSS chunks and sizes
5. Identify asset chunks (fonts, images) and sizes
6. Calculate ratio: vendor vs application vs assets

### 4. Analyze Dependencies

> Goal: analyze dependencies affecting bundle size

1. Identify dependencies in vendor chunks — use the Sonda JSON report (`deep: true`) to break deps into source files when available
2. Use `/follow-tool-node-modules-inspector` — `bunx node-modules-inspector report duplicates` and `report sizes --json` for versions, duplicates, installed sizes
3. Estimate each dependency's size in the bundle
4. Identify unexpectedly large dependencies (e.g. > 50KB)
5. Identify poorly tree-shaken dependencies
6. Identify dependencies that should be dynamic imports

### 5. Check Tree-Shaking

> Goal: check tree-shaking effectiveness

1. Check `sideEffects` in `package.json`
2. Identify modules with side effects that prevent tree-shaking
3. Check named imports vs namespace imports
4. Identify dead code not eliminated
5. Estimate potential savings if tree-shaking improves

### 6. Format Report

> Goal: format the report for readability

1. Use `/report` to format as a table
2. Present in order: Summary → Chunks → Dependencies → Tree-Shaking → Recommendations
3. Define columns for the chunks table:
   - No. sequence
   - Chunk filename
   - Type vendor / app / async / css / asset
   - Size (KB)
   - Gzipped gzipped size (KB) if available
   - % share of total
4. Separate tables by category: Chunks, Large Dependencies, Tree-Shaking Issues

### 7. Provide Insights

> Goal: give insights and recommendations

1. Summarize total bundle size and proportions by type
2. Identify chunks exceeding the threshold (e.g. > 100KB)
3. Identify dependencies that should be dynamic imports
4. Identify modules with side effects
5. Recommend next steps: `/deep-review-codebase` for optimization

## Rules

### Report UX/UI

> Goal: readable report — key findings on top, leading to action (bundle)

1. Summarize key findings above the details (bundle)
2. Use `/report` for multi-column comparison tables (bundle)
3. Use `/report` for status/progress/logs reports
4. Use "No." as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (bundle)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always use `/suggest-next-action` at the end of the report

### Read-Only Report

- Never optimize or modify build config — report only
- Use `/deep-review-codebase` for optimization
- Use `/run-build` for building

### Output Format

- Use `/report` to format the result
- Separate tables by category: Chunks, Large Dependencies, Tree-Shaking Issues
- Use symbols: ✅ good size, ⚠️ large, ❌ too large
- Show sizes in KB or MB

### High Impact Content

- Highlight chunks over 100KB
- Highlight dependencies over 50KB
- Highlight tree-shaking issues with potential savings > 10KB
- More than 50 chunks → show only the top 20 largest

### Thresholds

- Vendor chunk: < 150KB ✅, 150-300KB ⚠️, > 300KB ❌
- Application chunk: < 100KB ✅, 100-200KB ⚠️, > 200KB ❌
- Async chunk: < 50KB ✅, 50-100KB ⚠️, > 100KB ❌
- CSS chunk: < 50KB ✅, 50-100KB ⚠️, > 100KB ❌

### Non-Redundancy

- Build optimization already lives in `/deep-review-codebase`
- Building already lives in `/run-build`

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A summary of total bundle size and per-chunk size in a readable table
- Chunks and dependencies exceeding the threshold identified
- Tree-shaking issues and potential savings identified
- Clear recommendations
- No build config modified — read-only report
- Report is readable with key findings on top
- Next action is clear
