# Test Runner Reference - Bun

## Overview

Bun includes a built-in test runner compatible with Jest and Vitest.

## Running Tests

```bash
# Run all tests
bun test

# Run specific file
bun test test/file.test.ts

# Watch mode
bun test --watch

# Coverage
bun test --coverage

# With filter
bun test --test-name-pattern "user"
```

## Test Structure

```typescript
import { test, expect, describe } from "bun:test"

describe("Math operations", () => {
  test("addition", () => {
    expect(1 + 1).toBe(2)
  })

  test("async", async () => {
    const result = await Promise.resolve(42)
    expect(result).toBe(42)
  })
})
```

## Matchers

| Matcher | Description |
|---------|-------------|
| `toBe(value)` | Strict equality |
| `toEqual(value)` | Deep equality |
| `toMatch(regex)` | Regex match |
| `toContain(value)` | Array contains |
| `toThrow(error)` | Error thrown |
| `resolves()` | Promise resolves |
| `rejects()` | Promise rejects |

## Hooks

```typescript
describe("Suite", () => {
  beforeAll(() => {
    // Setup before all tests
  })

  beforeEach(() => {
    // Setup before each test
  })

  afterEach(() => {
    // Cleanup after each test
  })

  afterAll(() => {
    // Cleanup after all tests
  })
})
```

## Snapshots

```typescript
test("snapshot", () => {
  const data = { name: "Bun" }
  expect(data).toMatchSnapshot()
})
```

## Mocking

```typescript
import { mock } from "bun:test"

const mockFn = mock(() => "mocked")
mockFn()
expect(mockFn).toHaveBeenCalled()
```

## Configuration

```toml
[test]
root = "tests"
preload = ["./test-setup.ts"]
pathIgnorePatterns = ["node_modules"]
smol = true
coverage = true
coverageThreshold = 0.8
```

## CLI Options

| Option | Description |
|--------|-------------|
| `--watch` | Watch mode |
| `--coverage` | Generate coverage |
| `--run` | Run specific test pattern |
| `--timeout` | Set timeout |
| `--retry` | Retry failed tests |

---

**See also:**
- [Test Documentation](https://bun.sh/docs/test/test-runner)
- [Test Configuration](https://bun.sh/docs/test/configuration)
