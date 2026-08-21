---
title: package.json Script Examples
description: Example package.json scripts for Minimal, Standard, and Complete templates
---

# package.json Script Examples

## Minimal (Default)

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "typecheck": "tsc --noEmit",
    "lint": "biome check",
    "format": "biome check --write",
    "test": "vitest run",
    "verify": "bun run lint && bun run typecheck && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```

## Standard

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "typecheck": "tsc --noEmit",
    "lint": "biome check",
    "format": "biome check --write",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "deps:analyze": "bunx depcheck",
    "clean": "bunx rimraf node_modules",
    "verify": "bun run lint && bun run typecheck && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```

## Complete (Infra/Tooling Team)

```json
{
  "scripts": {
    "prepare": "bunx lefthook install",
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "build:watch": "bun build --watch",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "lint": "biome check",
    "format": "biome check --write",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "vitest run --config vitest.e2e.config.ts",
    "deps:analyze": "bunx depcheck",
    "clean": "bunx rimraf node_modules",
    "bench": "bunx mitata",
    "prerelease": "bun run build",
    "release": "auto-it",
    "verify": "bun run lint && bun run typecheck && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```
