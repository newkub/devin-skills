# Best Practices - TypeScript

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName` |
| Functions | camelCase | `getUser()` |
| Interfaces | PascalCase | `UserAccount` |
| Type Aliases | PascalCase | `UserResponse` |
| Enums | PascalCase | `Status::Active` |
| Constants | SCREAMING_SNAKE | `MAX_SIZE` |
| Files | kebab-case | `user-service.ts` |

## Type Safety

### Prefer Explicit Over Implicit

```typescript
// Bad
function process(data: any) {
  return data.value;
}

// Good
interface Data {
  value: string;
}

function process(data: Data): string {
  return data.value;
}
```

### Use Union Types for Multiple Options

```typescript
// Bad
function setStatus(status: string | number) {}

// Good
type Status = "pending" | "active" | "inactive";

function setStatus(status: Status) {}
```

### Avoid `any`, Use `unknown`

```typescript
// Bad
function parse(value: any): string {
  return value.data;
}

// Good
function parse(value: unknown): string {
  if (typeof value === "object" && value !== null && "data" in value) {
    return (value as { data: string }).data;
  }
  throw new Error("Invalid input");
}
```

## Interfaces vs Types

### Use Interface for Object Shapes

```typescript
// Prefer interface for public APIs
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Use Type for Complex Combinations

```typescript
// Use type for unions, intersections, mapped types
type UserId = string | number;
type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
```

## Generics

### Use Meaningful Type Parameters

```typescript
// Bad
function get<T>(items: T[]): T {}

// Good
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}
```

### Constrain Generics

```typescript
// Add constraints to limit acceptable types
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Error Handling

```typescript
// Use Result pattern
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function tryParse(input: string): Result<number> {
  const num = parseInt(input, 10);
  return isNaN(num)
    ? { ok: false, error: new Error("Invalid number") }
    : { ok: true, value: num };
}
```

## Testing

```typescript
// Example test file
describe("User", () => {
  interface User {
    name: string;
    age: number;
  }

  it("should create user with valid data", () => {
    const user: User = { name: "Alice", age: 30 };
    expect(user.name).toBe("Alice");
  });
});
```

## Performance Considerations

```typescript
// Predefine object types
const user = {
  name: "Alice",
  age: 30,
} as const;  // Readonly tuple

// Avoid deeply nested generics
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};
```