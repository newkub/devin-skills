# Mapped Types & Conditional Types

## Mapped Types

สร้าง types ใหม่จาก existing types อย่าง systematic

### Basic Mapped Types

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### Key Remapping

```typescript
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface Person {
  name: string;
  age: number;
}

type LazyPerson = Getters<Person>;
// { getName: () => string; getAge: () => number }
```

### Filtering with never

```typescript
type PickByValueType<T, ValueType> = {
  [P in keyof T as T[P] extends ValueType ? P : never]: T[P];
};

interface User {
  id: string;
  name: string;
  age: number;
}

type StringProps = PickByValueType<User, string>;
// { id: string; name: string }
```

## Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

### Distributive Conditional Types

```typescript
type ToArray<T> = T extends any ? T[] : never;

type B = ToArray<string | number>;  // string[] | number[]
type C = ToArray<never>;  // never
```

### Infer

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = ReturnType<() => string>;  // string
type B = ReturnType<() => Promise<number>>;  // Promise<number>
```

### Unwrap Types

```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnpackPromise<Promise<string>>;  // string
type B = UnpackPromise<number>;  // number
```

## Utility Types ใน TypeScript

```typescript
// Readonly<T>
type ReadonlyUser = Readonly<User>;

// Partial<T>
type OptionalUser = Partial<User>;

// Required<T>
type CompleteUser = Required<User>;

// Pick<T, K>
type UserPreview = Pick<User, "id" | "name">;

// Omit<T, K>
type UserWithoutPassword = Omit<User, "password">;

// Exclude<T, U>
type NonNull = Exclude<string | null | undefined, null | undefined>;

// Extract<T, U>
type Strings = Extract<"a" | "b", string>;  // "a" | "b"

// Record<K, V>
type UserRoles = Record<"admin" | "user", User>;

// NonNullable<T>
type NonNullUserId = NonNullable<User["id"] | null>;
```

## Real-world Examples

```typescript
// สร้าง type จาก API response
type ApiResponse<T> = {
  data: T;
  status: "success" | "error";
  message?: string;
};

// สร้าง form type จาก model
type FormType<T> = {
  [P in keyof T]: {
    value: T[P];
    error?: string;
    touched: boolean;
  };
};
```

## Best Practices

1. ใช้ mapped types สำหรับ transform types
2. ใช้ conditional types สำหรับ branching logic
3. ใช้ `infer` สำหรับ extract types จาก generics
4. Combine mapped + conditional types สำหรับ complex transformations