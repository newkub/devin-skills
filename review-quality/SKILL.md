---
name: review-quality
description: Review code quality including simplicity, redundancy, naming, consistency, and refactoring readiness
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
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

Review review-quality quality with findings and score Review simplicity ของ codebase ตรวจจับ over-engineering, unnecessary abstractions, YAGNI violations, premature optimization, และ indirection layers ที่เพิ่ม complexity โดยไม่จำเป็น ตรวจสอบและรายงาน redundancy ของเนื้อหาและ code ระหว่างไฟล์, se...

## Scope

Review scope for review-quality รวม: over-engineering patterns, unnecessary abstractions (interfaces ที่มี implementor เดียว, generic ที่ใช้กับ type เดียว, wrapper classes ที่ไม่เพิ่ม value), YAGNI violations (features ที่ยังไม่ได้ใช้, config options ที่ไม่มี consumer, extension points ที่ไม่มี extension), premature optimization (micro-optimizations ก่อน measure, cache ที่ไม่จำเป็น, complex alg...

## Execute

### Simplicity Deep Checks

สแกน codebase เพื่อเข้าใจโครงสร้างและระบุ simplicity patterns

> Goal: เข้าใจ project structure และระบุ tools สำหรับตรวจจับ over-engineering

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, dependencies, และ codebase size
2. ระบุ tools ที่มี: `knip` สำหรับ unused exports, `ast-grep` สำหรับ pattern detection, `madge` สำหรับ dependency graph
3. ถ้าสแกนไม่ได้ → stop และ report


วิเคราะห์ simplicity issues อย่างลึกซึ้งด้วย rules และ scripts

> Goal: ครอบคลุมทุก simplicity dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม simplicity categories ล่าสุด

### Redundancy Deep Checks

เตรียม workspace และ scan หา redundancy ด้วย tools

> Goal: เข้าใจ structure และรวบรวม candidate duplication ก่อน review

1. ตรวจสอบว่าทำ `/scan-codebase` เพื่อเข้าใจ project structure และ identify scope ของการ review
2. ตรวจสอบว่า code duplication tools ถูกรัน: `jscpd`, `knip`, `madge --circular`, `ast-grep`
3. ตรวจสอบการหา content duplication ใน markdown/docs ด้วย `grep` และ manual review
4. ตรวจสอบรายการผลลัพธ์มี file path, line range และ duplicate target


ตรวจสอบและจัดประเภท redundancy ที่พบ

> Goal: ระบุรายการซ้ำซ้อนที่เป็นปัญหาจริงพร้อม evidence

1. ตรวจสอบประเภท redundancy: exact duplicate, near-duplicate, partial overlap, reference-only

### Naming Deep Checks

> Goal: เข้าใจ naming patterns และ conventions ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ naming structure
2. ระบุ language conventions, framework conventions, project-specific naming rules ที่ใช้


> Goal: ครอบคลุมทุก naming dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ naming patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้


> Goal: ครอบคลุม variable, function, class naming

### Consistency Deep Checks

> Goal: รวบรวม skill files และบันทึก baseline สำหรับ review

1. ทำ `/scan-codebase` เพื่อรวบรวม skill files ทั้งหมด
2. อ่าน frontmatter ของแต่ละ `SKILL.md` และบันทึก patterns
3. ตรวจสอบ directory structure ของแต่ละ skill
4. ระบุ conventions ที่ใช้ร่วมกัน เช่น heading style, bullet language, backtick usage


> Goal: ตรวจสอบโครงสร้าง skill files

1. ตรวจสอบลำดับ sections (`## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`)
2. ตรวจสอบ frontmatter มี `name`, `description` และ `description` ไม่เกิน 100 ตัวอักษร
3. ตรวจสอบ Execute headings เป็น English Title Case และรายการภาษาไทย
4. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด


### Refactor Deep Checks

สแกน codebase เพื่อเข้าใจโครงสร้างและระบุ refactor candidates

> Goal: เข้าใจ project structure และระบุ refactoring tools ที่มี

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ codebase
2. ระบุ refactoring tools ที่มี: `biome`, `ast-grep`, `knip`, `jscpd`, `madge`
3. ถ้าสแกนไม่ได้ → stop และ report


วิเคราะห์ refactor opportunities อย่างลึกซึ้งด้วย scripts

> Goal: ครอบคลุมทุก refactor dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด


## Rules

### 1. Objectivity

- ให้คะแนนตาม criteria ที่กำหนด ไม่ตามความชอบส่วนตัว
- ระบุ evidence ทุก finding — file, line, code snippet
- ถ้าไม่แน่ใจว่า abstraction จำเป็นหรือไม่ → ระบุระดับความไม่แน่นอน

### 2. Actionable

- ทุก finding ต้องมี recommendation ที่ concrete
- ถ้า recommendation คือ "remove abstraction" → ระบุว่า inline ยังไง
- ถ้า abstraction จำเป็นจริง → ระบุเหตุผลและ mark เป็น Info

### 3. Balance

- รายงานทั้ง strengths (simple patterns ที่ดี) และ weaknesses
- ไม่ตรวจทุก abstraction เป็น over-engineering — ตรวจเฉพาะที่ไม่จำเป็นจริง
- ชื่นชม simple, readable code

### 4. Scope

- ไม่ review นอก scope ที่กำหนด
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ถ้า issue ซ้อนทับกับ `review-quality` → อ้างอิง ไม่ duplicate

### 5. Evidence Quality

- แต่ละ finding ต้องมี: file path, line number, code snippet และคำอธิบายว่าทำไมเป็น over-engineering
- ตรวจสอบ consumers ของ abstraction ก่อน report — ถ้ามี multiple consumers → ไม่ใช่ over-engineering
- ห้าม report โดยไม่มี evidence หรืออ้างอิงจากความจำเพียงอย่างเดียว

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

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
- ถ้าต้องการแก้ไข ให้ทำ `/review-quality` หรือ `/resolve-errors` หลัง review

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ heading levels สำหรับ structure
- ใช้ backticks สำหรับ `tools`, `commands`, file paths, skill references

### 1. Skip Conditions

- ถ้า project ไม่มี API → ข้าม Step 4 item 3
- ถ้า project ไม่มี database → ข้าม Step 4 item 4
- ถ้า project ไม่มี TypeScript → ข้าม Step 3 item 3 สำหรับ interface/type naming

### 2. Severity Classification

- Critical: inconsistent naming ที่ก่อให้เกิด bug, misleading name ที่ทำให้เข้าใจผิด, naming ที่สื่อผิดความหมายใน critical path
- High: inconsistent convention across layer, naming ที่สื่อผิด, single-letter names ใน non-trivial scope, data/temp/info names, inconsistent verb usage
- Medium: minor naming inconsistency, inconsistent prefix/suffix, missing naming convention documentation
- Low: cosmetic, minor naming improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ variable, function, class, file, หรือ endpoint ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

### 1. Skip Conditions

- ถ้า project ไม่มี skill files ใน workspace → ข้าม review นี้
- ถ้าพบว่า skill เป็น project-specific เท่านั้น → ระบุ scope ชัดเจนใน report
- ถ้าต้องการแก้ไขเนื้อหาเชิงลึก → ใช้ `/improve-devin-skills` แทนการ review ใน scope นี้

### 2. Severity Classification

- Critical: frontmatter หาย, `name` ไม่ตรงกับ filename, section order ผิด, broken `related` references ที่กระทบ execution, `description` เกิน 100 ตัวอักษร
- High: section ขาดหรือลำดับผิด, file เกิน 250 บรรทัด, terminology ไม่สม่ำเสมอข้าม skill, kebab-case ไม่ถูกต้อง
- Medium: spacing ไม่สม่ำเสมอ, backtick ใช้ไม่สม่ำเสมอ, parallel marker `∥` อยู่นอก Execute list, `description` ไม่ชัดเจน
- Low: cosmetic formatting, minor wording inconsistency, optional `related` หาย

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ใช้ `grep`, `glob`, `/scan-codebase` ก่อนระบุ findings
- ไม่เดาว่ามี inconsistency โดยไม่มี evidence
- ระบุ expected convention กับ actual convention ที่พบ


*Some details from merged source skills were condensed to keep the skill under 250 lines.*
