# Optimize TypeScript Build

## Context

ต้องการปรับปรุง TypeScript build performance

## Steps

### 1. Analyze Build Time

```bash
# Add build timing
bunx tsc --diagnostics
```

### 2. Configure Build Options

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "skipLibCheck": true
  }
}
```

### 3. Use Project References

```json
// tsconfig.json (root)
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ],
  "files": []
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  }
}
```

### 4. Configure Type Checking

```typescript
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationMap": true
  },
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### 5. Use SWC or esbuild

```bash
# Install SWC
bun add -D @swc/cli @swc/core

# Use swc for building
bunx swc src -d dist
```

### 6. Caching

```json
// package.json
{
  "scripts": {
    "build": "tsc --build --force",
    "typecheck": "tsc --noEmit --incremental"
  }
}
```

## Performance Tips

| Strategy | Benefit |
|----------|---------|
| `incremental: true` | Faster rebuilds |
| `skipLibCheck: true` | Skip .d.ts validation |
| Project references | Parallel builds |
| SWC/esbuild | Faster compilation |
| `.tsbuildinfo` | Cache type info |

## Monitoring

```bash
# Check build time
time bunx tsc --build

# Profile
NODE_OPTIONS="--inspect" bunx tsc --build --profile
```

## Related

- [guide/configuration.md](../guide/configuration.md)
- [guide/architecture.md](../guide/architecture.md)
