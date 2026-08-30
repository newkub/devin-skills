---
name: idea-features
description: สร้างไอเดียฟีเจอรใหม่และขยายจากของเดิม สร้าง report ชั่วคราว และเปิด preview ด้วย open-files-in-web ได้
argument-hint: "[topic]"
related:
  - create-report-in-dot-devin
  - create-files-in-os-temp
  - open-files-in-web
  - realize-implementation
  - review-codebase-everything
  - suggest-me
  - enhance-prompt
  - report-uxui-sketch
  - analyze-project
---

## Goal

สร้างไอเดียฟีเจอรใหม่และฟีเจอรที่ขยายจากของเดิมสำหรับ project จากนั้นสรุปใน chat หรือสร้าง report ชั่วคราว แล้วลบหลังใช้งาน

สามารถสร้าง report ใน OS temp directory และเปิด preview ด้วย `open-files-in-web` ได้ ถ้าผู้ใช้ต้องการดู report ก่อนตัดสินใจ

## Scope

- วิเคราะห์ project, packages, ฟีเจอรที่มีอยู่
- สร้างไอเดียฟีเจอรจัดลำดับความสำคัญ 2 กลุ่ม: `Extends` และ `New`
- สร้าง report ชั่วคราวใน `.devin/reports/` หรือ OS temp directory ถ้าต้องการ
- เปิด report ชั่วคราวด้วย `/open-files-in-web` ถ้าผู้ใช้ต้องการ preview
- ไม่สร้าง web app ถาวร, ไม่มี `src/`, ไม่มี `package.json` ใน skill directory
- เมื่อ user บอกให้ "ทำ" ให้ทำตาม `/realize-implementation` โดยก่อนรันต้อง `/review-codebase-everything` ก่อน และลบ report files หลังเสร็จ
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

> Goal: สร้าง report ชั่วคราวเพื่อสรุปไอเดีย

1. ถ้าต้องการ preview ใน browser → ใช้ `/create-files-in-os-temp` สร้าง report ใน OS temp
2. ถ้าไม่ต้องการ preview → ใช้ `/create-report-in-dot-devin` ใน `.devin/reports/`
3. รวม 3 tables: New Features, Extended Features, What You Do แบ่ง phase
4. รวม `/report-file-structure` ของ project
5. บันทึกลง path ทีเลือก

### 4.5 Open Preview With Open-Files-In-Web

> Goal: เปิด report ชั่วคราวดูก่อนตัดสินใจ

1. ถ้าสร้าง report ใน temp → ใช้ `/open-files-in-web preview <path>`
2. ถ้าสร้างใน `.devin/reports/` → ใช้ `/open-files-in-web <path>`
3. รอ user ดู preview หรือบอก "เสร็จแล้ว" ก่อน cleanup

### 5. Summarize In Chat

> Goal: รายงานผลให้ user ทราบ

1. สรุป features หลักใน chat สั้นๆ
2. ระบุ path ของ report ชั่วคราว
3. ถาม user ว่าต้องการทำ features ไหน

### 6. Implement If Asked

> Goal: ทำตามคำสั่ง "ทำ"

1. ถ้า user บอก "ทำ" → ทำ `/review-codebase-everything` ก่อน
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
- ไม่สร้าง web app ถาวร หรือ dev server
- เปิด preview ชั่วคราวด้วย `/open-files-in-web` ได้ ถ้าผู้ใช้ต้องการ

### 2. Report Is Temporary

- สร้าง report ใน `.devin/reports/` หรือ OS temp directory เท่านั้น
- ต้องลบ report files หลัง `/realize-implementation` เสร็จ หรือหลัง user ดู preview เสร็จ
- ไม่เก็บ report ค้าง

### 3. Implement Flow

- ถ้า user บอก "do ... now" หรือ "ทำ" → ทำ `/review-codebase-everything` ก่อน แล้ว `/realize-implementation`
- ถ้า user ขอ implement ฟีเจอรเฉพาะ → ทำ `/implement-features-to-mvp`
- ถ้า user ขอ implement ทั้งหมด → ทำ `/realize-implementation`

### 4. Data Format

- ใช้ `/create-report-in-dot-devin` สำหรับ report format
- แต่ละ feature ต้องมี fields: `number, type, impact, feature, description, phase, effort, mvpScore, risk, reason, how, riskDetail`
- ใช้ `/enhance-prompt` สำหรับ copy format

### 5. Direct Execution

- ถ้า user บอก "do ... now" → ทำ `/review-codebase-everything` แล้ว `/realize-implementation`
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
- Report ชั่วคราวถูกสร้างใน `.devin/reports/` หรือ OS temp (ถ้าต้องการ)
- สามารถเปิด preview ด้วย `/open-files-in-web` ได้ โดยไม่สร้าง web app ถาวร
- ไม่มี report files ค้างหลังเสร็จงาน
- เมื่อ user บอก "ทำ" ให้ทำ `/review-codebase-everything` แล้ว `/realize-implementation` แล้วลบ report files
- ไม่ต้องตอบยาวใน chat สรุป path และ features สั้นๆ
