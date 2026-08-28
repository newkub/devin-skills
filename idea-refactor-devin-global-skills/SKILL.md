---
name: idea-refactor-devin-global-skills
description: สร้างไอเดีย refactoring สำหรับ devin global skills repo
related:
  - rethink
  - report-numbered-bullet
  - follow-single-responsibility
  - review-devin-global-skills
  - deep-research
  - follow-math-concepts
  - follow-math-probability
  - update-devin-global-skills
---

## Goal

สร้างไอเดียสำหรับ refactor devin global skills repo ให้ดีขึ้น ครบถ้วน ไม่ซ้ำซ้อน

## Scope

ใช้เมื่อต้องการปรับปรุง skills repo โดยวิเคราะห์ duplicates, overlap, missing, outdated และ structure

## Execute

### 1. Analyze Current State

> Goal: เข้าใจสถานะปัจจุบันของ skills repo

1. ทำ `/review-devin-global-skills` สำหรับ quality conventions
2. ทำ `/check-broken-skills-references` เพื่อหา broken references
3. ทำ `/scan-codebase` เพื่อหา duplicated logic หรือ overlapping skills
4. ทำ `/report-file-structure` เพื่อดูโครงสร้างปัจจุบัน

### 2. Identify Refactor Opportunities

> Goal: หาจุดทีควร refactor

1. หา skills ทีชื่อคล้ายกันหรือทำงานซ้ำกัน
2. หา skills ที reference ซ้ำกันหรือ circular
3. หา skills ที frontmatter ไม่ครบหรือ description ยาวเกิน
4. หา skills ทียัง force architecture เดิม (e.g. Clean) แบบไม่ conditional
5. หา skills ทีควร extract เป็น references/templates
6. ถ้ามี uncertainty เรื่อง impact → ใช้ `/follow-math-probability`

### 3. Generate Ideas

> Goal: สร้างรายการไอเดีย

1. แยกแต่ละไอเดียตาม `/follow-single-responsibility`
2. ใช้ `/report-numbered-bullet` สำหรับรูปแบบ output
3. แบ่งหมวดหมู่:
   - Merge/Remove
   - Rename
   - Extract references
   - Add missing skills
   - Update conventions
4. ระบุ references:
   - `/<skill-name>` ทีเกี่ยวข้อง
   - ไฟล์/โฟลเดอร์ paths
   - URLs ถ้าจำเป็น

### 4. Prioritize

> Goal: เรียงลำดับไอเดีย

1. ใช้ `/rethink` กับแต่ละไอเดีย ตอบว่า keep/revise/replace/defer
2. ประเมิน impact กับ effort
3. เรียงลำดับตาม foundation → high impact → low risk
4. ถ้ามี trade-offs หลายตัว → ใช้ `/follow-math-optimization`

### 5. Report

> Goal: นำเสนอไอเดีย

1. ทำ `/report-numbered-bullet` ด้วย numbered หลัก + bullet ย่อย
2. แสดง `## Summary` ก่อน
3. แสดง `## Refactor Ideas` ตามลำดับ priority
4. แสดง `## References` ทีเกี่ยวข้อง
5. ท้ายด้วย `## Next Action` ชี้ไปยัง `/update-devin-global-skills` หรือ `/deep-refactor`

## Rules

### 1. Single Responsibility Per Idea

- แต่ละไอเดียทำสิงเดียว
- ถ้าพบ "และ" หลายตัว → แบ่งย่อย
- ไม่รวม implement และ idea ในข้อเดียว

### 2. Evidence Based

- อ้างอิงถึง skills/files จริงเท่านั้น
- ใช้ `/deep-research` ถ้าต้องหา best practices
- ไม่สร้าง reference ทีไม่มีอยู่

### 3. Backward Compatibility

- ไอเดีย rename หรือ merge ต้องคิดถึง references
- ระบุ migration steps
- ใช้ `/update-references` ถ้า implement

### 4. Output Format

- ใช้ numbered + bullet
- ใส่ references: `/<skill-name>`, `references/<file>.md`, URLs
- ไม่เกิน 250 บรรทัด

## Expected Outcome

- รายการไอเดีย refactor สำหรับ devin skills repo
- แต่ละไอเดียมี single responsibility, priority, impact
- มี references ครบถ้วน
- พร้อมส่งต่อให้ `/deep-refactor` หรือ `/update-devin-global-skills`
