---
name: follow-create-rolldown-plugins
description: สร้าง Rolldown plugins ด้วย TypeScript สำหรับ Rust-based bundler
related:
  - follow-create-bun-cli
  - follow-create-sdk
  - follow-create-vite-plugins
  - follow-lang-typescript
  - run-test
  - report-table
---
## Goal

สร้าง Rolldown plugins ด้วย TypeScript ทีทำงานกับ Rolldown bundler, รองรับ Universal hooks, hook filters, virtual modules, และ build package

## Scope

ใช้สำหรับสร้าง JavaScript/TypeScript plugins สำหรับ Rolldown หรือ Vite 8+ ครอบคลุม plugin object, hooks, filters, build, และ tests

## Execute

### 1. Setup Project

> Goal: สร้าง plugin package

1. สร้าง directory `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย name `rolldown-plugin-{name}` หรือ `unplugin-{name}`
3. ติดตั้ง `rolldown`, `typescript`, `@types/bun`
4. สร้าง `tsconfig.json`

### 2. Create Plugin Object

> Goal: implement plugin factory

1. สร้าง `src/index.ts` ด้วย factory function
2. return object ด้วย `name` ที่ required
4. ใช้ hook filters สำหรับลด overhead

### 3. Add Hooks

> Goal: ใช้ Rolldown plugin API

1. `options` — แก้ input options
2. `buildStart` — เริ่ม build
3. `resolveId` — resolve import
4. `load` — โหลด module
5. `transform` — แปลง code
6. `buildEnd` / `closeBundle` — cleanup

### 4. Configure Hook Filters

> Goal: ลด overhead ระหว่าง Rust และ JS

1. ใช้ `filter: { id: regex }` ใน `resolveId`, `load`, `transform`
2. คืน `null` เร็วถ้าไม่ match

### 5. Build Package

> Goal: build สำหรับ npm

1. ติดตั้ง `tsup` หรือ `bun build`
2. external `rolldown`
3. output `esm` และ `cjs`
4. ระบุ `types`, `main`, `exports` ใน `package.json`

### 6. Add Tests

> Goal: ทดสอบ plugin

1. สร้าง `test/plugin.test.ts`
2. ใช้ `rolldown.build(...)` ด้วย plugin
3. ตรวจสอบ output bundle
4. รัน `bun test`

### 7. Add Examples

> Goal: สร้างตัวอย่างใช้งาน

1. สร้าง `examples/basic/` ด้วย plugin พื้นฐาน
2. สร้าง `examples/virtual-module/` ด้วย resolveId + load
3. รันตัวอย่างให้ผ่าน

### 8. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- ใช้ `name` ที่ unique สำหรับ plugin
- ใช้ `rolldown-plugin-{name}` สำหรับ Rolldown-specific
- ใช้ `unplugin-{name}` ถ้ารองรับหลาย bundlers
- หลีกเลี่ยง `moduleParsed` hook ใน dev mode
- ใช้ hook filters สำหรับ `resolveId`, `load`, `transform`
- external `rolldown` และ `vite` ใน build

## Expected Outcome

- Rolldown plugin build ผ่าน
- Plugin รันกับ `rolldown.build` ได้
- Hook filters ลด overhead
- Tests และ examples ผ่าน
- สามารถใช้กับ Vite 8+ ได้
