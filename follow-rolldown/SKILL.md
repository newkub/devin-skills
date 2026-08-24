---
name: follow-rolldown
description: Fast JavaScript bundler ที่เขียนด้วย Rust ใช้ Rollup-compatible API
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

ใช้งาน Rolldown สำหรับ bundle JavaScript/TypeScript ด้วยความเร็วสูง

## Scope

ใช้สำหรับ:
- Bundle JavaScript/TypeScript ด้วยความเร็วสูง
- Migration จาก Rollup ไปยัง Rust-based bundler
- Code splitting และ tree-shaking
- Plugin system ที่ compatible กับ Rollup

## Execute

### Quick Start

ติดตั้งและเริ่มต้นใช้งาน:

```bash
bun add -D rolldown
```

สร้าง config file:

```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

Build project:

```bash
bunx rolldown
```

### Learning Path

1. `Getting Started`: อ่าน [learn/guide/getting-started.md](learn/guide/getting-started.md)
2. `Key Concepts`: เรียนรู้ [learn/key-concepts/three-stage-pipeline.md](learn/key-concepts/three-stage-pipeline.md)
3. `Best Practices`: ดู [learn/principles/best-practices.md](learn/principles/best-practices.md)
4. `Workflows`: ใช้ [workflows/setup-rolldown.md](workflows/setup-rolldown.md)

## Rules

- ใช้ `bun add -D rolldown` สำหรับติดตั้ง
- ใช้ `bunx rolldown` สำหรับ build
- ใช้ `--watch` สำหรับ watch mode
- ใช้ `--config` สำหรับ config file
- ใช้ TypeScript สำหรับ config file (rolldown.config.ts)
- ใช้ `defineConfig` สำหรับ type safety

## Expected Outcome

- JavaScript/TypeScript ที่ bundled ด้วยความเร็วสูง
- Migration จาก Rollup ที่ smooth
- Code splitting ที่ efficient
- Tree-shaking ที่ effective
- Plugin system ที่ compatible
- Performance ที่ดีขึ้น 10-100x
