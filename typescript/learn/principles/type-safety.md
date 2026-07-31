# Type Safety Rules

## Rationale

Type safety ช่วย catch errors ใน compile time, reduce runtime errors, และ improve code quality

## Bad Practice

```typescript
// ❌ Using any type
function processData(data: any) {
  return data.value; // ❌ No type checking
}

// ❌ Implicit any
function calculate(a, b) { // ❌ No types
  return a + b;
}

// ❌ Unsafe casting
const value: unknown = "hello";
const str: number = value as number; // ❌ Wrong casting
```

## Good Practice

```typescript
// ✅ Use specific types
function processData(data: UserData) {
  return data.value; // ✅ Type-safe
}

// ✅ Explicit types
function calculate(a: number, b: number): number {
  return a + b;
}

// ✅ Safe type guards
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function getLength(value: unknown): number {
  if (isString(value)) {
    return value.length; // ✅ Type narrowed
  }
  return 0;
}
```

## Rules

### 1. Avoid `any`

```typescript
// ❌
function fetchData(): any {
  return fetch("/api").then(r => r.json());
}

// ✅
async function fetchData(): Promise<Response> {
  const response = await fetch("/api");
  return response.json() as Promise<User[]>;
}

// ✅ Or use unknown
async function fetchData(): Promise<unknown> {
  return fetch("/api").then(r => r.json());
}
```

### 2. Use Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 3. Prefer Union Types over Enums

```typescript
// ❌ Enums can cause issues
enum Status {
  Active = "active",
  Inactive = "inactive"
}

// ✅ Union types are more flexible
type Status = "active" | "inactive" | "pending";
```

### 4. Use Discriminated Unions

```typescript
// ✅ Discriminated unions for type narrowing
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data); // ✅ Type narrowed
  } else {
    console.error(result.error);
  }
}
```

### 5. Generic Constraints

```typescript
// ✅ Use constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // ✅ string
```

## References

- [TypeScript Handbook - Type Safety](https://www.typescriptlang.org/docs/handbook/2/types-of-types.html)
- [TypeScript Deep Dive - Type System](https://basarat.gitbook.io/typescript/type-system)