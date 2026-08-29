---
name: list-github-project
description: แสดงรายการ GitHub Projects ของ user หรือ org พร้อม filter ตาม source
argument-hint: "[owner] [source]"
related:
  - follow-tool-github-project
  - list-github-repo
  - report-table
  - ask-me
  - create-github-task
  - list-github-issue
  - list-github-pull-request
---

## Goal

แสดงรายการ GitHub Projects (Projects v2) ของ user หรือ organization พร้อมกรองตาม source ทีเกี่ยวข้อง

## Scope

ใช้ `gh project` เพื่อ list projects และ item-list สำหรับ user, org หรือ repository ทีระบุ โดย filter ตาม `source`

## Execute

### 1. Verify gh Authentication

> Goal: ตรวจสอบ auth และ project scope

1. รัน `gh --version`
2. รัน `gh auth status`
3. ถ้าไม่มี `project` scope → รัน `gh auth refresh -s project`
4. ถ้าไม่ login → ทำ `/ask-me`

### 2. Resolve Owner And Source

> Goal: ได้ owner และ source filter ทีถูกต้อง

1. รับ `owner` จาก argument หรือใช้ `@me` ถ้าไม่ระบุ
2. รับ `source` จาก argument ถ้ามี:
   - `source` เป็น `user` → projects ของ user
   - `source` เป็น `org` → projects ของ org
   - `source` เป็น `repo:<owner>/<repo>` → projects ทีเกี่ยวข้องกับ repo นั้น
   - `source` เป็น `all` หรือไม่ระบุ → ทั้งหมด
3. ถ้าไม่ชัด → ทำ `/ask-me`

### 3. List Projects

> Goal: ดึงรายการ GitHub Projects

1. รัน `gh project list --owner <owner> --limit 100`
2. ถ้ามีมากกว่า 100 ให้ paginate ด้วย `--page`
3. บันทึก: number, title, owner, visibility, updated at

### 4. Filter By Source

> Goal: กรอง project หรือ items ตาม source ทีระบุ

1. ถ้า `source` เป็น `user`/`org` → กรอง project ตาม owner
2. ถ้า `source` เป็น `repo:<owner>/<repo>` → ใช้ `gh project item-list <number> --owner <owner> --query "repo:<owner>/<repo>"` เพื่อกรอง items ตาม repo source
3. ถ้า `source` เป็น `all` → ไม่กรอง
4. บันทึก projects/items ทีผ่าน filter

### 5. Build Report

> Goal: สรุปผลเป็นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Project
   - Owner
   - Source
   - Visibility
   - Updated At
   - URL
2. เรียงตาม updatedAt ล่าสุด
3. ระบุสรุปจำนวน projects

## Rules

### 1. Authentication

- ต้องมี `project` scope ก่อนใช้ `gh project`
- ไม่ expose token หรือ credentials

### 2. Source Filter

- รองรับ `user`, `org`, `repo:<owner>/<repo>`, `all`
- ถ้า filter ไม่ match ให้แจ้งว่าไม่พบ
- ไม่ modify projects หรือ items

### 3. Output

- ใช้ `/report-table` เป็นค่าเริ่มต้น
- ระบุ `source` ทีใช้กรองใน output
- ถ้าไม่มี project ให้แจ้งอย่างชัดเจน

### 4. Rate Limit

- ใช้ pagination ถ้ามี project มาก
- ถ้า API คืน 429 ให้รอและ retry

## Expected Outcome

- รายการ GitHub Projects ที filter ตาม source
- ตารางแสดง project, owner, source, visibility, updated at, url
- ไม่มีการแก้ไข project หรือ item ใดๆ
