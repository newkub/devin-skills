# API

## Purpose

API reference สำหรับ Vitest public API

## Scope

- Test Functions (describe, it, expect)
- vi Utilities (mock, spy, timers)
- Hooks (beforeEach, afterEach, etc.)
- Snapshot API
- Coverage API
- TypeScript Types

Vitest public API reference.

## Test Functions

### describe

```typescript
describe(name: string, fn: () => void): void
describe.each(table: any[])(name: string, fn: (...args) => void): void
describe.skip(name: string, fn: () => void): void
describe.only(name: string, fn: () => void): void
```

| Variant | Description |
|---------|-------------|
| `describe` | Standard suite |
| `describe.each` | Parameterized suite |
| `describe.skip` | Skip this suite |
| `describe.only` | Run only this suite |

### it / test

```typescript
it(name: string, fn: () => void | Promise<void>, timeout?: number): void
it.each(table: any[])(name: string, fn: (...args) => void, timeout?: number): void
it.skip(name: string, fn?: () => void): void
it.only(name: string, fn: () => void): void
it.todo(name: string): void
it.fails(name: string, fn: () => void): void
```

| Variant | Description |
|---------|-------------|
| `it` | Standard test (alias: `test`) |
| `it.each` | Parameterized test |
| `it.skip` | Skip this test |
| `it.only` | Run only this test |
| `it.todo` | Mark as todo |
| `it.fails` | Expect to fail |

### expect

```typescript
expect(value: any): Assertion
expect(value).toBe(expected): void
expect(value).toEqual(expected): void
expect(value).toBeTruthy(): void
expect(value).toBeFalsy(): void
expect(value).toBeNull(): void
expect(value).toBeUndefined(): void
expect(value).toContain(item): void
expect(value).toThrow(error?: string | Error): void
```

## vi Utilities

### vi.fn

```typescript
vi.fn(): MockInstance
vi.fn(() => value): MockInstance
vi.fn(() => value).mockReturnValue(value): MockInstance
vi.fn(() => value).mockResolvedValue(value): MockInstance
vi.fn(() => value).mockRejectedValue(error): MockInstance
```

### vi.spyOn

```typescript
vi.spyOn(object: object, method: string): MockInstance
```

### vi.mock

```typescript
vi.mock(path: string, factory?: () => unknown): void
vi.doMock(path: string, factory?: () => unknown): void
vi.unmock(path: string): void
```

### vi.mocked

```typescript
vi.mocked<T>(obj: T): T
```

### vi.hoisted

```typescript
vi.hoisted<T>(factory: () => T): T
```

### vi.mock.global

```typescript
vi.mock.global(namespace: string, value: any): void
```

## Timers

### Fake Timers

```typescript
vi.useFakeTimers(): VitestUtils
vi.useFakeTimers({ shouldAdvanceTime: true }): VitestUtils
vi.useRealTimers(): VitestUtils
vi.advanceTimersByTime(ms: number): void
vi.advanceTimersToNextTimer(): void
vi.runAllTimers(): void
vi.runOnlyPendingTimers(): void
```

## Hooks

```typescript
beforeEach(fn: () => void | Promise<void>): void
beforeEach(fn: () => void, timeout?: number): void
afterEach(fn: () => void | Promise<void>): void
afterEach(fn: () => void, timeout?: number): void
beforeAll(fn: () => void | Promise<void>): void
beforeAll(fn: () => void, timeout?: number): void
afterAll(fn: () => void | Promise<void>): void
afterAll(fn: () => void, timeout?: number): void
```

## Test Cleanup

```typescript
afterEach(fn: () => Promise<void>): void
afterAll(fn: () => Promise<void>): void

// Cleanup utilities
vi.clearAllMocks(): void
vi.resetAllMocks(): void
vi.restoreAllMocks(): void
```

## Snapshot

```typescript
expect(value).toMatchSnapshot(): void
expect(value).toMatchSnapshot(name: string): void
expect(value).toMatchInlineSnapshot(): void
expect(value).toMatchInlineSnapshot(snapshot: string): void
expect(value).toThrowErrorMatchingSnapshot(): void
expect(value).toThrowErrorMatchingInlineSnapshot(): void
```

## Coverage

```typescript
// Not functions, but config options
test: {
  coverage: {
    provider: 'v8' | 'istanbul'
    reporter: string | string[]
    exclude: string[]
    thresholds: {
      lines?: number
      functions?: number
      branches?: number
      statements?: number
    }
  }
}
```

## TypeScript Types

| Type | Description |
|------|-------------|
| `describe` | Suite function |
| `it` | Test function (alias: `test`) |
| `expect` | Assertion function |
| `vi` | Vitest utilities |
| `MockInstance` | Mock function type |
| `Assertion<T>` | Assertion type |