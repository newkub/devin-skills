---
name: idea-features
description: สร้างไอเดียฟีเจอร์ใหม่และขยายจากของเดิม รายงานใน chat กระชับอ่านง่าย
argument-hint: "[topic]"
---

## Goal

สร้างไอเดียฟีเจอร์ใหม่และฟีเจอร์ที่ขยายจากของเดิมสำหรับ project แล้วรายงานใน chat กระชับ อ่านง่าย เข้าใจทันที

## Scope

- วิเคราะห์ project, packages, ฟีเจอร์ที่มีอยู่ และแนวโน้มตลาด
- สร้างไอเดียฟีเจอร์จัดลำดับความสำคัญ 2 กลุ่ม: `Extends` และ `New`
- รายงานใน chat เป็นภาษาไทย ไม่สร้างไฟล์
- ห้ามเปรียบเทียบคู่แข่งโดยตรง; ใช้ `/bench-features` สำหรับการนั้น

## Execute

### 1. Analyze Project

> Goal: เข้าใจ project และระบุช่องว่าง

1. ทำ `/analyze-project` และอ่าน `docs/project/features.md` ถ้ามี
2. ทำ `/learn-from-web` เพื่อศึกษาแนวโน้มตลาดและความต้องการของผู้ใช้
3. ระบุ gaps และ opportunities จากการวิเคราะห์
4. ถ้าเข้าถึง project ไม่ได้ → stop และ report

### 2. Generate Ideas

> Goal: สร้างไอเดียฟีเจอร์ที่ actionable

1. สร้างไอเดีย `Extends` (ขยายฟีเจอร์ที่มี) และ `New` (ฟีเจอร์ใหม่)
2. จัดลำดับตาม impact: สูง → กลาง → ต่ำ
3. แต่ละกลุ่มไม่เกิน 10 ไอเดีย รวมไม่เกิน 20
4. ลำดับเลขต่อเนื่อง: `Extends` เริ่ม 1, `New` ต่อจาก `Extends`

### 3. Rank And Score

> Goal: จัดลำดับความสำคัญและคะแนน

1. ให้ MVP Score 1-10 ตาม RICE (Reach, Impact, Confidence, Effort)
2. จัดลำดับตาม MVP Score สูง → ต่ำ
3. ระบุ Phase: MVP, v2, v3
4. ระบุ Effort: S, M, L, XL

### 4. Report In Chat

> Goal: รายงานกระชับ อ่านง่าย เข้าใจทันที

1. สรุป Key Findings เป็น bullet points 3-5 ข้อ
2. แสดงตาราง `Extends` และ `New` แบบ markdown ใน chat
3. แต่ละไอเดียมีรายละเอียดสั้น: ทำไม, ทำยังไง, ความเสี่ยง
4. จบด้วย Next Action 3 ข้อแรกที่ควรทำ

## Rules

### 1. Table Columns (8 columns)

`# | Impact | Feature | Description | Phase | Effort | MVP Score | Risk`

- Impact: สูง, กลาง, ต่ำ
- Phase: MVP, v2, v3
- Effort: S, M, L, XL
- MVP Score: 1-10
- Risk: สูง, กลาง, ต่ำ
- Description: บรรทัดเดียว ภาษาไทย

### 2. Chat Output

- รายงาใน chat เป็นภาษาไทย
- ใช้ markdown tables และ bullet points
- ไม่สร้างไฟล์ ไม่เขียนลง docs
- สรุปกระชับ ไม่เกิน 60 บรรทัดใน chat

### 3. Feature Details

- แต่ละไอเดียมี 3 บรรทัด: ทำไม, ทำยังไง, ความเสี่ยง
- ไม่เกิน 5 บรรทัดต่อไอเดีย
- ใช้ bullet points ไม่ใช้ paragraphs

### 4. Start With MVP

- เริ่มจากเวอร์ชันที่ใช้งานได้น้อยที่สุด
- กำหนด MVP scope ให้ชัดเจนต่อฟีเจอร์
- สร้างแบบ iterative ไม่ใช่ big bang

### 5. Direct Execution

- ถ้า user บอก "do ... now" → ทำ `/refactor` และ `/realize-implementation`
- ถ้า user ขอ implement ฟีเจอร์เฉพาะ → ทำ `/implement-features-to-mvp`
- ถ้า user ขอ implement ทั้งหมด → ทำ `/review-codebase`

## Expected Outcome

- รายงานใน chat กระชับ อ่านง่าย เข้าใจทันที
- 2 ตาราง `Extends` และ `New` 8 columns พร้อมลำดับเลขต่อเนื่อง
- แต่ละไอเดียมีรายละเอียดสั้น: ทำไม, ทำยังไง, ความเสี่ยง
- Key Findings 3-5 ข้อ และ Next Action 3 ข้อแรก
- ไม่มีไฟล์สร้างขึ้น ทุกอย่างใน chat
