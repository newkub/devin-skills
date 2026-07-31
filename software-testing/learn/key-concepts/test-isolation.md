# Test Isolation

## Overview

Test isolation หมายถึงแต่ละ test ต้องทำงานได้อย่าง independent ไม่มีผลต่อกัน และสามารถรัน parallel ได้

## Why Isolation Matters

- **Parallel execution**: Tests สามารถรันพร้อมกันได้
- **Reliable results**: Test failures ไม่ได้มาจาก test อื่น
- **Easy debugging**: รู้ว่า test ไหน fail และทำไม
- **Fast feedback**: ไม่ต้องรันทั้ง suite เพื่อ debug

## Common Isolation Problems

### Shared State

```javascript
// BAD - Shared state between tests
let counter = 0;

test('increment', () => {
  counter++;
  expect(counter).toBe(1);
});

test('increment again', () => {
  counter++; // Depends on previous test
  expect(counter).toBe(2);
});
```

```javascript
// GOOD - Isolated tests
test('increment', () => {
  const counter = 0;
  counter++;
  expect(counter).toBe(1);
});

test('increment again', () => {
  const counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

### Database Pollution

```python
# BAD - Data persists between tests
def test_create_user():
    user = User.create(name='John')
    assert user.name == 'John'

def test_find_user():
    # This test depends on previous test
    user = User.find_by_name('John')
    assert user is not None
```

```python
# GOOD - Clean database between tests
@pytest.fixture(autouse=True)
def clean_db():
    db.session.rollback()
    db.drop_all()
    db.create_all()

def test_create_user():
    user = User.create(name='John')
    assert user.name == 'John'

def test_find_user():
    user = User.create(name='Jane')
    assert user.name == 'Jane'
```

### Time Dependencies

```javascript
// BAD - Depends on real time
test('check deadline', () => {
  const deadline = new Date('2024-01-01');
  const now = new Date();
  expect(now < deadline).toBe(true); // Flaky!
});
```

```javascript
// GOOD - Mock time
test('check deadline', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-01'));
  
  const deadline = new Date('2024-01-01');
  const now = new Date();
  expect(now <= deadline).toBe(true);
  
  vi.useRealTimers();
});
```

## Isolation Strategies

### 1. Setup/Teardown

```javascript
beforeEach(() => {
  // Reset state before each test
  localStorage.clear();
  mockApi.reset();
});

afterEach(() => {
  // Cleanup after each test
  cleanup();
});
```

### 2. Test Scoping

```python
# Use fixtures for scoped resources
@pytest.fixture(scope='function')
def temp_file():
    with tempfile.NamedTemporaryFile() as f:
        yield f.name
```

### 3. Randomized Order

```javascript
// Run tests in random order to catch dependencies
jest --random
```

### 4. Parallel Execution

```javascript
// Vitest runs tests in parallel by default
// Ensure tests are isolated
```

## Best Practices

- **No shared state** ระหว่าง tests
- **Clean up resources** ใน afterEach
- **Use fresh data** สำหรับแต่ละ test
- **Mock external dependencies** APIs, databases
- **Avoid global variables** ใน test files
- **Test in isolation** แต่ละ test ควร pass ตัวเดียว

## Detection

```javascript
// Run tests multiple times to catch flakiness
jest --repeat=5

// Run in random order
jest --random

// Run with different seeds
jest --seed=12345
```
