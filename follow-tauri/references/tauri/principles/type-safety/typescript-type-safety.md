# TypeScript Type Safety

## 1. Interface Definitions

```typescript
interface User {
  id: number
  name: string
  email: string
  age?: number // Optional
}

function processUser(user: User): string {
  return `User: ${user.name}`
}
```

## 2. Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase())
  }
}
```

## 3. Union Types

```typescript
type Result =
  | { success: true; data: Data }
  | { success: false; error: string }

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data)
  } else {
    console.error(result.error)
  }
}
```

## 4. Generic Types

```typescript
interface Repository<T> {
  find(id: number): Promise<T | null>
  save(item: T): Promise<void>
}

class UserRepository implements Repository<User> {
  async find(id: number): Promise<User | null> {
    // Implementation
  }

  async save(user: User): Promise<void> {
    // Implementation
  }
}
```
