# Vitest — Best Practices

Unit testing on Vite — fast runs, coverage, and test discipline

## Recommended Patterns

- `vitest` (watch) in dev, `vitest run` in CI — watch is the default, so pipelines must use `run`
- `describe`/`it` + `expect` — Jest-compatible API; `vi.mock`/`vi.fn`/`vi.spyOn` for mocks
- `vitest.config.ts` or a `test` field in `vite.config.ts` — environment (`node`/`jsdom`/`happy-dom`), globals, coverage
- Coverage: `vitest run --coverage` + the v8 provider — thresholds in the config, not CI grep
- Test files co-located as `*.test.ts` or in a `tests/` dir — keep one pattern per repo

## Common Pitfalls

- Globals (`describe`/`it` without imports) — enable `globals: true` only when wanted; explicit imports are better for types
- `vi.mock` hoisting — mocks hoist above imports; use factory functions for dynamic mocks
- Environment mismatch: DOM APIs need `jsdom`/`happy-dom` — in the `node` env, document is undefined
- Async: `await` expect/async utilities — floating promises = tests pass but never assert
- Snapshot tests: review diffs deliberately — blind `-u` makes snapshots useless
- Mock leaks: use `vi.restoreAllMocks`/`clearMocks` in the config — avoids cross-test mock pollution

## Perf / Scale

- `vitest --changed`/`--related` — run only tests related to changed files during dev
- Default parallelism is good; pick `--pool` options (forks vs threads) by need — forks for isolation
- `--bail` for fail-fast in dev; full runs in CI
- Typecheck tests: `vitest --typecheck` as a separate pass — treat types as an extra gate

## Do / Don't

| Do | Don't |
|----|-------|
| `vitest run` in CI | watch mode in pipelines |
| explicit imports or a clear globals:true | mixing imports with globals |
| coverage thresholds in the config | checking coverage via grep |
| `vi.mock` factories for dynamic mocks | getting surprised by hoisting |
