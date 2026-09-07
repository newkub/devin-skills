---
title: package.json Script Examples
description: Example package.json scripts for Minimal, Standard, Complete templates and root-only scripts
---

# package.json Script Examples

ตัวอย่างด้านล่างใช้ `bun` เป็น default สำหรับ JS/TS ถ้า project ใช้ stack อื่นให้ดูที [scripts-tables.md](scripts-tables.md)

## Minimal (Default)

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "typecheck": "tsc --noEmit",
    "lint": "biome lint",
    "format": "biome format --write",
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
    "typecheck": "tsc --noEmit",
    "lint": "biome lint",
    "format": "biome format --write",
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
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "lint": "biome lint",
    "format": "biome format --write",
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

หมายเหตุ: `prepare` ใช้เฉพาะ root `package.json` ใน monorepo สำหรับ `taze` และ `lefthook install` — workspace packages ไม่ควรมี `prepare` script
