# Best Practices

## Purpose

แนวทางปฏิบัติที่ดีที่สุดสำหรับการใช้ ArkType

## Scope

- Schema organization
- Error handling patterns
- Testing strategies
- Performance optimization
- Type design

## Schema Organization

### Group Related Types

```typescript
// types/user.ts
export const user = type({
  id: "string",
  name: "string",
  email: "string",
  "createdAt?": "date",
}).named("User");

export const createUser = type({
  name: "string.min(2)",
  email: "string.email()",
  password: "string.min(8)",
});

// Type exports
export type User = typeof user.t;
export type CreateUser = typeof createUser.t;
```

### Use Scopes for Large Projects

```typescript
// types/scope.ts
import { type } from "arktype";

export const types = type.scope({
  types: {
    user: {
      id: "string",
      name: "string",
      email: "string",
    },
    post: {
      id: "string",
      title: "string",
      "author?": "user",
    },
  },
});

// types/user.ts
import { types } from "./scope";

export const User = types("user");
export const Post = types("post");
```

## Error Handling Patterns

### Always Check for Errors

```typescript
const result = User.parse(data);

if (result instanceof type.errors) {
  // Handle error
  return res.status(400).json({
    errors: result.map(e => ({
      path: e.path,
      message: e.message,
    })),
  });
}

// Safe to use result
const user = result;
```

### Structured Error Responses

```typescript
function validateRequest<T>(
  data: unknown,
  schema: type<T>
): { success: true; data: T } | { success: false; errors: Error[] } {
  const result = schema(data);
  
  if (result instanceof type.errors) {
    return {
      success: false,
      errors: result.map(e => ({
        path: e.path,
        message: e.message,
      })),
    };
  }
  
  return { success: true, data: result };
}
```

## Testing Strategies

### Unit Tests for Schemas

```typescript
import { type } from "arktype";
import { describe, it, expect } from "vitest";

const User = type({
  name: "string",
  email: "string",
});

describe("User validation", () => {
  it("should accept valid data", () => {
    const result = User({ name: "John", email: "john@example.com" });
    expect(result instanceof type.errors).toBe(false);
  });
  
  it("should reject invalid email", () => {
    const result = User({ name: "John", email: "not-an-email" });
    expect(result instanceof type.errors).toBe(true);
  });
});
```

## Performance Optimization

### Reuse Schemas

```typescript
// Good: Schema created once
const UserSchema = type({
  name: "string",
  email: "string",
});

// Bad: Schema recreated each call
function validateUser(data: unknown) {
  return type({ name: "string", email: "string" })(data);
}
```

### Use Simple Types When Possible

```typescript
// Good: Direct string type
const Name = type("string");

// Less efficient: Object with single field
const Name2 = type({ value: "string" });
```

## Type Design

### Keep Types Small and Focused

```typescript
// Good: Focused types
const Address = type({
  street: "string",
  city: "string",
  country: "string",
});

const User = type({
  name: "string",
  "address?": Address,
});

// Overly complex type
const GiantSchema = type({
  // ... 50+ fields
});
```

### Use Unions for State

```typescript
// Good: Clear state types
const Order = type({
  status: "'pending' | 'processing' | 'completed' | 'cancelled'",
  "error?": "string",
});

// Better: Discriminated unions
const Order = type({
  status: "'success'",
  data: { orderId: "string" },
} | {
  status: "'error'",
  error: { message: "string" },
});
```

## Next Steps

- Explore [Integration](./integration.md)
- Read [Architecture](./architecture.md)
- Check [API Reference](../references/api.md)