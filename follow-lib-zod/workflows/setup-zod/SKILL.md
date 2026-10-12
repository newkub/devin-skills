---
name: follow-lib-zod-setup-zod
description: ติดตั้ง Zod — version detect (v3/v4), install, tsconfig, import patterns
argument-hint: "[version]"
related:
  - follow-lib-zod
  - run-typecheck
  - resolve-errors
---

## Goal

ติดตั้ง Zod — detect/install version (v3 vs v4), import patterns, tsconfig requirements

## Scope

setup เท่านั้น — v3→v4 upgrade ทำ `migrate-zod-v4` workflow; schema authoring → `define-schemas`

## Execute

### 1. Detect Version

```bash
bun pm ls zod     # หรือ npm ls zod
```

- `zod@3.x` → classic API; `zod@4.x` → new API (dual-published subpath `zod/v4` ใน v3.25+ ช่วง transition)
- Fresh install → latest v4 (stable since 2025)

### 2. Install

```bash
bun add zod          # runtime dep — ไม่ใช่ -D
```

- v4 install notes: `zod@latest` = v4 line; pin `zod@4` ชัดเจนใน package.json
- Peer ecosystem: `@hookform/resolvers`, `zod-to-json-schema` compat — เช็ค v4 support ต่อ package

### 3. Import Patterns

```ts
import { z } from 'zod'
// v4 explicit: import { z } from 'zod/v4' (ใน v3.25+ dual-publish) หรือ 'zod' ตอน v4 installed
// v4 sub-packages: 'zod/mini' (tree-shakable core), 'zod/locales' (error locales)
```

- `zod/v4` subpath ใน v3.25+ — transition path สำหรับลอง v4 โดยไม่ upgrade
- `zod/mini` — functional API สำหรับ bundle-sensitive apps

### 4. TSConfig Requirements

- `strict: true` — Zod type inference ต้อง strict mode
- TypeScript `>= 5.5` สำหรับ v4 (v3 ต้องการ 4.5+)
- ไม่ต้อง config JSX/module พิเศษ

### 5. Verify

1. `bunx tsc --noEmit` clean
2. Smoke test: `z.string().parse('x')` ใน unit test
3. fail → `/resolve-errors` max 3 รอบ

## Rules

- `zod` เป็น runtime dependency — ห้าม `-D`
- v4 = default ใหม่ — v3 ใช้เฉพาะ legacy codebase (upgrade → `migrate-zod-v4`)
- Import style เดียวทั้ง project — `z` namespace canonical
- ตรวจ ecosystem lib compat (hookform resolvers, trpc, orpc) กับ v4 ก่อน upgrade

## Expected Outcome

- `zod` ติดตั้ง version ถูก, imports พร้อม, typecheck ผ่าน
