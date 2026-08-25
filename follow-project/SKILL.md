---
name: follow-project
description: อัปเดต project documentation, config, rules, และ tooling ให้ครบถ้วนและสอดคล้องกัน
---

## Goal

อัปเดต project ทังหมดให้สอดคล้องกันในครั้งเดียว ตาม execution order ทีกำหนด

## Scope

ใช้สำหรับ project ที่ต้องการ update docs, config, rules, และ tooling

## Execute

### 1. Detect Project Structure

> Goal: ตรวจสอบ project ก่อน update

1. อ่าน root `package.json`
2. อ่าน `AGENTS.md` ถ้ามี
3. ตรวจสอบ `docs/`, `rules/`, `.devin/`, `.vscode/`
4. ระบุ orchestration tools (moon, turbo)

### 2. Run Updates In Order

> Goal: รัน update ตามลำดับ

1. `/follow-ci-cd` (ถ้าต้องการตรวจสอบหรือตั้งค่า CI/CD)
2. `/update-dot-devin`
3. `/cleanup-files-in-project` (ถ้าจำเป็น)
3. `/update-readme`
4. `/update-agents-md`
5. `/update-docs` (ถ้ามี `docs/`)
6. `/update-rules` (ถ้ามี `sgconfig.yml` และ `rules/`)
7. `/update-create-review-cli` (ถ้ามี `tools/review/`)
8. `/follow-dot-vscode`
9. `/update-contributing-md`

### 3. Coordinate Config

> Goal: ตรวจสอบ config files

1. ทำ `/follow-config` เพื่อ sync config ทั้งหมด
2. ทำ `/follow-gitignore` เพื่อ sync `.gitignore`
3. ตรวจสอบว่า scripts ใน `package.json` สอดคล้องกัน

### 4. Validate

> Goal: ตรวจสอบผลลัพธ์

1. ทำ `/validate`
2. รัน `git diff --check`
3. รัน checks ตาม project เช่น `bun run scan`, `bun run lint`

### 5. Report

> Goal: สรุปผล

1. รายงาน files ทีเปลี่ยน
2. รายงาน checks ทีผ่าน/ไม่ผ่าน
3. ระบุ next actions ถ้ามี

## Rules

### 1. Idempotency

- รัน follow-project ซ้ำได้โดยไม่เกิด side effects
- ไม่ลบหรือ overwrite โดยไม่ dry run

### 2. Conditionality

- รัน steps ทีมี conditions ตามทีกำหนด (เช่น ถ้ามี `docs/`)
- ข้าม steps ทีไม่จำเป็น

### 3. Validation

- รัน validation หลัง update
- ไม่อ้างว่า check ผ่าน ถ้า command fail

## Expected Outcome

- Project docs, config, rules, และ tooling sync กัน
- ผ่าน validation ตาม project
- รายงานผลชัดเจน

## Addendum

- `/follow-project` ต้องเรียก `/follow-monorepo` ก่อนเสมอ (Step 1) เพื่อ detect monorepo และเรียงลำดับ workspace ก่อนเริ่ม update
