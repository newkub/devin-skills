# API

## Purpose

Complete API reference for ArkType methods and utilities.

## Core Functions

### type

The main function to create types.

```typescript
import { type } from "arktype";

// From string
const str = type("string");

// From object
const obj = type({
  name: "string",
  age: "number",
});

// From array (tuple)
const tuple = type(["string", "number"]);

// Named type
const User = type({ name: "string" }).named("User");
```

### Parsing Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `type(data)` | `(data: unknown) => T \| type.errors` | Parse data, return result or errors |
| `type.assert(data)` | `(data: unknown) => T` | Parse, throw on error |
| `type.is(data)` | `(data: unknown) => boolean` | Check if data matches |
| `type.can(data)` | `(data: unknown) => boolean` | Check if data can be parsed |

### Type Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `.named(name)` | `(name: string) => ArkType<T>` | Add name for errors |
| `.defaults(values)` | `(values: Partial<T>) => ArkType<T>` | Set default values |
| `.or(other)` | `(other: ArkType) => ArkType` | Create union |
| `.and(other)` | `(other: ArkType) => ArkType` | Create intersection |
| `.extends(other)` | `(other: unknown) => boolean` | Check type relationship |
| `.assert(fn)` | `(fn: (data: T) => string?) => ArkType<T>` | Add custom validator |

### Type Properties

| Property | Type | Description |
|----------|------|-------------|
| `.t` | `T` | TypeScript type |
| `.name` | `string` | Type name |

## Primitive Types

| Type String | Description |
|-------------|-------------|
| `"string"` | String values |
| `"number"` | Number values (includes NaN) |
| `"bigint"` | BigInt values |
| `"boolean"` | Boolean values |
| `"symbol"` | Symbol values |
| `"date"` | Date objects |
| `"undefined"` | Undefined |
| `"null"` | Null |
| `"nan"` | NaN |
| `"any"` | Any value |
| `"unknown"` | Unknown value |
| `"never"` | Never (no values) |

## Literal Types

```typescript
// String literal
"'hello'"
"'active' | 'inactive'"

// Number literal
"42"
"1 | 2 | 3"

// Boolean literal
"true | false"
```

## Object Types

```typescript
// Basic
type({
  name: "string",
  age: "number",
})

// Optional field
type({
  name: "string",
  "email?": "string",  // optional
})

// Optional with default
type({
  name: "string",
  "status?": "'active'",  // default: "active"
})
```

## Array & Tuple Types

```typescript
// Array
"string[]"
"number[]"

// Nested array
"string[][]"

// Tuple
["string", "number"]

// Variadic tuple
["string", "...number[]"]
```

## Union & Intersection

```typescript
// Union
type("string | number")

// Intersection
type({
  name: "string",
} & {
  age: "number",
})
```

## Record Types

```typescript
// String key, number value
type("Record<string, number>")

// String key, any value
type("Record<string, unknown>")
```

## Type Errors

### Error Structure

```typescript
// type.errors is array-like
result[0].path    // ["field", "nested"]
result[0].message // "Expected string, received number"
result[0].actual  // 123
result[0].expected // "string"

result.summary    // Full formatted message
```

### Checking Errors

```typescript
const result = Type(data);

if (result instanceof type.errors) {
  // Handle error
}
```

## Scopes

### Creating Scope

```typescript
const App = type.scope({
  types: {
    user: { id: "string", name: "string" },
    post: { id: "string", "author?": "user" },
  },
});

// Use types
const User = App("user");
const Post = App("post");
```

## Type Inference

```typescript
const User = type({
  name: "string",
  age: "number",
});

// Infer type
type UserType = typeof User.t;
// { name: string; age: number }
```

## Modules

### arktype

```typescript
import { type, type errors, type scope } from "arktype";
```

### arktype/table (optional)

For database-like validation.

```typescript
import { table, c } from "arktype/table";
```
