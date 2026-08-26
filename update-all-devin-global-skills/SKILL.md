---
name: update-all-devin-global-skills
description: อัปเดต devin skills repo ทั้งหมดโดย orchestrate update-devin-global-skills ต่อ skill
related:
  - review-references
  - review-devin-global-skills
  - review-redundancy
  - review-flow
  - update-references
---

## Goal

อัปเดต ดูแล และ refactor devin skills repo ทั้งหมดใน `%APPDATA%\devin\skills` ให้ครบถ้วน สอดคล้องกัน เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน โดย orchestrate `update-devin-global-skills` สำหรับ skill แต่ละตัว พร้อม cross-skill consistency และ relocation

## Scope

ใช้เมื่อต้องการ update, maintain, audit หรือ refactor devin skills repo ทั้งหมด ครอบคลุม inventory, per-skill update, cross-skill consistency, redundancy, relocation และ reporting ไม่ใช่สร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`) ไม่ใช่ update skill เดียว (ใช้ `/update-devin-global-skills`)

## Execute

### 1. Review All Skills

> Goal: ตรวจสอบทุก skill ก่อนดำเนินการ

1. ทำ `/review-devin-global-skills` เพื่อตรวจสอบ skill package แต่ละตัวตามมาตรฐาน `follow-write-devin-skills` พร้อม refactor และ cross-skill consistency
2. ทำ `/review-redundancy` เพื่อตรวจหา skills ที่ซ้ำซ้อนกัน
3. ทำ `/review-flow` เพื่อตรวจ orchestration flow ของ skill นี้ให้เร็ว ปลอดภัย ไม่ซ้ำซ้อน
4. บันทึก findings เป็นตาราง: skill, issue, severity, recommendation

### 2. Inventory All Skills

> Goal: รู้สิ่งที่มีอยู่ใน repo

1. ทำ `/scan-codebase` ใน `%APPDATA%\devin\skills`
2. จัดทำรายการ skills ทั้งหมด: `name`, `description`, จำนวนไฟล์, ขนาด
3. จัดกลุ่มตาม prefix (`follow-lang-*`, `follow-framework-*`, `follow-service-*`, `follow-lib-*`, `follow-tool-*`, `follow-create-*`, `follow-*`, `run-*`, `check-*`, `review-*`, `update-*`, `report-*`, `idea-*`)
4. ทำ `/report-markdown-table` สรุป inventory: ชื่อ, กลุ่ม, จำนวนไฟล์, สถานะ
5. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions ปัจจุบัน

### 3. Update Each Skill

> Goal: อัปเดต skill แต่ละตัวผ่าน workhorse

1. สำหรับ skill ที่ไม่ผ่าน review → ทำ `/update-devin-global-skills <skill-name>`
2. จัดลำดับตาม severity: Critical ก่อน, High ตาม, Medium/Low ทีหลัง
3. ถ้าจำนวน skills ที่ต้องอัปเดต > 10 → ทำ `/follow-parallel` เพื่ออัปเดตขนาน
4. ถ้า skill มี dependencies แต่ขาด `references/` → ทำ `/learn-from-references`
5. ถ้า skill มี content ไม่ครอบคลุม → ทำ `/follow-coverage`

### 4. Refactor And Relocate Skills

> Goal: ปรับโครงสร้างและย้าย skills ไปตำแหน่งที่เหมาะสม

1. ทำ `/review-devin-global-skills` Steps 7-8 เพื่อ split, merge, restructure, deduplicate skills ที่มีปัญหาโครงสร้าง
2. ทำ `/follow-single-responsibility` สำหรับ skills ที่มี SRP violations
3. ทำ `/relocation` เพื่อย้าย skills ไปยังตำแหน่งที่เหมาะสมตาม prefix
4. ตรวจว่าทุก skill อยู่ในตำแหน่งที่สอดคล้องกับ prefix ตามมาตรฐานใน `/follow-write-devin-skills`
5. ถ้ามี skill ที่ prefix ไม่ตรงกับ responsibility → เปลี่ยน prefix และย้าย

### 5. Ensure Cross-Skill Consistency

> Goal: ทุก skill สอดคล้องกันข้าม repo

1. ทำ `/review-consistency` เพื่อตรวจภาษา, format, terminology, frontmatter ข้าม skill
2. ทำ `/review-redundancy` เพื่อลบเนื้อหาซ้ำซ้อนข้าม skill
3. ทำ `/idea-new-devin-skills-global` เพื่อวิเคราะห์ gaps และแนะนำ skills ใหม่
4. ทำ `/update-convert-active-repo-to-devin-skills` เพื่อสร้าง `at-<repo>` skills จาก active remote repos ทีตรงกับ local projects
5. ตรวจไม่มี broken references และไม่มี circular dependencies

### 6. Review References

> Goal: ตรวจสอบ references ก่อนอัปเดต

1. ทำ `/review-references` เพื่อตรวจ AGENTS.md, `related` frontmatter, in-body references, และ circular dependencies
2. บันทึก missing, stale, broken, circular references
3. ให้ priority กับ Critical/High

### 7. Update Cross-References

> Goal: references ระหว่าง skills ครบถ้วนและถูกต้อง

1. ทำ `/update-references` เพื่ออัปเดต references ที่เกี่ยวข้องทั้งหมด
2. ตรวจว่าทุก skill ใหม่ถูกอ้างถึงใน skills ที่เกี่ยวข้อง
3. ตรวจว่าไม่มี skill ที่อ้างถึง skill ที่ไม่มีอยู่
4. ทำ `/check-circular-dependencies` อีกครั้งหลังอัปเดต
5. ถ้ามี issue → แก้และ recheck (max 3 รอบ → stop และ report)

### 8. Report And Suggest Next Actions

> Goal: รายงานผลและแนะนำขั้นตอนถัดไป

1. ทำ `/report-markdown-table` สรุป before-after: จำนวน skills, จำนวนที่ผ่าน validation, จำนวนที่อัปเดต, จำนวนที่ refactor
2. สรุป issues ที่พบและการแก้ไข
3. ระบุ skills ที่ยังไม่ได้อัปเดตและเหตุผล
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป
5. ถ้ามี high-risk changes → ทำ `/ask-me` ก่อนดำเนินการ

## Rules

### 1. Review Before Update

- ทำ `/review-devin-global-skills` ก่อนเสมอ ตามมาตรฐาน `follow-write-devin-skills` Rule 9
- ไม่แก้ไข skill ใดๆ ก่อน review ผ่าน
- ทุก finding ต้องมี skill name, file path และ evidence

### 2. Orchestrate Per-Skill Updates

- เรียก `/update-devin-global-skills <skill-name>` สำหรับ skill แต่ละตัวที่ต้องอัปเดต
- ไม่ duplicate งาน per-skill update ใน skill นี้ — delegate ให้ workhorse
- ถ้าจำนวน skills > 10 → ทำ `/follow-parallel`

### 3. Safety

- ไม่ทำลาย references หรือ existing skills
- ถ้ามีการ overwrite ไฟล์เดิม → dry run และ user confirmation ก่อน
- ถ้ามีการ rename skill → ทำ `/update-references` ทันที
- ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

### 4. Validation

- ทุก skill ต้องผ่าน `/validate` หลังอัปเดต
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder
- install commands ใช้ `bun add` แทน `npm install` หรือ `npm i` และ `bun add -g` สำหรับ global CLI และ `bun add -g` สำหรับ global CLI (ยกเว้น project ใช้ npm เป็นหลัก)

### 5. Minimal Changes

- Minimal changes เสมอ ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะส่วน
- ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
- ถ้าไฟล์ยาว >250 บรรทัด → ทำ `/review-devin-global-skills` Steps 7-8 หลังจบ task

## Expected Outcome

- devin skills repo ครบถ้วน สอดคล้องกัน เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน
- ทุก skill ผ่าน `/review-devin-global-skills` และ `/validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- install commands ใช้ `bun add` แทน `npm install` หรือ `npm i` และ `bun add -g` สำหรับ global CLI
- references ครบถ้วน ไม่มี broken references และไม่มี circular dependencies
- skills ที่มี dependencies มี `references/` ครบผ่าน `/learn-from-references`
- content ครอบคลุมผ่าน `/follow-coverage`
- ทุก skill อยู่ในตำแหน่งที่สอดคล้องกับ prefix ผ่าน `/relocation`
- รายงาน before-after ชัดเจน พร้อม next actions
