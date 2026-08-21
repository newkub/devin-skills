# Features

## Purpose

สรุป features ทั้งหมดของ ArkType

## Primitive Types

| Type | Description | Example |
|------|-------------|---------|
| `"string"` | String type | `"hello"` |
| `"number"` | Number type (includes NaN) | `42`, `3.14` |
| `"boolean"` | Boolean type | `true`, `false` |
| `"bigint"` | BigInt type | `9007199254740991n` |
| `"symbol"` | Symbol type | `Symbol("x")` |
| `"date"` | Date object | `new Date()` |
| `"undefined"` | Undefined | `undefined` |
| `"null"` | Null | `null` |
| `"nan"` | Not a Number | `NaN` |
| `"any"` | Any type | anything |
| `"unknown"` | Unknown type | anything |
| `"never"` | Never type | nothing |

## Literal Types

```typescript
// String literals
type("'active' | 'inactive'")

// Number literals
type("1 | 2 | 3")

// Boolean literals
type("true | false")
```

## Object Types

```typescript
// Basic object
type({
  name: "string",
  age: "number",
})

// Optional fields
type({
  name: "string",
  "email?": "string",  // optional
})

// With defaults
type({
  name: "string",
  "status?": "'active'",  // default: "active"
})
```

## Array Types

```typescript
// Array of strings
type("string[]")

// Array of numbers
type("number[]")

// Nested arrays
type("string[][]")

// Tuples
type(["string", "number", "boolean"])

// Variadic tuples
type(["string", "...number[]"])
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

// Combined
type({
  kind: "'admin'",
  "permissions?": "string[]",
} | {
  kind: "'user'",
  "readOnly": "true",
})
```

## Record & Map Types

```typescript
// Record with string keys
type("Record<string, number>")
type("Record<string, string>")

// Map-like
type("Map<string, number>")
```

## Advanced Types

```typescript
// Nullable
type("string | null")

// Optional with union
type("string?")

// Optional object
type({
  "data?": {
    name: "string",
  }
})

// Recursive types
const Tree = type({
  value: "string",
  "children?": "typeof Tree[]",
})
```

## Parsers & Assertions

| Method | Description |
|--------|-------------|
| `type(data)` | Parse and return result or errors |
| `type.assert(data)` | Parse, throw on error |
| `type.or(other)` | Create union type |
| `type.and(other)` | Create intersection |
| `type.extends(other)` | Check type relationship |
| `type.named(name)` | Add name for better errors |
| `type.default(value)` | Set default value |

## Error Handling

```typescript
const result = type({ name: "string" })({ name: 123 });

if (result instanceof type.errors) {
  result[0].path    // ["name"]
  result[0].message // Error message
  result[0].actual  // 123
  result.summary    // Formatted summary
}
```

## Scopes & Defaults

```typescript
// Define scope
const UserScope = type.scope({
  types: {
    user: {
      id: "string",
      name: "string",
    }
  }
});

// Use from scope
UserScope("user")
```

## Type Inference

```typescript
const User = type({
  name: "string",
  age: "number",
});

type User = typeof User.t;  // { name: string; age: number }
```
