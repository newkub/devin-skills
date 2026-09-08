---
name: idea-new-devin-global-skills
description: สร้างไอเดีย devin global skills ใหม่หรือปรับปรุง refactor, merge, rename, extract
argument-hint: "[scope]"
related:
  - check-my-global-cli
  - follow-devin-global-skills
  - rethink
  - report-in-table
  - then-apply
  - follow-single-responsibility
  - review-devin-global-skills
  - deep-research
  - follow-math-concepts
  - update-devin-global-skills
---

## Goal

สร้างไอเดียสำหรับ devin global skills ใหม่หรือปรับปรุง ให้ครบถ้วน ไม่ซ้ำซ้อน และสอดคล้องกับ repo ปัจจุบัน

## Scope

ใช้เมื่อต้องการหาไอเดียปรับปรุง skills repo โดยวิเคราะห์ duplicates, overlap, missing, outdated, structure และ global CLI conventions

## Execute

### 1. Analyze Current State

> Goal: เข้าใจสถานะปัจจุบันของ skills repo

1. ทำ `/review-devin-global-skills` สำหรับ quality conventions
2. ทำ `/check-skills-related` เพื่อหา broken references
3. ทำ `/scan-codebase` เพื่อหา duplicated logic หรือ overlapping skills
4. ทำ `/report-file-structure` เพื่อดูโครงสร้างปัจจุบัน
5. ทำ `/check-my-global-cli` เพื่อตรวจ CLI tools ที่ติดตั้งและหาไอเดีย skill ใหม่
6. ทำ `/follow-devin-global-skills` เพื่อตรวจ conventions ของ global skills

### 2. Identify Opportunities

> Goal: หาจุดที่ควรปรับปรุง

1. หา skills ที่ชื่อคล้ายกันหรือทำงานซ้ำกัน
2. หา skills ที่ reference ซ้ำกันหรือ circular
3. หา skills ที่ frontmatter ไม่ครบหรือ description ยาวเกิน
4. หา skills ที่ยัง force architecture เดิมแบบไม่ conditional
5. หา skills ที่ควร extract เป็น references/templates
6. ถ้ามี uncertainty เรื่อง impact → ใช้ `/follow-math-concepts`

### 3. Generate Ideas

> Goal: สร้างรายการไอเดีย

1. แยกแต่ละไอเดียตาม `/follow-single-responsibility`
2. ใช้ `/report-in-table` สำหรับรูปแบบ output คอลัมน์: `No.`, `Idea`, `Category`, `Impact`, `Effort`, `Scope`
3. แบ่งหมวดหมู่:
   - Merge/Remove
   - Rename
   - Extract references
   - Add missing skills
   - Update conventions
4. ระบุ references:
   - `/<skill-name>` ที่เกี่ยวข้อง
   - ไฟล์/โฟลเดอร์ paths
   - URLs ถ้าจำเป็น

### 4. Prioritize

> Goal: เรียงลำดับไอเดีย

1. ใช้ `/rethink` กับแต่ละไอเดีย ตอบ keep/revise/replace/defer
2. ประเมิน impact กับ effort
3. เรียงลำดับตาม foundation → high impact → low risk
4. ถ้ามี trade-offs หลายตัว → ใช้ `/follow-math-concepts`

### 5. Report

> Goal: นำเสนอไอเดีย

1. ทำ `/report-in-table` ด้วย numbered หลัก + bullet ย่อย
2. แสดง `## Summary` ก่อน
3. แสดง `## Refactor Ideas` ตามลำดับ priority
4. ถ้ามี action ต่อเนื่องจาก idea ก่อนหน้า → ใช้ `/then-apply`
5. แสดง `## References` ที่เกี่ยวข้อง
6. ท้ายด้วย `## Next Action` ชี้ไปยัง `/update-devin-global-skills` หรือ `/deep-refactor`

## Rules

### 1. Single Responsibility Per Idea

- แต่ละไอเดียทำสิ่งเดียว
- ถ้าพบ "และ" หลายตัว → แบ่งย่อย
- ไม่รวม implement และ idea ในข้อเดียว

### 2. Evidence Based

- อ้างอิงถึง skills/files จริงเท่านั้น
- ใช้ `/deep-research` ถ้าต้องหา best practices
- ไม่สร้าง reference ที่ไม่มีอยู่

### 3. Backward Compatibility

- ไอเดีย rename หรือ merge ต้องคิดถึง references
- ระบุ migration steps
- ใช้ `/update-references` ถ้า implement

### 4. Output Format

- ใช้ numbered + bullet
- ใส่ references: `/<skill-name>`, `references/<file>.md`, URLs
- ไม่เกิน 250 บรรทัด

- ใช้ `/follow-math-concepts` ถ้าจำเป็น

## Expected Outcome

- รายการไอเดียสำหรับ devin skills repo
- แต่ละไอเดียมี single responsibility, priority, impact
- มี references ครบถ้วน
- พร้อมส่งต่อให้ `/deep-refactor` หรือ `/update-devin-global-skills`
