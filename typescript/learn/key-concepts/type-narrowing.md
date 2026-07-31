# Type Narrowing

## Overview

Type narrowing คือกระบวนการที่ TypeScript ลดความ uncertain ของ type ใน conditional blocks เพื่อให้เข้าถึง properties/methods ได้ถูกต้อง

## Common Narrowing Techniques

### 1. typeof

```typescript
function formatValue(value: string | number | boolean) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  }
  if (typeof value === "number") {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
  // TypeScript knows value is boolean here
  return value ? "yes" : "no";
}
```

### 2. instanceof

```typescript
class User {
  constructor(public name: string) {}
}

class Admin extends User {
  constructor(name: string, public permissions: string[]) {
    super(name);
  }
}

function greet(entity: User | Admin) {
  if (entity instanceof Admin) {
    // entity is Admin here
    console.log(`Admin ${entity.name} with permissions: ${entity.permissions}`);
  } else {
    // entity is User here
    console.log(`User ${entity.name}`);
  }
}
```

### 3. in operator

```typescript
interface Car {
  drive(): void;
  brand: string;
}

interface Boat {
  sail(): void;
  material: string;
}

function operate(vehicle: Car | Boat) {
  if ("drive" in vehicle) {
    // vehicle is Car
    vehicle.drive();
  } else {
    // vehicle is Boat
    vehicle.sail();
  }
}
```

### 4. Literal Types

```typescript
type ApiStatus = "idle" | "loading" | "success" | "error";

function handleStatus(status: ApiStatus) {
  if (status === "success") {
    // status is "success" literal
    console.log("Request succeeded");
  } else if (status === "loading") {
    // status is "loading" literal
    console.log("Loading...");
  }
}
```

### 5. Discriminated Unions

```typescript
interface SuccessResponse {
  kind: "success";
  data: User;
  timestamp: Date;
}

interface ErrorResponse {
  kind: "error";
  code: number;
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  switch (response.kind) {
    case "success":
      // response is SuccessResponse
      console.log(response.data.name);
      break;
    case "error":
      // response is ErrorResponse
      console.error(response.message);
      break;
  }
}
```

### 6. Type Guards

```typescript
// Custom type guard function
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  }
}

// Guard with predicates
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}
```

### 7. Assertion Functions

```typescript
// Type predicate
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new Error("Not a string!");
  }
}

function process(val: unknown) {
  assertIsString(val);
  // val is string here
  console.log(val.toUpperCase());
}
```

## Nullish Checks

### Optional Chaining

```typescript
interface User {
  address?: {
    street: string;
    city: string;
  };
}

function getCity(user: User): string {
  // Use optional chaining
  return user.address?.city ?? "Unknown";
}
```

### Nullish Coalescing

```typescript
function process(value: string | null): string {
  // Nullish coalescing
  return value ?? "default";
}
```

### Definite Assignment

```typescript
class UserService {
  private _cache!: Map<string, User>; // Definite assignment assertion

  constructor() {
    this._cache = new Map();
  }
}
```

## Control Flow Analysis

### Early Returns

```typescript
function process(input: string | null): string {
  // Early return narrows type
  if (input === null) {
    return "null";
  }
  // input is string here
  return input.toUpperCase();
}
```

### Exhaustive Checks

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default:
      // Exhaustiveness check
      const _exhaustive: never = shape;
      throw new Error("Unknown shape");
  }
}
```

## Narrowing with `never`

```typescript
// Exhaustive pattern
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// Using with discriminated union
type Event =
  | { type: "click"; x: number }
  | { type: "key"; key: string };

function handle(event: Event) {
  switch (event.type) {
    case "click":
      console.log(event.x);
      break;
    case "key":
      console.log(event.key);
      break;
    default:
      assertNever(event);
  }
}
```

## Common Pitfalls

### Object Literals

```typescript
// ❌ Narrowing doesn't work with object literals
function check(obj: { x: number } | { y: number }) {
  if ("x" in obj) {
    // obj might still have y
    console.log(obj.x); // Safe
  }
}
```

### Function Returns

```typescript
// ❌ Functions can return different types
function guess(): string | number {
  return Math.random() > 0.5 ? "hello" : 42;
}

// Type narrowing doesn't work on return value
const result = guess();
// result is still string | number
```

### Async/Never

```typescript
// ❌ async functions always return Promise
async function getValue(): string | null {
  // return narrows to Promise<string | null>
  return null;
}

const result = await getValue(); // string | null
```

## Best Practices

1. **Use discriminated unions** for complex state
2. **Write custom type guards** for complex checks
3. **Prefer narrowing over type assertions**
4. **Use `never` for exhaustive checks**
5. **Combine with optional chaining** for nested properties