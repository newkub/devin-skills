---
name: update-all-devin-global-skills
description: อัปเดต devin skills repo ทั้งหมดหรือเฉพาะที่ระบุโดย orchestrate update-devin-global-skills ต่อ skill
related:
  - review-references
  - review-devin-global-skills
  - review-redundancy
  - review-flow
  - update-references
  - update-version-latest
  - update-dependencies-latest
  - follow-tool-mise
  - deep-validate
  - review-issue
  - follow-global-rules
---

## Goal

อัปเดต ดูแล และ refactor devin skills repo ทั้งหมดหรือเฉพาะที่ระบุใน `%APPDATA%\devin\skills` ให้ครบถ้วน สอดคล้องกัน เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน โดย orchestrate `update-devin-global-skills` สำหรับ skill แต่ละตัว พร้อม cross-skill consistency และ relocation

## Scope

ใช้เมื่อต้องการ update, maintain, audit หรือ refactor devin skills repo ครอบคลุม inventory, per-skill update, cross-skill consistency, redundancy, relocation และ reporting

## Execute

### 1. Review Targets

> Goal: ตรวจสอบเป้าหมายก่อนดำเนินการ

1. รับ `@files...` จาก argument หรือ context
2. ถ้าไม่มี `@files` → scope เป็น devin skills repo ทั้งหมด
3. ถ้ามี `@files` → scope จำกัดเฉพาะ skill ที่ระบุ
4. ทำ `/review-devin-global-skills` ตาม scope ที่กำหนด
5. บันทึก findings เป็นตาราง: skill, issue, severity, recommendation

### 2. Inventory Skills

> Goal: รู้สิ่งที่มีอยู่ใน repo

1. ทำ `/scan-codebase` ใน `%APPDATA%\devin\skills`
2. จัดทำรายการ skills ทั้งหมด: `name`, `description`, จำนวนไฟล์, ขนาด
3. จัดกลุ่มตาม prefix (`follow-lang-*`, `follow-framework-*`, `follow-service-*`, `follow-lib-*`, `follow-tool-*`, `follow-create-*`, `follow-*`, `run-*`, `check-*`, `review-*`, `update-*`, `report-*`, `idea-*`)
4. ทำ `/report-table` สรุป inventory: ชื่อ, กลุ่ม, จำนวนไฟล์, สถานะ
5. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions ปัจจุบัน

### 3. Update Each Skill

> Goal: อัปเดต skill แต่ละตัวผ่าน workhorse

1. ถ้ามี `@files` → ทำ `/update-devin-global-skills @files`
2. ถ้าไม่มี `@files` → ทำ `/update-devin-global-skills` สำหรับ skill ที่ไม่ผ่าน review ทั้งหมด
3. จัดลำดับตาม severity: Critical ก่อน, High ตาม, Medium/Low ทีหลัง
4. ถ้าจำนวน skills ที่ต้องอัปเดต > 10 → ทำ `/follow-parallel` เพื่ออัปเดตขนาน
5. ถ้า skill มี dependencies แต่ขาด `references/` → ทำ `/learn-from-references`
6. ถ้า skill มี content ไม่ครอบคลุม → ทำ `/follow-coverage`

### 4. Refactor And Relocate Skills

> Goal: ปรับโครงสร้างและย้าย skills ไปตำแหน่งที่เหมาะสม

1. ทำ `/review-devin-global-skills` Steps 7-8 เพื่อ split, merge, restructure, deduplicate skills ที่มีปัญหาโครงสร้าง
2. ทำ `/follow-single-responsibility` สำหรับ skills ที่มี SRP violations
3. ทำ `/relocation` เพื่อย้าย skills ไปยังตำแหน่งที่เหมาะสมตาม prefix
4. ตรวจว่าทุก skill อยู่ในตำแหน่งที่สอดคล้องกับ prefix ตามมาตรฐานใน `/update-devin-global-skills`
5. ถ้ามี skill ที่ prefix ไม่ตรงกับ responsibility → เปลี่ยน prefix และย้าย

### 5. Ensure Cross-Skill Consistency

> Goal: ทุก skill สอดคล้องกันข้าม repo

1. ทำ `/review-quality` เพื่อตรวจภาษา, format, terminology, frontmatter ข้าม skill
2. ทำ `/review-redundancy` เพื่อลบเนื้อหาซ้ำซ้อนข้าม skill
3. ทำ `/idea-create-devin-skills-global` เพื่อวิเคราะหา gaps และแนะนำ skills ใหม่
4. ตรวจไม่มี broken references และไม่มี circular dependencies

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
4. ถ้ามี skill เกี่ยวข้องกับ global rules → อัปเดต `global_rules.md` และ `/follow-global-rules`
5. ทำ `/check-circular-dependencies` อีกครั้งหลังอัปเดต
6. ถ้ามี issue → แก้และ recheck (max 3 รอบ → stop และ report)

### 8. Update Dependencies And Tooling

> Goal: อัปเดต dependencies และ dev tools ที่เกี่ยวข้องกับ skills repo

1. ตรวจหา `package.json`, `mise.toml`, `bun.lock`, `bun.lockb` ใน `%APPDATA%\devin\skills` และ skills ที่มี `src/`
2. ระบุ dependencies หรือ dev tools ที่ควรย้ายไป `mise project` หรือ `mise.toml`
3. ถ้าต้องการ update ทุก version ทั้ง runtime/dependencies/tools → ทำ `/update-version-latest`
4. ถ้าต้องการเฉพาะ dependencies → ทำ `/update-dependencies-latest`
6. รัน `/deep-validate` และ `/run-check` หลัง update
7. รายงาน dependencies ที่เปลี่ยนแปลงลงใน before-after report

### 9. Report And Suggest Next Actions

> Goal: รายงานผลและแนะนำขั้นตอนถัดไป

1. ทำ `/report-table` สรุป before-after: จำนวน skills, จำนวนที่ผ่าน validation, จำนวนที่อัปเดต, จำนวนที่ refactor
2. สรุป issues ที่พบและการแก้ไข
3. ระบุ skills ที่ยังไม่ได้อัปเดตและเหตุผล
4. ถ้ามี issues ที่ต้อง review หรือ track → ทำ `/review-issue`
5. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป
6. ถ้ามี high-risk changes → ทำ `/ask-me` ก่อนดำเนินการ

## Rules

### 1. Review Before Update

- ทำ `/review-devin-global-skills` ก่อนเสมอ ตามมาตรฐาน `update-devin-global-skills` Rule 9
- ไม่แก้ไข skill ใดๆ ก่อน review ผ่าน
- ทุก finding ต้องมี skill name, file path และ evidence

### 2. Orchestrate Per-Skill Updates

- เรียก `/update-devin-global-skills` สำหรับ skill แต่ละตัวที่ต้องอัปเดต
- ถ้ามี `@files` → pass `@files` ให้ `/update-devin-global-skills`
- ไม่ duplicate งาน per-skill update ใน skill นี้ — delegate ให้ workhorse
- ถ้าจำนวน skills > 10 → ทำ `/follow-parallel`

### 3. Safety

- ไม่ทำลาย references หรือ existing skills
- ถ้ามีการ overwrite ไฟล์เดิม → dry run และ user confirmation ก่อน
- ถ้ามีการ rename skill → ทำ `/update-references` ทันที
- ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

### 4. Validation

- ทุก skill ต้องผ่าน `/deep-validate` หลังอัปเดต
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder
- install commands ใช้ `bun add` แทน `npm install` หรือ `npm i` สำหรับ project dependencies (ยกเว้น project ใช้ npm เป็นหลัก)
- global CLI ที่เป็น npm package ให้ใช้ `mise use -g npm:<package>` แทน `bun add -g`

### 5. Minimal Changes

- Minimal changes เสมอ ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะส่วน
- ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
- ถ้าไฟล์ยาว >250 บรรทัด → ทำ `/review-devin-global-skills` Steps 7-8 หลังจบ task

- ใช้ /review-flow ถ้าจำเป็น
- ใช้ /follow-tool-mise ถ้าจำเป็น

## Expected Outcome

- devin skills repo ครบถ้วน สอดคล้องกัน เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน
- ทุก skill ผ่าน `/review-devin-global-skills` และ `/deep-validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- install commands ใช้ `bun add` แทน `npm install` หรือ `npm i` สำหรับ project dependencies และ `mise use -g npm:<package>` สำหรับ global npm CLI
- references ครบถ้วน ไม่มี broken references และไม่มี circular dependencies
- skills ที่มี dependencies มี `references/` ครบผ่าน `/learn-from-references`
- content ครอบคลุมผ่าน `/follow-coverage`
- ทุก skill อยู่ในตำแหน่งที่สอดคล้องกับ prefix ผ่าน `/relocation`
- รายงาน before-after ชัดเจน พร้อม next actions
- versioned surfaces ถูกอัปเดตผ่าน `/update-version-latest` ตาม scope
- dependencies หรือ dev tools ที่ควรย้ายไป mise project ถูกระบุ และ deps ทีเหมาะสมถูกสั่ง `/update-dependencies-latest`
