---
name: follow-create-rolldown-plugins
description: สร้าง Rolldown plugins ด้วย TypeScript สำหรับ Rust-based bundler
related:
  - follow-create-bun-cli
  - follow-create-sdk
  - follow-create-vite-plugins
  - follow-lang-typescript
  - run-test
  - follow-my-tech-stack
  - review-techstack
  - report-table
---
## Goal

สร้าง Rolldown plugins ด้วย TypeScript ทีทำงานกับ Rolldown bundler, รองรับ Universal hooks, hook filters, virtual modules, และ build package

## Scope

ใช้สำหรับสร้าง JavaScript/TypeScript plugins สำหรับ Rolldown หรือ Vite 8+ ครอบคลุม plugin object, hooks, filters, build, และ tests

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Project

> Goal: สร้าง plugin package

1. สร้าง directory `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย name `rolldown-plugin-{name}` หรือ `unplugin-{name}`
3. ติดตั้ง `rolldown`, `typescript`, `@types/bun`
4. สร้าง `tsconfig.json`

### 3. Create Plugin Object

> Goal: implement plugin factory

1. สร้าง `src/index.ts` ด้วย factory function
2. return object ด้วย `name` ที่ required
4. ใช้ hook filters สำหรับลด overhead

### 4. Add Hooks

> Goal: ใช้ Rolldown plugin API

1. `options` — แก้ input options
2. `buildStart` — เริ่ม build
3. `resolveId` — resolve import
4. `load` — โหลด module
5. `transform` — แปลง code
6. `buildEnd` / `closeBundle` — cleanup

### 5. Configure Hook Filters

> Goal: ลด overhead ระหว่าง Rust และ JS

1. ใช้ `filter: { id: regex }` ใน `resolveId`, `load`, `transform`
2. คืน `null` เร็วถ้าไม่ match

### 6. Build Package

> Goal: build สำหรับ npm

1. ติดตั้ง `tsup` หรือ `bun build`
2. external `rolldown`
3. output `esm` และ `cjs`
4. ระบุ `types`, `main`, `exports` ใน `package.json`

### 7. Add Tests

> Goal: ทดสอบ plugin

1. สร้าง `test/plugin.test.ts`
2. ใช้ `rolldown.build(...)` ด้วย plugin
3. ตรวจสอบ output bundle
4. รัน `bun test`

### 8. Add Examples

> Goal: สร้างตัวอย่างใช้งาน

1. สร้าง `examples/basic/` ด้วย plugin พื้นฐาน
2. สร้าง `examples/virtual-module/` ด้วย resolveId + load
3. รันตัวอย่างให้ผ่าน

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-verify-cicd`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- ใช้ `name` ที่ unique สำหรับ plugin
- ใช้ `rolldown-plugin-{name}` สำหรับ Rolldown-specific
- ใช้ `unplugin-{name}` ถ้ารองรับหลาย bundlers
- หลีกเลี่ยง `moduleParsed` hook ใน dev mode
- ใช้ hook filters สำหรับ `resolveId`, `load`, `transform`
- external `rolldown` และ `vite` ใน build

- ใช้ /follow-create-bun-cli ถ้าจำเป็น
- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-create-vite-plugins ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /report-table ถ้าจำเป็น

## Expected Outcome

- Rolldown plugin build ผ่าน
- Plugin รันกับ `rolldown.build` ได้
- Hook filters ลด overhead
- Tests และ examples ผ่าน
- สามารถใช้กับ Vite 8+ ได้

