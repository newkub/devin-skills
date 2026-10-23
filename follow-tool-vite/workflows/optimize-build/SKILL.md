---
name: follow-tool-vite-optimize-build
description: Tune the Vite build — chunk splitting, minify options, sourcemap strategy
argument-hint: "[target-area]"
related:
  - follow-tool-vite
  - run-bench
  - deep-review
  - report-before-after
---

## Goal

Reduce the production bundle size and build time of a Vite project with appropriate chunk splitting, minify options, and sourcemap strategy — always measuring before and after

## Scope

- Covers `build.rolldownOptions.output` (`advancedChunks`, `minify`), `build.sourcemap`, `build.reportCompressedSize`, `chunkSizeWarningLimit`
- Applies to Vite 8+ (Rolldown bundler) — if the project is still Vite ≤7, see the official docs for the `rollupOptions` equivalents
- Basic config structure → use `workflows/config-vite/SKILL.md`

## Execute

### 1. Baseline

> Goal: capture the numbers before editing; never guess the bottleneck

1. Run `bunx vite build`, recording the build time and per-chunk output sizes
2. Enable `build.reportCompressedSize` to see gzip sizes in the output (or use a bundle visualizer — see official docs)
3. Do `/deep-optimize` when hunting for abnormally large chunks

### 2. Chunk Splitting

> Goal: split vendor/route chunks with a reason

1. Use `build.rolldownOptions.output.advancedChunks` for grouping, e.g. a separate `vendor` for `node_modules`
2. Split per route via dynamic `import()` in the source — config splitting never replaces lazy loading
3. Avoid too-small chunks — request overhead outweighs the benefit
4. Tune `chunkSizeWarningLimit` to match the project budget — don't just silence the warning

### 3. Minify Options

> Goal: minify without changing behavior

1. Vite 8 uses the Oxc minifier via `build.rolldownOptions.output.minify` — options under `minify.compress` such as `dropConsole`, `dropDebugger`
2. Enable `dropConsole`/`dropDebugger` only for production via conditional config by `mode`
3. Never enable compress options that change semantics without testing — see official docs per option

### 4. Sourcemap Strategy

> Goal: pick the sourcemap per use case

1. `build.sourcemap: true` → external `.map` — use for staging/internal tools
2. `build.sourcemap: 'hidden'` → generates maps without the comment — use for error reporting like Sentry
3. Keep the default `false` for public production when source exposure isn't wanted

### 5. Measure Again

> Goal: compare with the baseline

1. Re-run `bunx vite build` — compare bundle size, chunk count, build time
2. If there's a regression or behavior change → revert that point and report
3. Run `vite preview` + a smoke test on the real pages
4. Report the numbers with `/report-before-after`

## Rules

### 1. Behavior Preservation

- optimize ≠ change the output — runtime behavior must stay the same
- Change one point and measure one point — never change several options at once if results can't be separated

### 2. Options

- Use only options in the official docs (`vite.dev`, `rolldown.rs`) — never guess
- `esbuild.*` options are deprecated in Vite 8 — use `oxc`/`rolldownOptions` instead

- Use /follow-tool-vite if needed
- Use /run-bench if needed
- Use /deep-review if needed

## Expected Outcome

- Measurably better bundle size/build time versus the baseline
- A sensible chunk layout with sourcemaps matching the deployment strategy
