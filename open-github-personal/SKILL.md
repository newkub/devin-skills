---
name: open-github-personal
description: เปิดหน้า GitHub profile ของผู้ใช้ใน browser
allowed-tools:
  - exec
  - write
  - ask_user_question
triggers:
  - user
related:
  - open-web
argument-hint:
  - <username>
---

## Goal

เปิดหน้า GitHub profile ของผู้ใช้ใน browser

## Scope

- เปิด `https://github.com/<username>`
- ถ้าไม่ระบุ username ให้ดึงจาก `gh api user`
- ไม่แก้ไข profile

## Execute

### 1. Get Username
> Goal: ได้ username ที่ถูกต้อง

1. ถ้ามี argument ให้ใช้ username จาก argument
2. ถ้าไม่มี ให้รัน `gh api user --jq .login`
3. ถ้า `gh` ไม่ได้ login ให้ถาม user

### 2. Open Profile
> Goal: เปิดหน้า profile ใน browser

1. ตัด `@` ออกถ้ามี
2. สร้าง URL `https://github.com/<username>`
3. รัน `start <url>` บน Windows หรือ `open <url>` บน macOS/Linux
4. หรือทำ `/open-web` เพื่อเปิด

## Rules

### 1. Username

- ตัด `@` ออกถ้ามี
- ถ้า username มีช่องว่างให้หยุด
- ถ้าไม่พบ username ให้ถาม user

### 2. URL

- ใช้ `https://github.com/<username>` เท่านั้น
- ไม่ใช้ URL ที่ไม่ชัดเจน

### 3. Output

- แจ้ง URL ที่เปิด

## Expected Outcome

- หน้า GitHub profile ของผู้ใช้เปิดใน browser
- URL ถูกต้อง
