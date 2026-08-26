---
name: report-git-diff
description: รายงาน git diff พร้อมสรุปการเปลี่ยนแปลง สถิติ และ insights ในรูปแบบที่อ่านง่าย
argument-hint: "[ref]"
---

## Goal

รายงาน git diff ในรูปแบบที่อ่านง่าย พร้อมสรุปการเปลี่ยนแปลง สถิติ และ insights โดยไม่แก้ไขไฟล์

## Scope

ใช้สำหรับการรายงาน git diff ทั้ง staged, unstaged, ระหว่าง commits, และระหว่าง branches — ไม่รวมการ commit หรือ stage changes (ใช้ `/git-commit` แทน)

## Execute

### 1. Determine Diff Scope

> Goal: ระบุขอบเขตของ diff ที่ต้องการรายงาน

1. ถามผู้ใช้หรืออนุมานจาก context ว่าต้องการ diff แบบใด:
   - Unstaged: `git diff`
   - Staged: `git diff --cached`
   - All changes: `git diff HEAD`
   - Between commits: `git diff <commit-a> <commit-b>`
   - Between branches: `git diff <branch-a>..<branch-b>`
   - Specific file: `git diff <file>`
2. ถ้าไม่ระบุ → ใช้ `git diff HEAD` เป็น default
3. รันคำสั่งที่เลือกเพื่อเก็บ raw diff

### 2. Collect Diff Statistics

> Goal: รวบรวมสถิติของการเปลี่ยนแปลง

1. รัน `git diff --stat` เพื่อดูสถิติต่อไฟล์ (additions, deletions)
2. รัน `git diff --shortstat` เพื่อดูสถิติรวม
3. รัน `git diff --name-status` เพื่อดูประเภทการเปลี่ยนแปลง (Added, Modified, Deleted, Renamed)
4. รัน `git status --porcelain` เพื่อดูสถานะไฟล์ทั้งหมด

### 3. Categorize Changes

> Goal: จัดกลุ่มไฟล์ที่เปลี่ยนแปลงตามประเภท

1. จัดกลุ่มตาม change type:
   - Added (A): ไฟล์ใหม่
   - Modified (M): ไฟล์ที่แก้ไข
   - Deleted (D): ไฟล์ที่ลบ
   - Renamed (R): ไฟล์ที่เปลี่ยนชื่อ
2. จัดกลุ่มตาม category:
   - docs: `*.md`, `docs/`
   - config: `*.json`, `*.jsonc`, `*.yml`, `*.yaml`, `*.toml`, `.env*`
   - code: `src/`, `lib/`, `packages/`, `*.ts`, `*.tsx`, `*.js`, `*.jsx`
   - test: `*.test.*`, `*.spec.*`, `tests/`
   - chore: `scripts/`, `tools/`, build files
3. นับจำนวนไฟล์และบรรทัดที่เปลี่ยนแปลงต่อกลุ่ม

### 4. Format Diff Report

> Goal: จัดรูปแบบรายงานให้อ่านง่าย

1. ทำ `/report-markdown-table` เพื่อจัดรูปแบบสถิติเป็นตาราง
2. ทำ `/report-markdown-codeblock` เพื่อจัดรูปแบบ diff blocks
3. แสดงผลตามลำดับ: Summary → Statistics Table → Changes by Category → Key Diffs
4. ใช้ `diff` language tag สำหรับ diff code blocks

### 5. Highlight Key Changes

> Goal: ชี้เน้นการเปลี่ยนแปลงที่สำคัญ

1. ระบุไฟล์ที่มีการเปลี่ยนแปลงมากที่สุด (top 5 by lines changed)
2. ระบุ breaking changes หรือสิ่งที่กระทบ API, schema, หรือ config
3. ระบุไฟล์ใหม่ที่เพิ่มเข้ามา
4. ระบุไฟล์ที่ถูกลบ
5. ถ้ามีไฟล์ที่เปลี่ยนเกิน 100 บรรทัด → แสดงเฉพาะ summary ไม่แสดง full diff

### 6. Provide Insights

> Goal: ให้ insights ของการเปลี่ยนแปลง

1. สรุปว่าการเปลี่ยนแปลงนี้เป็นประเภทใด (feature, fix, refactor, config, docs)
2. ระบุผลกระทบต่อส่วนต่างๆ ของระบบ
3. ระบุความเสี่ยงที่อาจเกิดจากการเปลี่ยนแปลง
4. แนะนำ actions ถัดไป เช่น ตรวจสอบ tests, review breaking changes

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-markdown-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-markdown-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Diff Scope

- ใช้ `git diff` สำหรับ unstaged changes
- ใช้ `git diff --cached` สำหรับ staged changes
- ใช้ `git diff HEAD` สำหรับ all changes รวม staged และ unstaged
- ระบุ scope ชัดเจนในรายงานว่าเป็น diff แบบใด

### Report Format

- แสดง Summary ก่อน ตามด้วย Statistics Table แล้วตามด้วย Details
- ใช้ `diff` language tag สำหรับ diff code blocks
- จัดกลุ่ม changes ตาม category (docs, config, code, test, chore)
- ใช้ symbols: ✅ Added, ✏️ Modified, ❌ Deleted, 📝 Renamed

### High Impact Content

- แสดงเฉพาะไฟล์ที่มีการเปลี่ยนแปลง ไม่แสดงไฟล์ที่ไม่เกี่ยวข้อง
- ถ้า diff ใหญ่เกิน 500 บรรทัด → แสดงเฉพาะ summary และ top 5 ไฟล์
- ไม่แสดง full diff ของไฟล์ที่เปลี่ยนเกิน 100 บรรทัด → แสดงเฉพาะ summary
- ชี้เน้น breaking changes และสิ่งที่กระทบ API, schema, config

### Safety

- ไม่แก้ไข ไม่ stage ไม่ commit ใดๆ — ใช้ `/git-commit` สำหรับการ commit
- ไม่รันคำสั่งที่มี side effects
- รายงานเท่านั้น — read-only operation

### Non-Redundancy

- การ commit และ stage อยู่ใน `/git-commit` แล้ว
- การดู file history อยู่ใน `/follow-tool-git` แล้ว
- การจัดรูปแบบ code blocks อยู่ใน `/report-markdown-codeblock` แล้ว
- การจัดรูปแบบตารางอยู่ใน `/report-markdown-table` แล้ว

## Expected Outcome

- สรุปการเปลี่ยนแปลงเป็นตารางที่อ่านง่าย
- สถิติรวม: จำนวนไฟล์, additions, deletions
- การเปลี่ยนแปลงจัดกลุ่มตาม category และ change type
- ชี้เน้นการเปลี่ยนแปลงสำคัญและผลกระทบ
- ไม่มีการแก้ไขไฟล์จริง — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน