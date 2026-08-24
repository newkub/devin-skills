---
name: improve-devin-skills
description: ปรับปรุง skill หนึ่งหรือกลุ่มย่อยตาม /follow-devin-skills-md และ /follow-write-devin-skills
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - refactor-skills
  - improve-correctness
  - check-reference
  - check-circular-dependencies
  - deep-research
  - follow-best-practice
  - improve-redundancy
  - improve-consistency
  - review-codebase
  - validate
  - report
  - write-explicit
  - consider-use-in-another-skills
  - follow-devin-skills-md
  - follow-write-devin-skills
  - read-related-skills
  - scan-codebase
  - suggest-next-action
---

## Goal

ปรับปรุง skill หนึ่งหรือกลุ่มย่อยให้ถูกต้อง ครอบคลุม สอดคล้องกัน และเป็นไปตาม best practices

## Scope

ใช้สำหรับปรับปรุง skill หนึ่งหรือกลุ่มย่อย ทั้งใน `skills/` และ workspace ไม่ใช่ batch update ทั้งหมด

หมายเหตุ: สำหรับ batch update ทั้งหมด ให้ใช้ `/improve-all-skills`

## Execute

### 1. Identify Target And Assess

> Goal: รู้ว่าต้องปรับปรุง skill ใด และมีปัญหาหลักอะไร

1. รับชื่อ skill เป้าหมายจาก user หรือ context
2. อ่าน `SKILL.md` ของ target
3. ทำ `/read-related-skills` เพื่ออ่าน skills ที่เกี่ยวข้อง
4. ทำ `/scan-codebase` เพื่อหา: ไฟล์เกิน 250 บรรทัด, broken references, directory structure ผิด, missing sections
5. บันทึก issues เป็นรายการพร้อม priority: `Critical`, `High`, `Medium`, `Low`

### 2. Check Correctness And Structure

> Goal: skill ผ่านเกณฑ์ frontmatter, structure, และ directory ก่อนแก้ไข

1. ทำตาม `/review-correctness` เพื่อตรวจ structure, frontmatter, sections
   - ทำตาม `/follow-devin-skills-md` เพื่อตรวจมาตรฐาน `SKILL.md`
   - ทำตาม `/follow-write-devin-skills` เพื่อตรวจ directory structure, references, subskills, และ templates
2. ทำตาม `/check-reference` เพื่อตรวจ broken references
   - ทำตาม `/check-circular-dependencies` เพื่อตรวจ circular references
3. ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
   - ตรวจสอบ `name` ตรงกับ directory name

### 3. Research Best Practices

> Goal: ข้อมูลถูกต้องและทันสมัย

1. ทำตาม `/deep-research` สำหรับ tools/libraries ที่ skill เกี่ยวข้อง
   - ทำตาม `/follow-best-practice` สำหรับ context
2. ตรวจสอบ official documentation และ versions ที่ระบุ
3. บันทึก patterns ที่แนะนำไว้เป็น bullet points

### 4. Consider Reuse

> Goal: ไม่ duplicate งานที่ skill อื่นทำอยู่แล้ว

1. ทำ `/consider-use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้า skill อื่นครอบคลุมงานได้ → แก้ไขให้อ้างอิงแทนการเขียนซ้ำ
3. บันทึกสิ่งที่ต้อง keep ใน target skill เอง

### 5. Refactor Structure

> Goal: โครงสร้าง skill มี single responsibility

1. ทำ `/refactor-skills` เพื่อแยก/รวม/ย้าย sections ตาม SRP
2. จัดลำดับ `## Execute` steps ไม่เกิน 10 steps
3. ตรวจสอบตำแหน่ง: global skills อยู่ใน `%APPDATA%\devin\skills\` หรือ workspace skills อยู่ใน `.devin/skills/`
4. อัปเดต references หลัง refactor

### 6. Remove Redundancy

> Goal: ไม่มีเนื้อหาซ้ำซ้อน

1. ทำ `/review-redundancy` เพื่อตรวจ duplicate ระหว่าง files/sections
2. ใช้ `references/` หรืออ้างอิง skill อื่นแทนการคัดลอก
3. ตรวจว่า `## Execute` กับ `## Rules` ไม่ซ้ำกัน

### 7. Improve Consistency

> Goal: ภาษา รูปแบบ และ terminology สม่ำเสมอ

1. ทำ `/review-consistency` เพื่อตรวจภาษา, format, headings, backticks, heading conventions และ backticks
2. ปรับ `## Execute` headings เป็น English Title Case
3. ตรวจ `related` ให้ครบถ้วนและไม่มี invalid

### 8. Write Explicit Content

> Goal: เนื้อหาชัดเจน ไม่ต้องตีความ

1. ทำ `/write-explicit` กับ instructions ที่ยังคลุมเครือ
2. แก้ไข issues ตาม priority จาก `/review-correctness` เริ่มจาก `Critical`
3. ทำ `/review-codebase` สำหรับ issues เนื้อหาและ structure
4. อัปเดตเนื้อหาตาม best practices ที่ research ได้
5. เพิ่ม edge cases และ conditional execution ที่ขาด

### 9. Improve Coverage

> Goal: ครอบคลุม use cases และ edge cases

1. ทำ `/review-codebase` เพื่อตรวจว่า skill ครอบคลุม use cases ครบถ้วน
2. ตรวจแต่ละ subdirectory ว่ามีเนื้อหาหรือ reference รองรับ
3. ตรวจสอบว่า `## Expected Outcome` สอดคล้องกับ `## Goal`

### 10. Verify And Report

> Goal: skill ผ่าน validation และมีรายงาน

1. ทำตาม `/review-correctness` อีกครั้ง
   - ทำตาม `/check-reference`
   - ทำตาม `/check-circular-dependencies`
   - ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
2. ทำ `/validate`
3. ทำ `/report` เพื่อสรุปการปรับปรุง
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Correctness First

- แก้ไข `Critical` issues ก่อนเสมอ
- `description` ห้ามเกิน 100 ตัวอักษร
- `name` ต้องตรงกับ directory name
- ทุก skill ต้องมี `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- ทำ `/check-reference` ก่อนและหลังแก้ไข
- ทำ `/check-circular-dependencies` ก่อนและหลังแก้ไข

### 2. Research-Driven Improvements

- ทำ `/deep-research` สำหรับ tools/libraries ที่ skill เกี่ยวข้อง
- อ้างอิง official documentation เป็น primary source
- ตรวจสอบ version compatibility และ freshness
- ใช้ `/follow-best-practice` สำหรับ context

### 3. Refactor And Consistency

- ทำ `/refactor-skills` ก่อนแก้ไขเนื้อหาเมื่อโครงสร้างมีปัญหา
- ทำ `/review-redundancy` เพื่อลบเนื้อหาซ้ำซ้อน
- ทำ `/review-consistency` เพื่อให้ภาษาและ format สม่ำเสมอ
- ใช้ `references/` แทนการ duplicate เนื้อหา

### 4. Coverage Quality

- ครอบคลุม use cases ครบถ้วนด้วย `/review-codebase`
- ระบุ edge cases และ conditional execution
- `## Expected Outcome` ต้องสอดคล้องกับ `## Goal`
- ไม่มี missing sections หรือ missing files

### 5. Explicit Content

- ทุก instruction ต้องระบุ action, condition, หรือ expected result
- ใช้ `/write-explicit` เมื่อพบคำสั่งคลุมเครือ
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- `## Execute` headings เป็น English Title Case, `## Rules` รายการเป็นภาษาไทย

### 6. Minimal Changes

- แก้ไขเฉพาะสิ่งที่จำเป็น
- รักษา intent เดิมของ skill
- หลีกเลี่ยงการเขียนใหม่ทั้งไฟล์ถ้าไม่จำเป็น
- ใช้ `/edit-only` เมื่อเป็นไปได้

### 7. Verification

- ทำ `/review-correctness` อีกครั้งหลังแก้ไข
- ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
- ทำ `/check-reference` เพื่อยืนยัน references ถูกต้อง
- ทำ `/report` เพื่อสรุปการปรับปรุง

## Expected Outcome

- Skill ถูกต้องตามมาตรฐาน `/follow-devin-skills-md`
- Directory structure ครบถ้วน
- ไม่มี broken references
- เนื้อหาครอบคลุมและเป็นไปตาม best practices
- ทุกไฟล์ไม่เกิน 250 บรรทัด
- โครงสร้าง skill มี SRP ชัดเจน
- ภาษา รูปแบบ และ terminology สม่ำเสมอ
- `## Expected Outcome` สอดคล้องกับ `## Goal`
- ผ่าน `/validate` และ `/check-circular-dependencies`
