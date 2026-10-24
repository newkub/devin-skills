---
name: follow-lib-fast-check
description: Use fast-check for property-based testing — arbitraries, shrinking, invariants
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-tool-vitest

---

## Goal

Use fast-check for property-based testing — arbitraries, shrinking, invariants

## Scope

Use when the task involves `fast-check` — setup, writing property tests, model-based testing, debugging counterexamples

- Use this skill for property-based testing only — general unit tests go to `/run-test` or `/follow-tool-vitest`
- `fast-check` is a test library — install as a devDependency and there is no standalone CLI (run via the test runner)
- Latest: `fast-check@4.10.2` (verified 2026-10-23) — v4 requires Node ≥12.17 / ES2020 and drops deprecated arbitraries (`unicode*`, `ascii*`, `char`, `uuidV`, `.noBias`, `.noShrink`) while including invalid dates and null-prototype objects by default; it reads no `FAST_CHECK_*` environment variables, so every override goes through `fc.configureGlobal` or a per-call parameter
- References: [apis](references/apis.md) 
- References: [fast-check — Best Practices](best-practices/fast-check.md)
## Execute

### 1. Install And Configure

> Goal: install `fast-check` and set run parameters

1. Run `bun add -D fast-check` — devDependency only, never put it in `dependencies`
2. Install the runner integration matching the test framework: `bun add -D @fast-check/vitest` for vitest (setup: `/follow-tool-vitest`), `@fast-check/jest` for jest, `@fast-check/ava` for ava
3. Install `bun add -D @fast-check/poisoning` if you need prototype-pollution checks during tests
4. Set global defaults with `fc.configureGlobal({ numRuns, seed, verbose })` — it merges into the active global config instead of replacing it
5. Read the active defaults with `fc.readConfigureGlobal()`; `fc.resetConfigureGlobal()` clears every global setting back to an empty config
6. Keep CI knobs in your own code — a setup file can read `process.env.FAST_CHECK_NUM_RUNS` and forward it to `fc.configureGlobal`, but the library never reads the environment itself
7. Check the version in `package.json` — the v4 API differs from v3 (deprecated arbitraries removed)

### 2. Write Property Tests

> Goal: write property tests that assert invariants

1. Write a property with `fc.assert(fc.property(arb, (x) => invariant))` — the invariant is a condition that must always hold
2. Use `fc.asyncProperty(arb, async (x) => ...)` for async code
3. Use `fc.pre(condition)` inside the property for preconditions — skip irrelevant inputs instead of hand-generating
4. Pick arbitraries by domain: `fc.string()`, `fc.integer({ min, max })`, `fc.record()`, `fc.oneof()`, `fc.array()`
5. Use `fc.sample(arb, n)` to inspect generated values while debugging
6. Use `fc.statistics(property, classifier)` to measure the distribution of generated inputs
7. Use `fc.check(property, params)` when the outcome must stay data — it returns `RunDetails` (`failed`, `numRuns`, `numSkips`, `seed`) and never throws
8. Tune a run with the v4 `Parameters` fields that exist: `seed`, `path`, `numRuns`, `maxSkipsPerRun`, `examples`, `endOnFailure`, `verbose`, `randomType`, `plugins`, plus the reporter hooks
9. Wrap every run with the plugin API (added in 4.10) — build a plugin with `fc.beforeEach(fn)` / `fc.afterEach(fn)` and pass it through `plugins: [...]` or `fc.installGlobalPlugin(plugin)`; globally installed plugins become the outermost wrappers

### 3. Handle Failures And Shrinking

> Goal: reproduce and turn counterexamples into regression tests

1. On failure, fast-check automatically shrinks to a minimal counterexample
2. Record the `seed` and `path` from the failure output — replay with `fc.assert(prop, { seed, path })`, which is the only replay channel (no environment variable)
3. Promote the counterexample with `fc.assert(prop, { examples: [[...args]] })` so it runs on every execution, not only during a replay
4. Convert the counterexample into a plain unit test to prevent regression before fixing the bug

### 4. Model-Based And Race Testing

> Goal: test stateful systems and concurrency

1. Use `fc.commands()` for model-based testing — compare model vs real implementation through command sequences
2. Use `fc.scheduler()` / scheduled helpers to detect race conditions in async code
3. Use `it.prop` from `@fast-check/vitest` or the equivalent of your runner for direct integration

### 5. Verify

> Goal: verify correct usage

1. Run `/run-verify` for lint, typecheck
2. Run `/run-test` to execute the test suite containing the property tests
3. Check the latest official docs at `https://fast-check.dev` before using an uncertain API

### Use Cases

| Scenario | Use case |
|----------|----------|
| Round-trip/idempotence properties for serializers and sorters | `usecases/property-test-invariants.md` |
| Model-based tests and async race detection | `usecases/race-and-model-based.md` |
| Custom arbitraries, `fc.pre` preconditions, distribution stats | `usecases/custom-arbitraries-and-preconditions.md` |
| Shrink a failure, replay by seed/path, add a regression test | `usecases/shrink-replay-and-regression.md` |
| Runner adapter, CI run counts, prototype-pollution guard | `usecases/runner-integration-and-ci.md` |

## Rules

- Property tests complement unit tests, never replace them — use for pure functions, serializers, and invariants
- Balance `numRuns` between coverage and time (default 100; raise it in CI via `fc.configureGlobal`)
- Replay a failure with `{ seed }` + `{ path }` from the run output, then pin the counterexample in `examples` instead of pinning a seed in CI
- Compose arbitraries with `.map()`, `.filter()`, `.chain()` instead of writing generators by hand
- Never use deprecated v3 arbitraries (`unicode*`, `ascii*`, `char`, `uuidV`, `.noBias`, `.noShrink`) — removed in v4

- Use `/run-verify` if needed
- Use `/run-test` if needed
- Use `/follow-tool-vitest` if needed

- See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

- `fast-check` installed as a devDependency and integrated with the project's test runner
- Property tests assert the right invariants with composable arbitraries
- Failures reproduce via `seed`/`path` and counterexamples become regression tests
- Lint, typecheck, tests pass
