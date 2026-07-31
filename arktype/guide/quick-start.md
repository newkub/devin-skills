# Quick Start

## Purpose

คู่มือเริ่มต้นใช้งาน ArkType อย่างรวดเร็ว

## Scope

- Basic type creation
- Parsing data
- Error handling
- Type inference
- Common patterns

## Step 1: Install ArkType

```bash
bun add arktype
```

## Step 2: Create Type

```typescript
import { type } from "arktype";

// Define a type
const User = type({
  name: "string",
  email: "string",
  "age?": "number",
});
```

## Step 3: Parse Data

### Using result check (Recommended)

```typescript
const result = User({
  name: "John",
  email: "john@example.com",
});

if (result instanceof type.errors) {
  console.log(result.summary);
} else {
  console.log(result);
  // => { name: "John", email: "john@example.com" }
}
```

### Using assert (Throws on Error)

```typescript
try {
  const user = User.assert({
    name: "John",
    email: "john@example.com",
  });
  console.log(user);
} catch (error) {
  console.log(error);
}
```

## Step 4: Get TypeScript Type

```typescript
type User = typeof User.t;

// User = {
//   name: string;
//   email: string;
//   age?: number;
// }
```

## Step 5: More Complex Types

```typescript
// With literals
const Status = type({
  status: "'active' | 'inactive' | 'pending'",
});

// With unions
const Response = type({
  data: "string | number | null",
  success: "boolean",
});

// With arrays
const Users = type({
  users: "User[]",  // Reference another type
});
```

## Next Steps

- Learn about [Key Concepts](../key-concepts/overview.md)
- Explore [Features](./features.md)
- Read about [Integration](./integration.md)