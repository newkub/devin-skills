---
name: open-github-repo-org
description: เปิดหน้า repositories ของ GitHub organization ใน browser
argument-hint: "[org-name]"
related:
  - open-github-repo-personal
  - open-github-issue
  - open-github-pr
  - open-web
  - list-github-repo
  - list-github-star-latest
  - search-in-github-star
---

## Goal

เปิดหน้า repositories ของ GitHub organization ใน browser ด้วย native OS command

## Scope

- เปิด `https://github.com/orgs/<org-name>/repositories`
- ถ้าไม่ระบุ org ให้ list orgs ของ user แล้วถาม
- ไม่แก้ไข org หรือ repos

## Execute

### 1. Get Organization

> Goal: ได้ชื่อ org ทีถูกต้อง

1. รับ `org-name` จาก argument
2. ถ้าไม่มี ให้รัน `gh api user/orgs --jq '.[].login'` เพื่อ list orgs แล้วถาม user เลือก
3. ตัด `@` ออกถ้ามี

### 2. Open Organization Repositories

> Goal: เปิดหน้า repositories ของ org ใน browser

1. สร้าง URL `https://github.com/orgs/<org-name>/repositories`
2. ตรวจสอบ URL ว่าถูกต้อง
3. เปิดด้วย native OS command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
4. หรือทำ `/open-web` เพื่อเปิด

## Rules

### 1. Org Name

- ต้องระบุ org name
- ถ้าไม่ระบุให้ list orgs ของ user แล้วถาม
- ตัด `@` ออก

### 2. URL

- ใช้ `https://github.com/orgs/<org-name>/repositories` เท่านั้น
- ไม่ใช้ URL ทีไม่ชัดเจน

### 3. Open Method

- ใช้ native OS command `start` / `open` / `xdg-open`
- ใช้ `/open-web` เป็น fallback
- ถ้าต้องการ integrated browser ให้ใช้ `browser_preview` tool

### 4. Output

- แจ้ง URL ทีเปิด

## Expected Outcome

- หน้า repositories ของ GitHub organization เปิดใน browser
- URL ถูกต้อง
