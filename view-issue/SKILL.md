---
name: view-issue
description: แสดงรายละเอียด GitHub issue บน terminal พร้อม metadata และ comments
argument-hint: "[issue-number-or-url]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
triggers:
  - user
  - model
related:
  - list-github-issue
  - create-github-issue
  - review-github-issue
---

## Goal

แสดงรายละเอียด GitHub issue บน terminal: title, body, metadata, labels, และ comments

## Scope

ใช้เมื่อผู้ใช้ต้องการดู issue, ตรวจสอบ issue, หรืออ่านรายละเอียด issue โดยไม่ต้องเปิด browser รองรับ local repos และ cross-repo issues ผ่าน `gh`

ดูเพิ่มเติม: /list-github-issue, /create-github-issue, /review-github-issue

## Execute

### 1. Identify Issue

> Goal: Identify Issue

กำหนด issue ที่ต้องการดู

1. รับ issue number หรือ URL จาก argument หรือ context
2. ถ้าไม่มี issue ที่ระบุ ให้ใช้ `gh issue list` และขอให้ผู้ใช้เลือก issue
3. ถ้ามี URL ให้ดึง `owner/repo` และ issue number
4. ถ้าต้องการ `--repo` ให้สร้างจาก git remote หรือ URL

### 2. Check gh CLI

> Goal: Check gh CLI

ตรวจสอบให้แน่ใจว่า `gh` พร้อมใช้งานและผ่านการตรวจสอบสิทธิ

1. รัน `gh --version`
2. ถ้าหายไป ให้ติดตั้งด้วย `mise use -g gh` หรือ `scoop install gh`
3. รัน `gh auth status` เพื่อตรวจสอบการตรวจสอบสิทธิ
4. ถ้ายังไม่ผ่านการตรวจสอบสิทธิ ให้รัน `gh auth login` หรือ report issue

### 3. View Issue Details

> Goal: View Issue Details

แสดง metadata ของ issue

1. รัน `gh issue view <number>`
2. ใช้ `gh issue view <number> --json ...` สำหรับ structured output
3. รวม fields: number, title, author, state, labels, assignees, milestone, body
4. จัดรูปแบบ output เป็น table หรือ sectioned report ที่อ่านง่าย

### 4. View Issue Comments

> Goal: View Issue Comments

แสดง comments เมื่อมีการร้องขอ

1. รัน `gh issue view <number> --comments`
2. จำกัดเป็น 20 comments ล่าสุดโดย default
3. ถามก่อนโหลด comments ทั้งหมดสำหรับ issue ที่มี replies จำนวนมาก

### 5. Cross-Repo Issues

> Goal: Cross-Repo Issues

จัดการ issues จาก repositories อื่น

1. Parse issue URL เพื่อรับ owner, repo, และ number
2. รัน `gh issue view <number> --repo <owner/repo>`
3. รัน `gh issue view <number> --repo <owner/repo> --comments`

## Rules

### 1. Tooling

- ใช้ `gh issue view` เป็น primary command
- ใช้ `--json` สำหรับ machine-readable metadata
- ใช้ `--comments` เฉพาะเมื่อมีการร้องขอ

### 2. Output

- แสดง title, number, state, author, และ labels ก่อน
- แสดง body, assignees, และ milestone ใน sections
- แสดง comments ตามลำดับเวลา ถ้ามีการร้องขอ

### 3. Scope

- ดูเท่านั้น ห้าม close, edit, หรือ comment บน issue เว้นแต่มีการร้องขอ
- ถามก่อนแสดง issues ที่มี body ยาวมากหรือมี comments จำนวนมาก

### 4. Safety

- ตรวจสอบว่า `gh` ผ่านการตรวจสอบสิทธิ
- จัดการกรณี issue หายไปอย่างสุภาพด้วยข้อความที่ชัดเจน
- ห้ามเปิดเผย tokens หรือ secrets

## Expected Outcome

- Issue title, body, และ metadata ถูกแสดงอย่างชัดเจน
- Labels, assignees, และ milestone ถูกแสดง
- Comments ถูกแสดงเมื่อมีการร้องขอ
- Cross-repo issues ได้รับการรองรับ
