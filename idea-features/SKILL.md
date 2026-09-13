---
name: idea-features
description: สร้างไอเดียฟีเจอรใหม่/ขยาย และตอบกลับในแชท ไม่สร้างไฟล์
argument-hint: "[topic]"
related:
  - bench-competitors
  - compare-alternative
  - suggest-me
  - enhance-prompt
  - think-reframe
  - deep-analyze
  - report
  - report-todo
  - then-apply
  - implement-to-production
  - run-test-all

---

## Goal

สร้างไอเดียฟีเจอรใหม่และฟีเจอรที่ขยายจากของเดิม แล้วสรุปผลกลับในแชททันที โดยไม่สร้างไฟล์

## Scope

- วิเคราะห์ project context และ prompt
- สร้างไอเดีย `Extends` และ `New` พร้อมระบุ impact/effort/risk
- ตอบกลับในแชทด้วย idea table + `/report-todo` table เท่านั้น (sort ตาม impact)
- ไม่สร้าง report/plan ไฟล์
- ไม่ implement
- ถ้าต้องการเปรียบเทียบ features กับ alternatives เฉยๆ (ไม่ implement) → ใช้ `/compare-alternative`
- ถ้าต้องการ benchmark features เทียบคู่แข่งแล้ว implement ให้ดีกว่า → ใช้ `/bench-competitors` (features dimension อยู่ใน step 2)
- ถ้าต้องการ report/plan/implementation ให้ส่งต่อ `/plan` หรือ `/implement-features-to-mvp`

## Execute

### 1. Understand Context

> Goal: เข้าใจ topic และ project

1. รับ `<topic>` จาก argument หรือ conversation context
2. ทำ `/deep-analyze` แบบ lightweight ถ้าต้องการ
3. ถ้า topic ไม่ชัด → ใช้ `/suggest-me` ถาม user

### 2. Generate Ideas

> Goal: สร้างไอเดียฟีเจอร

1. สร้างไอเดีย `Extends` (ขยายฟีเจอรที่มี) และ `New` (ฟีเจอรใหม่)
2. แต่ละกลุ่มไม่เกิน 10 ไอเดีย รวมไม่เกิน 20
3. แต่ละ feature ระบุ: feature, description, impact, effort, risk, mvp score (1-10)
4. ลำดับเลขต่อเนื่อง: `Extends` เริ่ม 1, `New` ต่อจาก `Extends`

### 3. Rank And Format

> Goal: จัดลำดับตาม impact และจัดรูปแบบตอบกลับ

1. จัดลำดับตาม impact สูง → ต่ำ (tie-break ด้วย mvp score)
2. สร้าง markdown tables ด้วย `/report table`
3. ถ้ามี action ต่อเนื่องจาก idea ก่อนหน้า → ใช้ `/then-apply`
4. ระบุ phase: MVP, v2, v3

### 4. Reply In Chat

> Goal: ตอบกลับ user ทันทีด้วย table เท่านั้น

1. แสดง idea tables (`Extends`, `New`) ที่ sort ตาม impact แล้ว
2. ทำ `/report-todo` แสดง action table (No., Action, Before, After, Why, File Change, Risk) พร้อมสรุป numbered list
3. ไม่ต้องสร้าง UX/UI sketch, รูปภาพ หรือข้อความอธิบายยาว

## Rules

### 1. Chat Only

- ตอบกลับในแชทเท่านั้น
- ไม่สร้างไฟล์ใน `.devin/reports/<workspace>/` หรือ `.devin/plan/<workspace>/`
- ไม่สร้าง web app ถาวร
- ไม่เรียก `/implement-to-production` หรือ `/ship`

### 2. Lightweight

- ไม่ต้อง `/learn` (web) ลึก ยกเว้น user บอก
- ไม่ต้องวิเคราะห์ codebase ละเอียด ถ้า context พอ
- ใช้เวลาไม่เกิน 5-10 นาที

### 3. Suggest Deep Workflow

- ถ้า user บอก "ทำ" หรือ "do now" → แนะนำ `/implement-features-to-mvp`
- ถ้า user ต้องการ plan หรือ report → แนะนำ `/plan`
- ถ้า user ต้องการแค่ไอเดียเพิ่ม → ทำต่อใน skill นี้
- เมื่อ features ใดๆ ถูก implement → ต้องทำ `/run-test-all` เสมอเพื่อ verify ว่า features ทำงานและไม่พังของเดิม

### 4. Format

- ทุก table ต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก
- เรียงลำดับ 1, 2, 3, ...
- sort แถวตาม impact สูง → ต่ำ
- ตอบด้วย idea table + `/report-todo` table เท่านั้น — ไม่สร้าง UX/UI sketch หรือ prose ยาว
- คำแนะนำถัดไปใส่ใน `/report-todo` table (คอลัมน์ Action)
- ใช้ `/report` สำหรับ tables
- ไม่ต้องตอบยาวเกินความจำเป็น

- ใช้ `/enhance-prompt` ถ้า prompt คลุมเครือ

## Expected Outcome

- User ได้รับไอเดีย features ในแชททันทีเป็น tables (sort ตาม impact)
- มี `/report-todo` action table สำหรับ steps ถัดไป
- ไม่มีไฟล์ถูกสร้าง
- ไม่มี implementation หรือ UX/UI sketch เกิดขึ้น


- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: deep-idea-features)

