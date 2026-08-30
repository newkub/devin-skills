---
name: create-plan-on-github-issue
description: สร้างแผนคุณภาพสูงจากไอเดียฟีเจอรแล้วเขียนลง GitHub issue เป้น table พร้อมเปิดดู
related:
  - idea-features
  - create-plan-in-dot-devin
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
---

## Goal

สร้างแผนทีอ่านง่าย มีประโยชน์ และติดตามผลได้ จากไอเดียฟีเจอร แล้วเขียนลง GitHub issue เป้น body พร้อมเปิดหน้า issue ใน browser

## Scope

- รับ request หรือ topic
- ใช้ `/idea-features` เพื่อ generate features ทีเป็นระบบ
- ปรับปรุงแผนด้วย `/deep-plan`, `/improve`, `/review-plan`, `/report-plan`
- สร้าง GitHub issue ด้วย body ทีเป้น table
- เปิด issue URL ด้วย `open-web`
- ไม่ใช้ emoji หรือ external icon CDN ใน issue body

## Execute

### 1. Capture Request And Context

> Goal: เข้าใจสิ่งทีต้องวางแผน

1. รับ request หรือ `<topic>` จาก argument
2. อ่าน context, design, report ทีเกี่ยวข้อง
3. ถ้าข้อมูลไม่พอ → ทำ `/ask-me`

### 2. Generate Features With idea-features

> Goal: สร้างไอเดียฟีเจอรที actionable

1. ทำ `/idea-features <topic>` เพื่อ generate features
2. แบ่งเป็น `New` และ `Extends`
3. ทุก feature ต้องมี fields:
   - `No.`
   - `Type`
   - `Impact`
   - `Feature`
   - `Description`
   - `Phase`
   - `Effort`
   - `MVP Score`
   - `Risk`
   - `Reason`
   - `How`
   - `Risk Detail`
4. บันทึก output ชั่วคราวสำหรับสร้าง plan

### 3. Deep Plan

> Goal: วางแผนครบมิติ

1. ทำ `/deep-plan` โดยใช้ features จากขั้นตอนก่อน
2. แบ่งเป็น phases: MVP, v2, v3
3. ระบุ dependencies ระหว่าง features

### 4. Improve Plan

> Goal: ทำให้แผนกระชับและอ่านง่าย

1. ทำ `/improve` กับเนื้อหาแผน
2. เน้น:
   - ลำดับชัดเจนตาม dependency
   - ทุก task มี single responsibility
   - expected result วัดผลได้
   - ลดข้อความทีไม่จำเป็นจริง ๆ

### 5. Review Plan

> Goal: ตรวจคุณภาพแผน

1. ทำ `/review-plan` เพื่อตรวจ:
   - ความสอดคล้องกับ request
   - ลำดับทีถูกต้อง
   - risk ทีระบุครบ
   - ไม่มี gap
2. ถ้า review พบปัญหา → ทำ `/improve` ซ้ำ

### 6. Report Plan As Table

> Goal: สรุปแผนเป็น table

1. ทำ `/report-plan` สรุปเป็น 2 table:
   - **Features table** (No, Type, Impact, Feature, Description, Phase, Effort, MVP Score, Risk, Reason, How, Risk Detail)
   - **Tasks table** (No, Task, Owner, Status, Depends On, Expected Outcome)
2. ตรวจสอบว่า table ครบถ้วน

### 7. Determine Repository

> Goal: ระบุ repo ทีจะสร้าง issue

1. รัน `git remote -v` เพื่อหา repo ปัจจุบัน
2. ถ้าไม่มี remote หรือต้องการ repo อื่น → ถาม user
3. บันทึก owner/repo สำหรับ `gh issue create`

### 8. Check For Duplicate

> Goal: หลีกเลี่ยง issue ซ้ำ

1. รัน `gh issue list --search "<title>" --limit 10`
2. ถ้ามี issue ซ้ำ → อัปเดต issue เดิมแทน
3. ถ้าไม่มี → สร้างใหม่

### 9. Build Issue Body

> Goal: สร้าง issue body ทีอ่านง่าย

1. สร้าง title ทีบ่งบอกว่าเป็น plan เช่น `[Plan] <feature-name>`
2. เขียน body ด้วย sections:
   - `## Summary`
   - `## Goals`
   - `## Scope`
   - `## Features` (table)
   - `## Task Plan` (table)
   - `## Risks`
   - `## Acceptance Criteria` (checkboxes)
   - `## Notes` (optional)
3. Features table ใช้ fields จาก `/idea-features`
4. Tasks table ใช้: No., Task, Owner, Status, Depends On, Expected Outcome
5. ไม่ใช้ emoji หรือ external icon CDN
6. ใช้ checkboxes `- [ ]` สำหรับ acceptance criteria
7. แนบ link ไป report หรือ sketch ถ้ามี

### 10. Create GitHub Issue

> Goal: สร้าง issue บน GitHub

1. บันทึก body ลง temp file ถ้ามีข้อความยาว
2. รัน `gh issue create --title "<title>" --body-file <path>`
3. หรือ `gh issue create --title "<title>" --body "<body>"` ถ้าสั้น
4. เพิ่ม labels ถ้าจำเป็น เช่น `plan`, `enhancement`
5. บันทึก issue URL จาก output

### 11. Open In Web

> Goal: เปิด issue ใน browser

1. ใช้ URL ทีได้จาก `gh issue create`
2. ทำ `/open-web <issue-url>`
3. หรือรัน `start <url>` บน Windows

## Rules

### 1. Plan Quality

- Plan ต้องมาไอเดียฟีเจอรจาก `/idea-features`
- Plan ต้องมี Goals, Scope, Features, Tasks, Risks, Acceptance Criteria
- ทุก feature ต้องมี MVP Score, Phase, Effort, Risk
- ทุก task ต้องมี Expected Outcome วัดผลได้

### 2. Issue Body Format

- ใช้ markdown table สำหรับ features และ tasks
- ไม่ใช้ emoji หรือ external icon CDN
- ใช้ checkbox สำหรับ acceptance criteria
- ไม่เกินความกว้างทีอ่านง่ายบน GitHub

### 3. URL Safety

- ตรวจสอบ URL ก่อนเปิด browser
- ใช้ `open-web` หรือ OS native command เท่านั้น
- ไม่เปิด URL ทีไม่มาจาก GitHub ถ้าไม่แน่ใจ

## Expected Outcome

- GitHub issue ถูกสร้างด้วย plan ทีมี feature table และ task table
- Issue body อ่านง่าย ไม่มี emoji หรือ icon CDN
- Issue URL ถูกเปิดใน browser
- Plan สามารถ track ความคืบหน้าได้
