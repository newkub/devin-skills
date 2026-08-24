---
name: review-quality
description: Review code quality: simplicity, redundancy, naming, consistency, and refactor readiness
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - user
  - model
related:
  - review-codebase
  - review-correctness
  - review-docs
  - review-frontend
  - review-infrastructure
  - review-performance
  - review-reliability
  - review-security
  - suggest-next-action
  - validate
---

## Goal

ตรวจสอบคุณภาพ code โดยรวม ระบุปัญหา simplicity, redundancy, naming, consistency และ refactor readiness พร้อมคะแนน review

## Scope

- ครอบคลุม over-engineering, YAGNI, premature optimization และ abstraction ที่ไม่จำเป็น
- ครอบคลุม code/content redundancy, duplicate logic, unused exports และ circular dependencies
- ครอบคลุม naming conventions ของ variable, function, class, file และ endpoint
- ครอบคลุม consistency ของ style, conventions และ skill file structure ถ้ามี
- ครอบคลุม refactor candidates จาก code smells และ tooling
- ไม่ครอบคลุม `review-security`, `review-performance`, `review-infrastructure` หรือ `review-correctness`

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจโครงสร้าง codebase และ tools ที่มีสำหรับ review quality

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, dependencies และ conventions
2. ระบุ tools ที่มี: `knip`, `jscpd`, `madge`, `ast-grep`
3. ถ้า project ไม่มี code ที่ต้อง review → stop และ report

### 2. Simplicity Review

> Goal: ระบุ over-engineering และ unnecessary complexity

1. ตรวจสอบ abstraction ที่ไม่จำเป็น: interface เดียว implementor, generic กับ type เดียว, wrapper ที่ไม่เพิ่ม value
2. ตรวจสอบ YAGNI: features ไม่ได้ใช้, config options ไม่มี consumer, extension points ไม่มี extension
3. ตรวจสอบ premature optimization: cache ก่อน measure, micro-optimizations ก่อน benchmark
4. บันทึก evidence: file path, line number, code snippet

### 3. Redundancy Review

> Goal: ระบุ duplication และ unnecessary redundancy

1. รัน `jscpd`, `knip`, `madge --circular` เพื่อหา duplicate code และ unused exports
2. ตรวจสอบ content duplication ใน markdown/docs ด้วย `grep` และ manual review
3. จัดประเภท redundancy: exact duplicate, near-duplicate, partial overlap, reference-only
4. ระบุ duplicate target พร้อม file path และ line range

### 4. Naming Review

> Goal: ตรวจสอบ naming conventions ทั้งภาษาและ project

1. ระบุ language conventions, framework conventions และ project-specific naming rules
2. ตรวจสอบ variable, function, class, file และ endpoint names ว่าสื่อความหมายและสม่ำเสมอ
3. ตรวจสอบ single-letter names ใน scope ที่ซับซ้อน, misleading names และ inconsistent verb usage
4. บันทึก inconsistency พร้อม recommended convention

### 5. Consistency Review

> Goal: ตรวจสอบความสม่ำเสมอของ patterns และ conventions

1. ตรวจสอบ consistency ของ style, formatting, terminology และ conventions ข้ามไฟล์
2. ตรวจสอบ skill file structure: ลำดับ sections, frontmatter, backtick usage, heading style
3. ระบุ inconsistencies ที่อาจกระทบ readability หรือ maintainability
4. ถ้า project ไม่มี skill files → ข้าม step นี้

### 6. Refactor Review

> Goal: ระบุ refactoring candidates และ code smells

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ code smells และ refactor opportunities
2. ระบุ refactor candidates: long function, large class, tight coupling, dead code, unused files
3. ตรวจสอบ consumers ก่อน report — ถ้ามี multiple consumers อย่าเรียกว่า over-engineering
4. บันทึก recommendation ทั้ง short-term และ long-term

### 7. Validate and Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score เป็น percentage ต่อ dimension และ overall
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Scope

- ทำ review เท่านั้น ไม่แก้ไข code หรือเนื้อหาระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ไม่ duplicate กับ `review-quality` อื่น โดยอ้างอิง skill ที่เหมาะสม

### 2. Severity

- Critical: กระทบ single source of truth, circular dependency ข้าม module, duplicate secrets/tokens
- High: cross-file near-duplicate, unused exports สำคัญ, inconsistent naming ทำให้เข้าใจผิด
- Medium: partial overlap, intra-file duplication, minor naming inconsistency
- Low: cosmetic duplicate, documentation gap, minor naming improvement

### 3. Evidence

- ทุก finding ต้องมี file path, line number และ code snippet
- ใช้ output จาก `jscpd`, `knip`, `madge`, `ast-grep`, `grep` เป็น evidence
- ระบุ false positives พร้อมเหตุผล

### 4. Objectivity

- ให้คะแนนตาม criteria ที่กำหนด ไม่ตามความชอบส่วนตัว
- ระบุความไม่แน่ใจ ถ้า abstraction จำเป็นหรือไม่ไม่ชัดเจน
- ทุก recommendation ต้อง concrete และ actionable

### 5. Formatting

- ห้ามใช้ double-asterisk markers สำหรับเน้นข้อความ — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Expected Outcome

- รายงาน quality findings พร้อม evidence, severity, file path, line number
- คะแนน review ต่อ dimension: simplicity, redundancy, naming, consistency, refactor
- คะแนน overall quality score
- ตารางสรุป findings ด้วย `/report-table`
- ข้อเสนอแนะ action ถัดไป

*Merged from source review-* skills.*