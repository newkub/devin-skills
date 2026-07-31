# Generics

## Overview

Generics ช่วยให้เขียน reusable, type-safe code ที่ทำงานกับหลาย types โดยไม่ต้อง duplicate code

## Basic Syntax

```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

const str = identity<string>("hello");
const num = identity(42); // Type inference
```

## Generic Constraints

### Using `extends`

```typescript
// Constraint to specific type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // string
const age = getProperty(user, "age");    // number
```

### Multiple Constraints

```typescript
interface HasId {
  id: string;
}

interface HasName {
  name: string;
}

function processEntity<T extends HasId & HasName>(entity: T): void {
  console.log(entity.id, entity.name);
}
```

## Generic Interfaces

```typescript
interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // implementation
  }
  // ... other methods
}
```

## Generic Classes

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
```

## Generic Unions

```typescript
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: string }
  | { status: "loading" };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case "success":
      return response.data;
    case "error":
      throw new Error(response.error);
    case "loading":
      return null;
  }
}
```

## Default Type Parameters

```typescript
interface Result<T, E = Error> {
  ok: boolean;
  data?: T;
  error?: E;
}

type OkResult<T> = Result<T, never>;
type ErrResult<E> = Result<never, E>;
```

## keyof and typeof

```typescript
// keyof - get keys of type
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// typeof - create type from value
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

type Config = typeof config;
// { apiUrl: string; timeout: number }

// Utility: readonly
type ReadonlyConfig = Readonly<typeof config>;
```

## Mapped Types with Generics

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## Conditional Types with Generics

```typescript
// Extract element type from array
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringElement = ArrayElement<string[]>; // string
type NumberElement = ArrayElement<number[]>; // number

// Unwrap promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type StringFromPromise = UnwrapPromise<Promise<string>>; // string
```

## Real-world Examples

### API Client

```typescript
class ApiClient<T> {
  constructor(private baseUrl: string) {}

  async get<R = T>(endpoint: string): Promise<R> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post<R = T>(endpoint: string, data: Partial<T>): Promise<R> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  }
}

interface User {
  id: string;
  name: string;
  email: string;
}

const userApi = new ApiClient<User>("/api/users");
const user = await userApi.get("/123");
```

### Form State

```typescript
type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
};

function createFormState<T>(initialValues: T): FormState<T> {
  return {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isDirty: false,
  };
}

interface LoginForm {
  email: string;
  password: string;
}

const loginState = createFormState<LoginForm>({
  email: "",
  password: "",
});
```

## Best Practices

1. **Use constraints** - Narrow generic types when needed
2. **Name meaningfully** - Use `T`, `K`, `V` for simple cases; descriptive names for complex
3. **Leverage inference** - Let TypeScript infer types when possible
4. **Combine with utility types** - Use mapped/conditional types for transformations
5. **Default types** - Provide defaults for optional type parameters