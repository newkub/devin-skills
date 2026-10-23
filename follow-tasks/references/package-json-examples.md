---
title: package.json Script Examples
description: Example package.json scripts for Minimal, Standard, Complete templates and root-only scripts
---

# package.json Script Examples

The examples below default to `bun` for JS/TS; if the project uses another stack, see [scripts-tables.md](scripts-tables.md)

## Minimal (Default)

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "typecheck": "bun check",
    "lint": "biome lint",
    "format": "bun fmt",
    "format:check": "bun fmt --check",
    "test": "vitest run",
    "scan": "ast-grep scan",
    "check": "bun run lint && bun run typecheck && bun run scan",
    "verify": "bun run check && bun run test",
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
    "typecheck": "bun check",
    "lint": "biome lint",
    "format": "bun fmt",
    "format:check": "bun fmt --check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "scan": "ast-grep scan",
    "check": "bun run lint && bun run typecheck && bun run scan",
    "security": "bunx audit",
    "deps:analyze": "bunx depcheck",
    "clean": "bunx rimraf node_modules",
    "verify": "bun run check && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```

## Complete (Infra/Tooling Team)

```json
{
  "scripts": {
    "prepare": "bunx taze -r -w -i && bunx lefthook install",
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "build:watch": "bun build --watch",
    "typecheck": "bun check",
    "typecheck:watch": "bun run --watch typecheck",
    "lint": "biome lint",
    "format": "bun fmt",
    "format:check": "bun fmt --check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "vitest run --config vitest.e2e.config.ts",
    "scan": "ast-grep scan",
    "check": "bun run lint && bun run typecheck && bun run scan",
    "security": "bunx audit",
    "deps:analyze": "bunx depcheck",
    "clean": "bunx rimraf node_modules",
    "bench:fn": "bunx mitata",
    "bench:server": "bunx autocannon",
    "bench:memory": "bunx clinic",
    "prerelease": "bun run build",
    "release": "auto-it",
    "verify": "bun run check && bun run test",
    "ci": "bun run verify && bun run build",
    "verify:full": "bun run ci && bun run test:integration && bun run test:e2e"
  }
}
```

## Root Only (Monorepo / Secrets)

```json
{
  "scripts": {
    "prepare": "bunx taze -r -w -i && bunx lefthook install",
    "secrets:dev": "infisical run --env=dev -- bun run dev",
    "secrets:build": "infisical run --env=prod -- bun run build",
    "secrets:export": "infisical export --format=dotenv-export",
    "secrets:run": "infisical run --"
  }
}
```

Note: `prepare` is for the root `package.json` in a monorepo only, for `taze` and `lefthook install` — workspace packages should not have a `prepare` script
