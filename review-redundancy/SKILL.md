---
name: review-redundancy
description: Review redundancy across files, sections, and modules with evidence, severity, and score
auto_execution_mode: 3
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - scan-codebase
  - validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

ตรวจสอบและรายงาน redundancy ของเนื้อหาและ code ระหว่างไฟล์, sections และ modules ด้วย tools ก่อน manual verification โดยไม่แก้ไขเนื้อหาระหว่าง review

## Scope

ใช้กับเนื้อหาทุกประเภท: workflow files, documentation, code, configs — ตรวจจับ duplication ระหว่างไฟล์และภายในไฟล์ — ไม่รวม code refactoring เชิงลึก (อยู่ใน `review-refactor`) — เน้นรายงาน findings ไม่ใช่การลบหรือ merge

## Execute

### 1. Prepare And Scan

เตรียม workspace และ scan หา redundancy ด้วย tools

> Goal: เข้าใจ structure และรวบรวม candidate duplication ก่อน review

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ identify scope ของการ review
2. ตรวจสอบว่า code duplication tools ถูกรัน: `jscpd`, `knip`, `madge --circular`, `ast-grep`
3. ตรวจสอบการหา content duplication ใน markdown/docs ด้วย `grep` และ manual review
4. ตรวจสอบรายการผลลัพธ์มี file path, line range และ duplicate target
5. บันทึก baseline, scope และ tools ที่ใช้สำหรับ review

### 2. Review Duplication

ตรวจสอบและจัดประเภท redundancy ที่พบ

> Goal: ระบุรายการซ้ำซ้อนที่เป็นปัญหาจริงพร้อม evidence

1. ตรวจสอบประเภท redundancy: exact duplicate, near-duplicate, partial overlap, reference-only
2. ตรวจสอบลำดับความสำคัญ: ข้ามไฟล์ > ภายในไฟล์ > ภายใน section — ข้าม module > ภายใน module
3. ตรวจสอบว่าแต่ละรายการซ้ำซ้อนจริง ไม่ใช่ false positive — ถ้าเนื้อหาเหมือนกันแต่ context ต่างกันให้ mark เป็น intentional
4. ตรวจสอบความเหมาะสมของตำแหน่งที่ควรเป็น single source of truth
5. ตรวจสอบว่าไม่มีการลบ ย้าย หรือ merge เนื้อหาในระหว่าง review

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อนรายงาน

> Goal: Findings ถูกต้อง มี evidence ครบ ไม่มี missing context

1. ตรวจสอบว่าแต่ละ finding มี evidence ครบ: file path, line number, duplicate target, snippet
2. ตรวจสอบว่าเนื้อหาที่เหลือยังสมบูรณ์หากจะลบหรือ merge ในภายหลัง
3. ตรวจสอบ references ที่อาจชี้ไปยังเนื้อหาที่ซ้ำ หรือถูกย้าย
4. ตรวจสอบว่า single source of truth ยังเข้าถึงได้จากทุกจุดที่เคยอ้างอิง
5. ระบุ false positives และแยกออกจาก report หลัก

### 4. Rate And Report

ให้คะแนนและรายงาน findings ตามรูปแบบที่กำหนด

> Goal: รายงานชัดเจน พร้อม severity, review score และ action ถัดไป

1. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
2. คำนวณ review score จาก findings ที่ validate แล้ว
3. ทำ `/report-table` เพื่อรายงาน findings: type, location, duplicate target, severity, recommendation
4. รายงานสรุปจำนวน duplication, categories, false positives
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 5. Fix

> Goal: ลบ/merge redundancy ที review พบ

1. เรียงลำดับตาม severity Critical → High → Medium → Low
2. รัน `bunx jscpd`, `bunx knip`, `bunx madge --circular`, `bunx ast-grep scan` เพื่อ detect ก่อนแก้
3. จัดประเภท: exact duplicate → ลบสำเนา, near-duplicate → merge รักษา context, partial overlap → extract shared, reference-only → แทนด้วย reference
4. แสดง dry run preview ก่อนลบ หรือขอ `/ask-me`
5. ใช้ `/validate` หลังลบ/merge
6. ทำ `/update-reference` ถ้า references เปลี่ยน
7. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
8. ทำ `/run-check` หลังแก้
9. ถ้าไม่ผ่าน → `/resolve-errors` แล้ว retry สูงสุด 3 รอบ
10. ทำ `/suggest-next-action` หลังผ่าน

## Rules

### 1. Severity Classification

- Critical: exact duplicate ข้ามไฟล์ที่กระทบ single source of truth, ซ้ำซ้อนของ secrets/keys/tokens, circular dependencies ข้าม module, duplicate code ใน critical path
- High: cross-file near-duplicate, unused exports/files, high duplication percentage, near-duplicate ใน critical path
- Medium: partial overlap, intra-file duplication, moderate redundancy, magic numbers หรือ hardcoded strings ที่ใช้ซ้ำในหลายที่
- Low: minor cosmetic duplicate, single-occurrence redundancy, เนื้อหาที่ซ้ำแต่ไม่กระทบ behavior

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ต้องระบุ duplicate target พร้อม line range
- ใช้ output จาก `jscpd`, `knip`, `madge`, `ast-grep`, `grep` เป็น evidence
- ระบุ false positives ที่ตรวจพบและเหตุผลที่ไม่ใช่ redundancy จริง

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือเนื้อหาระหว่าง review
- ไม่ apply fixes ไม่ลบ ไม่ merge ไม่ย้ายเนื้อหาภายใน review reference นี้
- ถ้าต้องการแก้ไข ให้ทำ `improve-redundancy` หรือ `/resolve-errors` หลัง review

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ heading levels สำหรับ structure
- ใช้ backticks สำหรับ `tools`, `commands`, file paths, skill references

### 5. Fix Rules

- ใช้ dry run preview ก่อนลบ
- ถ้าลบแล้วทำให้ context ขาด → ยกเลิก
- รักษา single source of truth
- ไม่ refactor code ลึกซึ้ง (อยู่ใน `/refactor`)
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

## Expected Outcome

- รายงาน findings ของ redundancy พร้อม file path, line number, duplicate target และ severity
- ระบุประเภท redundancy: exact duplicate, near-duplicate, partial overlap, reference-only
- ไม่มี broken references หรือ missing context ที่เกี่ยวข้องกับ findings
- review score พร้อม grade และ progress bar
- รายงานเป็นตารางผ่าน `/report-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
