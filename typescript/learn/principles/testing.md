# Testing Rules

## Rationale

Testing ช่วย ensure code correctness, prevent regressions, และ improve code design

## Bad Practice

```typescript
// ❌ Testing implementation details
test("should call _validateUser method", () => {
  const service = new UserService();
  jest.spyOn(service as any, "_validateUser");
  service.createUser(data);
  expect(service._validateUser).toHaveBeenCalled();
});

// ❌ No assertions
test("creates user", () => {
  const user = createUser({ name: "John" });
  // ❌ No expect
});

// ❌ Test multiple things
test("user operations", () => {
  const user = createUser({ name: "John" });
  const updated = updateUser(user.id, { name: "Jane" });
  const deleted = deleteUser(user.id);
  // ❌ Multiple assertions, unclear intent
});

// ❌ No isolation
test("user service", () => {
  const service = new UserService();
  service.createUser(testData1);
  service.createUser(testData2); // ❌ Depends on first test
});
```

## Good Practice

```typescript
// ✅ Test behavior, not implementation
describe("UserService", () => {
  describe("createUser", () => {
    it("should create a user with valid data", async () => {
      const result = await userService.createUser(validUserData);
      expect(result).toMatchObject({
        id: expect.any(String),
        name: validUserData.name,
        email: validUserData.email,
      });
    });

    it("should throw ValidationError for invalid email", async () => {
      await expect(
        userService.createUser({ ...validUserData, email: "invalid" })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ConflictError if email exists", async () => {
      await userService.createUser(validUserData);
      await expect(
        userService.createUser(validUserData)
      ).rejects.toThrow(ConflictError);
    });
  });
});
```

## Rules

### 1. Name Tests Clearly

```typescript
// ✅ Descriptive test names
describe("UserService.createUser", () => {
  it("should create user with hashed password", async () => {
    // ...
  });

  it("should not expose password in response", async () => {
    // ...
  });
});

// ❌ Unclear names
test("create user", async () => { ... });
test("test", async () => { ... });
```

### 2. Use Arrange-Act-Assert Pattern

```typescript
// ✅ AAA pattern
describe("OrderService.totalPrice", () => {
  it("should calculate correct total with discount", () => {
    // Arrange
    const order = createOrder({ items: [...], discount: 0.1 });
    const calculator = new PriceCalculator();

    // Act
    const total = calculator.calculate(order);

    // Assert
    expect(total).toBe(90);
  });
});
```

### 3. Mock External Dependencies

```typescript
// ✅ Mock database, API calls
describe("UserService", () => {
  let userRepo: jest.Mocked<UserRepository>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(() => {
    userRepo = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    mailService = {
      sendWelcome: jest.fn(),
    };
  });

  it("should send welcome email after creating user", async () => {
    // Arrange
    const service = new UserService(userRepo, mailService);

    // Act
    await service.createUser(testUser);

    // Assert
    expect(mailService.sendWelcome).toHaveBeenCalledWith(testUser.email);
  });
});
```

### 4. Test Happy Path and Edge Cases

```typescript
describe("validateEmail", () => {
  it("should accept valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  it("should reject email without @", () => {
    expect(validateEmail("userexample.com")).toBe(false);
  });

  it("should reject email without domain", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(validateEmail("")).toBe(false);
  });
});
```

### 5. Use Test Data Builders

```typescript
// ✅ Test data builder
class UserBuilder {
  private name = "Test User";
  private email = "test@example.com";
  private role = "user";

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withRole(role: string): this {
    this.role = role;
    return this;
  }

  build(): CreateUserDto {
    return {
      name: this.name,
      email: this.email,
      role: this.role as UserRole,
    };
  }
}

// Usage
const admin = new UserBuilder().withRole("admin").build();
const guest = new UserBuilder().withName("Guest").build();
```

### 6. Group Tests with describe

```typescript
// ✅ Logical grouping
describe("Calculator", () => {
  describe("add", () => {
    it("should add two positive numbers", () => { ... });
    it("should handle negative numbers", () => { ... });
  });

  describe("divide", () => {
    it("should divide correctly", () => { ... });
    it("should throw when dividing by zero", () => { ... });
  });
});
```

## Testing Utilities

### Helper Functions

```typescript
// test/helpers.ts
export function createMock<T>(overrides?: Partial<T>): jest.Mocked<T> {
  return {
    ...jest.fn(),
    ...overrides,
  } as jest.Mocked<T>;
}

export async function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Shared Fixtures

```typescript
// test/fixtures.ts
export const testUsers = {
  valid: {
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123!",
  },
  admin: {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
};
```

## Coverage Guidelines

- **Unit tests**: Focus on business logic, utilities
- **Integration tests**: API endpoints, database operations
- **Target**: 80% code coverage for critical paths
- **Never sacrifice test quality for coverage**

## References

- [Testing Library](https://testing-library.com/docs/queries/by-testid/)
- [Jest Best Practices](https://jestjs.io/docs/setup-teardown)
- [Vitest Guide](https://vitest.dev/guide/)