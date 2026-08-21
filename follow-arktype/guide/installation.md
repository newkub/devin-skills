# Installation

## Purpose

คู่มือการติดตั้ง ArkType และการตั้งค่า TypeScript

## Scope

- Package installation
- TypeScript configuration
- Environment setup
- Verification

## Package Installation

### bun (Recommended)

```bash
bun add arktype
```

### bun

```bash
bun install arktype
```

### yarn

```bash
yarn add arktype
```

### bun

```bash
bun add arktype
```

### Deno (JSR)

```typescript
// Deno
import { type } from "jsr:@arktype/arktype";
```

## Version Requirements

| Dependency | Version |
|------------|---------|
| TypeScript | >=5.0 |
| Node.js | >=14.17.0 |

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "skipLibCheck": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### VSCode Settings

สำหรับ autocomplete ที่ดีขึ้น ให้ตั้งค่าใน `.vscode/settings.json`:

```json
{
  "editor.quickSuggestions": {
    "strings": "on"
  }
}
```

## Basic Verification

```typescript
import { type } from "arktype";

// Test installation
const StringType = type("string");
const result = StringType("hello");

console.log(result); // "hello" (success)
```

## Next Steps

- Read [Quick Start Guide](./quick-start.md)
- Explore [Features](./features.md)
- Learn about [Integration](./integration.md)