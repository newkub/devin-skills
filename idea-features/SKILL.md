---
name: idea-features
description: สร้างไอเดียฟีเจอรใหม่และขยายจากของเดิม โดยไม่เปิด web app และไม่สร้าง report files ถาวร
argument-hint: "[topic]"
related:
  - create-report-in-dot-devin
  - realize-implementation
  - review-codebase-everythink
  - suggest-me
  - enhance-prompt
  - report-uxui-sketch
---

## Goal

สร้างไอเดียฟีเจอรใหม่และฟีเจอรที่ขยายจากของเดิมสำหรับ project จากนั้นสรุปใน chat หรือสร้าง report ชั่วคราวใน `.devin/reports/` แล้วลบหลังใช้งาน โดยไม่เปิด web app

## Scope

- วิเคราะห์ project, packages, ฟีเจอรที่มีอยู่
- สร้างไอเดียฟีเจอรจัดลำดับความสำคัญ 2 กลุ่ม: `Extends` และ `New`
- สร้าง report ชั่วคราวใน `.devin/reports/` ด้วย `/create-report-in-dot-devin` ถ้าต้องการ
- ไม่เปิด web app, ไม่มี `src/`, ไม่มี `package.json` ใน skill directory
- เมื่อ user บอกให้ "ทำ" ให้ทำตาม `/realize-implementation` โดยก่อนรันต้อง `/review-codebase-everythink` ก่อน และลบ report files หลังเสร็จ
- ถ้าต้องการลบ `.git`, remote repo, submodules, web src ของ project ที่สร้าง → ดำเนินการตาม context ให้เหลือแค่ SKILL.md หรือไฟล์จำเป็น

## Execute

### 1. Analyze Project

> Goal: เข้าใจ project และระบุช่องว่าง

1. ทำ `/analyze-project` และอ่าน `docs/project/features.md` ถ้ามี
2. ทำ `/learn-from-web` เพื่อศึกษาแนวโน้มตลาดและความต้องการของผู้ใช้
3. ระบุ gaps และ opportunities จากการวิเคราะห์
4. ถ้าเข้าถึง project ไม่ได้ → stop และ report

### 2. Generate Ideas

> Goal: สร้างไอเดียฟีเจอรที่ actionable

1. สร้างไอเดีย `Extends` (ขยายฟีเจอรที่มี) และ `New` (ฟีเจอรใหม่)
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

### 4. Create Temporary Report

> Goal: สร้าง report ชั่วคราวใน .devin/reports/

1. ทำ `/create-report-in-dot-devin` ด้วย title จาก topic
2. รวม 3 tables: New Features, Extended Features, What You Do แบ่ง phase
3. รวม `/report-file-structure` ของ project
4. บันทึกลง `.devin/reports/<title>-<time>.md`

### 5. Summarize In Chat

> Goal: รายงานผลให้ user ทราบ

1. สรุป features หลักใน chat สั้นๆ
2. ระบุ path ของ report ชั่วคราว
3. ถาม user ว่าต้องการทำ features ไหน

### 6. Implement If Asked

> Goal: ทำตามคำสั่ง "ทำ"

1. ถ้า user บอก "ทำ" → ทำ `/review-codebase-everythink` ก่อน
2. จากนั้นทำ `/realize-implementation` ตาม features ที่เลือก
3. หลัง `/realize-implementation` เสร็จ ลบ report files ที่สร้างใน `.devin/reports/`
4. ถ้ามี `.git`, remote repo, submodules, web src ของ project ที่ไม่จำเป็น → ลบตาม context ให้เหลือแค่ไฟล์ที่จำเป็น

### 7. Cleanup

> Goal: จัดการหลังใช้งาน

1. ถ้า report ชั่วคราวยังคงอยู่และไม่ต้องการเก็บ → ลบไฟล์ `.devin/reports/<title>-<time>.md`
2. ถ้า user บอกว่าเสร็จแล้ว → ตรวจสอบว่าไม่มี report files ค้าง

## Rules

### 1. No Permanent Web App

- skill directory `idea-features` มีแค่ `SKILL.md`
- ไม่มี `src/`, `package.json`, `index.html`, `vite.config.ts`, `uno.config.ts`, `tsconfig.json`
- ไม่เปิด web app หรือ dev server
- ไม่บันทึก data JSON ลง temp เพื่อเปิด app

### 2. Report Is Temporary

- สร้าง report ใน `.devin/reports/` เท่านั้น
- ต้องลบ report files หลัง `/realize-implementation` เสร็จ
- ไม่เก็บ report ค้าง

### 3. Implement Flow

- ถ้า user บอก "do ... now" หรือ "ทำ" → ทำ `/review-codebase-everythink` ก่อน แล้ว `/realize-implementation`
- ถ้า user ขอ implement ฟีเจอรเฉพาะ → ทำ `/implement-features-to-mvp`
- ถ้า user ขอ implement ทั้งหมด → ทำ `/realize-implementation`

### 4. Data Format

- ใช้ `/create-report-in-dot-devin` สำหรับ report format
- แต่ละ feature ต้องมี fields: `number, type, impact, feature, description, phase, effort, mvpScore, risk, reason, how, riskDetail`
- ใช้ `/enhance-prompt` สำหรับ copy format

### 5. Direct Execution

- ถ้า user บอก "do ... now" → ทำ `/review-codebase-everythink` แล้ว `/realize-implementation`
- ถ้า user ขอ implement ฟีเจอรเฉพาะ → ทำ `/implement-features-to-mvp`
- ถ้า user ขอ implement ทั้งหมด → ทำ `/realize-implementation`

### 6. Start With MVP

- เริ่มจากเวอร์ชันที่ใช้งานได้น้อยที่สุด
- กำหนด MVP scope ให้ชัดเจนต่อฟีเจอร
- สร้างแบบ iterative ไม่ใช่ big bang

### 7. Cleanup Generated Project

- ถ้าสร้าง project สำหรับ features → ลบ `.git`, remote repo, submodules, web src ตาม context
- เหลือแค่ `SKILL.md` หรือไฟล์ที่จำเป็นจริงๆ
- ใช้ dry run ก่อน destructive actions

## Expected Outcome

- ไอเดีย features ถูกสร้างและจัดลำดับ
- Report ชั่วคราวถูกสร้างใน `.devin/reports/` (ถ้าต้องการ)
- ไม่มี web app หรือ report files ถาวร
- เมื่อ user บอก "ทำ" ให้ทำ `/review-codebase-everythink` แล้ว `/realize-implementation` แล้วลบ report files
- ไม่ต้องตอบยาวใน chat สรุป path และ features สั้นๆ
