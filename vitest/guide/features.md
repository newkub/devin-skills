# Features

## Purpose

สรุป features ทั้งหมดของ Vitest พร้อมตัวอย่างการใช้งาน

## Scope

- Test Types
- Matchers
- Hooks
- Mocking
- Code Coverage
- Snapshot Testing

## Test Types

| Type | Description | Environment |
|------|-------------|-------------|
| **Unit Test** | Test individual functions/modules | `node`, `jsdom` |
| **Component Test** | Test Vue/React components | `jsdom`, `happy-dom` |
| **Integration Test** | Test module interactions | `node` |
| **E2E-like** | Browser testing with happy-dom | `happy-dom` |

## Test Environments

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',  // Default: 'node'
  },
})
```

| Environment | Package | Use Case |
|-------------|---------|----------|
| `node` | Built-in | Node.js logic, pure functions |
| `jsdom` | `jsdom` | DOM testing, React/Vue components |
| `happy-dom` | `happy-dom` | Lightweight DOM alternative |

## Matchers

### Equality

| Matcher | Description | Example |
|---------|-------------|---------|
| `toBe(value)` | Strict equality (`===`) | `expect(1).toBe(1)` |
| `toEqual(value)` | Deep equality | `expect({a:1}).toEqual({a:1})` |
| `toStrictEqual(value)` | Strict deep equality | `expect({a:undefined}).toStrictEqual({})` |

### Truthiness

| Matcher | Description | Example |
|---------|-------------|---------|
| `toBeTruthy()` | Truthy value | `expect('hello').toBeTruthy()` |
| `toBeFalsy()` | Falsy value | `expect('').toBeFalsy()` |
| `toBeNull()` | Exactly `null` | `expect(null).toBeNull()` |
| `toBeUndefined()` | Exactly `undefined` | `expect(undefined).toBeUndefined()` |
| `toBeDefined()` | Not `undefined` | `expect(1).toBeDefined()` |

### Numbers

| Matcher | Description |
|---------|-------------|
| `toBeGreaterThan(n)` | `> n` |
| `toBeGreaterThanOrEqual(n)` | `>= n` |
| `toBeLessThan(n)` | `< n` |
| `toBeLessThanOrEqual(n)` | `<= n` |
| `toBeCloseTo(n, digits?)` | Floating point comparison |

### Strings

| Matcher | Description |
|---------|-------------|
| `toMatch(regex)` | Match regex |
| `toMatchSnapshot()` | Match saved snapshot |
| `toContain(item)` | String contains substring |

### Arrays & Objects

| Matcher | Description |
|---------|-------------|
| `toContain(item)` | Array contains item |
| `toHaveLength(n)` | Array length equals n |
| `toHaveProperty(key, value?)` | Object has property |
| `toBeInstanceOf(Class)` | Instance of class |

### Exceptions

| Matcher | Description |
|---------|-------------|
| `toThrow()` | Function throws |
| `toThrowError(message?)` | Throws with message |

### Custom Matchers

```typescript
expect.extend({
  toBeDivisibleBy(received, divisor) {
    const pass = received % divisor === 0
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be divisible by ${divisor}`,
    }
  },
})

// Usage
expect(10).toBeDivisibleBy(5)  // OK
expect(10).toBeDivisibleBy(3)  // FAIL
```

## Hooks

```typescript
describe('Calculator', () => {
  // Setup before all tests
  beforeAll(() => {
    // Initialize database, API mock, etc.
  })

  // Setup before each test
  beforeEach(() => {
    // Reset state, clear mocks
  })

  // Cleanup after each test
  afterEach(() => {
    // Clear timers, restore mocks
  })

  // Cleanup after all tests
  afterAll(() => {
    // Close connections
  })

  it('adds numbers', () => {})
})
```

| Hook | Runs | Use Case |
|------|------|----------|
| `beforeAll` | Once before all tests | Setup DB |
| `beforeEach` | Before each test | Reset state |
| `afterEach` | After each test | Cleanup |
| `afterAll` | Once after all tests | Close connections |

## Mocking

### Mock Functions

```typescript
// Create mock
const mockFn = vi.fn()
const mockWithImpl = vi.fn((x) => x * 2)

// Configure
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue({ data: 'ok' })
mockFn.mockImplementation((x) => x + 1)

// Assert
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(1, 2)
expect(mockFn).toHaveBeenCalledTimes(3)
```

### Module Mocking

```typescript
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'John' }),
}))

// Auto-mock
vi.mock('./api')
vi.mocked(fetchUser).mockResolvedValue({ id: 1 })
```

### Spy

```typescript
const obj = { method: () => 'real' }
const spy = vi.spyOn(obj, 'method')

obj.method()

expect(spy).toHaveBeenCalled()
spy.mockRestore()  // Restore original
```

## Code Coverage

```bash
vitest run --coverage
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',  // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '**/*.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

| Provider | Description |
|----------|-------------|
| `v8` | V8 built-in coverage (fast) |
| `istanbul` | Istanbul/nyc (more detailed) |

## Snapshot Testing

```typescript
it('renders correctly', () => {
  const result = renderComponent()
  expect(result).toMatchSnapshot()
})

// Update snapshots
// vitest run --update
```

| Method | Description |
|--------|-------------|
| `toMatchSnapshot()` | Match against saved snapshot |
| `toMatchInlineSnapshot()` | Inline snapshot in test file |

## Summary

| Category | Key Features |
|----------|--------------|
| **Environments** | node, jsdom, happy-dom |
| **Matchers** | 50+ built-in matchers |
| **Hooks** | beforeAll, beforeEach, afterEach, afterAll |
| **Mocking** | fn, mock, spy, module mocking |
| **Coverage** | v8, istanbul providers |
| **Snapshots** | toMatchSnapshot, toMatchInlineSnapshot |