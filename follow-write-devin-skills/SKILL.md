---
name: follow-write-devin-skills
description: สร้างหรือปรับปรุง skill package โดยเลือก template และจัดการ directory
related:
  - follow-devin-skills-md
  - write-skills-md
  - prepare-skills-context
  - use-scripts
  - validate
  - validate-workflow
  - check-circular-dependencies
  - update-reference
  - suggest-next-action
  - template-skills-run
  - template-skills-follow
  - template-skills-check
  - template-skills-deep
  - template-skills-review
  - template-skills-analyze
  - template-skills-idea
  - template-skills-report
  - template-skills-architecture
---

## Goal

สร้างหรือปรับปรุง skill package ทั้งหมด โดย focus ที่การเลือก template, สร้าง directory structure, และจัดการ references

## Scope

ใช้สำหรับสร้าง skill ใหมหรือแก้ไข skill ใน `%APPDATA%\devin\skills\` หรือ workspace `.devin/skills/` โดยครอบคลุม directory, template selection, validation และ references โดยไม่ทำลาย references เดิม

## Execute

### 1. Prepare Context

เตรียม context ก่อนเขียน skill

> Goal: ทราบ target AI tool, directory, dependencies, template

1. ทำ `/prepare-skills-context` เพื่อตรวจจับ AI tool, อ่าน `global_rules.md`, related skills, และเลือก template ตาม prefix
2. ถ้า skill มีอยู่แล้ว → อ่านไฟล์เดิมและระบุสิ่งที่ต้องปรับปรุง
3. ถ้า context ไม่ชัดหรือ reference ไม่มี → stop และ report

### 2. Select Template

เลือก template ตามประเภท skill

> Goal: skill มีโครงสร้างเริ่มต้นที่เหมาะสม

1. เลือก template ตาม prefix:
   - `run-*` → `/template-skills-run`
   - `follow-*` → `/template-skills-follow` ยกเว้น `follow-*-architecture` → `/template-skills-architecture`
   - `check-*` → `/template-skills-check`
   - `analyze-*` → `/template-skills-analyze`
   - `deep-*` → `/template-skills-deep`
   - `review-*` → `/template-skills-review`
   - `report-*` → `/template-skills-report`
   - `idea-*` → `/template-skills-idea`
2. ถ้าไม่ตรง template → ใช้ `/follow-devin-skills-md` เป็น fallback
3. อ่าน template ที่เลือกเพื่อดู sections, rules, และ example template

### 3. Write SKILL.md

สร้างหรือปรับปรุง `SKILL.md` โดยใช้ `/follow-devin-skills-md`

> Goal: `SKILL.md` ถูกต้องตาม Devin CLI spec

1. ทำ `/follow-devin-skills-md` หรือ `/write-skills-md` เพื่อเขียน frontmatter และ prompt body
2. ตรวจสอบว่า `name` ตรงกับ directory name
3. กำหนด `description` ไม่เกิน 100 ตัวอักษร
4. ตั้งค่า `allowed-tools` และ `permissions` ตามความเหมาะสม

### 4. Add Directory Contents

สร้างส่วนประกอบเพิ่มเติมถ้าจำเป็น

> Goal: skill directory รองรับไฟล์ย่อยโดยไม่ทำให้ `SKILL.md` ยาวเกินไป

1. ถ้าต้องการ external references → สร้าง `references/`
2. ถ้าต้องการ helper scripts → สร้าง `scripts/` ตาม `/use-scripts`
3. ถ้าต้องการ expanded documentation → สร้าง `guide/` หรือ `examples/`
4. ตรวจสอบว่าไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 5. Validate Skill

ตรวจสอบคุณภาพก่อน finalize

> Goal: skill package ผ่านเกณฑ์ทั้งหมด

1. ทำตาม `/validate` เพื่อตรวจความถูกต้อง
2. ทำตาม `/validate-workflow` เพื่อตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้าพบ issue → แก้และ revalidate (max 3 → stop/report)

### 6. Update References

อัปเดต references และสรุป

> Goal: skill package พร้อมใช้งาน references ครบถ้วน

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้อง
2. ทำ `/suggest-next-action` เพื่อแนะนำ skills ถัดไป
3. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)

## Rules

### 1. Template Selection

- ใช้ `template-skills-*` เป็น canonical structure ตาม prefix
- `follow-*-architecture` ใช้ `/template-skills-architecture` ไม่ใช่ `follow`
- ถ้าไม่ตรง template → ใช้ `/follow-devin-skills-md` เป็น fallback
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`

### 2. Package Structure

- `SKILL.md` เป็น entry point หลัก
- สามารถมี `references/`, `scripts/`, `guide/`, `examples/` ตามความจำเป็น
- directory name ต้องตรงกับ `name` ใน frontmatter
- ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 3. Flow And Parallelism

- เรียง Foundation → Dependencies → High impact → High-risk เพื่อ fail fast
- ใช้คำนำหน้า `parallel:` และคั่นด้วย `∥` ใน Execute numbered list
- ทุก skill ที่เรียกต้องนำหน้าด้วย `ทำตาม`

### 4. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions
- ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

## Expected Outcome

- Skill package ทั้งหมดถูกต้องตามมาตรฐาน
- `SKILL.md` valid ตาม Devin CLI spec ผ่าน `/follow-devin-skills-md`
- Template ที่เลือกตรงกับ prefix ของ skill
- Directory contents ครบถ้วนและไม่เกิน 250 บรรทัดต่อไฟล์
- `related` ถูกต้อง ไม่มี missing/unused
- references อัปเดตครบถ้วน
