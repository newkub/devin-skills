---
title: Migrate from Rollup - Setup
description: Install and initial setup steps for migrating from Rollup to Rolldown
auto_execution_mode: 3
---

## Goal

Migrate smoothly from Rollup to Rolldown

## Scope

- Config migration
- Plugin migration
- API compatibility
- Common changes

## Execute

### 1. Install Rolldown

Install Rolldown:

```bash
bun add -D rolldown
```

### 2. Update Config File

Change `rollup.config.js` to `rolldown.config.ts`:

Before (rollup.config.js):
```javascript
export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
}
```

After (rolldown.config.ts):
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### 3. Update Plugins

Switch the plugins from Rollup to Rolldown:

Before:
```javascript
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
}
```

After:
```typescript
import commonjs from '@rolldown/plugin-commonjs'
import nodeResolve from '@rolldown/plugin-node-resolve'

export default defineConfig({
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
})
```

### 4. Update Build Script

Change the build script in package.json:

Before:
```json
{
  "scripts": {
    "build": "rollup -c"
  }
}
```

After:
```json
{
  "scripts": {
    "build": "rolldown"
  }
}
```

### 5. Test Build

Test the build:

```bash
bun run build
```

### 6. Verify Output

Check the output:

```bash
ls dist/
```

## Rules

- Use `defineConfig` for type safety
- Switch plugins to Rolldown versions
- Test the build after migration
- Verify the output thoroughly

## Expected Outcome

- A project successfully migrated to Rolldown
- A significantly reduced build time
- Output comparable with Rollup
- Better performance
