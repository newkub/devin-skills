---
name: create-plan-in-dot-devin
description: สร้างแผนจากไอเดียฟีเจอร์พร้อม scoring แล้วเขียนลง .devin/plan/<title-date>.md
argument-hint: "[topic]"
related:
  - deep-idea-features
  - deep-plan
  - improve
  - review-plan
  - report-plan
  - report-uxui-sketch
  - report-architecture-diagram
  - implement-plan
  - ask-me
  - open-in-zed
---

## Goal

สร้างแผนที่อ่านง่าย มีประโยชน์ และติดตามผลได้ จากไอเดียฟีเจอร์ แล้วเขียนลง `.devin/plan/<title-date>.md` พร้อมเปิดไฟล์แผนใน editor

## Scope

- รับ request หรือ topic
- ใช้ `/deep-idea-features` เพื่อ generate features ที่เป็นระบบ
- คำนวณ score ตามสูตรคณิตศาสตร์
- สร้างไฟล์แผนด้วย body ที่สแกนได้ มี icons, color, diagram, tables
- เปิดไฟล์แผนด้วย `open-in-zed` หรือ editor ที่พร้อมใช้งาน

## Execute

### 1. Capture And Prepare

> Goal: เข้าใจสิ่งที่ต้องวางแผน

1. รับ `<topic>` จาก argument หรือ context
2. อ่าน context, design, report ที่เกี่ยวข้อง
3. ถ้าข้อมูลไม่พอ → ทำ `/ask-me`
4. ตรวจว่า `.devin/plan/` มีอยู่ ถ้าไม่มี → สร้าง directory
5. ยืนยัน target workspace กับ user ถ้าไม่ชัด

### 2. Generate And Score Features

> Goal: สร้างไอเดียฟีเจอร์ พร้อมคะแนน

1. ทำ `/deep-idea-features <topic>` โดยแบ่งเป็น `New` และ `Extends`
2. คำนวณ score ตาม `references/scoring.md`
   - `Score = (Impact + Effect) / (Risk × Phase)`
3. เรียงลำดับ features ตาม `Score` สูง → ต่ำ แล้ว `Phase` ต่ำ → สูง (กรณี `Score` เท่ากัน)
4. ทำ `/deep-plan` เพื่อวาง dependencies ระหว่าง features
5. ทำ `/report-uxui-sketch` สำหรับแต่ละ feature ที่ต้องการ visualize (ถ้ามี)

### 3. Plan And Refine

> Goal: ทำให้แผนกระชับและอ่านง่าย

1. ทำ `/improve` กับเนื้อหาแผน
2. ทำ `/review-plan` เพื่อตรวจคุณภาพ
3. ถ้าพบปัญหา → `/improve` ซ้ำ (max 3 รอบ)
4. ทำ `/report-uxui-sketch` หรือ `/report-architecture-diagram` สำหรับภาพรวม visual (ถ้าต้องการ)

### 4. Check For Duplicate

> Goal: หลีกเลี่ยงแผนซ้ำ

1. list ไฟล์ใน `.devin/plan/` แล้วเปรียบ title กับแผนใหม่
2. ถ้ามี plan ซ้ำ → อัปเดตไฟล์เดิมแทน
3. ถ้าไม่มี → ดำเนินการต่อขั้นตอน 5

### 5. Build Plan Body

> Goal: สร้างเนื้อหาแผนที่ใช้งานได้

สร้าง body ตาม `references/plan-template.md` โดยมี sections:

- `## Goal` — paragraph สั้น 1-3 บรรทัด
- `## Architecture` — ANSI diagram ตรงกลาง (ถ้ามี)
- `## Idea Features`
  - `### Scoring` — สูตรและ scale
  - `### Visual` — รวม `/report-uxui-sketch` ของแต่ละ feature (ถ้ามี)
  - `### Features` — table มี `Icon`, `No.`, `Feature`, `Description`, `Dependencies`, `Files Change`, `Benefit`, `Impact`, `Risk`, `Effect`, `Score`, `Phase`, `Test`
    - คอลัมน์ `Dependencies` เพิ่มเมื่อมี dependencies ระหว่าง features ถ้าไม่มีให้ละเว้นคอลัมน์นี้
- `## TODO` — task table มี `No.`, `Task`, `Status`, `Depends On`, `Expected Outcome`
- `## Acceptance Criteria` — checkboxes
- `## Execution Order` — ลำดับทำงานที่ `/implement-plan` ใช้

ใช้ `references/uxui-tips.md` เพื่อตรวจ visual hierarchy, icons, color, tables, checkboxes

### 6. Create And Open Plan File

> Goal: สร้างไฟล์แผนและเปิดให้ user ตรวจสอบ

1. บันทึก body ลง `.devin/plan/<title>-<YYYY-MM-DD>.md`
2. ถ้าไฟล์มีอยู่แล้วและเป็นแผนคนละเรื่อง → เลือก title ใหม่หรือถาม user
3. เปิดไฟล์ด้วย `open-in-zed` หรือ OS native command ตาม platform
4. รายงาน path ของไฟล์แผน
5. ทำ `/suggest-next-action` โดยแนะนำ `/implement-plan`

## Rules

### 1. Plan Quality

- Plan ต้องมาจาก `/deep-idea-features`
- ทุก feature ต้องมี score คำนวณจากสูตร
- ทุก task ต้องมี expected outcome วัดผลได้
- ต้องมี `## Execution Order` เพื่อให้ `/implement-plan` อ่านได้

### 2. Plan File UX

- ใช้ heading level ชัดเจน
- ใช้ markdown table สำหรับ features และ tasks
- Features table มีคอลัมน์ `Icon` อยู่ตำแหน่งแรก
- ใช้ Iconify CDN icons ใน column `Icon` และ headings
- ใช้ color query `?color=%23hex` เพื่อง่ายต่อการแยกแยะ
- ANSI diagram อยู่ใน `<div align="center">` กับ code block
- ใช้ checkbox สำหรับ acceptance criteria
- ห้ามใช้ `**` ใน plan body

### 3. Scoring

- ใช้สูตร `Score = (Impact + Effect) / (Risk × Phase)`
- ระบุ scale ที่ชัดเจน
- คำนวณทุก row
- เรียงลำดับ row หลักตาม `Score` สูง → ต่ำ แล้ว `Phase` ต่ำ → สูง
- ดูรายละเอียดใน `references/scoring.md`

### 4. File Safety

- สร้าง `.devin/plan/` ถ้าไม่มี
- ไม่ overwrite plan ที่มีอยู่โดยไม่ถาม user
- path ต้องอยู่ภายใต้ `.devin/plan/` เท่านั้น ห้ามมี `..`
- ใช้ `open-in-zed` หรือ OS native command เท่านั้น

- ใช้ `/implement-plan` เมื่อต้องการทำงานตามแผน
- ใช้ `/create-github-issue` ถ้าต้องการส่งแผนไป GitHub issue
- ใช้ `/report-plan` ถ้าจำเป็น

## Expected Outcome

- ไฟล์ `.devin/plan/<title>-<date>.md` ถูกสร้างด้วย plan ที่มี features table, scoring math, TODO table, Execution Order
- Plan body อ่านง่าย มี Iconify icons, color, และ centered diagram
- แต่ละ feature ที่ต้องการ visual มี `/report-uxui-sketch` ประกอบ
- ไฟล์แผนถูกเปิดใน editor
- Plan สามารถ track ความคืบหน้าได้ด้วย `/implement-plan`
- ทุก reference ใน `references/index.md` ถูกใช้งาน
