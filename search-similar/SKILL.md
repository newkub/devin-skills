---
name: search-similar
description: ค้นหา skills, code, หรือ patterns ทีคล้ายกับสิ่งทีระบุ
related:
  - search-files-patterns
  - search-by-astgrep
  - use-ast-grep
  - list-devin-global-skills
  - use-in-another-skills
  - create-similar
  - ask-me
  - report-table
---

## Goal

ค้นหา skills, code patterns, files หรือ functions ทีคล้ายกับ target ทีระบุ เพื่อ reuse, avoid duplication หรือสร้างสิ่งใหม่บนพื้นฐานเดิม

## Scope

ใช้เมื่อต้องการหาตัวอย่างเดิมทีคล้ายกัน ก่อนสร้าง skill ใหม่ หรือก่อน refactor

ดูเพิ่มเติม: /use-ast-grep

## Execute

### 1. Define Target

> Goal: ระบุสิ่งทีต้องการค้นหา similar

1. ถ้า user ระบุ skill name → อ่าน skill นั้น
2. ถ้า user ระบุ code snippet → บันทึก snippet
3. ถ้า user ระบุ pattern หรือ responsibility → สรุปเป็น keywords
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Search By Name And Prefix

> Goal: หา similar ด้วย name matching

1. ทำ `/list-devin-global-skills` เพื่อดูรายการ skills
2. หา skills ทีมี prefix หรือ name คล้าย target
3. หา skills ทีมี keywords ใน `description` หรือ `name`
4. บันทึก candidates ทีมี score > 0

### 3. Search By Content

> Goal: หา similar ด้วยเนื้อหา

1. ทำ `/search-files-patterns` ด้วย keywords จาก target
2. ทำ `/search-by-astgrep` สำหรับ code patterns (ถ้าเป็น code)
3. ค้นหาใน `AGENTS.md` categories ทีเกี่ยวข้อง
4. ค้นหา `related` frontmatter ทีอ้างถึง target

### 4. Compare Similarity

> Goal: จัดลำดับ candidates

1. เปรียบเทียบเป้าหมายกับ candidate ในแง่:
   - responsibility / goal
   - commands/tools ทีใช้
   - structure / sections
   - target domain
2. ให้ score 0-100 สำหรับแต่ละ candidate
3. ระบุเหตุผลทีคล้ายกัน

### 5. Report

> Goal: สรุปผล search

1. ใช้ `/report-table` คอลัมน์: No, Name, Type, SimilarityScore, Why
2. เรียงตาม SimilarityScore จากสูงไปต่ำ
3. ระบุ top 5 ทีคล้ายกว่าสุด
4. แนะนำ next action: reuse, extend, หรือ `/create-similar`

## Rules

- ไม่สร้าง duplicate ถ้ามี skill ทีครอบคลุมอยู่แล้ว
- เปรียบเทียบจาก responsibility มากกว่า name เท่านั้น
- ถ้าไม่พบ similar → รายงานว่าไม่พบและแนะนำ `/create-similar`
- ไม่expose secrets หรือ sensitive ใน snippets
- ถ้า context ไม่ชัด → ถาม user ก่อน

- ใช้ /use-in-another-skills ถ้าจำเป็น

## Expected Outcome

- รายการ skills/files/patterns ทีคล้ายกับ target พร้อม similarity score
- สรุปเหตุผลทีคล้ายกัน
- แนะนำ next action ชัดเจน
