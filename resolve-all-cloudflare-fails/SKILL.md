---
name: resolve-all-cloudflare-fails
argument-hint: "[--worker <worker-name>] [--project <pages-project>]"
description: ตรวจสอบและแก้ไข Cloudflare Workers/Pages ที deployment ล้มเหลวทั้งหมดใน account
related:
  - resolve-all-github-actions-fails
  - search-project-in-drive-d
  - resolve-errors
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

List ทุก Cloudflare Workers/Pages functions ทีมีปัญหา แล้ว resolve ให้หมดใน account เดียว

## Scope

ใช้เมื่อต้องการตรวจสอบและแก้ไข workers ที deploy ไม่ผ่านหรือมี runtime errors ใน Cloudflare account ของผู้ใช้ โดยใช้ `wrangler` หรือ Cloudflare API

## Execute

### 1. Verify wrangler Authentication

> Goal: ยืนยันว่า wrangler พร้อมและ authenticated
1. รัน `wrangler --version`
2. รัน `wrangler whoami`
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `wrangler login`
4. บันทึก account ID โดยไม่ expose ใน output

### 2. Get Account ID And Token

> Goal: ได้ account ID และ token เพื่อ query API
1. หา account ID จาก `wrangler whoami`, `CLOUDFLARE_ACCOUNT_ID` env var หรือ `wrangler.toml`
2. ใช้ token จาก `wrangler` credentials หรือ `CLOUDFLARE_API_TOKEN` env var
3. ถ้าหาไม่พบ → ทำ `/ask-me` เพื่อให้ user ระบุ

### 3. List Failing Deployments

> Goal: หา workers/pages ทีมีปัญหา
1. เรียก API `GET /client/v4/accounts/{account_id}/workers/scripts` และ `GET /client/v4/accounts/{account_id}/pages/projects`
2. หรือใช้ `wrangler` commands `deployments list --name <worker>` ถ้ามี worker name
3. รับรายการ: worker/project, type, latest deployment, status, errors/notes
4. ถ้าไม่มี failures → report ว่างานเสร็จแล้ว stop

### 4. Resolve Each Failure

> Goal: แก้ไข workers/pages ทีล้มเหลวทีละตัว
1. สำหรับแต่ละ worker ทีมีปัญหา:
   - รัน `wrangler tail <worker_name> --format json` สั้นๆ เพื่อหา runtime errors
   - รัน `wrangler deployments list --name <worker_name>` เพื่อดู history
   - ถ้าพบปัญหา clear → ทำ `/resolve-errors` แล้ว retry deploy
2. หา local repo ด้วย `/search-project-in-drive-d <worker_name>`
3. ถ้า project มี local repo:
   - `git status` / `git pull`
   - `wrangler deploy` หรือ `wrangler pages deploy`
   - รอผลแล้ว recheck deployment
4. ถ้าไม่มี local repo หรือไม่สามารถ deploy ได้ → บันทึกเป็น `manual-fix-required`
5. ทำซ้ำสูงสุด 3 รอบต่อ worker
6. ถ้า deploy ใหม่ fail → ขยับไปทำตัวถัดไป และ report ไว้

### 5. Build Report

> Goal: รายงานผลเป็นตาราง
1. ใช้ `/report-table` คอลัมน์: No., Worker, Type, Latest Deployment, Status, Action Taken, Errors / Notes
2. เรียงตาม Worker name
3. ระบุสรุป: จำนวนทั้งหมด, ที resolve ได้, ทีค้าง manual-fix-required

### 6. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป
1. ทำ `/suggest-next-action` เพื่อแนะนำ redeploy เพิม, check logs, หรือ `resolve-all-github-actions-fails`

## Rules

### 1. Safety
- ถาม user ก่อน deploy/redeploy แต่ละ worker ถ้ามีผลกระทบสูง
- ไม่ delete worker หรือ config โดยไม่ได้รับอนุญาต
- rollback ได้ถ้า deploy ใหม่ fail

### 2. Secret Safety
- ไม่ expose `CLOUDFLARE_API_TOKEN`, account ID หรือ credentials ใน output
- ใช้ env vars หรือ `wrangler` credentials เท่านั้น
- mask token ใน logs

### 3. Auth Required
- ต้อง login ด้วย `wrangler login` หรือมี `CLOUDFLARE_API_TOKEN` ก่อน
- ถ้าไม่มีสิทธิ์ `Workers Scripts:Read/Edit` ให้ report

### 4. Rate Limit
- อย่า query เร็วเกินไป ถ้า workers มาก ให้ batch
- ถ้า API คืน 429 ให้รอและ retry

### 5. Local Project Matching
- ใช้ `/search-project-in-drive-d` หา project ใน `D:\` ทีตรงกับ worker name
- ถ้าไม่พบ → ทำเครื่องหมาย `manual-fix-required`

## Expected Outcome

- รายการ Cloudflare Workers/Pages พร้อมสถานะล่าสุด
- Workers ทีล้มเหลวถูก resolve หรือทำเครื่องหมาย `manual-fix-required`
- ตารางที sort ตาม worker name
- รายงานผลการ deploy และข้อผิดพลาดทียังเหลือ
