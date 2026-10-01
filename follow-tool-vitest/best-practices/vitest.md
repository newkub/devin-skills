# Vitest — Best Practices

Unit testing บน Vite — fast runs, coverage และ test discipline

## Recommended Patterns

- `vitest` (watch) dev, `vitest run` CI — watch default จึงต้อง `run` ใน pipelines
- `describe`/`it` + `expect` — Jest-compatible API; `vi.mock`/`vi.fn`/`vi.spyOn` สำหรับ mocks
- `vitest.config.ts` หรือ config ใน `vite.config.ts` `test` field — environment (`node`/`jsdom`/`happy-dom`), globals, coverage
- Coverage: `vitest run --coverage` + v8 provider — thresholds ใน config ไม่ใช่ CI grep
- Test files co-located `*.test.ts` หรือ `tests/` dir — pattern consistent per repo

## Common Pitfalls

- Globals (`describe`/`it` no import) — enable `globals: true` เมื่อต้องการ; explicit imports ดีกว่าสำหรับ types
- `vi.mock` hoisting — mocks hoist เหนือ imports; factory functions สำหรับ dynamic mocks
- Environment mismatch: DOM APIs ต้อง `jsdom`/`happy-dom` — `node` env = document undefined
- Async: `await` expect/async utilities — floating promises = tests pass but never assert
- Snapshot tests: review diffs อย่างมีสติ — `-u` blindly = snapshots useless
- Mock leaks: `vi.restoreAllMocks`/`clearMocks` ใน config — cross-test mock pollution

## Perf / Scale

- `vitest --changed`/`--related` — run เฉพาะ tests ที่เกี่ยวกับ changed files ตอน dev
- Parallelism defaults ดี; `--pool` options (forks vs threads) ตาม needs — forks สำหรับ isolation
- `--bail` fail-fast ตอน dev; full runs ใน CI
- Typecheck tests: `vitest --typecheck` แยก pass — test types เป็น gate เสริม

## Do / Don't

| Do | Don't |
|----|-------|
| `vitest run` ใน CI | watch mode ใน pipelines |
| explicit imports หรือ globals:true ชัดเจน | mixed globals + imports |
| coverage thresholds ใน config | coverage check ด้วย grep |
| `vi.mock` factory สำหรับ dynamic | hoisting surprises |
