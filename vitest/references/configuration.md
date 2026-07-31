# Configuration

## Purpose

Configuration options reference สำหรับ vitest.config.ts

## Scope

- Basic Options
- Timeout Options
- Environment Options
- Pool Options
- Coverage Options
- Watch Mode
- Type Checking
- Snapshot Options
- Reporter Options
- Global Setup/Teardown
- Workspace Options
- CSS Options
- Resolve Options
- Environment Variables

Vitest configuration options reference.

## Config File

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Configuration here
  },
})
```

## Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `environment` | `string` | `'node'` | Test environment |
| `globals` | `boolean` | `false` | Enable globals |
| `setupFiles` | `string \| string[]` | `[]` | Setup files |
| `include` | `string[]` | `['**/*.test.ts', '**/*.spec.ts']` | Include patterns |
| `exclude` | `string[]` | `['node_modules', 'dist']` | Exclude patterns |
| `watchExclude` | `string[]` | `['**/node_modules/**', '**/dist/**']` | Watch exclude |

## Timeout Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `testTimeout` | `number` | `5000` | Test timeout (ms) |
| `hookTimeout` | `number` | `10000` | Hook timeout (ms) |
| `retry` | `number` | `0` | Retry count on failure |

## Environment Options

```typescript
test: {
  environment: 'node',     // 'node' | 'jsdom' | 'happy-dom'
  globals: true,
  pool: 'threads',
}
```

### Environments

| Environment | Description |
|-------------|-------------|
| `node` | Node.js environment (default) |
| `jsdom` | Browser-like DOM environment |
| `happy-dom` | Lightweight DOM environment |

## Pool Options

```typescript
test: {
  pool: 'threads',
  poolOptions: {
    threads: {
      singleThread: false,
      maxThreads: 4,
      minThreads: 2,
    },
  },
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pool` | `string` | `'forks'` | Pool type |
| `singleThread` | `boolean` | `false` | Single worker |
| `maxThreads` | `number` | `CPUs - 1` | Max workers |
| `minThreads` | `number` | `1` | Min workers |

### Pool Types

| Pool | Description |
|------|-------------|
| `forks` | Fork processes (default) |
| `threads` | Worker threads |
| `vmThreads` | VM with threads |

## Coverage Options

```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules', '**/*.d.ts'],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `provider` | `string` | `'v8'` | Coverage provider |
| `reporter` | `string \| string[]` | `['text']` | Report formats |
| `exclude` | `string[]` | - | Exclude patterns |
| `include` | `string[]` | - | Include patterns |
| `thresholds.lines` | `number` | - | Line coverage threshold |
| `thresholds.functions` | `number` | - | Function coverage threshold |
| `thresholds.branches` | `number` | - | Branch coverage threshold |
| `thresholds.statements` | `number` | - | Statement coverage threshold |

### Coverage Providers

| Provider | Description |
|----------|-------------|
| `v8` | V8 built-in (fast) |
| `istanbul` | Istanbul/nyc (detailed) |

### Report Formats

| Format | Description |
|--------|-------------|
| `text` | Console output |
| `json` | JSON file |
| `html` | HTML report |
| `lcov` | LCOV format |
| `clover` | Clover XML |

## Watch Mode

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `watch` | `boolean` | `true` | Enable watch mode |
| `ui` | `boolean` | `false` | Enable UI |
| `open` | `boolean` | `false` | Open UI in browser |
| `uiBase` | `string` | `/__vitest` | UI base path |

## Type Checking

```typescript
test: {
  typecheck: {
    enabled: true,
    tsconfigPath: './tsconfig.json',
  },
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable type checking |
| `tsconfigPath` | `string` | `'./tsconfig.json'` | tsconfig path |

## Snapshot Options

```typescript
test: {
  snapshotFormat: {
    printBasicPrototype: false,
  },
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `snapshotFormat` | `object` | - | Snapshot format options |
| `update` | `boolean` | `false` | Update snapshots |

## Reporter Options

```typescript
test: {
  reporters: ['default', 'json'],
  outputFile: './test-output.json',
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reporters` | `string \| string[]` | `['default']` | Reporters |
| `outputFile` | `string` | - | Output file for JSON reporter |

## Insource Options

```typescript
test: {
  includeSource: ['src/**/*.ts'],
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeSource` | `string[]` | `[]` | Source files to test |

## Global Setup/Teardown

```typescript
test: {
  globalSetup: './setup.ts',
  globalTeardown: './teardown.ts',
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `globalSetup` | `string` | - | Global setup file |
| `globalTeardown` | `string` | - | Global teardown file |

## Workspace Options

```typescript
test: {
  workspace: './packages/*',
  projects: [],
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `workspace` | `string \| string[]` | - | Workspace root globs |
| `projects` | `WorkspaceProject[]` | - | Project configs |

## CSS Options

```typescript
test: {
  css: {
    modules: {
      classNameStrategy: 'scoped',
    },
  },
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `css` | `object` | - | CSS handling options |
| `css.modules` | `object` | - | CSS modules options |

## Resolve Options

```typescript
test: {
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}
```

## Environment Variables

```typescript
test: {
  env: {
    NODE_ENV: 'test',
  },
  envFiles: ['.env.test'],
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `env` | `object` | - | Environment variables |
| `envFiles` | `string[]` | - | Env files to load |