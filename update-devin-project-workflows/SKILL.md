---
name: update-devin-project-workflows
description: สร้าง project-specific workflows สำหรับแต่ละ workspace โดยอ้างอิง global workflows
---

## Goal

สร้าง project-specific workflows ใน `.devin/workflows/` สำหรับแต่ละ workspace โดยแต่ละ workflow จะเรียก global workflow ที่ตรงกัน

## Scope

ใช้สำหรับสร้างและอัพเดท project-specific workflows ใน monorepo หรือ single project ที่มี `.devin` structure อยู่แล้ว

## Execute

### 1. Verify Devin Structure

ตรวจสอบว่า `.devin` structure มีอยู่แล้ว

> Goal: ยืนยันว่า .devin structure พร้อมใช้งาน

1. ตรวจสอบว่า `.devin/rules/` directory มีอยู่
2. ถ้าไม่มี ให้ทำ `/update-dot-devin` ก่อน
3. ตรวจสอบว่า `.devin/workflows/` directory มีอยู่ ถ้าไม่มีให้สร้าง

### 2. Analyze Project

วิเคราะห์ project เพื่อระบุ workspaces ที่ต้องมี project-specific workflows

> Goal: รู้ workspaces ทั้งหมดและ workflows ที่ต้องสร้าง

1. ทำ `/analyze-project` เพื่อดูภาพรวมโปรเจกต์
2. ระบุ workspaces ทั้งหมดจาก root `package.json` `workspaces` field
3. สำหรับแต่ละ workspace ให้ระบุชื่อที่จะใช้ใน workflow filename (เช่น `website`, `docs`, `mobile`, `claude-app`, `chatgpt-app`, `line-liff`, `shared`, `apple-business-connect`, `google-maps-booking`, `health`)

### 3. Create Monorepo-Level Workflows

สร้าง workflows ระดับ monorepo ที่ครอบคลุมทุก workspace

> Goal: มี workflows ระดับ monorepo สำหรับ refactor และ improve config

1. สร้าง `.devin/workflows/refactor-monorepo.md` — เรียก `/refactor` สำหรับทั้ง monorepo
2. สร้าง `.devin/workflows/improve-monorepo-config.md` — เรียก `/improve-all-skills` สำหรับ monorepo config

### 4. Create Workspace-Specific Workflows

สร้าง project-specific workflows สำหรับแต่ละ workspace โดยแต่ละ workflow เรียก global workflow ที่ตรงกัน

> Goal: แต่ละ workspace มี workflows เฉพาะ: review, ship, refactor, idea-features, realize-implementation

1. สำหรับแต่ละ workspace ให้สร้าง workflows ต่อไปนี้ใน `.devin/workflows/`:

`review-<workspace>.md` — เรียก `/review-codebase` สำหรับ workspace นั้น:
- ระบุ scope เป็น workspace path (เช่น `apps/website`)
- เรียก `/review-codebase` โดยจำกัด scope

`ship-<workspace>.md` — เรียก `/ship` สำหรับ workspace นั้น:
- ระบุ scope เป็น workspace path
- เรียก `/run-check`, `/run-test`, `/run-build` สำหรับ workspace นั้น

`refactor-<workspace>.md` — เรียก `/refactor` สำหรับ workspace นั้น:
- ระบุ scope เป็น workspace path
- เรียก `/refactor` โดยจำกัด scope

`idea-features-<workspace>.md` — เรียก `/idea-features` สำหรับ workspace นั้น:
- ระบุ scope เป็น workspace path
- เรียก `/idea-features` โดยจำกัด scope

`realize-implementation-<workspace>.md` — เรียก `/realize-implementation` สำหรับ workspace นั้น:
- ระบุ scope เป็น workspace path
- เรียก `/realize-implementation` โดยจำกัด scope

2. แต่ละ workflow ต้องมี frontmatter ตามมาตรฐาน `/follow-write-devin-skills`
3. แต่ละ workflow ต้องระบุ workspace path ใน Execute steps

### 5. Validate And Finalize

ตรวจสอบว่า workflows ทั้งหมดถูกต้องและเรียก global workflows ได้จริง

> Goal: Workflows ทั้งหมดถูกต้อง ไม่ซ้ำซ้อน เรียก global workflows ได้

1. ตรวจสอบว่าทุก workflow มี frontmatter ถูกต้องตาม `/follow-write-devin-skills`
2. ตรวจสอบว่าทุก workflow ระบุ workspace path ชัดเจน
3. ตรวจสอบว่าไม่มี workflows ซ้ำซ้อนกัน
4. ตรวจสอบว่า global workflows ที่อ้างอิงมีอยู่จริง
5. ทำ `/update-reference` หากมี file operations

## Rules

### 1. Workflow Types

- Monorepo-level: `refactor-monorepo.md`, `improve-monorepo-config.md` — ครอบคลุมทุก workspace
- Workspace-specific: `review-<workspace>.md`, `ship-<workspace>.md`, `refactor-<workspace>.md`, `idea-features-<workspace>.md`, `realize-implementation-<workspace>.md` — จำกัด scope เป็น workspace นั้น

### 2. Global Workflow Mapping

- `review-<workspace>` → เรียก `/review-codebase`
- `ship-<workspace>` → เรียก `/ship`
- `refactor-monorepo` → เรียก `/refactor` สำหรับทั้ง monorepo
- `improve-monorepo-config` → เรียก `/improve-all-skills`
- `refactor-<workspace>` → เรียก `/refactor` สำหรับ workspace นั้น
- `idea-features-<workspace>` → เรียก `/idea-features` สำหรับ workspace นั้น
- `realize-implementation-<workspace>` → เรียก `/realize-implementation` สำหรับ workspace นั้น

### 3. Frontmatter Format

- ทุกไฟล์ต้องมี `title`, `description`, `auto_execution_mode: 3`, และ `related` ใน frontmatter
- `title` ต้อง Title Case ตรงกับ filename
- `description` กระชับไม่เกิน 100 ตัวอักษร
- `related` ต้องมีเฉพาะ global workflows ที่เรียกโดยตรง

### 4. Content Language

- เนื้อหาทั้งหมดใน `.devin/workflows/` ต้องเป็นภาษาอังกฤษ
- ใช้ backticks สำหรับ `concepts`, `tools`, `terms`, และ `commands`

### 5. File Naming

- ตั้งชื่อไฟล์ด้วย `kebab-case.md`
- ใช้ชื่อ workspace จริงจาก `package.json` (เช่น `website`, `docs`, `mobile`)

### 6. Scope Specification

- แต่ละ workspace-specific workflow ต้องระบุ workspace path ชัดเจนใน Execute steps
- ห้ามเขียน workflow ที่ไม่ระบุ scope หรือระบุ scope กว้างเกินไป

## Expected Outcome

- `.devin/workflows/` มี monorepo-level workflows: `refactor-monorepo.md`, `improve-monorepo-config.md`
- `.devin/workflows/` มี workspace-specific workflows สำหรับแต่ละ workspace: `review-<workspace>.md`, `ship-<workspace>.md`, `refactor-<workspace>.md`, `idea-features-<workspace>.md`, `realize-implementation-<workspace>.md`
- ทุก workflow มี frontmatter ถูกต้องและเรียก global workflow ที่ตรงกัน
- ไม่มี workflows ซ้ำซ้อนกัน
