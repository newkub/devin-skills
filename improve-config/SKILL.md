---
name: improve-config
description: ปรับปรุง project config ครบถ้วนด้วย follow-tasks, improve-efficiency, follow-config
---

## Goal

ปรับปรุง configuration ของ project ให้ครบถ้วน ถูกต้อง และสอดคล้องกับ tech stack ทั้ง root และทุก workspace ใน monorepo

## Scope

ใช้สำหรับ project ที่มี package manifest และ config files ใน root หรือ monorepo ครอบคลุม scripts, build config, shared config, lint, format, git hooks, CI/CD

## Execute

### 1. Analyze Project

> Goal: วิเคราะห์ project และ workspaces ทั้งหมด
> Goal: เข้าใจ tech stack, structure, และ scope ของ config ที่ต้องปรับปรุง

1. ทำ `/follow-monorepo` เพื่อตรวจสอบและจัดระเบียบ monorepo
2. ทำ `/all-workspaces` เพื่อระบุทุก workspace ที่ต้องประมวลผล
3. ทำ `/analyze-project` เพื่อวิเคราะห์ tech stack, package manager, build tool
4. ถ้าเป็น monorepo ให้อ่าน `package.json` ทั้ง root และทุก workspace

### 2. Plan Configuration Improvements

> Goal: วางแผนการปรับปรุง config
> Goal: มีแผนครอบคลุมทุกจุดก่อนลงมือแก้ไข

1. ทำ `/deep-plan` ถ้างานซับซ้อนสูงหรือหลาย workspace
2. ระบุ config files ที่ขาดหรือล้าสมัยในแต่ละ workspace
3. ระบุ dependencies ที่ต้อง update หรือเพิ่ม
4. จัดลำดับ priority: foundation (root) → shared packages → apps

### 3. Improve Tasks And Scripts

> Goal: ปรับปรุง scripts ใน package manifest
> Goal: ทุก workspace มี scripts ตามมาตรฐานและสอดคล้อง tech stack

1. ทำ `/follow-tasks` สำหรับ root และแต่ละ workspace
2. ตรวจสอบ scripts หลัก: `dev`, `build`, `typecheck`, `lint`, `format`, `test`, `scan`, `check`, `verify`, `ci`
3. ถ้า operations มากกว่า 10 ไฟล์ ให้ใช้ `/use-scripts` สำหรับ batch update

### 4. Optimize Build Configuration

> Goal: ปรับปรุง build configuration
> Goal: build เร็วขึ้น output เล็กลง โดยไม่ทำลาย functionality

1. ทำ `/improve-efficiency` สำหรับ build config แต่ละ workspace
2. ตรวจสอบ `minify`, `sourcemap`, `external`, `tree-shaking`, `target`
3. บันทึก before/after metrics สำหรับ build time และ output size

### 5. Fix Shared Configuration

> Goal: ตั้งค่า shared config files
> Goal: config files สอดคล้องกันทั้ง monorepo

1. ทำ `/follow-config` ตาม tech stack ที่ detect ได้
2. ตรวจสอบ root-level config: `biome.jsonc`, `tsconfig.json`, `turbo.json`, `lefthook.yml`, `.gitignore`
3. ตรวจสอบ workspace-specific overrides ให้ extend จาก root ได้ถูกต้อง
4. ทำ `/follow-dot-vscode` และ `/follow-dot-github` ถ้าจำเป็น

### 6. Validate And Commit

> Goal: ตรวจสอบผลลัพธ์และ commit
> Goal: config ถูกต้องและพร้อมใช้งาน

1. ทำ `/run-check` เพื่อตรวจ lint, typecheck, scan
2. ทำ `/run-verify` ถ้ามี test suite
3. ทำ `/git-commit` เพื่อ commit การเปลี่ยนแปลง
4. ทำ `/ask-me` เพื่อถามว่าจะ `/git-push` หรือ `/run-release` ต่อไหม

## Rules

### 1. Monorepo First

- ทำ `/follow-monorepo` ก่อนเสมอถ้าเป็น monorepo
- ตั้งค่า root ก่อน แล้วค่อยตั้งค่า workspaces
- ใช้ workspace protocol สำหรับ internal dependencies
- หลีกเลี่ยง circular dependencies

### 2. Minimal Changes

- แก้ไขเฉพาะ config ที่จำเป็น
- ไม่แก้ไข source logic หรือ public API
- ไม่ลบ config ที่ยังใช้งานอยู่

### 3. Consistency Across Workspaces

- Root config เป็น base สำหรับทุก workspace
- Workspace config ควร override เฉพาะที่จำเป็น
- Scripts ใน package.json ควรสอดคล้องกัน

### 4. Safety

- บันทึก baseline ก่อน optimize build
- รัน verify ก่อน commit
- ใช้ `/ask-me` ก่อน push หรือ release

## Expected Outcome

- Config ทั้ง root และ workspaces ครบถ้วนและสอดคล้องกัน
- Scripts ทุก workspace ตามมาตรฐาน
- Build config ถูก优化และมี metrics เปรียบเทียบ
- Shared config files ถูกต้อง
- ผ่าน `/run-check` และ `/run-verify`
- มี commit พร้อม next action จาก `/ask-me`
