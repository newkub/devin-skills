# Testing

## Overview

Testing ใน JavaScript เป็นการ verify ว่า code ทำงานถูกต้องตามที่คาดหวัง ช่วยลด bugs และเพิ่มความมั่นใจในการ deploy

## Types of Testing

### 1. Unit Testing

ทดสอบ functions หรือ components แยกเป็นส่วนๆ

```javascript
// Example with Vitest
import { describe, it, expect } from 'vitest';
import { add, subtract } from './math.js';

describe('Math functions', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  it('should subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
  
  it('should handle negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });
});
```

### 2. Integration Testing

ทดสอบการทำงานร่วมกันของหลายส่วน

```javascript
describe('User API integration', () => {
  it('should create and fetch user', async () => {
    // Create user
    const created = await api.post('/users', {
      name: 'John',
      email: 'john@example.com'
    });
    
    expect(created.status).toBe(201);
    expect(created.data.name).toBe('John');
    
    // Fetch user
    const fetched = await api.get(`/users/${created.data.id}`);
    
    expect(fetched.data).toEqual(created.data);
  });
});
```

### 3. End-to-End Testing

ทดสอบ flow ทั้งหมดของ application

```javascript
// Example with Playwright
import { test, expect } from '@playwright/test';

test('user login flow', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Testing Frameworks

### Vitest

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

```bash
# Run tests
npx vitest

# Run with coverage
npx vitest --coverage

# Watch mode
npx vitest --watch
```

### Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

```bash
# Run tests
npx jest

# Run with coverage
npx jest --coverage

# Watch mode
npx jest --watch
```

## Testing Patterns

### 1. AAA Pattern (Arrange, Act, Assert)

```javascript
it('should calculate total with tax', () => {
  // Arrange
  const price = 100;
  const taxRate = 0.1;
  
  // Act
  const total = calculateTotal(price, taxRate);
  
  // Assert
  expect(total).toBe(110);
});
```

### 2. Given-When-Then Pattern

```javascript
describe('User authentication', () => {
  it('should allow login with valid credentials', () => {
    // Given
    const user = { email: 'user@example.com', password: 'password' };
    
    // When
    const result = authenticate(user);
    
    // Then
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });
});
```

### 3. Test Doubles

#### Mocks

```javascript
import { vi } from 'vitest';

// Mock function
const mockFn = vi.fn();
mockFn('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Mock module
vi.mock('./api.js', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock' }))
}));
```

#### Stubs

```javascript
// Stub with specific return
const stub = vi.fn();
stub.mockReturnValue(42);
expect(stub()).toBe(42);

// Stub with promise
stub.mockResolvedValue({ data: 'result' });
await stub();
```

#### Spies

```javascript
// Spy on existing function
const original = console.log;
const spy = vi.spyOn(console, 'log');

console.log('test');
expect(spy).toHaveBeenCalledWith('test');

spy.mockRestore();
```

## Async Testing

### Testing Promises

```javascript
it('should resolve with data', async () => {
  const result = await fetchData();
  expect(result).toEqual({ data: 'test' });
});

it('should reject on error', async () => {
  await expect(fetchDataWithError()).rejects.toThrow('Error');
});
```

### Testing Callbacks

```javascript
it('should call callback with data', (done) => {
  fetchData((data) => {
    expect(data).toBe('test');
    done();
  });
});
```

### Testing Timers

```javascript
import { vi } from 'vitest';

it('should call function after timeout', () => {
  vi.useFakeTimers();
  
  const callback = vi.fn();
  setTimeout(callback, 1000);
  
  vi.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalled();
  
  vi.useRealTimers();
});
```

## Testing Best Practices

### 1. Write Testable Code

```javascript
// ❌ Hard to test - tight coupling
function processUser() {
  const user = fetchUserFromDB();
  const result = externalAPI(user);
  saveToDB(result);
}

// ✅ Easy to test - dependency injection
function processUser(userFetcher, api, db) {
  const user = userFetcher();
  const result = api(user);
  db.save(result);
}
```

### 2. Test Behavior, Not Implementation

```javascript
// ❌ Testing implementation
it('should set the internal state', () => {
  const counter = new Counter();
  counter.increment();
  expect(counter.count).toBe(1);
});

// ✅ Testing behavior
it('should return incremented value', () => {
  const counter = new Counter();
  const result = counter.increment();
  expect(result).toBe(1);
});
```

### 3. Use Descriptive Test Names

```javascript
// ❌ Vague
it('should work');

// ✅ Descriptive
it('should return 404 when user not found');
it('should calculate total with tax included');
it('should validate email format');
```

### 4. Test Edge Cases

```javascript
describe('Array operations', () => {
  it('should handle empty array', () => {
    expect(first([])).toBeUndefined();
  });
  
  it('should handle single element', () => {
    expect(first([1])).toBe(1);
  });
  
  it('should handle null input', () => {
    expect(first(null)).toBeUndefined();
  });
});
```

### 5. Keep Tests Independent

```javascript
// ❌ Tests depend on each other
let userId;

it('should create user', () => {
  const user = createUser({ name: 'John' });
  userId = user.id;
});

it('should fetch user', () => {
  const user = getUser(userId);
  expect(user.name).toBe('John');
});

// ✅ Each test is independent
it('should create user', () => {
  const user = createUser({ name: 'John' });
  expect(user.id).toBeDefined();
});

it('should fetch user', () => {
  const user = createUser({ name: 'John' });
  const fetched = getUser(user.id);
  expect(fetched.name).toBe('John');
});
```

## Test Organization

### File Structure

```
src/
├── math.js
├── math.test.js
├── api/
│   ├── users.js
│   └── users.test.js
└── __tests__/
    └── integration/
        └── auth.test.js
```

### Test Categories

```javascript
// Unit tests
describe('Unit tests', () => {
  // Fast, isolated tests
});

// Integration tests
describe('Integration tests', () => {
  // Slower, test interactions
});

// E2E tests
describe('E2E tests', () => {
  // Slowest, test full flows
});
```

## Coverage

### Setting Coverage Goals

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```

### Ignoring Code

```javascript
/* istanbul ignore next */
function debugFunction() {
  // Don't count in coverage
}

/* istanbul ignore file */
// Ignore entire file
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: bun ci
      - run: bun test
      - run: bun run test:coverage
```

## Testing Checklist

- [ ] Write unit tests for critical functions
- [ ] Test edge cases and error conditions
- [ ] Use descriptive test names
- [ ] Keep tests independent
- [ ] Mock external dependencies
- [ ] Test async code properly
- [ ] Set coverage goals
- [ ] Run tests in CI/CD
- [ ] Test security-critical code
- [ ] Test performance-critical code
- [ ] Keep tests fast
- [ ] Update tests when code changes

## Related Concepts

- [Error Handling](./error-handling/index.md)
- [Async Patterns](../key-concepts/async-patterns.md)
- [Best Practices](../guide/best-practices.md)
