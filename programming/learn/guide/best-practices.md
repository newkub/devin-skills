# Best Practices

## Purpose

แนวทางปฏิบัติที่ดีที่สุดสำหรับการเขียนโค้ดที่อ่านง่าย ดูแลรักษาได้ และทำงานได้ดี

## Scope

- Code Style
- Naming Conventions
- Error Handling
- Testing
- Performance

## Code Style

### Formatting

| Practice | Recommendation |
|----------|----------------|
| **Indentation** | 2 spaces (or 4 per team) |
| **Semicolons** | Use semicolons |
| **Quotes** | Single quotes for strings |
| **Braces** | Same line for function/class |
| **Trailing comma** | Use in multiline |

### Bad vs Good

```typescript
// ❌ Bad
const fn=(a,b)=>{return a+b;}

// ✅ Good
const add = (a: number, b: number): number => {
  return a + b;
};
```

## Naming Conventions

### Variables & Functions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_URL` |
| Functions | camelCase, verb prefix | `getUser()`, `fetchData()` |
| Classes | PascalCase | `UserService`, `ApiClient` |
| Interfaces | PascalCase, I prefix (optional) | `User`, `IUserConfig` |
| Types | PascalCase | `UserRole`, `ApiResponse` |

### Naming Guidelines

```typescript
// ❌ Bad
const x = getUserData(uId);

// ✅ Good
const userId = getUserData(userId);

// ❌ Bad
function process() {}

// ✅ Good
function processUserData() {}

// ❌ Bad
const data = fetchDataFromApi();

// ✅ Good
const userData = fetchUserData();
```

## Functions

### Best Practices

| Practice | Description |
|----------|-------------|
| **Single responsibility** | Function ทำอย่างเดียว |
| **Small functions** | ยิ่งเล็กยิ่งดี (< 20 lines) |
| **Pure functions** | ไม่มี side effects |
| **Descriptive names** | ชื่อบอกว่าทำอะไร |
| **Avoid boolean parameters** | ใช้ function แยก |

```typescript
// ❌ Bad - too many responsibilities
function processUser(user: User) {
  validate(user);
  saveToDatabase(user);
  sendEmail(user);
  logActivity(user);
}

// ✅ Good - single responsibility
function validateUser(user: User): void {
  // validation logic
}

function saveUser(user: User): void {
  // save logic
}

function notifyUser(user: User): void {
  // notification logic
}
```

## Error Handling

### Use Specific Error Types

```typescript
// ❌ Bad
try {
  // code
} catch (e) {
  console.log(e);
}

// ✅ Good
try {
  // code
} catch (error) {
  if (error instanceof ValidationError) {
    // handle validation
  } else if (error instanceof NetworkError) {
    // handle network
  } else {
    throw error; // re-throw unknown errors
  }
}
```

### Async Error Handling

```typescript
// ✅ Use try-catch with async/await
async function fetchUser(id: string) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', { id, error });
    throw new UserFetchError(id, error);
  }
}
```

## Testing

### Test Structure

```typescript
describe('UserService', () => {
  describe('getUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const mockUser = { id: '1', name: 'John' };
      jest.spyOn(api, 'get').mockResolvedValue(mockUser);

      // Act
      const user = await userService.getUser('1');

      // Assert
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundError when user not found', async () => {
      // ...
    });
  });
});
```

### Test Naming

| Pattern | Example |
|---------|---------|
| Unit test | `should return user when found` |
| Integration test | `should create order with valid items` |
| E2E test | `should allow user to complete checkout` |

## Performance

### Do's

| Practice | Description |
|----------|-------------|
| **Avoid mutations** | ใช้ immutable data |
| **Memoize expensive ops** | cache results |
| **Lazy load** | load when needed |
| **Batch operations** | combine writes |
| **Use appropriate data structures** | Map for lookups |

### Don'ts

| Practice | Description |
|----------|-------------|
| **Deep cloning** | expensive memory usage |
| **Unnecessary re-renders** | memoize components |
| **Blocking operations** | use async |
| **Memory leaks** | clean up subscriptions |

## Documentation

### Code Comments

```typescript
// ❌ Bad - redundant comment
// increment counter
counter++;

// ✅ Good - explain WHY, not WHAT
// Retry needed for eventual consistency
await retry(fetchUser(id), 3);
```

### JSDoc

```typescript
/**
 * Calculates the sum of two numbers.
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
function add(a: number, b: number): number {
  return a + b;
}
```

## Summary Checklist

- [ ] Follow consistent naming
- [ ] Write small, focused functions
- [ ] Handle errors properly
- [ ] Write tests
- [ ] Document complex logic
- [ ] Optimize when needed

## Next Steps

| File | Description |
|------|-------------|
| [integration.md](integration.md) | Integration with tools |
| [features.md](features.md) | Language features |