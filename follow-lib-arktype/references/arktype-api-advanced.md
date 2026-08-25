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
