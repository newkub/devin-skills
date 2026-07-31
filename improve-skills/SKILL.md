---
name: improve-skills
description: ปรับปรุง skill ให้ถูกต้อง ครอบคลุม และเป็นไปตาม best practices
---

## Goal

ปรับปรุง skill ให้ถูกต้อง ครอบคลุม สม่ำเสมอ และเป็นไปตาม best practices

## Scope

ใช้สำหรับปรับปรุง skill หนึ่งหรือกลุ่มย่อย ทั้งใน `skills/` และ workspace

หมายเหตุ: สำหรับ batch update ทั้งหมด ใช้ `/improve-all-skills` แทน

## Execute

### 1. Identify Target Skills

ระบุ skill ที่ต้องปรับปรุง

1. ระบุ skill directory ที่ต้องปรับปรุง (เดียวหรือกลุ่มย่อย)
2. ตรวจสอบว่ามี `SKILL.md` และ directory structure ตาม `/write-devin-skills`
3. ถ้าอยู่ใน workspace ตรวจสอบว่า skill สอดคล้องกับ project context

### 2. Check Correctness

ตรวจสอบความถูกต้องตามมาตรฐาน

1. ทำ `/check-correctness` เพื่อตรวจสอบ structure, frontmatter, sections ครบถ้วน
2. ทำ `/check-reference` เพื่อตรวจสอบ references ที่อ้างถึงมีอยู่จริง
3. ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด (รวม `SKILL.md` และไฟล์ใน subdirectories)
4. ตรวจสอบ directory structure ตาม `/write-devin-skills`: `guide/`, `key-concepts/`, `principles/`, `references/`, `workflows/`, `templates/`, `scripts/`
5. บันทึก issues ที่พบพร้อม priority (Critical, High, Medium, Low)

### 3. Research Best Practices

ค้นหา best practices สำหรับ topics ที่เกี่ยวข้อง

1. ทำ `/deep-research` สำหรับ tools/libraries ที่ skill เกี่ยวข้อง
2. ทำ `/follow-best-practice` สำหรับ context ของ skill นั้นๆ
3. ตรวจสอบว่าข้อมูลเป็นปัจจุบันและสอดคล้องกับ official documentation
4. ระบุ patterns และ conventions ที่แนะนำจาก findings

### 4. Apply Improvements

ปรับปรุง skill ตาม findings

1. แก้ไข issues ตาม priority จาก `/check-correctness` (Critical ก่อน)
2. ทำ `/review-code-quality` สำหรับ issues ด้านเนื้อหาและ structure
3. ปรับปรุง content ตาม `/follow-content-quality` (clarity, completeness, consistency)
4. อัปเดตเนื้อหาตาม best practices ที่ research ได้
5. ใช้ references แทนการ duplicate เนื้อหาจาก skills หรือ workflows อื่น
6. ตรวจสอบว่าไม่ซ้ำซ้อนระหว่าง Execute และ Rules

### 5. Improve Coverage

ปรับปรุงความครอบคลุมของเนื้อหา

1. ทำ `/review-delivery` เพื่อตรวจสอบว่า skill ครอบคลุม use cases ครบถ้วน
2. ทำ `/review-code-quality` เพื่อตรวจสอบ missing sections หรือไฟล์ใน subdirectories
3. ทำ `/review-coverage` สำหรับแต่ละ subdirectory ที่ขาดเนื้อหา
4. เพิ่ม edge cases และ conditional execution ที่ขาดหาย
5. ตรวจสอบว่า Expected Outcome สอดคล้องกับ Goal

### 6. Verify And Report

ตรวจสอบผลการปรับปรุง

1. ทำ `/check-correctness` อีกครั้งเพื่อ verify
2. ทำ `/check-reference` เพื่อยืนยัน references ทั้งหมดถูกต้อง
3. ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
4. ทำ `/report` เพื่อสรุปการปรับปรุง
5. ท้า /suggest-next-action เพือแนะนำอก์ชันถัดไป้

## Rules

### 1. Correctness First

- แก้ไข Critical issues ก่อนเสมอ
- ตรวจสอบ frontmatter ถูกต้อง (title, description, `auto_execution_mode: 3`)
- ตรวจสอบ sections ครบถ้วน (Goal, Scope, Execute, Rules, Expected Outcome)
- ตรวจสอบ directory structure ตาม `/write-devin-skills`
- ทำ `/check-reference` ก่อนและหลังแก้ไข

### 2. Research-Driven Improvements

- ทำ `/deep-research` สำหรับ tools/libraries ที่เกี่ยวข้อง
- อ้างอิง official documentation เป็น primary source
- ตรวจสอบ version compatibility และ information freshness
- ใช้ `/follow-best-practice` สำหรับ context ของ skill

### 3. Coverage Quality

- ครอบคลุม use cases ครบถ้วน (ทำ `/review-code-quality`)
- ครอบคลุม edge cases และ conditional execution
- ทำ `/review-coverage` สำหรับ subdirectories ที่ขาดเนื้อหา
- Expected Outcome สอดคล้องกับ Goal
- ไม่มี missing sections หรือไฟล์ (ทำ `/review-code-quality`)

### 4. Content Quality

- ใช้ references แทนการ duplicate เนื้อหา
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- เนื้อหา explicit แทน implicit
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/skill-name`
- Execute headings: English Title Case, Rules: ภาษาไทย
- ตรวจสอบ dependent skills เมื่อแก้ไข

### 5. Minimal Changes

- แก้ไขเฉพาะสิ่งที่จำเป็น (ทำ `/dont-over-engineer`)
- รักษา skill intent เดิม
- หลีกเลี่ยงการเขียนใหม่ทั้งไฟล์ถ้าไม่จำเป็น
- ใช้ `/edit-only` เมื่อเป็นไปได้

### 6. Verification

- ทำ `/check-correctness` อีกครั้งหลังแก้ไข
- ตรวจสอบทุกไฟล์ไม่เกิน 250 บรรทัด
- ทำ `/check-reference` เพื่อยืนยัน references ถูกต้อง
- ทำ `/report` เพื่อสรุปการปรับปรุง

## Expected Outcome

- Skill ถูกต้องตามมาตรฐาน `/write-devin-skills`
- Directory structure ครบถ้วนตามมาตรฐาน
- ไม่มี broken references
- เนื้อหาครอบคลุมและเป็นไปตาม best practices
- ทุกไฟล์ไม่เกิน 250 บรรทัด
- สอดคล้องกับ official documentation และ current best practices
- Expected Outcome สอดคล้องกับ Goal
