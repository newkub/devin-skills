---
name: improve-skills
description: ปรับปรุง skill ให้ถูกต้อง ครอบคลุม สอดคล้อง และเป็นไปตาม best practices
related:
  - check-correctness
  - check-reference
  - deep-research
  - dont-over-engineer
  - edit-only
  - follow-best-practice
  - follow-content-quality
  - follow-devin-skills-md
  - improve-all-skills
  - improve-consistency
  - improve-redundancy
  - refactor-skills
  - read-related-skills
  - report
  - review-code-quality
  - review-coverage
  - review-delivery
  - check-circular-dependencies
  - scan-codebase
  - suggest-next-action
  - validate
---

## Goal

ปรับปรุง skill ให้ถูกต้อง ครอบคลุม สอดคล้องกัน และเป็นไปตาม best practices

## Scope

ใช้สำหรับปรับปรุง skill หนึ่งหรือกลุ่มย่อย ทั้งใน `skills/` และ workspace

หมายเหตุ: สำหรับ batch update ทั้งหมด ให้ใช้ `/improve-all-skills`

## Execute

### 1. Identify And Assess

ระบุ skill เป้าหมายและประเมินสถานะปัจจุบัน

> Goal: รู้ skill ที่ต้องปรับปรุงและปัญหาหลักก่อนลงมือ

1. ระบุ skill directory ที่ต้องปรับปรุง (เดียวหรือกลุ่มย่อย)
2. ทำ `/read-related-skills` เพื่ออ่าน skills ที่เกี่ยวข้องและเข้าใจ dependencies
3. ตรวจสอบ `SKILL.md` และ directory structure ตาม `/follow-devin-skills-md`
4. ทำ `/scan-codebase` เพื่อหาไฟล์เกิน 250 บรรทัด, broken references, และ issues ด้าน structure
4. บันทึก issues พร้อม priority (Critical, High, Medium, Low)
5. ถ้าอยู่ใน workspace ตรวจสอบว่า skill สอดคล้องกับ project context

### 2. Check Correctness

ตรวจสอบความถูกต้องตามมาตรฐาน

> Goal: skill ผ่านเกณฑ์ structure, frontmatter, references ก่อนปรับปรุง

1. parallel: ทำตาม `/check-correctness` เพื่อตรวจสอบ structure, frontmatter, sections ∥ ทำตาม `/check-reference` เพื่อตรวจสอบ references ที่อ้างถึง ∥ ทำตาม `/check-circular-dependencies` เพื่อตรวจสอบ circular references ใน target
2. parallel: ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด ∥ ตรวจสอบ directory structure ตาม `/follow-devin-skills-md`

### 3. Research Best Practices

ค้นหา best practices สำหรับ topics ที่เกี่ยวข้อง

> Goal: เนื้อหาอัปเดตและสอดคล้องกับ official documentation

1. parallel: ทำตาม `/deep-research` สำหรับ tools/libraries ที่ skill เกี่ยวข้อง ∥ ทำตาม `/follow-best-practice` สำหรับ context
2. ตรวจสอบ official documentation และ versions ที่เกี่ยวข้อง
3. ระบุ patterns และ conventions ที่แนะนำจาก findings

### 4. Refactor Structure

refactor โครงสร้าง skill ก่อนแก้ไขเนื้อหา

> Goal: skill มี single responsibility ชัดเจนและจัดการง่าย

1. ทำ `/refactor-skills` เพื่อแยก/รวม/ย้าย sections ตาม SRP
2. จัดลำดับ Execute steps ให้เป็นระบบ ไม่เกิน 10 steps
3. refactor location ให้เหมาะสม: global skills อยู่ใน `%APPDATA%\devin\skills\` หรือ workspace skills อยู่ใน `.devin/skills/`
4. อัปเดต references หลัง refactor

### 5. Remove Redundancy

ลบเนื้อหาซ้ำซ้อนและรักษา single source of truth

> Goal: ไม่มี duplicate content ระหว่าง Execute, Rules, หรือ skills ที่เกี่ยวข้อง

1. ทำ `/improve-redundancy` เพื่อตรวจจับและลบเนื้อหาซ้ำซ้อน
2. ใช้ references แทนการ duplicate เนื้อหาจาก skills หรือ workflows อื่น
3. ตรวจสอบว่าไม่ซ้ำซ้อนระหว่าง Execute และ Rules

### 6. Improve Consistency

ปรับปรุงความสอดคล้องของภาษา รูปแบบ และ terminology

> Goal: skill มีลักษณะภาษา การ format และ frontmatter สม่ำเสมอ

1. ทำ `/improve-consistency` เพื่อตรวจภาษา, format, headings, backticks, parallel markers
2. ปรับ Execute headings เป็น English Title Case, รายการภาษาไทย
3. ตรวจ `related` references ครบถ้วน

### 7. Apply Content Improvements

ปรับปรุงเนื้อหาตาม findings

> Goal: เนื้อหาครอบคลุม ชัดเจน และตรงตาม best practices

1. แก้ไข issues ตาม priority จาก `/check-correctness` (Critical ก่อน)
2. ทำ `/review-code-quality` สำหรับ issues ด้านเนื้อหาและ structure
3. ปรับปรุง content ตาม `/follow-content-quality` (clarity, completeness, consistency)
4. อัปเดตเนื้อหาตาม best practices ที่ research ได้
5. เพิ่ม edge cases และ conditional execution ที่ขาดหาย

### 8. Improve Coverage

ปรับปรุงความครอบคลุมของเนื้อหา

> Goal: skill ครอบคลุม use cases, edge cases, และ subdirectories ครบถ้วน

1. ทำ `/review-delivery` เพื่อตรวจสอบว่า skill ครอบคลุม use cases ครบถ้วน
2. ทำ `/review-coverage` สำหรับแต่ละ subdirectory ที่ขาดเนื้อหา
3. ตรวจสอบว่า Expected Outcome สอดคล้องกับ Goal

### 9. Verify And Report

ตรวจสอบผลการปรับปรุง

> Goal: skill ผ่าน validation และมีรายงานสรุป

1. parallel: ทำตาม `/check-correctness` อีกครั้ง ∥ ทำตาม `/check-reference` ∥ ทำตาม `/check-circular-dependencies` ∥ ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
2. ทำ `/validate`
3. ทำ `/report` เพื่อสรุปการปรับปรุง
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Correctness First

- แก้ไข Critical issues ก่อนเสมอ
- ตรวจสอบ frontmatter ถูกต้อง (`name`, `description` ไม่เกิน 100 ตัวอักษร)
- ตรวจสอบ sections ครบถ้วน (`## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`)
- ตรวจสอบ directory structure ตาม `/follow-devin-skills-md`
- ทำ `/check-reference` ก่อนและหลังแก้ไข
- ทำ `/check-circular-dependencies` ก่อนและหลังแก้ไขเพื่อตรวจ circular references ระหว่าง skills

### 2. Research-Driven Improvements

- ทำ `/deep-research` สำหรับ tools/libraries ที่เกี่ยวข้อง
- อ้างอิง official documentation เป็น primary source
- ตรวจสอบ version compatibility และ information freshness
- ใช้ `/follow-best-practice` สำหรับ context ของ skill

### 3. Refactor And Consistency

- ทำ `/refactor-skills` ก่อนแก้ไขเนื้อหาเมื่อโครงสร้างมีปัญหา
- ทำ `/improve-redundancy` เพื่อลบเนื้อหาซ้ำซ้อน
- ทำ `/improve-consistency` เพื่อให้ภาษาและ format สม่ำเสมอ
- ใช้ references แทนการ duplicate เนื้อหา

### 4. Coverage Quality

- ครอบคลุม use cases ครบถ้วน (ทำ `/review-delivery`)
- ครอบคลุม edge cases และ conditional execution
- ทำ `/review-coverage` สำหรับ subdirectories ที่ขาดเนื้อหา
- Expected Outcome สอดคล้องกับ Goal
- ไม่มี missing sections หรือไฟล์

### 5. Content Quality

- เนื้อหา explicit แทน implicit
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- Execute headings: English Title Case, Rules: ภาษาไทย
- ตรวจสอบ dependent skills เมื่อแก้ไข

### 6. Minimal Changes

- แก้ไขเฉพาะสิ่งที่จำเป็น (ทำ `/dont-over-engineer`)
- รักษา skill intent เดิม
- หลีกเลี่ยงการเขียนใหม่ทั้งไฟล์ถ้าไม่จำเป็น
- ใช้ `/edit-only` เมื่อเป็นไปได้

### 7. Verification

- ทำ `/check-correctness` อีกครั้งหลังแก้ไข
- ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
- ทำ `/check-reference` เพื่อยืนยัน references ถูกต้อง
- ทำ `/report` เพื่อสรุปการปรับปรุง

## Expected Outcome

- Skill ถูกต้องตามมาตรฐาน `/follow-devin-skills-md`
- Directory structure ครบถ้วนตามมาตรฐาน
- ไม่มี broken references
- เนื้อหาครอบคลุมและเป็นไปตาม best practices
- ทุกไฟล์ไม่เกิน 250 บรรทัด
- โครงสร้าง skill มี SRP ชัดเจน ไม่มีเนื้อหาซ้ำซ้อน
- ภาษา รูปแบบ และ terminology สม่ำเสมอ
- Expected Outcome สอดคล้องกับ Goal
