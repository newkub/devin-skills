---
name: follow-tool-turborepo-config-pipeline
description: ตั้งค่า turbo.json tasks, dependsOn, inputs/outputs และ package-level overrides
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-build
  - run-test-all
---

## Goal

ตั้งค่า task pipeline ใน `turbo.json` ให้ถูกต้อง — `tasks`, `dependsOn`, `inputs`, `outputs`, `env` และ package-level overrides โดยไม่ clobber config เดิม

## Scope

ใช้เมื่อต้องแก้ `turbo.json` ที่ root หรือ package-level — ไม่ครอบคลุม install/layout (ดู `subskills/setup-turborepo/SKILL.md`) และ remote cache (ดู `subskills/optimize-cache/SKILL.md`)

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `turbo.json` ที่ root และทุก package-level `turbo.json` ที่มีอยู่
2. ตรวจ `package.json` scripts ของแต่ละ workspace — task names ใน `turbo.json` ต้อง map กับ scripts จริง
3. ถ้าไม่พบ `turbo.json` → ทำ `subskills/setup-turborepo/SKILL.md` ก่อน

### 2. Define Tasks

> Goal: กำหนด `tasks` ใน `turbo.json`

1. สร้าง entry ต่อ task: `build`, `test`, `lint`, `typecheck`, `dev`
2. ตั้ง `dependsOn` ตาม task graph — `^build` สำหรับ upstream dependencies, `build` สำหรับ same package
3. ตั้ง `outputs` สำหรับ build artifacts เช่น `["dist/**", ".next/**", "!.next/cache/**"]`
4. ตั้ง `inputs` ให้ชัดเจนเพื่อให้ cache hash ถูกต้อง (source files, ไม่รวม outputs)
5. ใช้ `cache: false` สำหรับ dev servers และ tasks ที่มี side effects
6. ใช้ `persistent: true` สำหรับ long-running tasks เช่น `dev`

### 3. Configure Environment Variables

> Goal: จัดการ env vars ให้ cache ถูกต้องและปลอดภัย

1. ใช้ `env` สำหรับ variables ที่ affect build output (ไม่มี `$` prefix) — เข้า cache hash
2. ใช้ `passThroughEnv` สำหรับ secrets ที่ tasks ต้องใช้แต่ไม่ควรเข้า hash
3. ไม่ hard-code secrets ใน `turbo.json` — ใช้ `/follow-secret-manager` ถ้าจำเป็น

### 4. Package-Level Overrides

> Goal: override config เฉพาะ package เมื่อจำเป็น

1. สร้าง `turbo.json` ใน package พร้อม `"extends": ["//"]` เพื่อ inherit จาก root
2. ใช้ `$TURBO_EXTENDS$` ใน arrays เพื่อ append แทน replace
3. ระบุ `outputs` และ `dependsOn` เฉพาะ package — ห้าม duplicate root config โดยไม่จำเป็น

### 5. Verify

> Goal: ตรวจว่า task graph ถูกต้อง

1. รัน `bunx turbo run <task> --dry=json` เพื่อ inspect task graph ก่อนรันจริง
2. รัน `bunx turbo run build` แล้วตรวจว่า dependency order ถูกต้อง
3. รันซ้ำเพื่อยืนยัน cache hit — ถ้าพัง → revert keys ที่แก้แล้ว report diff

## Rules

### 1. Config Discipline

- ใช้ `turbo.json` ที่ root พร้อม `$schema` เสมอ
- merge กับ config เดิม — ห้าม overwrite ทั้งไฟล์ถ้าไม่จำเป็น
- กำหนด `inputs`/`outputs` ให้ชัดเจน — cache correctness ขึ้นกับสิ่งนี้

### 2. Task Graph

- ใช้ `^task` สำหรับ upstream dependencies เสมอเมื่อ task ต้องการ output ของ deps
- ไม่สร้าง circular `dependsOn`
- task name ต้องตรงกับ `package.json` scripts ของ workspaces

### 3. Safety

- secrets → `passThroughEnv` เท่านั้น ห้ามใส่ `env` (เข้า cache hash = leak)
- verify ด้วย `--dry=json` ก่อนรันจริงเสมอ

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น
- ใช้ /run-test-all ถ้าจำเป็น

## Expected Outcome

- `turbo.json` มี task graph ถูกต้องพร้อม `dependsOn`/`inputs`/`outputs`
- Env vars แยก `env` vs `passThroughEnv` ถูกต้อง
- Package-level overrides inherit จาก root ถูกต้อง
- `--dry=json` แสดง graph ตามที่คาด
