---
name: improve-rules
description: ปรับปรุง rule files ให้ถูกต้อง ครอบคลุม และสอดคล้องกับ project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ปรับปรุง rule files ทั้ง `.devin/rules/`, `global_rules.md`, และ `rules/` (ast-grep) ให้ถูกต้อง ครอบคลุม และสอดคล้องกับ project โดยไม่ duplicate เนื้อหาจาก workflows หรือ global rules

## Scope

ใช้กับ rule files ทั้งใน project workspace และ `global_rules.md` รวม ast-grep rules ทั้งหมด — ไม่รวม code หรือ workflow files

## Execute

### 1. Identify Target Rules

ระบุ rule files ทีต้องปรับปรุง

1. ระบุไฟล์ใน `.devin/rules/`, `global_rules.md`, `rules/` (ast-grep)
2. ตรวจสอบ structure ตาม `/follow-write-devin-skills` สำหรับ `.devin/rules/` markdowns
3. ถ้าไม่มี rule files → stop และ report

### 2. Check Correctness

ตรวจสอบความถูกต้องของ rule files

1. ทำ `/check-correctness` เพื่อตรวจ issues
2. ทำ `/check-reference` เพื่อตรวจ broken references
3. ตรวจว่า rules ไม่ซ้ำซ้อนกับ `global_rules.md` หรือ workflows อื่น
4. บันทึก issues พร้อม priority (Critical, High, Medium, Low)

### 3. Research Best Practices

ค้นหา best practices สำหรับ rules

1. ทำ `/deep-research` สำหรับ tools/domains ที rules เกี่ยวข้อง
2. ทำ `/follow-best-practice` ตาม context ของ rule นั้น
3. ระบุ patterns ทีควรเพิ่มหรือแก้ไข

### 4. Apply Improvements

ปรับปรุง rule files ตาม findings

1. แก้ไข issues ตาม priority จาก `/check-correctness` (Critical ก่อน)
2. ทำ `/review-codebase` สำหรับ issues ด้านเนื้อหาและ structure
3. ปรับปรุง content ตาม `/follow-content-quality` (clarity, completeness, consistency)
4. อัปเดตเนื้อหาตาม best practices ที research ได้
5. ใช้ references แทนการ duplicate เนื้อหาจาก rules หรือ workflows อื่น
6. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal
7. ถ้าจำนวน rule files มากกว่า 10 ไฟล์ → ทำ `/use-scripts` เพื่อ batch processing

### 5. Validate And Report

ตรวจสอบผลการปรับปรุง

1. ทำ `/check-correctness` อีกครั้งเพื่อ verify
2. ทำ `/check-reference` เพื่อยืนยัน references ทั้งหมดถูกต้อง
3. ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
4. ทำ `/report` เพื่อสรุปการปรับปรุง
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Correctness First

- แก้ไข Critical issues ก่อนเสมอ
- ตรวจสอบ frontmatter ถูกต้อง (title, description, `auto_execution_mode: 3`)
- ตรวจสอบ sections ครบถ้วน (Goal, Scope, Execute, Rules, Expected Outcome)
- ทำ `/check-reference` ก่อนและหลังแก้ไข

### 2. Coverage

- ครอบคลุม tools, domains, file patterns ที project ใช้จริง
- ไม่ซ้ำซ้อนกับ `global_rules.md` หรือ workflows อื่น
- ทุก devin rule ทีแปลงเป็น ast-grep ได้ ต้องมี ast-grep counterpart หรือระบุเหตุผล

### 3. Content Quality

- เนื้อหา explicit แทน implicit
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`
- Execute headings: English Title Case, Rules: ภาษาไทย

### 4. Minimal Changes

- แก้ไขเฉพาะสิงทีจำเป็น
- รักษา rule intent เดิม
- หลีกเลี่ยงการเขียนใหม่ทั้งไฟล์ถ้าไม่จำเป็น
- ใช้ `/edit-only` เมื่องเป็นไปได้

### 5. Verification

- ทำ `/check-correctness` ก่อนและหลังแก้ไข
- ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
- ไม่มี TODO, MOCK, placeholder, generic filler

## Expected Outcome

- Rule files ถูกต้องตามมาตรฐาน `/follow-write-devin-skills`
- ครอบคลุม tools, domains, file patterns ที project ใช้
- ไม่มี broken references
- ไม่ซ้ำซ้อนกับ `global_rules.md` หรือ workflows อื่น
- ทุกไฟล์ไม่เกิน 250 บรรทัด
- สอดคล้องกับ best practices และ official documentation
- มี report สรุปการปรับปรุง
