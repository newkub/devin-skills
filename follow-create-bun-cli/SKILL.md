---
name: follow-create-bun-cli
description: สร้าง CLI applications ด้วย Bun runtime ตาม context และ best practices
related:
  - follow-create-cli
  - follow-create-web
  - follow-tool-bunup
  - follow-architecture
  - follow-flat-folders
  - rethink
  - follow-my-tech-stack
  - review-techstack
  - review-architecture
---
## Goal

สร้าง CLI applications ด้วย Bun runtime ที่มีประสิทธิภาพสูง โครงสร้างตาม context

## Scope

ใช้สำหรับสร้าง CLI applications ด้วย Bun runtime — ไม่ครอบคลุม library bundling (ดู `/follow-tool-bunup`) — ถ้ายังไม่ชัด Bun หรือ Rust ให้ใช้ `/follow-create-cli` เลือก stack ก่อน

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Project Structure

> Goal: สร้างโครงสร้างโปรเจกต์ตาม architecture ที่เหมาะสม

1. ทำ `/follow-architecture` หรือ `/review-architecture` เพื่อเลือก architecture ตาม context
2. เลือก structure ตามลักษณะงาน:
   - CLI ง่ายๆ → `src/cli/`, `src/commands/`, `src/index.ts`, `src/utils/`
   - ต้อง support หลาย output/consumer → `src/core/`, `src/shell/`, `src/cli/`, `src/index.ts`
   - มีหลาย adapter ซับซ้อน → `src/core/`, `src/ports/`, `src/app/`, `src/adapters/`, `src/presentation/cli.ts`
3. สร้าง entry points ตาม architecture ที่เลือก เช่น `src/cli.ts`, `src/index.ts`, หรือ `src/presentation/cli.ts`
4. ถ้า directory ซ้อนลึกเกิน 3 ระดับและไม่จำเป็น → ทำ `/follow-flat-folders`

### 3. Configure Build Tools

> Goal: ตั้งค่า build tools สำหรับ production

1. ติดตั้ง `bunup` ด้วย `bun add -d bunup`
2. สร้าง `bunup.config.ts` พร้อม `dts.splitting: true`
3. ติดตั้ง `picocolors` แทน `chalk` สำหรับ terminal colors
4. ติดตั้ง `cac` แทน `commander` สำหรับ argument parsing
5. ตั้งค่า `tsconfig.json`: `declaration: true`, `isolatedDeclarations: true`

### 4. Setup Scripts

> Goal: ตั้งค่า scripts ใน `package.json` ตาม `/follow-tasks`

1. เพิ่ม `dev`: `bun run <cli-entry>` โดย `<cli-entry>` อาจเป็น `src/cli.ts` หรือ `src/presentation/cli.ts` ตาม architecture ที่เลือก
2. เพิ่ม `build`: `bunx bunup`
3. เพิ่ม `build:watch`: `bunx bunup --watch`
4. เพิ่ม `lint`: `bunx tsc --noEmit && bunx biome lint --write`
5. เพิ่ม `test`: `bun test`

### 5. Choose CLI Libraries and APIs

> Goal: ใช้ lightweight libraries และ Bun native APIs

1. ทำตาม `/use-bun-native-api` โดยใช้ `Bun.file`, `Bun.write`, `Bun.spawn`, `Bun.Glob` แทน `node:*`
2. ใช้ `picocolors` สำหรับสีใน terminal
3. ใช้ `cac` สำหรับ argument parsing และ command structure
4. หลีกเลี่ยง `chalk`, `commander` และ `node:fs`/`node:child_process` ถ้ามี Bun native equivalent

ดู [references/bun.md](references/bun.md) สำหรับ Bun native APIs และ CLI libraries เต็ม

### 6. Development Workflow

> Goal: ใช้ development workflow ที่มีประสิทธิภาพ

1. ใช้ `bun run dev` สำหรับ run CLI โดยตรง
2. ใช้ `bun run build:watch` สำหรับ watch build mode
3. ใช้ `bun run build` สำหรับ production build
4. รัน lint และ typecheck ก่อน commit

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Project Structure

- เลือก architecture ตาม context โดยไม่บังคับ Clean หรือ Layered
- CLI ง่ายๆ → แยก `src/cli/`, `src/commands/`, `src/index.ts`, `src/utils/`
- มีหลาย output/consumer → แยก `src/core/`, `src/shell/`, `src/cli/`, `src/index.ts`
- มีหลาย adapter ซับซ้อน → ใช้ `src/core/`, `src/ports/`, `src/app/`, `src/adapters/`
- `presentation/cli.ts` หรือ `src/cli.ts` เป็น CLI entry point ตาม architecture ที่เลือก
- `src/index.ts` = library entry point

### 2. Build Configuration

- ใช้ `bunup` สำหรับ building — ดู `/follow-tool-bunup` สำหรับ config options
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

ดู [references/bun.md](references/bun.md) สำหรับ Bun native APIs และ library versions

## Expected Outcome

- CLI project ที่มีโครงสร้างตาม architecture ที่เลือกและ maintainable
- Directory ไม่ซ้อนลึกเกินไป (ใช้ `/follow-flat-folders` ถ้าจำเป็น)
- `bun run dev` รัน CLI ได้โดยตรง
- `bun run build` สร้าง dist/ พร้อม type declarations
- Scripts สอดคล้องกับ `/follow-tasks`

## Examples

```text
project/
├── src/
│   ├── cli/              # CLI parsing
│   ├── commands/         # Command handlers
│   ├── services/         # Business logic
│   ├── types/            # Shared types
│   ├── utils/            # Utilities
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

- `/follow-architecture` — architecture selection
- `/follow-runtime-bun` — Bun runtime setup, install, test, build
- `/follow-tool-bunup` — Bunup bundler configuration
- `/follow-tasks` — Scripts standards
- `/use-bun-native-api` — Bun native APIs แทน Node.js
- [Bun Documentation](https://bun.sh/docs)
