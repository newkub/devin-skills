---
name: open-cloudflare-workers
description: เปิดหน้า Cloudflare Workers dashboard ใน browser
argument-hint: "[account-id]"
related:
  - open-web
  - list-cloudflare-project
  - list-cloudflare-worker-fail
  - watch-cloudflare
---

## Goal

เปิดหน้า Cloudflare Workers dashboard ใน browser ด้วย native OS command

## Scope

ใช้เปิด dashboard สำหรับจัดการ Cloudflare Workers และ Pages โดยไม่แก้ไข config ใดๆ

## Execute

### 1. Resolve Account ID

> Goal: ได้ Cloudflare account ID ทีถูกต้อง

1. รับ `account-id` จาก argument
2. ถ้าไม่มี ให้หาจาก `CLOUDFLARE_ACCOUNT_ID` env var
3. ถ้ายังไม่มี ให้รัน `wrangler whoami` หรือ `gh`? ดู account info
4. ถ้าหาไม่พบ → ทำ `/ask-me`

### 2. Build URL

> Goal: สร้าง URL ทีถูกต้อง

1. ถ้ามี account ID → `https://dash.cloudflare.com/<account-id>/workers-and-pages`
2. ถ้าไม่มี → `https://dash.cloudflare.com/?to=/:account/workers-and-pages`
3. ตรวจสอบ URL ก่อนเปิด

### 3. Open Dashboard

> Goal: เปิด dashboard ใน browser

1. เปิดด้วย native OS command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
2. หรือทำ `/open-web` เพื่อเปิด

## Rules

### 1. Account ID

- ไม่ expose account ID หรือ token ใน output
- ถ้าไม่มี account ID ให้เปิดหน้า dashboard ทั่วไป
- รองรับ env var `CLOUDFLARE_ACCOUNT_ID`

### 2. URL

- ใช้ dash.cloudflare.com เท่านั้น
- ไม่สร้าง URL ทีไม่ชัดเจน

### 3. Open Method

- ใช้ native OS command `start` / `open` / `xdg-open`
- ใช้ `/open-web` เป็น fallback
- ถ้าต้องการ integrated browser ให้ใช้ `browser_preview` tool

### 4. Output

- แจ้ง URL ทีเปิด
- ถ้าเปิดไม่ได้ให้ report

## Expected Outcome

- หน้า Cloudflare Workers dashboard เปิดใน browser
- URL ถูกต้อง
