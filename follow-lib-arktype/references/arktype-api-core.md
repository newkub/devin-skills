# ArkType API Core

## Version Info

- Latest stable: `arktype` v2.2.3 (Jul 7, 2026)
- License: MIT, zero external dependencies
- TypeScript >= 5.1 required
- Source: https://arktype.io

## Core Functions

### `type`

Create types from native TypeScript syntax.

```typescript
import { type } from "arktype"

const User = type({
  name: "string",
  "age?": "number",
})
```

### `match`

Pattern matching with type-safe branching.

```typescript
import { match } from "arktype"

const sizeOf = match({
  "string | Array": (v) => v.length,
  number: (v) => v,
  bigint: (v) => v,
  default: "assert",
})
```

### `scope`

Group and reference reusable type definitions.

```typescript
import { scope } from "arktype"

const App = scope({
  user: { id: "string", name: "string" },
  post: { id: "string", "author?": "user" },
})

const { user: User, post: Post } = App.export()
```

## Validation Methods

| Method | Returns | Use |
|--------|---------|-----|
| `Schema(data)` | output \| `ArkErrors` | parse and transform |
| `Schema.assert(data)` | output or throws `TraversalError` | throw on invalid |
| `Schema.allows(data)` | `data is T` (boolean) | pure type check, no morphs |

## Type Methods

| Method | Description |
|--------|-------------|
| `.or(def)` | union |
| `.and(def)` | intersection |
| `.to(def)` | pipe to morph/transform |
| `.narrow(fn)` | add custom validation logic |
| `.configure(...)` | customize errors/behavior |
| `.describe(text)` | set human-readable description |
| `.onUndeclaredKey(...)` | handle extra keys |
| `.toJsonSchema()` | generate JSON Schema |

## Type Properties

| Property | Use |
|----------|-----|
| `.t` / `.infer` | `typeof User.t` for output type |
| `.inferIn` | input type |
| `.inferOut` | output type |
| `.description` | human-readable description |
| `.expression` | syntax string |

## Error Handling

```typescript
const result = User(data)

if (result instanceof type.errors) {
  console.error(result.summary)
}
```

Use `TraversalError` for `.assert()`:

```typescript
import { type, TraversalError } from "arktype"

try {
  User.assert(data)
} catch (e) {
  if (e instanceof TraversalError) {
    console.error(e.message)
    console.error(e.arkErrors.flatProblemsByPath)
  }
}
```

## Sources

- https://arktype.io/docs/intro/setup
- https://arktype.io/docs/type-api
- https://arktype.io/docs/traversal-api
- https://arktype.io/docs/match
- https://arktype.io/docs/scopes
