# Test Maintainability

## Overview

Test maintainability หมายถึง tests ต้องง่ายต่อการอ่าน, เขียน, และแก้ไข เมื่อ code เปลี่ยน

## Characteristics of Maintainable Tests

- **Readable**: Test names และ assertions บอกเรื่องที่ทดสอบ
- **Independent**: แต่ละ test ไม่ depend กับ test อื่น
- **Fast**: รันเร็วเพื่อ feedback ทันที
- **Reliable**: ไม่ flaky ไม่ fail โดยไม่ชัดเจน
- **Focused**: แต่ละ test ทดสอบอย่างเดียว

## Anti-Patterns

### 1. Implementation Coupling

```javascript
// BAD - Tests implementation details
test('calls api with correct parameters', () => {
  const spy = vi.spyOn(api, 'getUser');
  service.getUser(1);
  expect(spy).toHaveBeenCalledWith(1, { timeout: 5000 }); // Coupled to timeout
});

// GOOD - Tests behavior
test('returns user data', async () => {
  const user = await service.getUser(1);
  expect(user.id).toBe(1);
  expect(user.name).toBeDefined();
});
```

### 2. Fragile Selectors

```javascript
// BAD - Fragile DOM selectors
test('submits form', () => {
  render(<Form />);
  fireEvent.click(document.querySelector('.btn-primary')); // Brittle
});

// GOOD - Accessible selectors
test('submits form', () => {
  render(<Form />);
  fireEvent.click(screen.getByRole('button', { name: 'Submit' })); // Robust
});
```

### 3. Magic Numbers

```javascript
// BAD - Magic numbers
test('calculates discount', () => {
  expect(calculateDiscount(100)).toBe(10); // Why 10?
});

// GOOD - Descriptive values
test('calculates 10% discount', () => {
  expect(calculateDiscount(100, 0.1)).toBe(10);
});
```

### 4. Long Test Methods

```javascript
// BAD - Too many assertions
test('user lifecycle', () => {
  const user = create();
  expect(user.id).toBeDefined();
  user.update({ name: 'Jane' });
  expect(user.name).toBe('Jane');
  user.delete();
  expect(User.findById(user.id)).toBeNull();
});

// GOOD - Split into focused tests
test('creates user with id', () => {
  const user = create();
  expect(user.id).toBeDefined();
});

test('updates user name', () => {
  const user = create();
  user.update({ name: 'Jane' });
  expect(user.name).toBe('Jane');
});

test('deletes user', () => {
  const user = create();
  user.delete();
  expect(User.findById(user.id)).toBeNull();
});
```

## Best Practices

### 1. Descriptive Test Names

```javascript
// BAD
test('user 1', () => {});

// GOOD
test('should create user with valid data', () => {});
test('should throw error when email is invalid', () => {});
```

### 2. AAA Pattern

```javascript
test('calculates total with tax', () => {
  // Arrange
  const price = 100;
  const taxRate = 0.1;
  
  // Act
  const total = calculateTotal(price, taxRate);
  
  // Assert
  expect(total).toBe(110);
});
```

### 3. Use Test Helpers

```javascript
// Helper function
const createTestUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides
});

test('updates user email', () => {
  const user = createTestUser();
  user.email = 'jane@example.com';
  expect(user.email).toBe('jane@example.com');
});
```

### 4. Page Object Pattern (E2E)

```javascript
// Page object
class LoginPage {
  constructor(page) {
    this.page = page;
  }
  
  async login(email, password) {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('#login');
  }
}

// Test
test('user can login', async () => {
  const loginPage = new LoginPage(page);
  await loginPage.login('john@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### 5. Shared Fixtures

```python
# conftest.py
@pytest.fixture
def authenticated_client():
    client = app.test_client()
    with client.session_transaction() as sess:
        sess['user_id'] = 1
    return client

# Test
def test_access_protected_route(authenticated_client):
    response = authenticated_client.get('/dashboard')
    assert response.status_code == 200
```

## Refactoring Tests

### When to Refactor

- Test names ไม่ชัดเจน
- Code duplication ใน tests
- Tests ยาวเกินไป
- Tests ซับซ้อนเกินไป
- Tests ช้า

### Refactoring Steps

1. **Identify patterns** หา code ที่ซ้ำกัน
2. **Extract helpers** สร้าง helper functions
3. **Simplify assertions** ใช้ custom matchers
4. **Organize structure** จัดกลุ่ม tests
5. **Verify behavior** ทดสอบว่ายังทำงานเหมือนเดิม

## Measurement

```javascript
// Use eslint-plugin-jest for test quality
bun install --save-dev eslint-plugin-jest

// Use jest-extended for better matchers
bun install --save-dev jest-extended
```
