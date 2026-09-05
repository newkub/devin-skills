---
name: open-github-repo-personal
description: เปิดหน้า repositories ของ GitHub profile ส่วนตัวใน browser
argument-hint: "[username]"
related:
  - open-github-repo
  - open-github-repo-org
  - all-github-repo
  - open-github-issue
  - open-github-pr
  - open-web
  - list-github-repo
  - list-github-star-latest
  - search-in-github-star
  - view-repo
---

## Goal

เปิดหน้า repositories ของ GitHub profile ส่วนตัวใน browser ด้วย native OS command

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `open-github-repo`, `open-github-repo-org`, `all-github-repo`, `open-github-issue`, `open-github-pr`, `list-github-repo`, `list-github-star-latest`, `search-in-github-star`

- เปิด `https://github.com/<username>?tab=repositories`
- ถ้าไม่ระบุ username ให้ดึงจาก `gh api user`
- ไม่แก้ไข profile หรือ repos

## Execute

### 1. Get Username

> Goal: ได้ username ทีถูกต้อง

1. ถ้ามี argument ให้ใช้ username จาก argument
2. ถ้าไม่มี ให้รัน `gh api user --jq .login`
3. ถ้า `gh` ไม่ได้ login ให้ถาม user

### 2. Open Repositories

> Goal: เปิดหน้า repositories ใน browser

1. ตัด `@` ออกถ้ามี
2. สร้าง URL `https://github.com/<username>?tab=repositories`
3. ตรวจสอบ URL ว่าถูกต้อง
4. เปิดด้วย native OS command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
5. หรือทำ `/open-web` เพื่อเปิด
6. ถ้าต้องการดู metadata ของ repo ใด repo หนึ่ง ให้ทำ `/view-repo`

## Rules

### 1. Username

- ตัด `@` ออกถ้ามี
- ถ้า username มีช่องว่างให้หยุด
- ถ้าไม่พบ username ให้ถาม user

### 2. URL

- ใช้ `https://github.com/<username>?tab=repositories` เท่านั้น
- ไม่ใช้ URL ทีไม่ชัดเจน

### 3. Open Method

- ใช้ native OS command `start` / `open` / `xdg-open`
- ใช้ `/open-web` เป็น fallback
- ถ้าต้องการ integrated browser ให้ใช้ `browser_preview` tool

### 4. Output

- แจ้ง URL ทีเปิด

## Expected Outcome

- หน้า repositories ของ GitHub profile ส่วนตัวเปิดใน browser
- URL ถูกต้อง
