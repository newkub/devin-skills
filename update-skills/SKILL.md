---
name: update-skills
description: อัปเดตและดูแล devin skills repo ให้ครบถ้วนและสอดคล้องกัน
related:
  - follow-write-devin-skills
  - learn-from-references
  - create-devin-global-skills
  - idea-new-devin-skills-global
  - follow-coverage
  - review-all-skills
  - review-redundancy
  - check-reference
  - update-reference
  - validate
  - report-table
  - suggest-next-action
---

## Goal

อัปเดตและดูแล devin skills repo ใน `%APPDATA%\devin\skills` ให้ครบถ้วน สอดคล้องกัน และเป็นปัจจุบัน โดยใช้ `/follow-write-devin-skills`, `/learn-from-references` และ skills อื่นๆ ตามเหมาะสม

## Scope

ใช้เมื่อต้องการ update, maintain, หรือ audit devin skills repo ทั้งหมด ครอบคลุม validation, references, coverage, redundancy และ consistency ระหว่าง skills ไม่ใช่สร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`)

## Execute

### 1. Inventory All Skills

> Goal: รู้สิ่งที่มีอยู่ใน repo

1. ทำ `/scan-codebase` ใน `%APPDATA%\devin\skills`
2. จัดทำรายการ skills ทั้งหมด: `name`, `description`, จำนวนไฟล์, ขนาด
3. จัดกลุ่มตาม prefix (`run-*`, `follow-*`, `check-*`, `analyze-*`, `deep-*`, `review-*`, `report-*`, `idea-*`, `lib-*`)
4. ทำ `/report-table` สรุป inventory: ชื่อ, กลุ่ม, จำนวนไฟล์, สถานะ
5. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions ปัจจุบัน

### 2. Validate All Skills

> Goal: ตรวจทุก skill ผ่านเกณฑ์มาตรฐาน

1. ทำ `/validate` สำหรับทุก skill ใน repo
2. ตรวจแต่ละ skill: ไม่เกิน 250 บรรทัด, sections ครบ (`Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`), `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` สำหรับ `related` references
4. ทำ `/check-reference` เพื่อยืนยัน `related` references มีอยู่จริง
5. บันทึก findings เป็นตาราง: skill, issue, severity, recommendation

### 3. Update Stale Skills

> Goal: อัปเดต skill ที่ล้าสมัยหรือไม่ตรงมาตรฐาน

1. สำหรับ skill ที่ไม่ผ่าน validation → ทำ `/follow-write-devin-skills` เพื่อปรับปรุง
2. สำหรับ skill ที่มี dependencies แต่ขาด `references/` → ทำ `/learn-from-references` เพื่อสกัดและเขียน references
3. สำหรับ skill ที่ content ไม่ครอบคลุม → ทำ `/follow-coverage` เพื่อเติมส่วนที่ขาด
4. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
5. ถ้ามี breaking changes → ระบุ migration steps และทำ `/update-reference`

### 4. Ensure Coverage And Consistency

> Goal: ทุก skill ครอบคลุมและสอดคล้องกัน

1. ทำ `/follow-coverage` สำหรับ skills ที่ content ไม่ครอบคลุม
2. ทำ `/review-all-skills` เพื่อตรวจสอบ consistency ระหว่าง skills
3. ทำ `/review-redundancy` เพื่อตรวจหา skills ที่ซ้ำซ้อนกัน
4. ทำ `/idea-new-devin-skills-global` เพื่อวิเคราะห์ gaps และแนะนำ skills ใหม่
5. ตรวจ `related` ทุก skill ไม่มี missing/unused และไม่มี circular dependencies
6. ทำ `/update-reference` สำหรับการเปลี่ยนแปลงชื่อหรือเพิ่ม skills ใหม่

### 5. Update Cross-References

> Goal: references ระหว่าง skills ครบถ้วนและถูกต้อง

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้องทั้งหมด
2. ตรวจว่าทุก skill ใหม่ถูกอ้างถึงใน skills ที่เกี่ยวข้อง
3. ตรวจว่าไม่มี skill ที่อ้างถึง skill ที่ไม่มีอยู่
4. ทำ `/check-circular-dependencies` อีกครั้งหลังอัปเดต
5. ถ้ามี issue → แก้และ recheck (max 3 รอบ → stop และ report)

### 6. Report And Suggest Next Actions

> Goal: รายงานผลและแนะนำขั้นตอนถัดไป

1. ทำ `/report-table` สรุป before-after: จำนวน skills, จำนวนที่ผ่าน validation, จำนวนที่อัปเดต
2. สรุป issues ที่พบและการแก้ไข
3. ระบุ skills ที่ยังไม่ได้อัปเดตและเหตุผล
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป
5. ถ้ามี high-risk changes → ทำ `/ask-me` ก่อนดำเนินการ

## Rules

### 1. Use Follow-Write-Devin-Skills

- ทำ `/follow-write-devin-skills` สำหรับการปรับปรุง skill ใดๆ
- ทำ `/learn-from-references` สำหรับ skills ที่มี dependencies แต่ขาด references
- ทำ `/follow-coverage` สำหรับ skills ที่ content ไม่ครอบคลุม
- ใช้ skills อื่นๆ ตามเหมาะสม เช่น `/review-all-skills`, `/idea-new-devin-skills-global`

### 2. Safety

- ไม่ทำลาย references หรือ existing skills
- ถ้ามีการ overwrite ไฟล์เดิม → dry run และ user confirmation ก่อน
- ถ้ามีการ rename skill → ทำ `/update-reference` ทันที
- ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

### 3. Validation

- ทุก skill ต้องผ่าน `/validate` หลังอัปเดต
- ไม่เกิน 250 บรรทัดต่อไฟล์
- `related` ไม่มี missing/unused และไม่มี circular dependencies
- ไม่มี TODO/MOCK/placeholder

### 4. Minimal Changes

- Minimal changes เสมอ ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะส่วน
- ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
- ถ้าไฟล์ยาว >250 บรรทัด → ทำ `/refactor` หลังจบ task

## Expected Outcome

- devin skills repo ครบถ้วน สอดคล้องกัน และเป็นปัจจุบัน
- ทุก skill ผ่าน `/validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- `related` references ครบถ้วน ไม่มี missing/unused และไม่มี circular dependencies
- skills ที่มี dependencies มี `references/` ครบผ่าน `/learn-from-references`
- content ครอบคลุมผ่าน `/follow-coverage`
- รายงาน before-after ชัดเจน พร้อม next actions
