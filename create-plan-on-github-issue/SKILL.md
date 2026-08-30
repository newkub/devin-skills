---
name: create-plan-on-github-issue
description: สร้างแผนคุณภาพสูงจากไอเดียฟีเจอรแล้วเขียนลง GitHub issue พร้อม open-web
related:
  - create-plan-in-dot-devin
  - idea-features
  - create-github-issue
  - open-github-issue
  - open-web
  - open-github-repo
  - follow-github-issue-templates
  - deep-plan
  - improve
  - review-plan
  - report-plan
  - report-uxui-sketch
  - report-architecture-diagram
---

## Goal

สร้างแผนทีอ่านง่าย มีประโยชน์ และติดตามผลได้ จากไอเดียฟีเจอร แล้วเขียนลง GitHub issue เป้น body พร้อมเปิดหน้า issue ใน browser

## Scope

- รับ request หรือ topic
- ใช้ `/idea-features` เพื่อ generate features ทีเป้นระบบ
- คำนวณ score ตามสูตรคณิตศาสตร์
- สร้าง GitHub issue ด้วย body ทีเป็น table
- เปิด issue URL ด้วย `open-web`

## Execute

### 1. Capture Request And Context

> Goal: เข้าใจสิ่งทีต้องวางแผน

1. รับ request หรือ `<topic>` จาก argument
2. อ่าน context, design, report ทีเกี่ยวข้อง
3. ถ้าข้อมูลไม่พอ → ทำ `/ask-me`

### 2. Generate Features

> Goal: สร้างไอเดียฟีเจอร

1. ทำ `/idea-features <topic>` เพื่อ generate features
2. แบ่งเป้น `New` และ `Extends`
3. ทุก feature ต้องมี fields ครบ

### 3. Score Features

> Goal: ให้คะแนน feature ด้วยสูตรคณิตศาสตร์

1. กำหนด scale:
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
2. เน้นลำดับชัดเจน, single responsibility, expected result วัดผลได้

### 6. Review Plan

> Goal: ตรวจคุณภาพแผน

1. ทำ `/review-plan`
2. ถ้าพบปัญหา → ทำ `/improve` ซ้ำ

### 7. Report Plan

> Goal: สรุปแผนให้ user เห็นภาพรวม

1. ทำ `/report-plan` สรุปเป้น table
2. ระบุ title, features, dependencies, risks

### 8. Determine Repository

> Goal: ระบุ repo ทีจะสร้าง issue

1. รัน `git remote -v` เพื่อหา repo ปัจจุบัน
2. ถ้าไม่มี remote หรือต้องการ repo อื่น → ถาม user
3. บันทึก owner/repo สำหรับ `gh issue create`

### 9. Check For Duplicate

> Goal: หลีกเลี่ยง issue ซ้ำ

1. รัน `gh issue list --search "<title>" --limit 10`
2. ถ้ามี issue ซ้ำ → อัปเดต issue เดิมแทน
3. ถ้าไม่มี → สร้างใหม่

### 10. Build Issue Body

> Goal: สร้าง issue body ทีอ่านง่าย

1. สร้าง title ทีบ่งบอกว่าเป้น plan เช่น `[Plan] <feature-name>`
2. เขียน body ด้วย sections:
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

### 11. Create GitHub Issue

> Goal: สร้าง issue บน GitHub

1. บันทึก body ลง temp file ถ้ามีข้อความยาว
2. รัน `gh issue create --title "<title>" --body-file <path>`
3. หรือ `gh issue create --title "<title>" --body "<body>"` ถ้าสั้น
4. เพิ่ม labels ถ้าจำเป็น เช่น `plan`, `enhancement`
5. บันทึก issue URL จาก output

### 12. Open In Web

> Goal: เปิด issue ใน browser

1. ใช้ URL ทีได้จาก `gh issue create`
2. ทำ `/open-web <issue-url>`
3. หรือรัน `start <url>` บน Windows

## Rules

### 1. Plan Quality

- Plan ต้องมาจาก `/idea-features`
- ทุก feature ต้องมี score คำนวณจากสูตร
- ทุก task ต้องมี expected outcome วัดผลได้

### 2. Issue Body Format

- Goal เป้น paragraph สั้น ๆ
- ใช้ markdown table สำหรับ features และ tasks
- Features table มีคอลัมน์ `Icon` อยู่ตำแหน่งแรก
- คอลัมน์ `Files Change`, `Impact`, `Risk`, `Effect`, `Score`, `Phase` ครบ
- ใช้ Iconify CDN icons ใน column `Icon` และ headings
- ใช้ color query ใน icon URL เพื่อง่ายต่อการแยกแยะ
- ANSI diagram อยู่ใน code block แบบ plain text ภายใต้ `<div align="center">`
- ใช้ checkbox สำหรับ acceptance criteria

### 3. Scoring

- ใช้สูตร `Score = (Impact + Effect) / (Risk × Phase)`
- ระบุ scale ทีชัดเจน
- คำนวณทุก row

### 4. URL Safety

- ตรวจสอบ URL ก่อนเปิด browser
- ใช้ `open-web` หรือ OS native command เท่านั้น
- ไม่เปิด URL ทีไม่มาจาก GitHub ถ้าไม่แน่ใจ

## Expected Outcome

- GitHub issue ถูกสร้างด้วย plan ทีมี features table, scoring math, TODO table
- Issue body อ่านง่าย มี Iconify icons และ color
- ANSI diagram อยู่ตรงกลาง
- Issue URL ถูกเปิดใน browser
- Plan สามารถ track ความคืบหน้าได้
