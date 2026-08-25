# API

## Purpose

Complete API reference for ArkType v2.x methods and utilities.

## Version Info

- Latest stable: `arktype` v2.2.3 (Jul 7, 2026)
- License: MIT, zero external dependencies
- TypeScript >= 5.0 required
- Source: https://arktype.io

## Core Functions

### type

The main function to create types from native TypeScript syntax.

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

// Named type (for error messages)
const User = type({ name: "string" }).named("User");
```

### match

Pattern matching API — type-safe `switch` using type syntax (v2.1+).

```typescript
import { match } from "arktype";

// Case Record API
const sizeOf = match({
  "string | Array": (v) => v.length,
  number: (v) => v,
  bigint: (v) => v,
  default: "assert", // throw if no case matches
});

sizeOf("abc"); // 3
sizeOf([1, 2, 3, 4]); // 4
sizeOf(5n); // 5n

// Fluent API (for non-string-embeddable definitions)
const matcher = match({
  string: (v) => v.length,
})
  .case({ length: "number" }, (o) => o.length)
  .default(() => 0);

// Narrowing with .in<T>() and .at("key")
const discriminate = match
  .in<Data>()
  .at("id")
  .match({
    1: (o) => `${o.oneValue}!`,
    2: (o) => o.twoValue.length,
    default: "assert",
  });
```

`default` accepts one of 4 values:

- `"assert"`: accept `unknown`, throw if none match
- `"never"`: accept based on inferred cases, throw if none match
- `"reject"`: accept `unknown`, return `ArkErrors` if none match
- `(data: In) => unknown`: handle unmatched data directly

### Parsing Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `Schema(data)` | `(data: unknown) => T \| ArkErrors` | Parse data, return result or errors |
| `Schema.assert(data)` | `(data: unknown) => T` | Parse, throw on error |
| `Schema.is(data)` | `(data: unknown) => boolean` | Check if data matches |
| `Schema.can(data)` | `(data: unknown) => boolean` | Check if data can be parsed |

### Type Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `.named(name)` | `(name: string) => Type<T>` | Add name for errors |
| `.or(other)` | `(other: Type) => Type` | Create union |
| `.and(other)` | `(other: Type) => Type` | Create intersection |
| `.to(other)` | `(other: string \| Type) => Type` | Pipe to morph/transform |
| `.assert(fn)` | `(fn: (data: T) => string?) => Type<T>` | Add custom validator |

### Type Properties

| Property | Type | Description |
|----------|------|-------------|
| `.t` | `T` | TypeScript type (use `typeof Schema.t`) |
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

## ArkErrors

### Error Structure

```typescript
import { type, ArkErrors } from "arktype";

const result = User(data);

if (result instanceof ArkErrors) {
  result.summary;    // Full formatted message
  result[0].path;    // ["field", "nested"]
  result[0].message; // "must be a string (was a number)"
  result[0].actual;  // 123
}
```

### Checking Errors

```typescript
const result = User(data);

if (result instanceof ArkErrors) {
  // Handle error
} else {
  // result is typed as T
}
```

## Scopes

### Creating Scope

```typescript
const App = type.scope({
  user: { id: "string", name: "string" },
  post: { id: "string", "author?": "user" },
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

## Configuration

### Global Configuration

```typescript
import { configure } from "arktype/config";

configure({
  keywords: {
    string: "must be a string",
    "string.email": {
      actual: () => "definitely fake",
    },
  },
});
```

### Per-Type Configuration

```typescript
const Custom = type("1", "@", {
  message: "Yikes.",
});

// ArkErrors: Yikes.
Custom(2);
```

## Modules

### arktype

```typescript
import { type, match, ArkErrors, type scope } from "arktype";
```

### arktype/config

```typescript
import { configure } from "arktype/config";
```

## Sources

- https://arktype.io/docs/intro/setup
- https://arktype.io/docs/expressions
- https://arktype.io/docs/match
- https://arktype.io/docs/configuration
- https://www.npmjs.com/package/arktype
