---
title: Configuration Reference
description: Configuration options สำหรับ ArkType
---

## Configuration Reference

Configuration options สำหรับ ArkType

## Type Configuration

### Scope Configuration

#### Global Scope

```typescript
import { configure } from 'arktype'

configure({
  // Global configuration
  strict: true,
  onType: (type) => {
    // Custom type handler
  }
})
```

### Type Options

#### Strict Mode

```typescript
import { type } from 'arktype'

const Schema = type({
  field: 'string'
}, {
  strict: true // Strict validation
})
```

#### Default Values

```typescript
const Schema = type({
  field: 'string',
  count: 'number'
}, {
  defaults: {
    count: 0 // Default value
  }
})
```

## Parser Configuration

### Custom Parsers

#### Define Custom Parser

```typescript
import { type } from 'arktype'

const CustomParser = type.defineParser({
  parse: (value) => {
    // Custom parsing logic
    return value
  }
})
```

### Parser Options

#### Error Messages

```typescript
const Schema = type({
  field: 'string'
}, {
  errors: {
    field: {
      type: 'Invalid field type'
    }
  }
})
```

## Validation Configuration

### Validation Rules

#### Custom Rules

```typescript
const Schema = type({
  field: 'string'
}, {
  rules: {
    field: (value) => {
      // Custom validation
      return true
    }
  }
})
```

### Validation Options

#### Early Exit

```typescript
const Schema = type({
  field: 'string'
}, {
  earlyExit: true // Stop on first error
})
```

## Type Inference Configuration

### Inference Options

#### Deep Inference

```typescript
const Schema = type({
  nested: {
    field: 'string'
  }
}, {
  deepInference: true // Infer nested types
})
```

## Error Configuration

### Error Handling

#### Custom Error Handler

```typescript
const Schema = type({
  field: 'string'
}, {
  onError: (error) => {
    // Custom error handling
    console.error(error)
  }
})
```

### Error Messages

#### Custom Messages

```typescript
const Schema = type({
  field: 'string'
}, {
  messages: {
    field: {
      required: 'Field is required',
      type: 'Invalid type'
    }
  }
})
```

## ตารางสรุป Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| strict | boolean | false | Strict validation mode |
| defaults | object | {} | Default values |
| earlyExit | boolean | false | Stop on first error |
| deepInference | boolean | true | Infer nested types |
| onError | function | - | Custom error handler |
| messages | object | {} | Custom error messages |

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions

```typescript
// Global type definitions
declare global {
  namespace ArkType {
    interface Config {
      // Custom config
    }
  }
}
```

## Build Configuration

### Bundler Configuration

#### Vite

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['arktype']
  }
})
```

#### Rollup

```javascript
// rollup.config.js
export default {
  external: ['arktype']
}
```

## Development Configuration

### Testing Configuration

#### Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true
  }
})
```

### Linting Configuration

#### Biome

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  }
}
```

## ตารางสรุป Configuration Files

| File | Purpose | Example |
|------|---------|---------|
| tsconfig.json | TypeScript config | Strict mode |
| vite.config.ts | Vite config | Optimization |
| rollup.config.js | Rollup config | External deps |
| vitest.config.ts | Vitest config | Test globals |
| biome.json | Biome config | Linting rules |
