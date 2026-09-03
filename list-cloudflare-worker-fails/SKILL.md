---
name: list-cloudflare-worker-fails
description: สรุป Cloudflare Workers/Pages ที deployment ล้มเหลวทั้งหมดใน account
argument-hint: "[limit]"
related:
  - list-cloudflare-projects
  - list-deployment-fails
  - open-cloudflare-workers
  - open-all-cloudflare-projects
  - resolve-cloudflare-worker-fails
  - resolve-cicd
  - follow-service-cloudflare
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

สรุป Cloudflare Workers/Pages ที deployment ล้มเหลวหรือ latest deployment ไม่อยู่ในสถานะ success ทั้งหมดใน Cloudflare account ที user เข้าถึง

## Scope

ใช้เมื่อต้องการตรวจสอบ workers ที deploy ไม่ผ่านหรือมี deployment status ล้มเหลว ใน Cloudflare account ของผู้ใช้ โดยใช้ `wrangler` หรือ Cloudflare API โดยไม่แก้ไข worker หรือ redeploy

ดูเพิ่มเติม: /list-cloudflare-projects, /list-deployment-fails, /open-cloudflare-workers, /open-all-cloudflare-projects, /follow-service-cloudflare

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
2. หา token จาก `wrangler` credentials ที `wrangler login` เก็บไว้ หรือ `CLOUDFLARE_API_TOKEN` env var
3. ถ้าหาไม่พบ → ทำ `/ask-me` เพื่อให้ user ระบุ

### 3. List All Workers And Pages Functions

> Goal: ดึงรายการ workers ทั้งหมดใน account

1. รัน API:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts"`
2. หรือใช้ Bun/Node script เรียก API เดียวกัน
3. สำหรับ Pages projects ใช้:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects"`
4. บันทึก worker names และ pages project names

### 4. Detect Failing Deployments

> Goal: หา workers ทีมีปัญหา

1. สำหรับแต่ละ worker รัน:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts/<worker_name>/deployments"`
2. สำหรับ Pages projects ใช้:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects/<project_name>/deployments"`
3. บันทึก latest deployment: status, created at, version
4. หา status ทีไม่ใช่ `success` หรือ `active`
5. รวบรวม list ทีต้อง report

### 5. Build Report

> Goal: สรุปผลเป็นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Worker / Project
   - Type
   - Latest Deployment
   - Status
   - Errors / Notes
2. เรียงตาม Worker / Project name
3. ระบุสรุป: จำนวนทั้งหมด, จำนวนที deployment ล้มเหลว

### 6. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ check logs, `resolve-cicd` หรือ `resolve-cloudflare-worker-fails`

## Rules

### 1. Read Only

- ไม่ redeploy, delete worker, หรือแก้ไข config
- ไม่ push code หรือ deploy อัตโนมัติ

### 2. Secret Safety

- ไม่ expose `CLOUDFLARE_API_TOKEN`, account ID หรือ credentials ใน output
- ใช้ env vars หรือ `wrangler` credentials เท่านั้น
- mask token ใน logs

### 3. Auth Required

- ต้อง login ด้วย `wrangler login` หรือมี `CLOUDFLARE_API_TOKEN` ก่อน
- ถ้าไม่มีสิทธิ์ `Workers Scripts:Read` หรือ `Pages:Read` ให้ report

### 4. Rate Limit

- อย่า query เร็วเกินไป ถ้า workers มาก ให้ batch
- ถ้า API คืน 429 ให้รอและ retry

## Expected Outcome

- รายการ Cloudflare Workers/Pages พร้อมสถานะล่าสุด
- Workers ที deployment ล้มเหลวถูกทำเครื่องหมายชัดเจน
- ตารางที sort ตาม worker/project name
- รายงานผลการ deploy ทีล้มเหลวพร้อม notes
- ไม่มีการแก้ไข worker หรือ redeploy ใดๆ
