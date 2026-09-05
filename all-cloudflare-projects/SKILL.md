---
name: all-cloudflare-projects
description: รายการ Cloudflare projects ทั้งหมดใน account (Workers, Pages, D1, KV, R2)
argument-hint: "[account-id]"
allowed-tools:
  - read
  - exec
  - report-table
  - suggest-next-action
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-cloudflare-projects
  - open-all-cloudflare-projects
  - resolve-all-cloudflare-fails
  - list-cloudflare-worker-fails
  - follow-service-cloudflare
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

รายการ Cloudflare projects ทั้งหมดใน account รวม Workers, Pages, D1, KV และ R2 พร้อมสถานะและลิงก์ dashboard

## Scope

ใช้ `wrangler` หรือ Cloudflare API เพื่อ list projects ทั้งหมดใน account ของผู้ใช้ โดยไม่แก้ไข resource ใด

ดูเพิ่มเติม: /list-cloudflare-projects, /open-all-cloudflare-projects, /resolve-all-cloudflare-fails, /follow-service-cloudflare

## Execute

### 1. Verify Authentication

> Goal: ยืนยันว่าสามารถเรียก Cloudflare API ได้

1. รัน `wrangler --version`
2. รัน `wrangler whoami`
3. ถ้า `wrangler` ไม่ได้ login ให้ทำ `/ask-me` เพื่อให้ user รัน `wrangler login`
4. ใช้ `CLOUDFLARE_API_TOKEN` จาก env var ถ้ามี มิฉะนั้นใช้ credentials จาก `wrangler`

### 2. Get Account ID

> Goal: ได้ account ID ทีถูกต้อง

1. ถ้ามี argument `account-id` ให้ใช้ค่านั้น
2. ถ้าไม่มี ให้หาจาก `CLOUDFLARE_ACCOUNT_ID` env var
3. ถ้ายังไม่มี ให้หาจาก output ของ `wrangler whoami` หรือ `wrangler.toml`
4. ถ้าหาไม่พบ ให้ทำ `/ask-me` เพื่อให้ user ระบุ
5. ไม่ expose account ID ใน output ทั้งตัว

### 3. List Workers Scripts

> Goal: ดึงรายการ Workers ทั้งหมด

1. เรียก `GET https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts`
2. ส่ง header `Authorization: Bearer <token>` และ `Content-Type: application/json`
3. บันทึก `result[].id`, `created_on`, `modified_on` เป้นประเภท `worker`
4. ถ้า API คืน 403 หรือ 404 ให้ข้าม workers และบันทึกเหตุผล

### 4. List Pages Projects

> Goal: ดึงรายการ Pages ทั้งหมด

1. เรียก `GET https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects`
2. ส่ง header `Authorization: Bearer <token>`
3. บันทึก `result[].name`, `created_on`, `modified_on`, `subdomain` เป้นประเภท `pages`
4. ถ้า API คืน 403 หรือ 404 ให้ข้าม pages และบันทึกเหตุผล

### 5. List D1, KV And R2

> Goal: ดึงรายการ D1, KV, R2 ถ้ามีสิทธิ์

1. เรียก API ตามลำดับ:
   - D1: `GET /client/v4/accounts/{account_id}/d1/database`
   - KV: `GET /client/v4/accounts/{account_id}/storage/kv/namespaces`
   - R2: `GET /client/v4/accounts/{account_id}/r2/buckets`
2. บันทึกชื่อ project แต่ละประเภท พร้อม `created_on` หรือ timestamp ที API คืน
3. ถ้า endpoint ใดคืน 403 ให้ข้ามประเภทนั้นและบันทึกว่า permission ไม่เพียงพอ

### 6. Build Report

> Goal: นำเสนอผลลัพธ์ให้อ่านง่าย

1. รวมรายการทั้งหมดจากทุกประเภท
2. สร้าง URL dashboard สำหรับแต่ละ project:
   - Worker: `https://dash.cloudflare.com/{account_id}/workers-and-pages/services/view/{id}/production`
   - Pages: `https://dash.cloudflare.com/{account_id}/pages/view/{name}`
   - D1: `https://dash.cloudflare.com/{account_id}/d1/databases`
   - KV: `https://dash.cloudflare.com/{account_id}/workers/kv/namespaces`
   - R2: `https://dash.cloudflare.com/{account_id}/r2/buckets`
3. ทำ `/report-table` ด้วยคอลัมน์:
   - No.
   - Project
   - Type
   - Created
   - Modified
   - Notes
   - URL
4. เรียงตามชื่อ project ภายในแต่ละ type
5. สรุปจำนวน projects ทั้งหมด และแยกตามประเภท

### 7. Suggest Next Action

> Goal: แนะนำ action ถัดไป

1. ถ้าต้องการเปิด dashboard ทุก project ให้ทำ `/open-all-cloudflare-projects`
2. ถ้าต้องการตรวจสอบ project ที fail ให้ทำ `/resolve-all-cloudflare-fails` หรือ `/list-cloudflare-worker-fails`
3. ถ้าต้องการดู local projects บนเครื่อง ให้ทำ `/list-cloudflare-projects`
4. ทำ `/suggest-next-action` เพื่อแนะนำเพิ่ม

## Rules

### 1. Authentication

- ต้อง login ด้วย `wrangler login` หรือมี `CLOUDFLARE_API_TOKEN` ก่อน
- ถ้าไม่มีสิทธิ์ `Workers Scripts:Read` หรือ `Pages:Read` ให้ report

### 2. Secret Safety

- ไม่ expose `CLOUDFLARE_API_TOKEN`, account ID หรือ credentials ใน output
- ใช้ env vars หรือ `wrangler` credentials เท่านั้น
- mask token ใน logs

### 3. Permission Handling

- ถ้า endpoint ใดคืน 403 ให้ข้ามประเภทนั้นและบันทึกไว้
- ไม่ stop เมื่อ endpoint บางตัวไม่มีสิทธิ์
- ถ้าทุก endpoint คืน 401/403 ให้ stop และแนะนำตรวจสิทธิ์ token

### 4. Rate Limit

- อย่า query เร็วเกินไป ถ้า projects มาก ให้ batch
- ถ้า API คืน 429 ให้รอและ retry ด้วย exponential backoff

### 5. Output

- ใช้ `/report-table` เสมอ
- คอลัมน์ No. ต้องเป้นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
- สรุปจำนวน projects ทั้งหมดและแยกตามประเภท

## Expected Outcome

- รายการ Cloudflare projects ทั้งหมดใน account ทีสามารถดึงได้
- Table ครบถ้วน: project, type, created, modified, notes, url
- ไม่มีการเปลี่ยนแปลง resource ใด
- พร้อม next action สำหรับ project ทีเลือก
