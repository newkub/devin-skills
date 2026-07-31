# Test Pyramid Principle

## Overview

Test Pyramid เป็น principle ที่แนะนำให้มี unit tests จำนวนมาก, integration tests ปานกลาง, และ E2E tests น้อย

## Why Pyramid Matters

- **Cost**: Unit tests ถูกกว่า E2E tests
- **Speed**: Unit tests เร็วกว่ามาก
- **Reliability**: Unit tests น้อย flaky กว่า
- **Maintenance**: Unit tests ง่ายต่อการ debug

## Ideal Ratio

```
         ┌─────────────┐
         │     E2E     │  10% - Few, slow, expensive
         │   ┌─────┐    │
         │   │ Int │    │  30% - Some, moderate
         │   │┌───┐│    │
         │   ││Uni││    │  60% - Many, fast, cheap
         │   │└───┘│    │
         │   └─────┘    │
         └─────────────┘
```

## When to Use Each Level

### Unit Tests (60%)

**Use when:**
- Testing business logic
- Testing pure functions
- Testing algorithms
- Testing validation rules

**Example:**
```javascript
test('calculateTotal with discount', () => {
  const total = calculateTotal(100, 0.1);
  expect(total).toBe(90);
});
```

### Integration Tests (30%)

**Use when:**
- Testing component interactions
- Testing database operations
- Testing API endpoints
- Testing external service integration

**Example:**
```javascript
test('user creation saves to database', async () => {
  const user = await UserService.create({ name: 'John' });
  const found = await UserRepository.findById(user.id);
  expect(found.name).toBe('John');
});
```

### E2E Tests (10%)

**Use when:**
- Testing critical user flows
- Testing cross-system integration
- Testing UI interactions
- Testing deployment

**Example:**
```javascript
test('user can login and view dashboard', async () => {
  await page.goto('/login');
  await page.fill('#email', 'john@example.com');
  await page.fill('#password', 'password');
  await page.click('#login');
  await expect(page).toHaveURL('/dashboard');
});
```

## Common Anti-Patterns

### Ice Cream Cone

```
         ┌─────────────┐
         │     E2E     │  Too many E2E tests
         │  ┌────────┐  │
         │  │  Int   │  │
         │  │┌─────┐ │  │
         │  ││ Uni │ │  │  Too few unit tests
         │  │└─────┘ │  │
         │  └────────┘  │
         └─────────────┘
```

**Problems:**
- Slow test suite
- Flaky tests
- Expensive to maintain
- Hard to debug

### Hourglass

```
         ┌─────────────┐
         │     E2E     │  Many E2E tests
         │   ┌─────┐    │
         │   │     │    │  No integration tests
         │   │┌───┐│    │
         │   ││Uni││    │  Many unit tests
         │   │└───┘│    │
         │   └─────┘    │
         └─────────────┘
```

**Problems:**
- Integration gaps
- False confidence
- Integration bugs found late

## Best Practices

- **Start with unit tests** สำหรับ business logic
- **Add integration tests** สำหรับ critical paths
- **Limit E2E tests** สำหรับ happy paths และ critical flows
- **Measure coverage** แต่อย่า target 100%
- **Review pyramid** เป็นระยะ
