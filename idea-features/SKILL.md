---
name: idea-features
description: สร้างไอเดียฟีเจอรใหม่/ขยาย และตอบกลับในแชท ไม่สร้างไฟล์
argument-hint: "[topic]"
related:
  - deep-idea-features
  - suggest-me
  - enhance-prompt
  - analyze-project
  - report-table
  - report-uxui-sketch
---

## Goal

สร้างไอเดียฟีเจอรใหม่และฟีเจอรที่ขยายจากของเดิม แล้วสรุปผลกลับในแชททันที โดยไม่สร้างไฟล์

## Scope

- วิเคราะห์ project context และ prompt
- สร้างไอเดีย `Extends` และ `New` พร้อมระบุ impact/effort/risk
- ตอบกลับในแชทด้วย markdown tables และ bullets
- ไม่สร้าง report/plan ไฟล์
- ไม่ implement
- ถ้าต้องการ report/plan/implementation ให้ส่งต่อ `/deep-idea-features`

- ดูเพิ่มเติม: /report-uxui-sketch

## Execute

### 1. Understand Context

> Goal: เข้าใจ topic และ project

1. รับ `<topic>` จาก argument หรือ conversation context
2. ทำ `/analyze-project` แบบ lightweight ถ้าต้องการ
3. ถ้า topic ไม่ชัด → ใช้ `/suggest-me` ถาม user

### 2. Generate Ideas

> Goal: สร้างไอเดียฟีเจอร

1. สร้างไอเดีย `Extends` (ขยายฟีเจอรที่มี) และ `New` (ฟีเจอรใหม่)
2. แต่ละกลุ่มไม่เกิน 10 ไอเดีย รวมไม่เกิน 20
3. แต่ละ feature ระบุ: feature, description, impact, effort, risk, mvp score (1-10)
4. ลำดับเลขต่อเนื่อง: `Extends` เริ่ม 1, `New` ต่อจาก `Extends`

### 3. Rank And Format

> Goal: จัดลำดับและจัดรูปแบบตอบกลับ

1. จัดลำดับตาม MVP score สูง → ต่ำ
2. สร้าง markdown tables ด้วย `/report-table`
3. สรุป top 3-5 features สั้นๆ ด้วย bullets
4. ระบุ phase: MVP, v2, v3

### 4. Reply In Chat

> Goal: ตอบกลับ user ทันที

1. แสดง summary 1-2 บรรทัด
2. แสดง tables ในแชท
3. บอกว่าเป็นไอเดียสำหรับพิจารณา
4. ถ้าต้องการ plan/report/implementation → แนะนำ `/deep-idea-features`
5. ถ้าต้องการถามต่อ → ใช้ `/suggest-me`

## Rules

### 1. Chat Only

- ตอบกลับในแชทเท่านั้น
- ไม่สร้างไฟล์ `.devin/reports/` หรือ `.devin/plan/`
- ไม่สร้าง web app ถาวร
- ไม่เรียก `/realize-implementation` หรือ `/ship`

### 2. Lightweight

- ไม่ต้อง `/learn-from-web` ลึก ยกเว้น user บอก
- ไม่ต้องวิเคราะห์ codebase ละเอียด ถ้า context พอ
- ใช้เวลาไม่เกิน 5-10 นาที

### 3. Suggest Deep Workflow

- ถ้า user บอก "ทำ" หรือ "do now" → แนะนำ `/deep-idea-features`
- ถ้า user ต้องการ plan หรือ report → แนะนำ `/deep-idea-features`
- ถ้า user ต้องการแค่ไอเดียเพิ่ม → ใช้ `/idea-features` ต่อ

### 4. Format

- ทุก table ต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก
- เรียงลำดับ 1, 2, 3, ...
- ใช้ `/report-table` สำหรับ tables
- ไม่ต้องตอบยาวเกินความจำเป็น

- ใช้ `/enhance-prompt` ถ้า prompt คลุมเครือ

## Expected Outcome

- User ได้รับไอเดีย features ในแชททันที
- มี tables สรุป Extends, New, ลำดับความสำคัญ
- ไม่มีไฟล์ถูกสร้าง
- ไม่มี implementation เกิดขึ้น
- มีคำแนะนำถัดไปชัดเจน

