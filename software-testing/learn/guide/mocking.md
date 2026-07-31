# Mocking

## Overview

Mocking เป็นเทคนิคในการแทนที่ real dependencies ด้วย simulated objects เพื่อให้การทดสอบเป็น isolated, fast, และ reliable

## When to Mock

**Mock เมื่อ:**
- Dependencies ช้า (API calls, database)
- Dependencies ไม่เสถียร (external services)
- Dependencies ยากต่อการ setup (filesystem, network)
- ต้องการ test edge cases ที่ยากจะสร้างใน reality

**ไม่ Mock เมื่อ:**
- Dependencies เร็วและเสถียร (pure functions)
- ต้องการ test integration จริง
- Dependencies เป็น core business logic

## Jest Mocking

### Mock Functions

```javascript
// Create mock function
const mockFn = jest.fn();

// Set return value
mockFn.mockReturnValue(42);
expect(mockFn()).toBe(42);

// Set resolved value for promises
mockFn.mockResolvedValue('async result');
await expect(mockFn()).resolves.toBe('async result');

// Set rejected value
mockFn.mockRejectedValue(new Error('failed'));
await expect(mockFn()).rejects.toThrow('failed');

// Clear mock
mockFn.mockClear();
```

### Mock Implementations

```javascript
// Mock with implementation
const mockFn = jest.fn((a, b) => a + b);
expect(mockFn(2, 3)).toBe(5);

// Mock with different implementations
mockFn
  .mockImplementationOnce(() => 42)
  .mockImplementationOnce(() => 100);
expect(mockFn()).toBe(42);
expect(mockFn()).toBe(100);
```

### Mock Modules

```javascript
// Mock entire module
jest.mock('./api', () => ({
  getUser: jest.fn(() => Promise.resolve({ id: 1, name: 'John' })),
  createUser: jest.fn()
}));

// Use in test
import { getUser } from './api';
test('fetches user', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('John');
});
```

### Partial Mocks

```javascript
// Mock specific methods
import { UserService } from './service';

jest.mock('./service', () => {
  const actual = jest.requireActual('./service');
  return {
    ...actual,
    UserService: {
      ...actual.UserService,
      create: jest.fn()
    }
  };
});
```

### Spy on Methods

```javascript
// Spy on existing object method
const user = { name: 'John', update: jest.fn() };
user.update({ name: 'Jane' });
expect(user.update).toHaveBeenCalledWith({ name: 'Jane' });
```

## Vitest Mocking

### Mock Functions

```typescript
import { vi } from 'vitest';

// Create mock
const mockFn = vi.fn();

// Set return value
mockFn.mockReturnValue(42);

// Set resolved value
mockFn.mockResolvedValue('async');

// Clear mock
mockFn.mockClear();
```

### Mock Modules

```typescript
// Mock module
vi.mock('./api', () => ({
  getUser: vi.fn(() => Promise.resolve({ id: 1 }))
}));

// Use in test
import { getUser } from './api';
```

### Mock Timers

```typescript
// Mock timers
vi.useFakeTimers();

test('timeout callback', () => {
  const callback = vi.fn();
  setTimeout(callback, 1000);
  
  vi.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
  
  vi.useRealTimers();
});
```

## Pytest Mocking

### Mock Objects

```python
from unittest.mock import Mock, patch

# Create mock
mock_api = Mock()
mock_api.get_user.return_value = {'id': 1, 'name': 'John'}

# Use mock
user = mock_api.get_user(1)
assert user['name'] == 'John'
```

### Patch Functions

```python
# Patch function
with patch('app.api.get_user') as mock:
    mock.return_value = {'id': 1}
    user = get_user(1)
    assert user['id'] == 1
```

### Patch Decorator

```python
from unittest.mock import patch

@patch('app.api.get_user')
def test_get_user(mock_get_user):
    mock_get_user.return_value = {'id': 1}
    user = get_user(1)
    assert user['id'] == 1
```

### Mock Side Effects

```python
# Mock with side effect
mock_func = Mock()
mock_func.side_effect = [1, 2, 3]

assert mock_func() == 1
assert mock_func() == 2
assert mock_func() == 3
```

## Best Practices

- **Mock at boundaries** Mock external dependencies เท่านั้น
- **Keep mocks simple** อย่า mock logic ที่ซับซ้อน
- **Verify behavior** ทดสอบผลลัพธ์ไม่ใช่ implementation
- **Clean up mocks** ใน afterEach/afterEach
- **Use real dependencies** เมื่อ possible สำหรับ integration tests
