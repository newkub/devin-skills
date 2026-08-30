---
name: create-plan-as-github-issue
description: สร้างแผนคุณภาพสูงจากไอเดียฟีเจอร แล้วเขียนลง GitHub issue พร้อม open-web
related:
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
- สร้าง GitHub issue ด้วย body ทีสแกนได้ มี icons, color, diagram, tables
- เปิด issue URL ด้วย `open-web`

## Execute

### 1. Capture And Prepare

> Goal: เข้าใจสิ่งทีต้องวางแผน

1. รับ `<topic>` จาก argument หรือ context
2. อ่าน context, design, report ทีเกี่ยวข้อง
3. ถ้าข้อมูลไม่พอ → ทำ `/ask-me`
4. รัน `git remote -v` เพื่อระบุ target repo สำหรับ `gh issue create`
5. ถ้าไม่มี remote หรือต้องการ repo อื่น → ถาม user

### 2. Generate And Score Features

> Goal: สร้างไอเดียฟีเจอร พร้อมคะแนน

1. ทำ `/idea-features <topic>` โดยแบ่งเป้น `New` และ `Extends`
2. คำนวณ score ตาม `references/scoring.md`
   - `Score = (Impact + Effect) / (Risk × Phase)`
3. เรียงลำดับ features ตาม score สูง → ต่ำ
4. ทำ `/deep-plan` เพื่อวาง dependencies ระหว่าง features

### 3. Plan And Refine

> Goal: ทำให้แผนกระชับและอ่านง่าย

1. ทำ `/improve` กับเนื้อหาแผน
2. ทำ `/review-plan` เพื่อตรวจคุณภาพ
3. ถ้าพบปัญหา → `/improve` ซ้ำ (max 3 รอบ)
4. ทำ `/report-uxui-sketch` หรือ `/report-architecture-diagram` ถ้าต้องการ visual

### 4. Check For Duplicate

> Goal: หลีกเลี่ยง issue ซ้ำ

1. รัน `gh issue list --search "<title>" --limit 10`
2. ถ้ามี issue ซ้ำ → อัปเดต issue เดิมแทน
3. ถ้าไม่มี → ดำเนินต่อขั้นตอน 5

### 5. Build Issue Body

> Goal: สร้าง issue body ทีใช้งานได้

สร้าง body ตาม `references/issue-body-template.md` โดยมี sections:

- `## Goal` — paragraph สั้น 1-3 บรรทัด
- `## Architecture` — ANSI diagram ตรงกลาง (ถ้ามี)
- `## Idea Features`
  - `### Scoring` — สูตรและ scale
  - `### Features` — table มี `Icon`, `No.`, `Feature`, `Description`, `Files Change`, `Impact`, `Risk`, `Effect`, `Score`, `Phase`
- `## TODO` — task table มี `No.`, `Task`, `Status`, `Depends On`, `Expected Outcome`
- `## Acceptance Criteria` — checkboxes

ใช้ `references/uxui-tips.md` เพื่อตรวจ visual hierarchy, icons, color, tables, checkboxes

### 6. Create And Open Issue

> Goal: สร้าง issue บน GitHub และเปิดใน browser

1. บันทึก body ลง temp file ถ้ายาว
2. รัน `gh issue create --title "[Plan] <feature-name>" --body-file <path>`
3. เพิ่ม labels เช่น `plan`, `enhancement` ถ้าจำเป็น
4. บันทึก issue URL
5. ทำ `/open-web <issue-url>` หรือ `start <url>` บน Windows
6. ทำ `/suggest-next-action`

## Rules

### 1. Plan Quality

- Plan ต้องมาจาก `/idea-features`
- ทุก feature ต้องมี score คำนวณจากสูตร
- ทุก task ต้องมี expected outcome วัดผลได้

### 2. Issue Body UX

- ใช้ heading level ชัดเจน
- ใช้ markdown table สำหรับ features และ tasks
- Features table มีคอลัมน์ `Icon` อยู่ตำแหน่งแรก
- ใช้ Iconify CDN icons ใน column `Icon` และ headings
- ใช้ color query `?color=%23hex` เพื่อง่ายต่อการแยกแยะ
- ANSI diagram อยู่ใน `<div align="center">` กับ code block
- ใช้ checkbox สำหรับ acceptance criteria
- ห้ามใช้ `**` ใน issue body

### 3. Scoring

- ใช้สูตร `Score = (Impact + Effect) / (Risk × Phase)`
- ระบุ scale ทีชัดเจน
- คำนวณทุก row
- ดูรายละเอียดใน `references/scoring.md`

### 4. URL Safety

- ตรวจสอบ URL ก่อนเปิด browser
- ใช้ `open-web` หรือ OS native command เท่านั้น
- ไม่เปิด URL ทีไม่มาจาก GitHub ถ้าไม่แน่ใจ

- ใช้ /create-github-issue ถ้าจำเป็น
- ใช้ /open-github-issue ถ้าจำเป็น
- ใช้ /open-github-repo ถ้าจำเป็น
- ใช้ /follow-github-issue-templates ถ้าจำเป็น
- ใช้ /report-plan ถ้าจำเป็น

## Expected Outcome

- GitHub issue ถูกสร้างด้วย plan ทีมี features table, scoring math, TODO table
- Issue body อ่านง่าย มี Iconify icons, color, และ centered diagram
- Issue URL ถูกเปิดใน browser
- Plan สามารถ track ความคืบหน้าได้
- ทุก reference ใน `references/index.md` ถูกใช้งาน
