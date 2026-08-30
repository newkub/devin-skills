---
name: create-plan-in-dot-devin
description: สร้างแผนคุณภาพสูงใน .devin/plan/ ด้วย features table, scoring, และ TODO
argument-hint: "[title]"
related:
  - idea-features
  - deep-plan
  - improve
  - review-plan
  - report-plan
  - report-uxui-sketch
  - report-architecture-diagram
  - follow-agents-md
---

## Goal

สร้างแผนละเอียดใน `.devin/plan/<title>-<time>.md` ทีอ่านง่าย มี features table, scoring math, และ TODO

## Scope

- รับ request หรือ title จาก argument
- สร้างไอเดียฟีเจอรด้วย `/idea-features`
- คำนวณ score ตามสูตรคณิตศาสตร์
- สร้างไฟล์แผนด้วย format: Goal, Architecture, Idea Features, TODO
- ลบไฟล์หลังใช้งาน

## Execute

### 1. Capture Request

> Goal: เข้าใจ request และกำหนดชื่อแผน

1. รับ `<title>` และ request content จาก argument
2. ถ้า title ขาด → ถาม user หรือ derived จาก request
3. แปลง title เป้น kebab-case
4. ใช้ `YYYYMMDDHHMMSS` เป้น time
5. สร้าง path `.devin/plan/<title>-<time>.md`

### 2. Generate Features

> Goal: สร้างไอเดียฟีเจอร

1. ทำ `/idea-features <title>` เพื่อ generate features
2. แบ่งเป้น `New` และ `Extends`
3. ทุก feature ต้องมี fields: `No.`, `Type`, `Impact`, `Feature`, `Description`, `Phase`, `Effort`, `MVP Score`, `Risk`, `Reason`, `How`, `Risk Detail`

### 3. Score Features

> Goal: ให้คะแนน feature ด้วยสูตรคณิตศาสตร์

1. กำหนด scale สำหรับแต่ละตัวแปร:
   - `Impact`: High = 10, Medium = 6, Low = 3
   - `Effect`: High = 10, Medium = 6, Low = 3
   - `Risk`: High = 3, Medium = 2, Low = 1
   - `Phase`: MVP = 1.0, v2 = 1.5, v3 = 2.0, Done = 0.5
2. ใช้สูตร `Score = (Impact + Effect) / (Risk × Phase)`
3. ปัดเศษทศนิยม 1 ตำแหน่ง
4. ใช้ score เรียงลำดับ priority

### 4. Deep Plan

> Goal: วางแผนครบมิติ

1. ทำ `/deep-plan` โดยใช้ features จากขั้นตอนก่อน
2. แบ่งเป้น phases: MVP, v2, v3
3. ระบุ dependencies ระหว่าง features

### 5. Improve Plan

> Goal: ทำให้แผนกระชับและอ่านง่าย

1. ทำ `/improve` กับเนื้อหาแผน
2. เน้น:
   - ลำดับชัดเจนตาม dependency
   - ทุก task มี single responsibility
   - expected result วัดผลได้
   - ลดข้อความทีไม่จำเป็น

### 6. Review Plan

> Goal: ตรวจคุณภาพแผน

1. ทำ `/review-plan` เพื่อตรวจ:
   - ความสอดคล้องกับ request
   - ลำดับทีถูกต้อง
   - risk ทีระบุครบ
   - ไม่มี gap
2. ถ้า review พบปัญหา → ทำ `/improve` ซ้ำ

### 7. Report Plan

> Goal: สรุปแผนให้ user เห็นภาพรวม

1. ทำ `/report-plan` สรุปเป้น table
2. ระบุ title, time, number of features, dependencies, risks
3. รายงานช่วงสั้นก่อนเขียนไฟล์

### 8. Write Plan File

> Goal: บันทึกแผนลงไฟล์

1. สร้าง directory `.devin/plan/` ถ้ายังไม่มี
2. เขียนไฟล์ `.devin/plan/<title>-<time>.md` ด้วย sections:
   - `## Goal` (paragraph)
   - `## Architecture` (optional ANSI diagram centered)
   - `## Idea Features`
     - `### Scoring` (math formula)
     - `### Features` (table)
   - `## TODO` (task table)
   - `## Acceptance Criteria` (checkboxes)
3. Features table columns:
   - `Icon`, `No.`, `Feature`, `Description`, `Files Change`, `Impact`, `Risk`, `Effect`, `Score`, `Phase`
4. TODO table columns:
   - `No.`, `Task`, `Status`, `Depends On`, `Expected Outcome`
5. ใช้ Iconify CDN icons ใน column `Icon` และ headings
6. ใช้ color query `?color=%23hex` สำหรับสถานะ/ระดับ
7. ANSI diagram อยู่ใน `<div align="center">` พร้อม code block
8. ใช้ `write` tool สร้างไฟล์
9. รายงาน path ให้ผู้ใช้

### 9. Update References

> Goal: อัปเดต references ทีเกี่ยวข้อง

1. ทำ `/update-references` กับทุก skill ทีอ้างอิง `create-plan` เก่า
2. เปลี่ยนเป้น `create-plan-in-dot-devin` ทีจำเป็น
3. ถ้ามี `AGENTS.md` → อัปเดต slash command

### 10. Mark Complete And Cleanup

> Goal: จัดการแผนหลังใช้งาน

1. ถ้าผู้ใช้หรืองานอื่นแจ้งว่าดำเนินการตามแผนครบทุกขั้นตอนแล้ว → อัปเดต `status` เป้น `completed`
2. ลบไฟล์ `.devin/plan/<title>-<time>.md` ทีสร้างขึ้น
3. รายงานว่าแผนถูกลบแล้ว

## Rules

### 1. File Location

- ไฟล์ต้องอยู่ใน `.devin/plan/`
- ชื่อไฟล์ format `<title>-<time>.md`
- title เป้น kebab-case
- time ใช้ `YYYYMMDDHHMMSS`

### 2. Content Quality

- ผ่าน `/improve` และ `/review-plan` ก่อนบันทึก
- ทุก feature ต้องมี score คำนวณจากสูตร
- ทุก task ต้องมี expected outcome วัดผลได้
- ไม่เกิน 250 บรรทัด

### 3. Table Format

- Features table ไม่เกิน 10 คอลัมน์
- คอลัมน์ `Icon` อยู่ตำแหน่งแรก
- คอลัมน์ `Files Change` ระบุไฟล์ทีจะเปลี่ยน
- คอลัมน์ `Score` คำนวณจากสูตร
- คอลัมน์ `Effect` ระบุผลกระทบ

### 4. Scoring

- ใช้สูตร `Score = (Impact + Effect) / (Risk × Phase)`
- ระบุ scale ทีชัดเจน
- คำนวณทุก row

### 5. Readability

- ใช้ Iconify CDN icons ใน headings และ table cells
- ใช้ color query ใน icon URL เพื่อง่ายต่อการแยกแยะ
- ANSI diagram อยู่ใน code block แบบ plain text ภายใต้ `<div align="center">`
- Goal เป็น paragraph สั้น ๆ

### 6. Cleanup

- ลบแผนทันทีเมื่องานเสร็จ
- ไม่เก็บแผนค้าง

## Expected Outcome

- ไฟล์แผน `.devin/plan/<title>-<time>.md` ถูกสร้าง
- แผนผ่าน `/deep-plan`, `/improve`, `/review-plan`, `/report-plan`
- References อัปเดตครบ
- ถ้าดำเนินการตามแผนจนครบถ้วนแล้ว ให้ลบไฟล์แผน `.devin/plan/<title>-<time>.md` ทีสร้างขึ้น
