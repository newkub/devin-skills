---
name: update-devin-global-skills
description: อัปเดต skill เดียวใน devin skills repo ตามมาตรฐาน follow-write-devin-skills
argument-hint: "[skill-name]"
---

## Goal

อัปเดต ดูแล และ refactor skill เดียวใน `%APPDATA%\devin\skills` ให้ผ่านมาตรฐาน `follow-write-devin-skills` เป็นปัจจุบัน และมีโครงสร้าง SRP ชัดเจน

## Scope

ใช้เมื่อต้องการ update, maintain หรือ refactor skill เดียวใน devin skills repo ครอบคลุม validation, references, coverage, structure refactor ของ skill นั้น ไม่ใช่สร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`) ไม่ใช่ update ทั้ง repo (ใช้ `/update-all-devin-global-skills`)

## Execute

### 1. Identify Target Skill

> Goal: รู้ว่าจะอัปเดต skill ใด

1. รับ `skill-name` จาก argument หรือจาก context ของ task
2. ยืนยันว่า `%APPDATA%\devin\skills\<skill-name>\SKILL.md` มีอยู่จริง
3. ถ้าไม่มี → stop และ report
4. อ่าน `SKILL.md` และไฟล์ทั้งหมดใน skill package

### 2. Review Target Skill

> Goal: ตรวจสอบ skill ก่อนดำเนินการ

1. ทำ `/review-devin-global-skills` โดย scope เฉพาะ skill นี้ (Steps 2-6)
2. บันทึก findings เป็นตาราง: category, severity, finding, evidence, action
3. ถ้า score < 70 → แจ้งผู้ใช้ก่อนดำเนินการ

### 3. Update Structure

> Goal: ปรับโครงสร้าง skill ให้ตรงมาตรฐาน

1. ทำ `/follow-write-devin-skills` เพื่อปรับปรุง `SKILL.md` และ directory structure
2. ตรวจ template selection ตรงกับ prefix ตาม `templates/index.md`
3. ถ้าไฟล์เกิน 250 บรรทัด → split ออกเป็น `references/` หรือ `subskills/`
4. ทำ `/follow-single-responsibility` สำหรับไฟล์ที่มี SRP violations

### 4. Update References

> Goal: references ครบถ้วนและเป็นปัจจุบัน

1. ถ้า skill มี dependencies แต่ขาด `references/` → ทำ `/learn-from-references` เพื่อสกัดและเขียน references
2. ตรวจ markdown links ใน `SKILL.md` ชี้ไปยังไฟล์ที่มีอยู่จริง
3. ทำ `/check-reference` เพื่อยืนยัน `related` references มีอยู่จริง
4. ถ้ามี broken references → แก้ทันที

### 5. Update Content

> Goal: เนื้อหาครอบคลุมและกระชับ

1. ทำ `/follow-coverage` สำหรับส่วนที่ขาด
2. ทำ `/simplify` เพื่อกระชับเนื้อหาที่ซ้ำซ้อน
3. ตรวจไม่มี TODO/MOCK/placeholder
4. ถ้ามี version info ที่ล้าสมัย → ทำ `/learn-from-web` เพื่อ verify และอัปเดต

### 6. Validate

> Goal: skill ผ่านเกณฑ์ทั้งหมด

1. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง
2. ตรวจทุกไฟล์ไม่เกิน 250 บรรทัด
3. ทำ `/check-circular-dependencies` สำหรับ skill นี้
4. ถ้าไม่ผ่าน → แก้และ recheck (max 3 รอบ → stop และ report)

### 7. Update Cross-References

> Goal: references ระหว่าง skills ครบถ้วน

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้องกับ skill นี้
2. ตรวจว่า skills อื่นที่อ้างถึง skill นี้ยังถูกต้อง
3. ถ้ามีการ rename → อัปเดตทุกจุดที่อ้างถึง

### 8. Report

> Goal: รายงานผลและแนะนำขั้นตอนถัดไป

1. ทำ `/report-table` สรุป before-after: findings, actions, status
2. สรุป issues ที่พบและการแก้ไข
3. ระบุส่วนที่ยังไม่ได้อัปเดตและเหตุผล
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. Review Before Update

- ทำ `/review-devin-global-skills` ก่อนเสมอ ตามมาตรฐาน `follow-write-devin-skills` Rule 9
- ไม่แก้ไข skill ก่อน review ผ่าน
- ทุก finding ต้องมี file path และ evidence

### 2. Use Follow-Write-Devin-Skills

- ทำ `/follow-write-devin-skills` สำหรับการปรับปรุง skill
- ทำ `/learn-from-references` สำหรับ skills ที่มี dependencies แต่ขาด references
- ทำ `/follow-coverage` สำหรับ skills ที่ content ไม่ครอบคลุม

### 3. Safety

- ไม่ทำลาย references หรับ existing skills
- ถ้ามีการ overwrite ไฟล์เดิม → dry run และ user confirmation ก่อน
- ถ้ามีการ rename skill → ทำ `/update-reference` ทันที
- ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

### 4. Validation

- skill ต้องผ่าน `/validate` หลังอัปเดต
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder

### 5. Minimal Changes

- Minimal changes เสมอ ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะส่วน
- ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`

## Expected Outcome

- skill เดียวผ่าน `/review-devin-global-skills` และ `/validate`
- ไม่เกิน 250 บรรทัดต่อไฟล์ ไม่มี TODO/MOCK/placeholder
- references ครบถ้วน ไม่มี broken references และไม่มี circular dependencies
- ถ้ามี dependencies มี `references/` ครบผ่าน `/learn-from-references`
- content ครอบคลุมผ่าน `/follow-coverage`
- รายงาน before-after ชัดเจน พร้อม next actions
