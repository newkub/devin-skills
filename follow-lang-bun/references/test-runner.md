# Bun Test Runner

`bun test` คือ Jest-compatible test runner ในตัว — TypeScript-first, fast, มี snapshots, DOM testing และ coverage ในตัว Docs: https://bun.com/docs/test

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
- `expect` matchers ครบชุด Jest + `toMatchSnapshot`, `toThrowErrorMatchingSnapshot`
- `mock()`/`jest.fn()` — `mock.module("pkg", () => fake)` สำหรับ module mocking, `spyOn(obj, "m")`
- `setSystemTime()` — fake timers
- DOM testing: `bun:test` + `happy-dom` หรือ `jsdom` (register ผ่าน `[test] preload`)
- `--rerun-each <n>` — re-run each test n times (flaky detection); `--randomize` + `--seed <n>` ใน bunfig

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

- `--coverage` หรือ `[test] coverage = true` — uses Bun's own coverage (ไม่ใช่ v8/nyc)
- `coverageReporter = ["text", "lcov", "json"]`, `coverageDir`, `coverageThreshold`
- `coveragePathIgnorePatterns` — exclude files
- Source-mapped: coverage รายงานตาม TS source ไม่ใช่ transpiled output

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

- `expect(value).toMatchSnapshot()` — เขียนลง `__snapshots__/<file>.snap`
- `--update-snapshots` หรือ `bun test -u`
- `expect.addSnapshotSerializer()` สำหรับ custom serializers

## Notes

- Tests รันบน Bun runtime — `Bun.*` APIs ใช้ได้ตรงๆ
- `bun test` ไม่รัน doctests (ไม่มี concept นั้น — ต่างจาก Rust)
- CI: `bun test --coverage --reporter=junit --reporter-outfile=report.xml`
- Concurrent tests (`test.concurrent`) รันขนานในไฟล์เดียว; `--parallel` รันข้ามไฟล์
