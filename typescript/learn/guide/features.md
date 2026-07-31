# All Features - TypeScript

## Data Types

### Primitives

| Type | Description | Example |
|------|-------------|---------|
| string | Text | `"hello"` |
| number | Numeric | `42`, `3.14` |
| boolean | True/False | `true`/`false` |
| null | Intentional absence | `null` |
| undefined | Unassigned | `undefined` |
| symbol | Unique identifier | `Symbol("id")` |
| bigint | Large integers | `9007199254740991n` |

### Complex Types

```typescript
// Arrays
let nums: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// Tuples
let tuple: [string, number] = ["hello", 42];

// Objects
interface User {
  name: string;
  age: number;
}

// Enums
enum Status {
  Active,
  Inactive,
  Suspended
}
```

## Interfaces vs Types

```typescript
// Interface
interface User {
  name: string;
  age: number;
}

// Type Alias
type User = {
  name: string;
  age: number;
};

// Interface can be extended
interface Admin extends User {
  role: string;
}

// Type can use union/intersection
type Admin = User & { role: string };
```

## Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Container<T> {
  value: T;
}

// Generic constraints
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// Multiple type parameters
function map<K, V>(obj: Record<K, V>, fn: (v: V) => V): Record<K, V> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, fn(v)])
  );
}
```

## Utility Types

```typescript
// Partial - all properties optional
type PartialUser = Partial<User>;

// Required - all properties required
type RequiredUser = Required<User>;

// Pick - select properties
type UserPreview = Pick<User, "name">;

// Omit - exclude properties
type UserWithoutAge = Omit<User, "age">;

// Record - key-value map
type UserMap = Record<string, User>;

// Exclude/Extract
type NonNull = Exclude<string | null, null>;
type Strings = Extract<string | number, string>;
```

## Decorators (Experimental)

```typescript
// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// Method decorator
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
}

// Usage
@sealed
class MyClass {
  @log
  myMethod(arg: string) {
    return arg;
  }
}
```

## Control Flow Analysis

```typescript
function example(x: string | number) {
  if (typeof x === "string") {
    // x is string here
    x.toUpperCase();
  } else {
    // x is number here
    x.toFixed(2);
  }
}

// Type predicates
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```