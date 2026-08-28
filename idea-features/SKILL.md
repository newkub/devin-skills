---
name: idea-features
description: สร้างไอเดียฟีเจอร์ใหม่และขยายจากของเดิม บันทึกลง temp แล้วเปิด app เลือก copy และดู uxui sketch
argument-hint: "[topic]"
related:
  - report-uxui-sketch
  - enhance-prompt
  - follow-tool-vite
  - follow-framework-solidjs
---

## Goal

สร้างไอเดียฟีเจอร์ใหม่และฟีเจอร์ที่ขยายจากของเดิมสำหรับ project จากนั้นบันทึกลง temp JSON แล้วเปิด web app ให้ user เลือก features, copy ในรูปแบบ enhance-prompt และดู report-uxui-sketch ของแต่ละ feature

## Scope

- วิเคราะห์ project, packages, ฟีเจอร์ที่มีอยู่ และแนวโน้มตลาด
- สร้างไอเดียฟีเจอร์จัดลำดับความสำคัญ 2 กลุ่ม: `Extends` และ `New`
- บันทึกข้อมูลลงไฟล์ JSON ใน temp directory เท่านั้น
- เปิด web app ที่อ่าน JSON จาก temp โดยไม่มี backend server
- ใน app สามารถเลือก features, copy ทีเดียว, ดู uxui sketch แต่ละ feature
- ห้ามเปรียบเทียบคู่แข่งโดยตรงใน skill นี้

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
5. แต่ละ feature ต้องมี `feature, description, reason, how, riskDetail` สั้นๆ

### 3. Rank And Score

> Goal: จัดลำดับความสำคัญและคะแนน

1. ให้ MVP Score 1-10 ตาม RICE (Reach, Impact, Confidence, Effort)
2. จัดลำดับตาม MVP Score สูง → ต่ำ
3. ระบุ Phase: MVP, v2, v3
4. ระบุ Effort: S, M, L, XL
5. ระบุ Risk: สูง, กลาง, ต่ำ

### 4. Save Data To Temp

> Goal: เขียน JSON ลง temp สำหรับ app โหลด

1. สร้าง directory `TEMP/idea-features/` ถ้ายังไม่มี (`TEMP` คือ `%TEMP%` บน Windows หรือ `$TMPDIR`)
2. ใช้ path จาก env `IDEA_FEATURES_DATA` ถ้ามี ไม่งั้นใช้ `TEMP/idea-features/data.json`
3. เขียน JSON ด้วยโครงสร้าง:
   - `generatedAt`: ISO timestamp
   - `features`: array ของ feature objects
4. feature object ต้องมี fields หลัก: `number, type, impact, feature, description, phase, effort, mvpScore, risk, reason, how, riskDetail` และอาจเพิ่ม `tags` (array สตริง) / `files` (array path) เพื่อแสดงใน app
5. ใช้ `write` tool หรือ script เขียนไฟล์

### 5. Open Web App

> Goal: เปิด app ให้ user เลือก features แทนการตอบใน chat

1. ตรวจสอบว่าอยู่ใน directory `C:\Users\Veerapong\AppData\Roaming\devin\skills\idea-features`
2. ถ้ายังไม่ได้ติดตั้ม dependencies → รัน `bun install`
3. รัน `bun run dev` ใน background
4. รอ dev server ready ที่ `http://localhost:5173`
5. ทำ `/browser_preview` หรือ `agent-browser open http://localhost:5173` เพื่อเปิดใน browser
6. รายงาน user ว่า app พร้อมใช้งาน สามารถเลือก features, copy, ดู uxui sketch ได้
7. dev server รันไปเรื่อยจนกว่า user จะ kill เองหรือ terminal หยุด

### 6. Cleanup

> Goal: จัดการหลังใช้งาน

1. ถ้า user บอกว่าเสร็จแล้ว หรืองานอื่นรับช่วง → ตรวจสอบว่า dev server หยุดแล้ว
2. ถ้า server ยังรันอยู่ → ทำ `kill` หรือหยุด background shell
3. ไฟล์ data ใน temp สามารถลบหรือเก็บไว้ดังเดิมตาม context

## Rules

### 1. Data Format

- บันทึกเฉพาะ data JSON ลง temp directory
- template uxui ของ app อยู่ใน `src/App.tsx` ไม่ต้องเขียน template ลง temp
- data ต้องมี `features` เป็น array

### 2. Web App Behavior

- app เป็น Solid client-side SPA ไม่มี backend server
- app โหลด JSON จาก `/api/data` ที Vite plugin serve จาก temp
- app แสดงผลภาษาไทย สนับสนุนการ filter, select, copy
- app มี uxui sketch สำหรับแต่ละ feature แบบละเอียด
- app ส่ง beacon ไป `/close` ตอน `beforeunload` เพื่อหยุด dev server

### 3. Copy Format

- เมื่อ user กด copy ให้สร้าง numbered list ตาม `/enhance-prompt`
- รูปแบบ: `1. <feature> — <description>`
- ทีเดียวสำหรับ features ทีเลือกทั้งหมด

### 4. Table Columns For Internal Use

`# | Impact | Feature | Description | Phase | Effort | MVP Score | Risk`

- Impact: สูง, กลาง, ต่ำ
- Phase: MVP, v2, v3
- Effort: S, M, L, XL
- MVP Score: 1-10
- Risk: สูง, กลาง, ต่ำ
- Description: บรรทัดเดียว ภาษาไทย

### 5. No Chat Output By Default

- ไม่ต้องรายงานผลใน chat โดย default
- ถ้า user ขอ chat summary → ให้สรุปสั้นๆ แล้วเปิด app

### 6. Start With MVP

- เริ่มจากเวอร์ชันที่ใช้งานได้น้อยที่สุด
- กำหนด MVP scope ให้ชัดเจนต่อฟีเจอร์
- สร้างแบบ iterative ไม่ใช่ big bang

### 7. Direct Execution

- ถ้า user บอก "do ... now" → ทำ `/refactor` และ `/realize-implementation`
- ถ้า user ขอ implement ฟีเจอร์เฉพาะ → ทำ `/implement-features-to-mvp`
- ถ้า user ขอ implement ทั้งหมด → ทำ `/update-review-codebase-cli-and-run`

## Expected Outcome

- ไฟล์ JSON ของ features ถูกบันทึกลง temp
- Web app ทำงานที่ `http://localhost:5173` หลังรัน `bun run dev`
- สามารถเลือก features, copy ทีเดียวในรูปแบบ `/enhance-prompt`
- แต่ละ feature มี report-uxui-sketch ละเอียด
- ปิด tab เพื่อหยุด dev server อัตโนมัติ
- ไม่ต้องตอบยาวใน chat สรุป path และ url สั้นๆ
