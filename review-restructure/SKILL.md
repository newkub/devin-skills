---
name: review-restructure
description: Review file/folder structure before restructure to plan relocation and dry-run
---

## Goal

Review file/folder structure BEFORE restructure เพื่อประเมิน structure health, ระบุปัญหา naming, grouping, barrel exports, import alias complexity, และจัดทำ relocation plan พร้อม dry-run preview โดยไม่ดำเนินการ restructure จริง

## Scope

ใช้ก่อนเรียก `restructure` หรือ `relocation` เพื่อทำความเข้าใจ structure ปัจจุบันและวางแผนการย้าย ครอบคลุม: file naming conventions, folder domain grouping, long files, barrel exports, import alias complexity, flat vs nested structure, dry-run preview input ไม่รวมการย้ายไฟล์จริง — เป็น review เท่านั้น

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ conventions ก่อน review

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ directory tree
2. อ่าน `AGENTS.md` เพื่อทราบ naming conventions และ structure rules
3. ระบุ source directories ที่ต้อง review
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze File Naming

> Goal: ตรวจสอบ file naming conventions

1. ทำ `/scan-codebase` เพื่อ list ไฟล์ทั้งหมดใน source directories
2. ตรวจสอบ naming conventions ตาม [references/file-naming.md](references/file-naming.md)
3. ระบุไฟล์ที่ชื่อไม่สะท้อน responsibility หรือไม่ตรง convention
4. บันทึก: file, current name, issue, suggested name

### 3. Analyze Folder Grouping

> Goal: ตรวจสอบ folder domain grouping

1. ทำ `/follow-folder-quality` เพื่อประเมิน folder quality
2. ตรวจสอบ domain grouping ตาม [references/folder-grouping.md](references/folder-grouping.md)
3. ตรวจสอบ mixed concerns: logic, test, config, generated ปนกัน
4. ตรวจสอบ nesting depth: เกิน 5 ระดับ หรือ flat เกินไป
5. บันทึก: folder, file count, quality issues, restructure candidate, priority

### 4. Analyze Long Files

> Goal: ระบุไฟล์ที่ยาวเกิน threshold ใน context ของ restructure

1. ทำ `/check-long-files` เพื่อหาไฟล์ที่ยาวกว่า 250 บรรทัด
2. ระบุไฟล์ที่ต้อง split ก่อนหรือหลัง relocation
3. บันทึก: file, line count, split needed, affects relocation

### 5. Analyze Barrel Exports And Import Aliases

> Goal: ตรวจสอบ barrel exports และ import alias complexity

1. ตรวจสอบ barrel exports ตาม [references/barrel-exports.md](references/barrel-exports.md)
2. ใช้ `sg outline --items imports <paths>` เพื่อตรวจสอบ import patterns
3. ค้นหา relative imports ที่ซับซ้อน (`../../../`)
4. ตรวจสอบ import alias configuration ใน `tsconfig.json`, `vite.config.ts`, `package.json`
5. รัน `madge --circular --extensions ts,tsx` สำหรับ circular dependencies
6. บันทึก: file, barrel issue, alias complexity, recommended action

### 6. Analyze Flat Vs Nested Structure

> Goal: ประเมินว่า structure ควรเป็น flat หรือ nested

1. ตรวจสอบ nesting depth ของ directory tree
2. ประเมินตาม `/follow-flat-folders` ว่าควร flatten บางส่วนหรือไม่
3. ประเมินตาม `/follow-ordering` ว่าการจัดเรียงไฟล์ใน folder เหมาะสมหรือไม่
4. บันทึก: directory, current depth, recommended depth, flatten/keep

### 7. Calculate Structure Health Score

> Goal: คำนวณ structure health score

1. รวบรวม metrics จาก Step 2-6 ตาม [references/structure-health.md](references/structure-health.md)
2. คำนวณ structure health score จาก metrics
3. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
4. บันทึก baseline สำหรับเปรียบเทียบหลัง restructure

### 8. Build Relocation Plan

> Goal: สร้าง relocation plan พร้อม dry-run preview

1. รวม findings จาก Step 2-6 เป็น relocation candidates
2. กำหนด target folder สำหรับแต่ละไฟล์ตาม domain และ responsibility
3. ตรวจสอบ dependency direction ก่อนวางแผนย้าย
4. จัดลำดับการย้ายตาม dependency direction (foundation ก่อน)
5. สร้าง mapping: old path → new path
6. สร้าง dry-run preview แสดง before/after structure
7. ระบุ files ที่ต้อง update imports หลังย้าย

### 9. Report

> Goal: รายงาน structure health และ relocation plan

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Structure Health Metrics: metric, count, threshold, status
3. สร้างตาราง Relocation Plan: file, old path, new path, reason, priority
4. แสดง dry-run preview ของ structure before/after
5. แสดง structure health score พร้อม grade
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่ย้ายไฟล์หรือแก้ไข structure ระหว่าง review
- แยก review process จาก restructure process
- ถ้าต้อง restructure ให้ทำ `restructure` หรือ `relocation` หลัง review

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path หรือ folder path
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

### 3. Dry-Run Preview

- แสดง dry-run preview ก่อนทุกครั้ง ไม่ดำเนินการย้ายจริง
- ระบุ old path → new path mapping ชัดเจน
- ระบุ files ที่ต้อง update imports

### 4. Structure Health Scoring

- 5 metrics หลัก: file naming, folder grouping, barrel exports, import complexity, nesting depth
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Structure health score = (total score / 5) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Relocation Safety

- ตรวจสอบ dependency direction ก่อนวางแผนย้าย
- จัดลำดับการย้ายตาม dependency direction (foundation ก่อน)
- ระบุ files ที่ต้อง update imports หลังย้าย
- ไม่วางแผนย้ายที่สร้าง circular dependencies

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Structure Health Metrics พร้อม status indicators
- รายงานตาราง Relocation Plan พร้อม old path, new path, reason, priority
- Dry-run preview ของ structure before/after
- Structure health score พร้อม grade
- ไม่มีการย้ายไฟล์จริง — เป็น review เท่านั้น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
