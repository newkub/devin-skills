# Bun Test Runner

`bun test` is a built-in Jest-compatible test runner — TypeScript-first, fast, with snapshots, DOM testing, and coverage built in. Docs: https://bun.com/docs/test

## Writing Tests

```ts
import { describe, test, expect, beforeAll, afterEach, mock, spyOn } from "bun:test";

describe("math", () => {
  test("adds", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- Discovery: `*.test.{js,jsx,ts,tsx}`, `*_test.*`, `*.spec.*`, `*_spec.*`
- Jest-compatible API: `describe`, `test`/`it`, `expect`, `beforeAll/BeforeEach/afterAll/afterEach`
- `test.skip`, `test.todo`, `test.only`, `test.each`, `describe.each`, `test.concurrent`
- `test("name", async () => {...}, timeout)` — per-test timeout
- Full set of Jest `expect` matchers + `toMatchSnapshot`, `toThrowErrorMatchingSnapshot`
- `mock()`/`jest.fn()` — `mock.module("pkg", () => fake)` for module mocking, `spyOn(obj, "m")`
- `setSystemTime()` — fake timers
- DOM testing: `bun:test` + `happy-dom` or `jsdom` (registered via `[test] preload`)
- `--rerun-each <n>` — re-run each test n times (flaky detection); `--randomize` + `--seed <n>` in bunfig

## Running

| commands | description |
|----------|-------------|
| `bun test` | run all discovered tests |
| `bun test <path>` | run tests in specific file/dir |
| `bun test -t <pattern>` | filter by test name |
| `bun test --watch` | re-run on change |
| `bun test --parallel` | run test files across multiple threads (v1.4+) |
| `bun test --bail [n]` | stop after n failures |
| `bun test --timeout <ms>` | per-test timeout (default 5000) |
| `bun test --coverage` | collect coverage |
| `bun test --preload <m>` | load module before tests |
| `bun test --rerun-each <n>` | repeat each test |
| `bun test --update-snapshots` | update snapshots |
| `bun test --reporter=junit --reporter-outfile=junit.xml` | JUnit output for CI |

## Coverage

- `--coverage` or `[test] coverage = true` — uses Bun's own coverage (not v8/nyc)
- `coverageReporter = ["text", "lcov", "json"]`, `coverageDir`, `coverageThreshold`
- `coveragePathIgnorePatterns` — exclude files
- Source-mapped: coverage is reported against the TS source, not the transpiled output

## Config (bunfig.toml)

```toml
[test]
root = "./tests"
preload = ["./test/setup.ts"]
coverage = true
coverageThreshold = 0.9
coverageReporter = ["text", "lcov"]
randomize = true
smol = true
```

## Snapshots

- `expect(value).toMatchSnapshot()` — writes to `__snapshots__/<file>.snap`
- `--update-snapshots` or `bun test -u`
- `expect.addSnapshotSerializer()` for custom serializers

## Notes

- Tests run on the Bun runtime — `Bun.*` APIs are directly available
- `bun test` doesn't run doctests (no such concept — unlike Rust)
- CI: `bun test --coverage --reporter=junit --reporter-outfile=report.xml`
- Concurrent tests (`test.concurrent`) run in parallel within one file; `--parallel` runs across files
