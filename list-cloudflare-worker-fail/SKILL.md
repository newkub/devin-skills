---
name: list-cloudflare-worker-fail
description: แสดงรายการ Cloudflare Workers ทีมี deployment/health ล้มเหลว
related:
  - list-cloudflare-project
  - watch-cicd-and-resolve
  - report-table
  - suggest-next-action
  - list-deployment-fails
  - ask-me
---

## Goal

แสดงรายการ Cloudflare Workers หรือ Cloudflare Pages functions พร้อมสถานะล่าสุด deployment และข้อผิดพลาดทีอาจเกิดขึ้น

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `list-cloudflare-project`, `list-deployment-fails`

ใช้เมื่อต้องการตรวจสอบ workers ที deploy ไม่ผ่านหรือมี runtime errors ใน Cloudflare account ของผู้ใช้ โดยใช้ `wrangler` หรือ Cloudflare API

## Execute

### 1. Verify wrangler Authentication

> Goal: ยืนยันว่า wrangler พร้อมและ authenticated

1. รัน `wrangler --version` เพื่อตรวจสอบการติดตั้ง
2. รัน `wrangler whoami` เพื่อตรวจสอบ authentication และ account
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `wrangler login`
4. บันทึก account info

### 2. Get Account ID And Token

> Goal: ได้ account ID และ token เพื่อ query API

1. หา account ID จาก:
   - `wrangler whoami` output
   - `CLOUDFLARE_ACCOUNT_ID` env var
   - `~/.wrangler/config/` หรือ `wrangler.toml` ใน project ใด project หน่วง
2. หา token จาก:
   - `wrangler` credentials ที `wrangler login` เก็บไว้
   - `CLOUDFLARE_API_TOKEN` env var
3. ถ้าหาไม่พบ → ทำ `/ask-me` เพื่อให้ user ระบุ

### 3. List Workers

> Goal: ดึงรายการ workers ทั้งหมดใน account

1. รัน API:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts"`
2. หรือใช้ Bun/Node script เรียก API เดียวกัน
3. บันทึก worker names

### 4. Check Latest Deployment Per Worker

> Goal: ตรวจสอบสถานะ deployment ล่าสุดของแต่ละ worker

1. สำหรับแต่ละ worker รัน:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts/<worker_name>/deployments"`
2. บันทึก latest deployment: status, created at, version
3. ถ้า `wrangler deployments list --name <worker_name>` ใช้ได้ ให้ใช้แทน

### 5. Check Recent Errors (Optional)

> Goal: ดู recent runtime errors ถ้าเปิดใช้

1. ถ้า tail ใช้ได้ รัน `wrangler tail <worker_name> --format json` สั้นๆ
2. หรือดู logs จาก Cloudflare dashboard
3. บันทึก errors ล่าสุด (ถ้ามี)

### 6. Build Report

> Goal: รายงานผลเป็นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Worker
   - Type
   - Latest Deployment
   - Status
   - Errors / Notes
2. เรียงตาม Worker name
3. ระบุสรุปจำนวน workers ทีพบ และจำนวนทีมีปัญหา

### 7. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ redeploy, check logs, หรือ `watch-cicd-and-resolve`

## Rules

### 1. Read Only

- ไม่ deploy, delete, หรือแก้ไข worker ใดๆ
- แค่ query status และรายงาน

### 2. Secret Safety

- ไม่ expose `CLOUDFLARE_API_TOKEN`, account ID หรือ credentials ใน output
- ใช้ env vars หรือ `wrangler` credentials เท่านั้น
- mask token ใน logs

### 3. Auth Required

- ต้อง login ด้วย `wrangler login` หรือมี `CLOUDFLARE_API_TOKEN` ก่อน
- ถ้าไม่มีสิทธิ์ `Workers Scripts:Read` ให้ report

### 4. Rate Limit

- อย่า query เร็วเกินไป ถ้ามี workers มาก ให้ batch
- ถ้า API คืน 429 ให้รอและ retry

## Expected Outcome

- รายการ Cloudflare Workers พร้อมสถานะ deployment ล่าสุด
- ระบุ workers ทีอาจมีปัญหาหรือ deployment ล้มเหลว
- ตารางที sort ตาม worker name
- ไม่มีการแก้ไข worker หรือ config ใดๆ
