---
name: update-review-cli
description: อัปเดต tools/review-codebase CLI ให้ keep up ทันกับ codebase features
related:
  - review-codebase-everything
  - update-create-analyze-cli
  - update-project-rules
  - run-review
  - deep-analyze-by-use-scripts
  - scan-codebase
  - analyze-project
---

## Goal

อัปเดต `tools/review-codebase` CLI ให้ครอบคลุม features ที่มีอยู่ใน codebase ปัจจุบัน

## Scope

- ใช้กับ monorepo ที่มี `tools/review-codebase`
- ตรวจสอบ codebase features, package manifest, AGENTS.md
- อัปเดต analyzers ใน `tools/analyze` ผ่าน `/update-create-analyze-cli`
- อัปเดต `tools/review-codebase` ให้ integrate analyzers ใหม่
- validate ด้วย `/run-review`

## Execute

### 1. Scan Codebase Features

> Goal: เข้าใจ features ที่มีใน codebase

1. ทำ `/scan-codebase` เพื่อดู structure, tech stack, packages
2. ทำ `/analyze-project` เพื่อดู features หลัก
3. อ่าน `AGENTS.md` และ `docs/project/features.md` ถ้ามี
4. ระบุ features ใหม่ที่ยังไม่มี analyzer ครอบคลุม

### 2. Update Project Rules

> Goal: มั่นใจว่า skills/rules ครอบคลุม dependencies และ features

1. ทำ `/update-project-rules` เพื่อสร้าง skills ที่ขาดจาก dependencies
2. ตรวจสอบว่า `AGENTS.md` และ `.devin/rules` อัปเดตตาม features ใหม่
3. ถ้ามี skill หรือ rule ขาด → สร้างหรืออัปเดต

### 3. Update Analyze CLI

> Goal: เพิ่ม/อัปเดต analyzers ตาม features ใหม่

1. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze`
2. ตรวจสอบ categories ครอบคลุม features ทั้งหมด
3. ถ้า categories น้อยกว่า 60 หรือ feature ใหม่ไม่มี analyzer → เพิ่ม analyzer

### 4. Integrate And Validate

> Goal: ให้ `tools/review-codebase` รันได้กับ features ใหม่

1. ตรวจสอบ `tools/review-codebase/src/application/review.ts` import analyzers ใหม่
2. รัน `bun --filter tools-review-codebase typecheck`
3. รัน `bun --filter tools-review-codebase lint`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 5. Report

> Goal: สรุปสถานะด้วยตารางที่มี sub-row / grouping ตาม phase

1. ใช้ `/report-table` จัดรูปแบบ report
2. ทุกตารางต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... ตามลำดับของแถว
3. แบ่ง report เป็น 4–5 ตารางตาม phase:
   - Table 1 — Codebase Features Discovered
     - col: `No.`, `Category`, `Feature`, `Evidence`, `Status`, `Notes`
   - Table 2 — Analyzer Update Log
     - col: `No.`, `Category`, `Type`, `Analyzer`, `Solution / Action Taken`, `Status`, `Evidence`
   - Table 3 — Analyzer Quality & Risk
     - col: `No.`, `Analyzer`, `Risk / Impact`, `Need Verify`, `Notes / Details`
   - Table 4 — Validation & CLI Output UX
     - col: `No.`, `Check`, `Command / Output`, `Status`, `Evidence`, `UX/UI Note`
   - Table 5 — Next Actions (ถ้ามี)
     - col: `No.`, `Action`, `Priority`, `Owner`, `Notes`
4. ลำดับ col ในแต่ละ table ให้ follow หลักการ: `No. → What → Type/How → Result → Proof → Extra`
5. ใช้สัญลักษณ์สถานะ `✅` `❌` `⚠️` ตาม `/report-table`
6. ถ้า solution ยาวเกิน 1–2 บรรทัด ให้ย้าย detail ไป `Notes / Details` หรือสร้าง report ไฟล์แยก
7. ท้าย report ทำ `/suggest-next-action` เสมอ

## Rules

### 1. Keep In Sync

- อัปเดต CLI ทุกครั้งที่ codebase มี features ใหม่หรือ dependencies ใหม่
- ไม่ duplicate analyzer logic ระหว่าง `tools/analyze` และ `tools/review-codebase`

### 2. Evidence-Based

- ทุก analyzer ต้องมี evidence จาก codebase จริง
- ไม่เพิ่ม category ที่ไม่มี feature รองรับ

### 3. Validate Before Ship

- รัน review-codebase ให้ผ่านก่อนใช้งาน
- ถ้ามี analyzer error ให้แก้ไขก่อน

- ใช้ /review-codebase-everything ถ้าจำเป็น
- ใช้ /deep-analyze-by-use-scripts ถ้าจำเป็น

## Expected Outcome

- `tools/review-codebase` ครอบคลุม features ปัจจุบัน
- `tools/analyze` มี analyzers ครบ categories
- ผ่าน `/run-review` โดยไม่มี analyzer errors
- `AGENTS.md` และ rules อัปเดตตาม codebase
