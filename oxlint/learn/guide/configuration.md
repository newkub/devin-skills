# Configuration

## Description

ตั้งค่า Oxlint ผ่าน configuration file

## Config Files

### .oxlintrc.json

```json
{
  "categories": {
    "correctness": "warn",
    "suspicious": "warn",
    "perf": "warn",
    "style": "warn",
    "restriction": "warn",
    "nursery": "allow"
  },
  "rules": {
    "no-console": "off",
    "no-debugger": "error"
  },
  "ignore": [
    "node_modules/**",
    "dist/**",
    "*.min.js"
  ]
}
```

### oxlint.config.ts

```typescript
import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
    suspicious: "warn",
    perf: "warn",
    style: "warn",
    restriction: "warn",
    nursery: "allow",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "error",
  },
  ignore: [
    "node_modules/**",
    "dist/**",
    "*.min.js",
  ],
});
```

## Configuration Options

### Categories

```json
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "perf": "warn",
    "style": "warn",
    "restriction": "warn",
    "nursery": "allow"
  }
}
```

### Rules

```json
{
  "rules": {
    "no-console": "off",
    "no-debugger": "error",
    "no-unused-vars": "warn"
  }
}
```

### Ignore

```json
{
  "ignore": [
    "node_modules/**",
    "dist/**",
    "*.min.js",
    "build/**"
  ]
}
```

## Best Practices

1. **Use TypeScript Config**: ใช้ oxlint.config.ts สำหรับ type safety
2. **Customize Rules**: Customize rules ตาม project needs
3. **Ignore Build Artifacts**: Ignore build artifacts
4. **Version Control**: Commit config file
