---
name: open-github-org
description: เปิดหน้า GitHub organization ที่ระบุใน browser
argument-hint: "<org-name>"
triggers: ['user']
allowed-tools: ['exec']
related:
  - open-web
---

## Goal

เปิดหน้า GitHub organization ที่ระบุใน browser

## Scope

- เปิด `https://github.com/<org-name>`
- ถ้าไม่ระบุ org ให้ list orgs ของ user แล้วถาม
- ไม่แก้ไข org

## Execute

### 1. Get Organization

> Goal: ได้ชื่อ org ที่ถูกต้อง

1. รับ `org-name` จาก argument
2. ถ้าไม่มี ให้รัน `gh api user/orgs --jq '.[].login'` เพื่อ list orgs แล้วถาม user เลือก
3. ตัด `@` ออกถ้ามี

### 2. Open Organization

> Goal: เปิดหน้า org ใน browser

1. สร้าง URL `https://github.com/<org-name>`
2. รัน `start <url>` บน Windows หรือ `open <url>` บน macOS/Linux
3. หรือทำ `/open-web`

## Rules

### 1. Org Name

- ต้องระบุ org name
- ถ้าไม่ระบุให้ list orgs ของ user แล้วถาม
- ตัด `@` ออก

### 2. URL

- ใช้ `https://github.com/<org-name>` เท่านั้น

### 3. Output

- แจ้ง URL ที่เปิด

## Expected Outcome

- หน้า GitHub organization เปิดใน browser
- URL ถูกต้อง