# Fixtures

## Overview

Fixtures เป็น setup code ที่ใช้เตรียม environment, data, หรือ dependencies สำหรับการทดสอบ ช่วยลด code duplication และทำให้ tests อ่านง่ายขึ้น

## Types of Fixtures

### Setup/Teardown

```javascript
// Before each test
beforeEach(() => {
  // Setup
  database = new TestDatabase();
  database.seed();
});

afterEach(() => {
  // Cleanup
  database.cleanup();
});
```

### Parameterized Fixtures

```python
# Pytest fixture with parameters
@pytest.fixture(params=['sqlite', 'postgres'])
def database(request):
    if request.param == 'sqlite':
        return SQLiteDatabase()
    return PostgreSQLDatabase()
```

### Shared Fixtures

```javascript
// Shared fixture file
// fixtures/user.js
export const validUser = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};

export const invalidUser = {
  name: '',
  email: 'invalid',
  age: -1
};
```

## Framework Examples

### Jest Setup

```javascript
// setupTests.js
import '@testing-library/jest-dom';

// Global mocks
global.fetch = jest.fn();

// Custom matchers
expect.extend({
  toBeValidEmail(received) {
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(received);
    return {
      pass,
      message: () => pass ? 'valid email' : 'invalid email'
    };
  }
});
```

### Vitest Setup

```typescript
// setup.ts
import { vi } from 'vitest';

// Global mocks
global.fetch = vi.fn();

// Environment setup
import { cleanup } from '@testing-library/vue';
afterEach(() => {
  cleanup();
});
```

### Pytest Fixtures

```python
# conftest.py
import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def user():
    return User(name='John', email='john@example.com')
```

## Best Practices

- **Keep fixtures focused** แต่ละ fixture ทำหน้าที่เดียว
- **Use descriptive names** ชื่อ fixture บอกหน้าที่
- **Avoid over-engineering** ไม่ต้อง abstract ทุกอย่าง
- **Clean up resources** ใน teardown
- **Use factory functions** สำหรับ dynamic data

## Common Patterns

### Database Fixture

```python
@pytest.fixture
def db_session():
    session = Session()
    try:
        yield session
        session.commit()
    finally:
        session.rollback()
        session.close()
```

### API Client Fixture

```javascript
// fixtures/apiClient.js
export const apiClient = {
  authenticated: () => new ApiClient({ token: 'test-token' }),
  unauthenticated: () => new ApiClient()
};
```

### Test Data Factory

```javascript
// factories/userFactory.js
export const createUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides
});
```
