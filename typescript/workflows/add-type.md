# Add TypeScript Type

## Context

ต้องการเพิ่ม type หรือ interface ใหม่ใน TypeScript project

## Steps

### 1. Analyze Type Requirements

```
[ ] Identify what data structure needed
[ ] Define required properties
[ ] Determine optional vs required fields
[ ] Check for existing similar types
```

### 2. Create Type Definition

```typescript
// types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  createdAt?: Date;
}

// Use discriminated union for states
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### 3. Export from Index

```typescript
// types/index.ts
export * from "./user";
```

### 4. Use Type

```typescript
import { User, AsyncState } from "@/types";

async function fetchUser(id: string): Promise<AsyncState<User>> {
  try {
    const response = await api.get(`/users/${id}`);
    return { status: "success", data: response.data };
  } catch (error) {
    return { status: "error", error };
  }
}
```

## Principles

- **Single Source of Truth**: รวม types ไว้ที่เดียว
- **Descriptive Naming**: ใช้ชื่อที่สื่อความหมาย
- **Leverage Utility Types**: ใช้ `Partial`, `Pick`, `Omit`, `Readonly`
- **Avoid `any`**: ใช้ `unknown` แทนเมื่อไม่ทราบ type

## Related

- [principles/type-safety.md](../principles/type-safety.md)
- [principles/naming-conventions.md](../principles/naming-conventions.md)
