# Fast Feedback Principle

## Overview

Fast feedback หมายถึง tests ต้องรันเร็วเพื่อให้ developer ได้ feedback ทันที เมื่อแก้โค้ด

## Why Speed Matters

- **Developer productivity**: เขียนโค้ด → รัน test → แก้ bug ในเวลาสั้น
- **TDD workflow**: Red-Green-Refactor ต้องเร็ว
- **CI/CD efficiency**: Pipeline เร็ว = deploy เร็ว
- **Debugging**: Tests เร็ว = หา bug เร็ว

## Target Times

| Test Type | Target Time | Acceptable |
|-----------|-------------|------------|
| **Unit test** | < 10ms | < 100ms |
| **Integration test** | < 100ms | < 1s |
| **E2E test** | < 5s | < 30s |
| **Full suite** | < 1min | < 5min |

## Optimization Strategies

### 1. Mock External Dependencies

```javascript
// SLOW - Real API call
test('fetch user', async () => {
  const user = await api.getUser(1); // Network latency
  expect(user.name).toBe('John');
});

// FAST - Mocked API
test('fetch user', async () => {
  api.getUser.mockResolvedValue({ id: 1, name: 'John' });
  const user = await api.getUser(1); // Instant
  expect(user.name).toBe('John');
});
```

### 2. Use In-Memory Databases

```python
# SLOW - Real database
@pytest.fixture
def db():
    db = PostgreSQLDatabase()
    db.connect()
    yield db
    db.disconnect()

# FAST - In-memory database
@pytest.fixture
def db():
    db = SQLiteDatabase(':memory:')
    db.create_all()
    yield db
    db.drop_all()
```

### 3. Parallel Execution

```javascript
// Vitest runs tests in parallel by default
// Jest can run tests in parallel with --maxWorkers
jest --maxWorkers=4
```

### 4. Selective Test Running

```bash
# Run only changed files
jest --onlyChanged

# Run only tests matching pattern
jest --testNamePattern="User"

# Run only failed tests
jest --onlyFailures
```

### 5. Test Organization

```javascript
// Organize by speed
// __tests__/fast/ - Unit tests
// __tests__/medium/ - Integration tests
// __tests__/slow/ - E2E tests

// Run fast tests during development
jest __tests__/fast

// Run all tests in CI
jest
```

## Measurement

```javascript
// Measure test execution time
jest --verbose

// Use jest-bench for benchmarking
bun install --save-dev jest-bench
```

## Best Practices

- **Profile slow tests** ระบุ tests ที่ช้า
- **Mock I/O operations** Network, disk, database
- **Use in-memory alternatives** SQLite, Redis
- **Run tests in parallel** เมื่อ possible
- **Organize by speed** แยก fast/slow tests
- **Set time limits** Timeout สำหรับแต่ละ test
