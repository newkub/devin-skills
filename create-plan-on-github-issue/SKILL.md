---
name: create-plan-on-github-issue
description: สร้าง plan แล้วเขียนลง GitHub issue พร้อม open หน้า issue ด้วย open-web
related:
  - create-github-issue
  - open-github-issue
  - open-web
  - open-github-repo
  - follow-github-issue-templates
  - report-plan
  - report-uxui-sketch
---

## Goal

สร้าง plan สำหรับ feature/project แล้วเขียนลง GitHub issue พร้อมเปิดหน้า issue ใน browser

## Scope

- สร้างหรือรวบรวม plan จาก context, report, หรือ design
- สร้าง GitHub issue ด้วย plan เป้น body
- เปิด issue URL ด้วย `open-web`
- ใช้ `gh` CLI หรือ MCP GitHub tool

## Execute

### 1. Prepare Plan

> Goal: รวบรวม plan ให้ครบถ้วน

1. อ่าน context, design, report ที user ให้
2. ทำ `/report-plan` สรุป plan เป้น bullet points
3. ใช้ `/report-uxui-sketch` ถ้าต้องการแนบ wireframe
4. ตรวจสอบ scope, deliverables, และ acceptance criteria

### 2. Determine Repository

> Goal: ระบุ repo ทีจะสร้าง issue

1. รัน `git remote -v` เพื่อหา repo ปัจจุบัน
2. ถ้าไม่มี remote หรือต้องการ repo อื่น → ถาม user
3. บันทึก owner/repo สำหรับ `gh issue create`

### 3. Check For Duplicate

> Goal: หลีกเลี่ยง issue ซ้ำ

1. รัน `gh issue list --search "<title>" --limit 10`
2. ถ้ามี issue ซ้ำ → update เดิมแทน
3. ถ้าไม่มี → สร้างใหม่

### 4. Create GitHub Issue

> Goal: สร้าง issue บน GitHub

1. สร้าง title ทีบ่งบอกวาเป้น plan เช่น `[Plan] <feature-name>`
2. ใช้ `gh issue create --title "<title>" --body "<body>"`
3. หรือสร้าง body จากไฟล์: `gh issue create --title "<title>" --body-file <path>`
4. เพิ่ม labels ถ้าจำเป็น เช่น `plan`, `enhancement`
5. บันทึก issue URL จาก output

### 5. Open In Web

> Goal: เปิด issue ใน browser

1. ใช้ URL ทีได้จาก `gh issue create`
2. ทำ `/open-web <issue-url>`
3. หรือรัน `start <url>` บน Windows

## Rules

### 1. Plan Quality

- Plan ต้องมี Goal, Scope, Tasks, และ Acceptance Criteria
- แยก task ย่อยให้ชัดเจน
- ระบุ dependencies และ risks

### 2. Issue Body

- ใช้ markdown สำหรับ issue body
- มี summary สั้น ๆ ด้านบน
- มี checkboxes สำหรับ task ย่อยถ้าจำเป็น
- แนบ link ไปยัง report หรือ sketch ถ้ามี

### 3. URL Safety

- ตรวจสอบ URL ก่อนเปิด browser
- ใช้ `open-web` หรือ OS native command เท่านั้น
- ไม่เปิด URL ทีไม่มาจาก GitHub ถ้าไม่แน่ใจ

## Expected Outcome

- GitHub issue ถูกสร้างด้วย plan ทีครบถ้วน
- Issue URL ถูกเปิดใน browser
- Plan สามารถ track ความคืบหน้าได้
