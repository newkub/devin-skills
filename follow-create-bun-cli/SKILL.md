---
name: follow-create-bun-cli
description: สร้าง CLI applications ด้วย Bun runtime ตาม Clean Architecture และ best practices
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

สร้าง CLI applications ด้วย Bun runtime ที่มีประสิทธิภาพสูง โครงสร้างตาม Clean Architecture

## Scope

ใช้สำหรับสร้าง CLI applications ด้วย Bun runtime — ไม่ครอบคลุม library bundling (ดู `/follow-bunup`)

## Execute

### 1. Setup Project Structure

> Goal: สร้างโครงสร้างโปรเจกต์ตาม Clean Architecture
> Goal: แยก concerns ชัดเจนตาม Clean Architecture layers

1. ทำ `/follow-clean-architecture` เพื่อสร้างโครงสร้าง `src/domain/`, `src/application/`, `src/adapters/`, `src/presentation/`
2. สร้าง entry points: `src/presentation/cli.ts` (CLI entry) และ `src/index.ts` (library entry)
3. สร้าง `src/shared/` สำหรับ common types และ utilities

### 2. Configure Build Tools

> Goal: ตั้งค่า build tools สำหรับ production
> Goal: Build ได้เร็ว มี type declarations ครบ

1. ติดตั้ง `bunup` ด้วย `bun add -d bunup`
2. สร้าง `bunup.config.ts` พร้อม `dts.splitting: true`
3. ติดตั้ง `picocolors` แทน `chalk` สำหรับ terminal colors
4. ติดตั้ง `cac` แทน `commander` สำหรับ argument parsing
5. ตั้งค่า `tsconfig.json`: `declaration: true`, `isolatedDeclarations: true`

### 3. Setup Scripts

> Goal: ตั้งค่า scripts ใน `package.json` ตาม `/follow-tasks`
> Goal: Scripts ครบ สอดคล้อง monorepo standards

1. เพิ่ม `dev`: `bun run src/presentation/cli.ts`
2. เพิ่ม `build`: `bunx bunup`
3. เพิ่ม `build:watch`: `bunx bunup --watch`
4. เพิ่ม `lint`: `bunx tsc --noEmit && bunx biome lint --write`
5. เพิ่ม `test`: `bun test`

### 4. Choose CLI Libraries and APIs

> Goal: ใช้ lightweight libraries และ Bun native APIs

1. ทำตาม `/use-bun-native-api` โดยใช้ `Bun.file`, `Bun.write`, `Bun.spawn`, `Bun.Glob` แทน `node:*`
2. ใช้ `picocolors` สำหรับสีใน terminal
3. ใช้ `cac` สำหรับ argument parsing และ command structure
4. หลีกเลี่ยง `chalk`, `commander` และ `node:fs`/`node:child_process` ถ้ามี Bun native equivalent

### 5. Development Workflow

> Goal: ใช้ development workflow ที่มีประสิทธิภาพ
> Goal: รันได้เร็ว แก้ไขได้ทันที

1. ใช้ `bun run dev` สำหรับ run CLI โดยตรง
2. ใช้ `bun run build:watch` สำหรับ watch build mode
3. ใช้ `bun run build` สำหรับ production build
4. รัน lint และ typecheck ก่อน commit

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Project Structure

- ใช้ Clean Architecture: `domain/`, `application/`, `adapters/`, `presentation/`, `shared/`
- `domain/` = pure business logic, ไม่มี side effects
- `presentation/cli.ts` = CLI entry point
- `src/index.ts` = library entry point

### 2. Build Configuration

- ใช้ `bunup` สำหรับ building — ดู `/follow-bunup` สำหรับ config options
- ตั้งค่า `dts.splitting: true` สำหรับ type declarations
- TypeScript: `declaration: true`, `isolatedDeclarations: true`
- ตั้งค่า `packages: "bundle"` ใน `bunup.config.ts` ถ้าต้องการ zero runtime dependencies

### 3. Scripts

- `dev` = run CLI โดยตรง (`bun run src/presentation/cli.ts`)
- `build:watch` = `bunx bunup --watch`
- ใช้ `bunx` แทน `npx`
- รัน lint และ typecheck ก่อน commit

### 4. Dependencies

- ใช้ `picocolors` แทน `chalk`
- ใช้ `cac` แทน `commander`
- ใช้ Bun native APIs (`Bun.file`, `Bun.write`, `Bun.spawn`, `Bun.Glob`) แทน `node:*` modules
- bundle dependencies ด้วย `bunup` เพื่อลด runtime dependencies ถ้าเหมาะสม

## Expected Outcome

- CLI project ที่มีโครงสร้าง Clean Architecture และ maintainable
- `bun run dev` รัน CLI ได้โดยตรง
- `bun run build` สร้าง dist/ พร้อม type declarations
- Scripts สอดคล้องกับ `/follow-tasks`

## Examples

```text
project/
├── src/
│   ├── domain/           # Pure business logic
│   ├── application/      # Orchestration layer
│   ├── adapters/         # External systems
│   ├── presentation/     # Entry points
│   │   └── cli.ts        # CLI entry
│   ├── shared/           # Common types, utils
│   └── index.ts          # Library entry
├── test/
├── package.json
├── bunup.config.ts
└── tsconfig.json
```

### package.json scripts

```json
"scripts": {
  "dev": "bun run src/presentation/cli.ts",
  "build": "bunx bunup",
  "build:watch": "bunx bunup --watch",
  "lint": "bunx tsc --noEmit && bunx biome lint --write",
  "test": "bun test"
}
```

### bunup.config.ts

```ts
import { defineConfig } from "bunup";

export default defineConfig({
  dts: { splitting: true },
});
```

## Guide

- `/follow-clean-architecture` — Clean Architecture structure
- `/follow-bunup` — Bunup bundler configuration
- `/follow-tasks` — Scripts standards
- `/use-bun-native-api` — Bun native APIs แทน Node.js
- [Bun Documentation](https://bun.sh/docs)
