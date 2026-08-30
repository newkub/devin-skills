---
name: open-all-cloudflare-projects
description: เปิดหน้า dashboard ของ Cloudflare projects ทั้งหมดทีพบในเครื่องบน web
argument-hint: "[account-id]"
related:
  - open-web
  - list-cloudflare-projects
  - list-cloudflare-worker-fail
  - open-cloudflare-workers
  - ask-me
---

## Goal

เปิดหน้า dashboard ของ Cloudflare projects ทั้งหมดทีพบในเครื่อง บน web browser

## Scope

- สำหรับ skills ที่เกี่ยวข้อง: `list-cloudflare-projects`, `open-cloudflare-workers`, `open-web`

ใช้หลังจาก `/list-cloudflare-projects` เพื่อเปิดหน้า dashboard ของ Workers/Pages ทีหาได้ ทั้งหมดใน browser

## Execute

### 1. Resolve Account ID

> Goal: ได้ Cloudflare account ID ทีถูกต้อง

1. รับ `account-id` จาก argument
2. ถ้าไม่มี ให้หาจาก `CLOUDFLARE_ACCOUNT_ID` env var
3. ถ้ายังไม่มี ให้รัน `wrangler whoami` หรือหาใน `wrangler.toml`/`.dev.vars`
4. ถ้าหาไม่พบ → ทำ `/ask-me`

### 2. List Cloudflare Projects

> Goal: รวบรวม projects ทั้งหมด

1. เรียก `/list-cloudflare-projects` หรืออ่านจากผลลัพธ์ก่อนหน้า
2. ดึงรายการ `WorkerName`/`ProjectName` จาก table
3. ถ้าไม่มี projects → report ว่าไม่พบ

### 3. Build URLs

> Goal: สร้าง URL dashboard สำหรับแต่ละ project

1. ถ้าเป็น Worker → `https://dash.cloudflare.com/<account-id>/workers-and-pages/services/view/<worker-name>/production`
2. ถ้าเป็น Pages → `https://dash.cloudflare.com/<account-id>/pages/view/<project-name>`
3. ถ้าไม่แน่ใจประเภท → ใช้ `https://dash.cloudflare.com/<account-id>/workers-and-pages` สำหรับทุก project

### 4. Open In Browser

> Goal: เปิดทุก URL บน web

1. สำหรับแต่ละ URL เรียก `/open-web` หรือ native command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
2. ถ้า project จำนวนมาก → ถาม user ก่อนเปิดทั้งหมด
3. บันทึก URL ทีเปิดไปแล้ว

## Rules

### 1. Account ID

- ไม่ expose account ID หรือ token ใน output
- รองรับ env var `CLOUDFLARE_ACCOUNT_ID`

### 2. URL Safety

- ใช้ `dash.cloudflare.com` เท่านั้น
- ไม่สร้าง URL ทีไม่ชัดเจน
- ถ้าไม่แน่ใจ project คืออะไร ให้หยุดถาม user

### 3. Open Method

- ใช้ `/open-web` เป็นหลัก
- ใช้ native OS command เป็น fallback
- ถ้าเปิดทีละหน้าจะเยอะเกินไป ให้ถาม user ก่อน

### 4. Output

- แสดงรายการ URL ทีเปิด
- รายงาน project ไหนเปิดไม่ได้

## Expected Outcome

- หน้า dashboard ของทุก Cloudflare project เปิดบน web
- รายการ URL ทีเปิดครบถ้วน
- ไม่มี project ไหนถูกเปิดผิด account
