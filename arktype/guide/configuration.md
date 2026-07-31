# Configuration

## Purpose

คู่มือการตั้งค่า ArkType สำหรับ project ต่างๆ

## Scope

- Type configuration
- Scopes
- Error customization
- Parser options

## Type Configuration

### Naming Types

```typescript
import { type } from "arktype";

const User = type({
  name: "string",
  age: "number",
}).named("User");

// Better error messages
const result = User({ name: 123 });
// Error will mention "User"
```

### Default Values

```typescript
const Config = type({
  name: "string",
  "debug?": "boolean",
}).defaults({
  debug: false,
});
```

## Scopes

### Creating a Scope

```typescript
import { type } from "arktype";

const App = type.scope({
  types: {
    user: {
      id: "string",
      name: "string",
      email: "string",
    },
    post: {
      id: "string",
      title: "string",
      "author?": "user",
    },
  },
});

// Use types from scope
const user = App("user");
const post = App("post");

// Parse with scope
const result = App("user", { id: "123", name: "John" });
```

### Nested Scopes

```typescript
const Database = type.scope({
  types: {
    models: {
      user: { id: "string", name: "string" },
      post: { id: "string", "author?": "user" },
    },
  },
});

const User = Database("models/user");
```

## Error Customization

### Custom Error Messages

```typescript
const Email = type("string").assert((s) => 
  s.includes("@") ? null : "Must be a valid email"
);
```

### Extracting Error Details

```typescript
const result = User({ name: 123 });

if (result instanceof type.errors) {
  for (const error of result) {
    console.log({
      path: error.path,      // ["name"]
      message: error.message, // "Expected string, received number"
      actual: error.actual,   // 123
      expected: error.expected, // "string"
    });
  }
}
```

## Parser Options

### Strict Mode

```typescript
// Only allow defined properties
const StrictUser = type({
  name: "string",
}, { excess: "strip" });
```

### Optional Fields

```typescript
// Make all fields optional
const PartialUser = type({
  name: "string",
  email: "string",
}, { optional: true });
```

## Environment Setup

### Node.js

```typescript
// CommonJS
const { type } = require("arktype");

// ESM
import { type } from "arktype";
```

### Deno

```typescript
import { type } from "jsr:@arktype/arktype";
```

### Browser

```typescript
import { type } from "arktype";
// Works in all modern browsers
```