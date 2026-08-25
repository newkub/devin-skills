---
name: update-devin-global-skills
description: อัปเดต ดูแล และ refactor devin skills repo ทั้งหมดให้ครบถ้วนและสอดคล้องกัน
auto_execution_mode: 3
---

## Goal

อัปเดต ดูแล และ refactor devin skills repo ใน `%APPDATA%\devin\skills` ให้ครบถ้วน สอดคล้องกัน เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน โดยรวมงาน update, refactor, review และ relocation ไว้ใน skill เดียว

## Scope

ใช้เมื่อต้องการ update, maintain, audit, หรือ refactor devin skills repo ทั้งหมด ครอบคลุม validation, references, coverage, redundancy, consistency, structure refactor และ relocation ไม่ใช่สร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`)

## Execute

### 1. Review All Skills

> Goal: ตรวจสอบทุก skill ก่อนดำเนินการ

1. ทำ `/review-devin-global-skills` เพื่อตรวจสอบ skill package แต่ละตัวตามมาตรฐาน `follow-write-devin-skills` พร้อม refactor และ cross-skill consistency
2. ทำ `/review-redundancy` เพื่อตรวจหา skills ที่ซ้ำซ้อนกัน
3. บันทึก findings เป็นตาราง: skill, issue, severity, recommendation

### 2. Inventory All Skills

> Goal: รู้สิ่งที่มีอยู่ใน repo

1. ทำ `/scan-codebase` ใน `%APPDATA%\devin\skills`
2. ทำ `/analyze-all-folders` เพื่อประมวลผลทุก folder ใน skills repo
3. จัดทำรายการ skills ทั้งหมด: `name`, `description`, จำนวนไฟล์, ขนาด
4. จัดกลุ่มตาม prefix (`follow-lang-*`, `follow-framework-*`, `follow-service-*`, `follow-lib-*`, `follow-tool-*`, `follow-create-*`, `follow-*`, `run-*`, `check-*`, `review-*`, `update-*`, `report-*`, `idea-*`)
5. ทำ `/report-table` สรุป inventory: ชื่อ, กลุ่ม, จำนวนไฟล์, สถานะ
6. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions ปัจจุบัน

### 3. Refactor And Relocate Skills

> Goal: ปรับโครงสร้างและย้าย skills ไปตำแหน่งที่เหมาะสม

1. ทำ `/review-devin-global-skills` Steps 7-8 เพื่อ split, merge, restructure, deduplicate skills ที่มีปัญหาโครงสร้าง
2. ทำ `/refactor-to-single-responsibility` สำหรับ skills ที่มี SRP violations
3. ทำ `/relocation` เพื่อย้าย skills ไปยังตำแหน่งที่เหมาะสมตาม prefix
4. ตรวจว่าทุก skill อยู่ในตำแหน่งที่สอดคล้องกับ prefix ตามมาตรฐานใน `/follow-write-devin-skills`
5. ถ้ามี skill ที่ prefix ไม่ตรงกับ responsibility → เปลี่ยน prefix และย้าย

### 4. Update Stale Skills

> Goal: อัปเดต skill ที่ล้าสมัยหรือไม่ตรงมาตรฐาน

1. สำหรับ skill ที่ไม่ผ่าน validation → ทำ `/follow-write-devin-skills` เพื่อปรับปรุง
2. สำหรับ skill ที่มี dependencies แต่ขาด `references/` → ทำ `/learn-from-references` เพื่อสกัดและเขียน references
3. สำหรับ skill ที่ content ไม่ครอบคลุม → ทำ `/follow-coverage` เพื่อเติมส่วนที่ขาด
4. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
5. ถ้ามี breaking changes → ระบุ migration steps และทำ `/update-reference`

### 5. Ensure Coverage And Consistency

> Goal: ทุก skill ครอบคลุมและสอดคล้องกัน

1. ทำ `/follow-coverage` สำหรับ skills ที่ content ไม่ครอบคลุม
2. ทำ `/idea-new-devin-skills-global` เพื่อวิเคราะห์ gaps และแนะนำ skills ใหม่
3. ตรวไม่มี broken references และไม่มี circular dependencies
4. ทำ `/update-reference` สำหรับการเปลี่ยนแปลงชื่อหรือเพิ่ม skills ใหม่

### 6. Update Cross-References

> Goal: references ระหว่าง skills ครบถ้วนและถูกต้อง

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้องทั้งหมด
2. ตรวจว่าทุก skill ใหม่ถูกอ้างถึงใน skills ที่เกี่ยวข้อง
3. ตรวจว่าไม่มี skill ที่อ้างถึง skill ที่ไม่มีอยู่
4. ทำ `/check-circular-dependencies` อีกครั้งหลังอัปเดต
5. ถ้ามี issue → แก้และ recheck (max 3 รอบ → stop และ report)

### 7. Report And Suggest Next Actions

> Goal: รายงานผลและแนะนำขั้นตอนถัดไป

1. ทำ `/report-table` สรุป before-after: จำนวน skills, จำนวนที่ผ่าน validation, จำนวนที่อัปเดต, จำนวนที่ refactor
2. สรุป issues ที่พบและการแก้ไข
3. ระบุ skills ที่ยังไม่ได้อัปเดตและเหตุผล
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป
5. ถ้ามี high-risk changes → ทำ `/ask-me` ก่อนดำเนินการ

## Rules

### 1. Review Before Update

- ทำ `/review-devin-global-skills` ก่อนเสมอ ตามมาตรฐาน `follow-write-devin-skills` Rule 9
- ไม่แก้ไข skill ใดๆ ก่อน review ผ่าน
- ทุก finding ต้องมี skill name, file path และ evidence

### 2. Use Follow-Write-Devin-Skills

- ทำ `/follow-write-devin-skills` สำหรับการปรับปรุง skill ใดๆ
- ทำ `/learn-from-references` สำหรับ skills ที่มี dependencies แต่ขาด references
- ทำ `/follow-coverage` สำหรับ skills ที่ content ไม่ครอบคลุม
- ใช้ skills อื่นๆ ตามเหมาะสม เช่น `/review-devin-global-skills`, `/idea-new-devin-skills-global`

### 3. Safety

- ไม่ทำลาย references หรือ existing skills
- ถ้ามีการ overwrite ไฟล์เดิม → dry run และ user confirmation ก่อน
- ถ้ามีการ rename skill → ทำ `/update-reference` ทันที
- ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

### 4. Validation

- ทุก skill ต้องผ่าน `/validate` หลังอัปเดต
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder

### 5. Minimal Changes

- Minimal changes เสมอ ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะส่วน
- ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
- ถ้าไฟล์ยาว >250 บรรทัด → ทำ `/review-devin-global-skills` Steps 7-8 หลังจบ task

## Expected Outcome

- devin skills repo ครบถ้วน สอดคล้องกัน เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน
- ทุก skill ผ่าน `/review-devin-global-skills` และ `/validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- references ครบถ้วน ไม่มี broken references และไม่มี circular dependencies
- skills ที่มี dependencies มี `references/` ครบผ่าน `/learn-from-references`
- content ครอบคลุมผ่าน `/follow-coverage`
- ทุก skill อยู่ในตำแหน่งที่สอดคล้องกับ prefix ผ่าน `/relocation`
- รายงาน before-after ชัดเจน พร้อม next actions
