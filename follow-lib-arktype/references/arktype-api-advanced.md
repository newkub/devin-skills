# ArkType Advanced

## ArkErrors

```typescript
import { type } from "arktype"

const result = User(data)

if (result instanceof type.errors) {
  result.summary              // human-readable summary
  result.flatByPath           // errors grouped by path
  result.flatProblemsByPath   // string problems grouped by path
}
```

## Scopes

```typescript
import { scope } from "arktype"

const App = scope({
  user: { id: "string", name: "string" },
  post: { id: "string", "author?": "user" },
})

const types = App.export()
const User = types.user
const Post = types.post
```

## Type Inference

```typescript
const User = type({
  name: "string",
  age: "number",
})

type UserType = typeof User.t
// { name: string; age: number }
```

## Configuration

### Global Configuration

```typescript
import { configure } from "arktype/config"

configure({ numberAllowsNaN: true })
```

### Per-Type Configuration

```typescript
const Password = type("string >= 8").configure({
  actual: () => "",
})

const User = type({
  email: "string.email",
  password: Password,
})
```

## Modules

```typescript
import { type, match, scope, ArkErrors } from "arktype"
import { configure } from "arktype/config"
```

## Sources

- https://arktype.io/docs/configuration
- https://arktype.io/docs/scopes
- https://arktype.io/docs/traversal-api
- https://arktype.io/docs/type-api
