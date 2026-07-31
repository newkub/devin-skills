# Test Doubles

## Overview

Test doubles เป็น objects หรือ functions ที่ใช้แทน real dependencies ในการทดสอบ เพื่อให้การทดสอบเป็น isolated, fast, และ reliable

## Types of Test Doubles

### Dummy

Objects ที่ถูกส่งผ่านแต่ไม่ได้ใช้จริง

```javascript
// Dummy object
const dummyUser = { id: 1, name: 'Test' };
userService.create(dummyUser, callback);
```

### Stub

Predefined responses สำหรับ specific calls

```javascript
// Stub with predefined response
const stubUserRepository = {
  findById: (id) => ({ id, name: 'John' })
};
```

### Spy

Record calls และ verify interactions

```javascript
// Spy to track calls
const spy = vi.fn();
userService.update(spy);
expect(spy).toHaveBeenCalledWith({ id: 1, name: 'Jane' });
```

### Mock

Pre-programmed expectations และ verify behavior

```javascript
// Mock with expectations
const mockApi = vi.mocked(externalApi);
mockApi.getUser.mockResolvedValue({ id: 1, name: 'John' });
```

### Fake

Working implementation แต่ simplified

```javascript
// Fake in-memory database
class FakeDatabase {
  constructor() { this.data = []; }
  save(item) { this.data.push(item); }
  find(id) { return this.data.find(i => i.id === id); }
}
```

## When to Use Each

| Type | Use Case | Example |
|------|----------|---------|
| **Dummy** | Fill parameters | User object for validation test |
| **Stub** | Fixed responses | API returning static data |
| **Spy** | Verify calls | Check if function was called |
| **Mock** | Complex behavior | API with multiple endpoints |
| **Fake** | Real behavior | In-memory database |

## Examples

### Jest Mocking

```javascript
// Mock function
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async');

// Mock module
jest.mock('./api', () => ({
  getUser: jest.fn(() => Promise.resolve({ id: 1 }))
}));

// Mock implementation
jest.mock('./api', () => ({
  getUser: jest.fn().mockImplementation((id) => {
    return Promise.resolve({ id, name: 'User ' + id });
  })
}));
```

### Vitest Mocking

```javascript
// Mock function
import { vi } from 'vitest';
const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async');

// Mock module
vi.mock('./api', () => ({
  getUser: vi.fn(() => Promise.resolve({ id: 1 }))
}));
```

### Pytest Mocking

```python
# Mock using unittest.mock
from unittest.mock import Mock, patch

# Create mock
mock_api = Mock()
mock_api.get_user.return_value = {'id': 1, 'name': 'John'}

# Patch
with patch('app.api.get_user') as mock:
    mock.return_value = {'id': 1}
    result = get_user(1)
```

## Best Practices

- **Prefer fakes over mocks** เมื่อ possible
- **Keep mocks simple** อย่า mock logic ที่ซับซ้อน
- **Verify behavior, not implementation** ทดสอบผลลัพธ์ไม่ใช่วิธีทำ
- **Use real dependencies when possible** สำหรับ integration tests
- **Clean up mocks** ใน afterEach/afterEach
