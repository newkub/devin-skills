---
name: open-github-issue
description: เปิดหน้า GitHub issue ใน browser
argument-hint: "[owner/repo] [issue-number]"
related:
  - open-github-pr
  - open-web
  - follow-tool-github-issue
---

## Goal

เปิดหน้า GitHub issue ใน browser ด้วย native OS command

## Scope

ใช้เปิด issue ด้วย `owner/repo` + `issue-number` หรือ URL ทีให้มา โดยไม่แก้ไข issue

## Execute

### 1. Parse Input

> Goal: ได้ owner, repo, issue number ทีถูกต้อง

1. รับ argument จาก user
2. ถ้า argument เป็น URL `https://github.com/<owner>/<repo>/issues/<number>` → แยกส่วน
3. ถ้า argument เป็น `<owner>/<repo> <number>` หรือ `<owner>/<repo>#<number>` → แยกส่วน
4. ถ้าไม่พบ → ถาม user ด้วย `/ask-me`
5. ตัด `@` ออกถ้ามี

### 2. Validate

> Goal: ตรวจสอบข้อมูลก่อนเปิด

1. ตรวจสอบว่า `owner` และ `repo` ไม่ว่าง
2. ตรวจสอบว่า `issue-number` เป็นตัวเลข
3. ถ้าข้อมูลไม่ถูกต้อง → หยุดและแจ้ง user

### 3. Open Issue

> Goal: เปิด issue ใน browser

1. สร้าง URL `https://github.com/<owner>/<repo>/issues/<number>`
2. ตรวจสอบ URL ว่าถูกต้อง
3. เปิดด้วย native OS command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
4. หรือทำ `/open-web` เพื่อเปิด

## Rules

### 1. Input Format

- รับรูปแบบ: `<owner>/<repo> <number>`, `<owner>/<repo>#<number>`, หรือ URL ฉบับเต็ม
- ตัด `@` ออกถ้ามี
- ถ้าไม่ระบุ owner/repo ให้ดึงจาก git remote หรือ `gh repo view --json owner,name`

### 2. URL

- ใช้ `https://github.com/<owner>/<repo>/issues/<number>` เท่านั้น
- ไม่สร้าง URL ทีไม่ชัดเจน

### 3. Open Method

- ใช้ native OS command `start` / `open` / `xdg-open`
- ใช้ `/open-web` เป็น fallback
- ถ้าต้องการ integrated browser ให้ใช้ `browser_preview` tool

### 4. Output

- แจ้ง URL ทีเปิด
- ถ้าเปิดไม่ได้ให้ report

## Expected Outcome

- หน้า GitHub issue เปิดใน browser
- URL ถูกต้อง
