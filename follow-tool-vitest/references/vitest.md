# Vitest Reference

## Overview

Vitest is a next generation testing framework powered by Vite. It is Jest-compatible, reuses Vite config and plugins, and works for both frontend and backend code. By building on top of Vite, Vitest natively understands your Vite config and reuses the same resolve and transform pipelines.

## Install

```bash
bun add -D vitest @vitest/coverage-v8
```

Install the UI package (optional):

```bash
bun add -D @vitest/ui
```

Initialize a configuration file:

```bash
bunx vitest init
```

## Version Info

- Latest stable: `4.1.11`
- License: MIT
- Node.js: `^20.0.0 || ^22.0.0 || >=24.0.0`
- Source: https://vitest.dev

## Peer Dependencies

Vitest declares the following peer dependencies. Only `vite` is required; all others are optional.

- `vite`: `^6.0.0 || ^7.0.0 || ^8.0.0` (required)
- `@vitest/coverage-v8`: `4.1.11` (optional)
- `@vitest/coverage-istanbul`: `4.1.11` (optional)
- `@vitest/ui`: `4.1.11` (optional)
- `@vitest/browser-playwright`: `4.1.11` (optional)
- `@vitest/browser-webdriverio`: `4.1.11` (optional)
- `@vitest/browser-preview`: `4.1.11` (optional)
- `@types/node`: `^20.0.0 || ^22.0.0 || >=24.0.0` (optional)
- `jsdom`: `*` (optional)
- `happy-dom`: `*` (optional)
- `@edge-runtime/vm`: `*` (optional)
- `@opentelemetry/api`: `^1.9.0` (optional)

## Configuration

Vitest reads `vite.config.*` by default, so existing Vite plugins and configuration work out-of-the-box. A separate `vitest.config.ts` has higher priority and overrides `vite.config.ts` entirely. If not using `vite`, import `defineConfig` from `vitest/config`. If using `vite`, add a triple slash reference for `test` types.

### Basic configuration

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
})
```

### Coverage configuration

Vitest supports coverage via `v8` (default) and `istanbul`. Install the corresponding package manually or let Vitest auto-install it.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/utils/users.ts'],
      reporter: ['text', 'json', 'lcov', 'html'],
    },
  },
})
```

### Test projects (monorepo)

Use `test.projects` array for multi-project setups. The `workspace` config is deprecated since 3.2. Use `defineProject` instead of `defineConfig` in project-level config files. All projects must have unique names.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      {
        extends: true,
        test: {
          name: 'happy-dom',
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          environment: 'happy-dom',
        },
      },
    ],
  },
})
```

Project-level config uses `defineProject`:

```ts
import { defineProject } from 'vitest/config'
export default defineProject({ test: { environment: 'jsdom' } })
```

### Type-checking configuration

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      include: ['**/*.{test-d,spec-d}.ts'],
      exclude: ['**/node_modules/**'],
    },
  },
})
```

### Test tags configuration

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    tags: [
      {
        name: 'db',
        retry: 3,
      },
      {
        name: 'flaky',
        retry: 5,
        timeout: 10000,
      },
    ],
  },
})
```

## CLI Commands

```bash
# Run tests once without watch mode (for CI)
vitest run

# Run tests in watch mode (default in development)
vitest watch

# Alias to vitest watch
vitest dev

# Run tests with UI
vitest --ui

# Run only tests that cover a list of source files
vitest related /src/index.ts

# Run only benchmark tests
vitest bench

# Initialize project configuration (e.g., browser)
vitest init browser

# List all matching tests
vitest list

# Run tests with coverage
vitest run --coverage

# Filter tests by name pattern
vitest run -t="some-test"

# Filter by project name (monorepo)
vitest run --project e2e

# Filter by test tags
vitest run --tags-filter="unit"
vitest run --tags-filter="frontend && !flaky"

# Specify config file path
vitest --config ./path/to/vitest.config.ts

# Update snapshots
vitest run -u
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

When using Bun as the package manager, use `bun run test` instead of `bun test` to avoid Bun's own test runner.

## Vitest 4 Breaking Changes

- `poolOptions` is removed; use top-level `maxWorkers`, `isolate`, `vmMemoryLimit` instead
- `maxThreads` and `maxForks` are replaced by `maxWorkers`
- `singleThread` and `singleFork` are replaced by `maxWorkers: 1, isolate: false`
- `coverage.all` and `coverage.extensions` are removed; use `coverage.include` instead
- `workspace` config is deprecated; use `test.projects` instead
- Browser Mode is stable; use `@vitest/browser-playwright` instead of `@vitest/browser`
- Vitest 4.1 adds Vite 8 support and uses the installed `vite` version when possible

## Source

- https://vitest.dev/guide/
- https://vitest.dev/config/
- https://vitest.dev/guide/cli
- https://vitest.dev/guide/coverage
- https://vitest.dev/guide/projects
- https://vitest.dev/blog/vitest-4
- https://vitest.dev/blog/vitest-4-1
- https://github.com/vitest-dev/vitest
