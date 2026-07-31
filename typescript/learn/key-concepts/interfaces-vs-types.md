# Interfaces vs Types

## Overview

TypeScript มีสองวิธีในการกำหนด type shapes: `interface` และ `type aliases` แต่ละอันมีข้อดีข้อเสียต่างกัน

## Basic Differences

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Declaration merging | ✅ Yes | ❌ No |
| Extends/implements | ✅ Yes | ✅ With `&` |
| Computed properties | ❌ No | ✅ Yes |
| Tuple types | ❌ No | ✅ Yes |
| Union types | ❌ No | ✅ Yes |

## When to Use Interface

### Object Shapes

```typescript
// ✅ Best for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Extending interfaces
interface Admin extends User {
  permissions: string[];
  role: "admin";
}

// Declaration merging (important for libraries)
interface Window {
  myCustomProperty: string;
}

// Use for classes
class UserService implements User {
  // must have all User properties
}
```

### Library/Module Types

```typescript
// Declaration merging allows adding to existing types
interface Array<T> {
  shuffle(): T[];
}

// Extend third-party types
interface Response {
  // existing properties
}

interface Response {
  customField: string;
}
```

## When to Use Type

### Union/Intersection Types

```typescript
// ✅ Union types
type Status = "pending" | "active" | "inactive";
type StringOrNumber = string | number;

// Intersection types
type ReadonlyUser = User & { isReadonly: true };

// Complex unions
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

### Utility Types

```typescript
// Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Template literal types
type EventName = `on${Capitalize<string>}`;
type ButtonEvent = OnClick | OnHover | OnFocus;
```

### Tuple Types

```typescript
// ✅ Tuples require type
type Coordinate = [number, number];
type RGB = [red: number, green: number, blue: number];
type Result<T, E> = [value: T, error: E | null];
```

### Computed/Template Types

```typescript
// Computed property names
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Key remapping
type RemapKeys<T> = {
  [K in keyof T as `${string & K}Prop`]: T[K];
};
```

### Primitive Aliases

```typescript
// Simple aliases
type ID = string;
type Email = string;
type UserId = string;

// Branded types for type safety
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function getUser(id: UserId) { ... }
function getOrder(id: OrderId) { ... }
```

## Practical Guidelines

### Start with Interface

```typescript
// For object shapes, start with interface
interface User {
  name: string;
  email: string;
}
```

### Switch to Type When Needed

```typescript
// Need union?
type Status = "active" | "inactive";

// Need intersection?
type Admin = User & { permissions: string[] };

// Need computed?
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

### Avoid Mixing

```typescript
// ❌ Don't mix extends and &
interface Animal {
  name: string;
}
type Bear = Animal & { honey: boolean };

// ✅ Pick one approach
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}
```

## Common Patterns

### Interface with Generic

```typescript
interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
}

// Works well with classes
class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // ...
  }
  async save(entity: User): Promise<User> {
    // ...
  }
}
```

### Type with Union

```typescript
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keydown"; key: string }
  | { type: "scroll"; deltaY: number };
```

### Hybrid Pattern

```typescript
// Interface for shape
interface User {
  id: string;
  name: string;
}

// Type for computed/extended
type PartialUser = Partial<User> & { isNew: boolean };

// Or with union
type UserPreview = Pick<User, "id" | "name">;
```

## Best Practices

1. **Use Interface** for object shapes that might be extended
2. **Use Type** for unions, intersections, utility types
3. **Be consistent** - Pick one style per project
4. **Use type for primitives** - `type UserId = string`
5. **Use interface for classes** - `class Service implements Repository`

## Summary Decision Tree

```
Is it an object shape?
├── YES → Use interface
└── NO → Is it a union/intersection?
    ├── YES → Use type
    └── NO → Is it a tuple?
        ├── YES → Use type
        └── NO → Use interface
```