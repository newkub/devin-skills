---
name: follow-create-github-action
description: สร้าง GitHub Action ด้วย TypeScript/Composite/Docker
related:
  - follow-create-sdk
  - follow-create-bun-cli
  - follow-dot-github
  - run-test
  - follow-release
  - report-table
---

## Goal

สร้าง GitHub Action ทีสามารถรันใน workflow ได้ รองรับ TypeScript, Composite, และ Docker actions พร้อม `action.yml`, build, tests, และ release

## Scope

ใช้สำหรับสร้าง action สำหรับ GitHub Marketplace หรือ private repos ครอบคลุม inputs, outputs, runs, branding, และ `dist/` สำหรับ TS actions

## Execute

### 1. Choose Action Type

> Goal: เลือกประเภท action

1. ถ้าต้องการ logic ซับซ้อน: ใช้ `node20` + TypeScript
2. ถ้าต้องการรวมหลาย commands: ใช้ `composite`
3. ถ้าต้องการ environment ควบคุม: ใช้ `docker`
4. ระบุ inputs และ outputs ทีต้องการ

### 2. Setup Project

> Goal: สร้างโครงสร้าง action

1. สร้าง repo หรือ directory สำหรับ action
2. สร้าง `action.yml` ที root
3. สร้าง `README.md` บอกวิธีใช้
4. สร้าง `.github/workflows/ci.yml` สำหรับ test action

### 3. Write action.yml

> Goal: กำหนด manifest ของ action

1. ระบุ `name`, `description`, `author`, `branding`
2. ระบุ `inputs` พร้อม `required`, `default`, `description`
3. ระบุ `outputs` สำหรับผลลัพธ์
4. ระบุ `runs.using` เป้น `node20`, `composite`, หรือ `docker`
5. ดูตัวอย่างใน `references/github-action.md`

### 4. Implement Logic

> Goal: เขียน logic ของ action

1. ถ้า TypeScript: สร้าง `src/index.ts` ใช้ `@actions/core`, `@actions/github`
2. ถ้า Composite: สร้าง `steps` ด้วย `run` และ `shell`
3. ถ้า Docker: สร้าง `Dockerfile` และ `entrypoint.sh`
4. จัดการ secrets ด้วย `core.getInput()` ไม่ hardcode

### 5. Build TypeScript Action

> Goal: build `dist/index.js` สำหรับ TypeScript

1. ติดตั้ง `esbuild`, `@vercel/ncc`, หรือ `rollup`
2. รัน `bun run build` เพื่อ bundle `src/index.ts` → `dist/index.js`
3. รวม `licenses.txt` ถ้าใช้ `ncc`
4. commit `dist/` เข้า repo

### 6. Add Tests

> Goal: ทดสอบ action

1. สร้าง `__tests__/index.test.ts` สำหรับ mock inputs
2. ใช้ `vitest` หรือ `bun:test`
3. สร้าง `.github/workflows/test.yml` เพื่อรัน action บน `workflow_call` หรือ `push`
4. ตรวจสอบ outputs และ side effects

### 7. Release

> Goal: สร้าง release tags

1. สร้าง git tag `v1.0.0`
2. ย้าย major tag `v1` ไป commit ล่าสุด
3. สร้าง GitHub release พร้อม release notes
4. ทำ `/ship`

## Rules

- ใช้ `@actions/core` สำหรับ inputs/outputs/exports
- ไม่ log secrets หรือ credentials
- TypeScript action ต้อง commit `dist/index.js`
- ตั้ง `branding.icon` และ `branding.color` ใน `action.yml`
- ใช้ major version tags (`v1`) สำหรับ consumers
- ทดสอบ action บน GitHub runner ก่อน release
- ดู `references/github-action.md` สำหรับ action.yml spec และ toolkit

## Expected Outcome

- `action.yml` valid และ `name` ไม่ซ้ำ
- TypeScript action มี `dist/index.js` อัปเดต
- Tests ผ่าน
- Action รันได้ใน GitHub workflow
- Release tags `v1` และ `v1.0.0` ถูกต้อง
