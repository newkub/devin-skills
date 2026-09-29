---
name: review-writing
description: Review writing quality, naming conventions, and discoverability across docs, code, features
argument-hint: "[scope]"
related:
  - scan-codebase
  - deep-validate
  - run-verify
  - resolve-errors
  - report
  - suggest-next-action
  - review-docs
  - run-review

  - use-subagents
---

## Goal

ปรับปรุงคุณภาพการเขียน, naming conventions, และ discoverability ทั่ว project ให้ชัดเจน กระชับ สม่ำเสมอ และค้นหาเข้าถึงได้

## Scope

ครอบคลุม 3 ด้าน:
- `writing-quality` — documentation, code comments, commit messages, changelogs, technical writing
- `naming` — naming conventions สำหรับ identifiers, files, components, types, API, database, CSS, constants
- `discoverability` — code, docs, features discoverability

ไม่รวม UX copy, content coverage, SEO, code quality โดยละเอียด

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project structure และระบุขอบเขต review

- ทำ `/scan-codebase` เพื่อหา code, docs, features
- ระบุ doc tools, search/index tools, navigation patterns, feature entry points
- อ่าน `README`, `AGENTS.md` และ docs หลัก
- จัดประเภท review areas ตาม impact

### 2. Review Writing Quality

> Goal: ตรวจสอบคุณภาพการเขียน

ทำตาม subagents/writing-reviewer/writing-quality.md และ subagents/writing-reviewer/content-quality.md

### 3. Review Naming Conventions

> Goal: วิเคราะห์ naming patterns และ inconsistencies

ทำตาม subagents/writing-reviewer/naming.md

### 4. Review Discoverability

> Goal: ตรวจสอบ code, docs, features discoverability

ทำตาม subagents/writing-reviewer/discoverability.md

### 5. Validate And Report

> Goal: ตรวจสอบผลลัพธ์ คำนวณ score และรายงาน

ทำตาม subagents/writing-reviewer/scoring.md

- ทำ `/deep-validate`
- คำนวณ review score และ supplementary metrics
- รัน `tsc --noEmit`, `bunx biome lint`, `/run-verify` — ถ้าแก้ไขเอกสารที่เกี่ยวกับ code
- ถ้า validation fail → ทำ `/resolve-errors` แล้ว retry (max 3)
- ทำ `/report`
- ทำ `/suggest-next-action`

## Rules

1. Writing Priority And Principles
   - แก้ `README` และ docs ก่อน
   - ชัดเจนก่อนสวยงาม
   - กระชับ ตัด noise
   - active voice สำหรับ instructions
   - อธิบาย why ไม่ใช่แค่ what
2. Naming Principles
   - ทุกไอเดียต้อง solve real naming problem
   - อ้างอิง official style guides
   - พิจารณา impact ต่อ codebase ทั้งหมด
3. Discoverability Scope And Severity
   - Severity: Critical → High → Medium → Low
   - ทุก finding ต้องมี file path หรือ URL
4. Safety And Scope Control
   - แก้ public API docs ต้องมี dry run และ user confirmation
   - ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (writing)
5. Output Format
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report`

- ใช้ /review-docs ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding — naming consistency ข้าม codebase ตัวแปร, functions, files และ exports (writing)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](subagents/writing-reviewer/checklist.md)
- [Writing quality](subagents/writing-reviewer/writing-quality.md)
- [Content quality](subagents/writing-reviewer/content-quality.md)
- [Naming](subagents/writing-reviewer/naming.md)
- [Discoverability](subagents/writing-reviewer/discoverability.md)
- [Scoring](subagents/writing-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- documentation ชัดเจน กระชับ
- code comments สื่อความหมาย
- commit messages และ changelogs บอก what และ why
- terminology, voice, tone สม่ำเสมอ
- ตาราง naming improvements
- รายงาน discoverability findings พร้อม severity
- Review score และ report table
