---
title: Migrate from Rollup - Common Changes
description: Common changes and migration checklist from Rollup to Rolldown
auto_execution_mode: 3
---

## Goal

Identify the common changes in the migration and verify completeness

## Scope

- Common changes
- Migration checklist

## Common Changes

### 1. Config File Extension

Change `.js` to `.ts`:

```bash
mv rollup.config.js rolldown.config.ts
```

### 2. Import Statement

Change the import:

Before:
```javascript
export default {
  input: 'src/index.js',
}
```

After:
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
})
```

### 3. TypeScript Support

Rolldown has built-in TypeScript support:

Before (Rollup):
```javascript
import typescript from '@rollup/plugin-typescript'

export default {
  plugins: [typescript()],
}
```

After (Rolldown):
```typescript
export default defineConfig({
  tsconfig: './tsconfig.json',
})
```

### 4. Minification

Rolldown uses a built-in minifier:

Before (Rollup):
```javascript
import terser from '@rollup/plugin-terser'

export default {
  plugins: [terser()],
}
```

After (Rolldown):
```typescript
export default defineConfig({
  output: {
    minify: true,
  },
})
```

## Migration Checklist

- [ ] Install Rolldown
- [ ] Update config file name
- [ ] Update import statements
- [ ] Update plugins
- [ ] Update build scripts
- [ ] Remove TypeScript plugin (if using)
- [ ] Remove Terser plugin (if using)
- [ ] Test build
- [ ] Verify output
- [ ] Test runtime

## Rules

- Change the config file extension to `.ts`
- Use `defineConfig` for type safety
- Remove plugins Rolldown already has built-in (TypeScript, Terser)

## Expected Outcome

- Config and plugins fully updated per the checklist
- No plugins duplicating built-in features
