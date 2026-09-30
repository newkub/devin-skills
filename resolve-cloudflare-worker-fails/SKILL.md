---
name: resolve-cloudflare-worker-fails
argument-hint: "[--worker <worker-name>] [--project <pages-project>]"
description: ตรวจสอบและแก้ไข Cloudflare Worker หรือ Pages project ทีระบุ
related:
  - resolve-errors
  - list-cloudflare-projects
  - search
  - report
  - suggest-next-action
  - ask-me

---

## Goal

ตรวจสอบและแก้ไข Cloudflare Worker หรือ Pages project ทีระบุ โดยหา local project ใน `D:\` แล้ว deploy ใหม่

## Scope

ใช้กับ worker หรือ pages project เดียว ถ้าไม่ระบุจะหาจาก current project หรือ repo name

- สำหรับ list fails ดู `references/list-fails.md`

ดูเพิ่มเติม: /list-cloudflare-projects, /resolve-all-cloudflare-worker-fails, `references/list-fails.md`

## Execute

### 1. Verify wrangler Authentication

> Goal: ยืนยันว่า wrangler พร้อมและ authenticated
1. รัน `wrangler --version`
2. รัน `wrangler whoami`
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `wrangler login`

### 2. Identify Worker Or Project

> Goal: ระบุ target
1. ถ้ามี `--worker` → ใช้ worker name นั้น
2. ถ้ามี `--project` → ใช้ Pages project นั้น
3. ถ้าไม่มี → หา worker name จาก `wrangler.toml` หรือ repo name จาก `git remote -v`
4. ถ้าหาไม่พบ → ทำ `/ask-me`

### 3. Check Deployment And Logs

> Goal: หาปัญหาของ target
1. รัน `wrangler deployments list --name <worker>` หรือตรวจสอบ Pages deployments
2. รัน `wrangler tail <worker> --format json` สั้นๆ เพื่อหา runtime errors
3. บันทึก errors และ deployment status

### 4. Resolve

> Goal: แก้ไขแล้ว redeploy
1. ถ้าพบปัญหา clear → ทำ `/resolve-errors`
2. หา local repo ด้วย `/search-project-in-drive-d <worker-or-project-name>`
3. ถ้าไม่พบ local repo → ทำเครื่องหมาย `manual-fix-required`
4. ถ้าพบ local repo:
   - `git status`
   - `git pull`
   - แก้ไข code/config
   - `wrangler deploy` หรือ `wrangler pages deploy`
5. รอผลแล้ว recheck
6. ทำซ้ำสูงสุด 3 รอบ

### 5. Build Report

> Goal: สรุปผล
1. ใช้ `/report` คอลัมน์: No., Worker/Project, Type, Latest Deployment, Status, Action Taken, Errors / Notes
2. ระบุ: resolve ได้หรือ manual-fix-required

### 6. Suggest Next Action

> Goal: แนะนำต่อ
1. ทำ `/suggest-next-action` เพื่อแนะนำ redeploy, check logs หรือ `/resolve-all-cloudflare-worker-fails`

## Rules

### 1. Safety
- ถาม user ก่อน deploy/redeploy ถ้ามีผลกระทบสูง
- ไม่ delete worker หรือ config โดยไม่ได้รับอนุญาต
- rollback ได้ถ้า deploy ใหม่ fail

### 2. Secret Safety
- ไม่ expose `CLOUDFLARE_API_TOKEN`, account ID หรือ credentials
- ใช้ env vars หรือ `wrangler` credentials เท่านั้น

### 3. Local Project Matching
- ใช้ `/search-project-in-drive-d` หา project ใน `D:\`
- ถ้าไม่พบ → manual-fix-required

### 4. Rate Limit
- หลีกเลี่ยง query เร็วเกินไป
- ถ้า API คืน 429 ให้รอและ retry

## Merged Details

### references/list-fails

#### List Cloudflare Worker Fails

##### Goal

สรุป Cloudflare Workers/Pages ที deployment ล้มเหลวหรือ latest deployment ไม่อยู่ในสถานะ success ทั้งหมดใน Cloudflare account ที user เข้าถึง

##### Scope

ใช้เมื่อต้องการตรวจสอบ workers ที deploy ไม่ผ่านหรือมี deployment status ล้มเหลว ใน Cloudflare account ของผู้ใช้ โดยใช้ `wrangler` หรือ Cloudflare API โดยไม่แก้ไข worker หรือ redeploy

ดูเพิ่มเติม: /list-cloudflare-projects, /list-deployment-fails, /open-cloudflare-workers, /follow-service-cloudflare

##### Execute

###### 1. Verify wrangler Authentication

> Goal: ยืนยันว่า wrangler พร้อมและ authenticated

1. รัน `wrangler --version` เพื่อตรวจสอบการติดตั้ง
2. รัน `wrangler whoami` เพื่อตรวจสอบ authentication และ account
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `wrangler login`
4. บันทึก account info

###### 2. Get Account ID And Token

> Goal: ได้ account ID และ token เพื่อ query API

1. หา account ID จาก:
   - `wrangler whoami` output
   - `CLOUDFLARE_ACCOUNT_ID` env var
   - `~/.wrangler/config/` หรือ `wrangler.toml` ใน project ใด project หน่วง
2. หา token จาก `wrangler` credentials ที `wrangler login` เก็บไว้ หรือ `CLOUDFLARE_API_TOKEN` env var
3. ถ้าหาไม่พบ → ทำ `/ask-me` เพื่อให้ user ระบุ

###### 3. List All Workers And Pages Functions

> Goal: ดึงรายการ workers ทั้งหมดใน account

1. รัน API:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts"`
2. หรือใช้ Bun/Node script เรียก API เดียวกัน
3. สำหรับ Pages projects ใช้:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects"`
4. บันทึก worker names และ pages project names

###### 4. Detect Failing Deployments

> Goal: หา workers ทีมีปัญหา

1. สำหรับแต่ละ worker รัน:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts/<worker_name>/deployments"`
2. สำหรับ Pages projects ใช้:
   `curl -s -H "Authorization: Bearer <token>" "https://api.cloudflare.com/client/v4/accounts/<account_id>/pages/projects/<project_name>/deployments"`
3. บันทึก latest deployment: status, created at, version
4. หา status ทีไม่ใช่ `success` หรือ `active`
5. รวบรวม list ทีต้อง report

###### 5. Build Report

> Goal: สรุปผลเป็นตาราง

1. ใช้ `/report` คอลัมน์:
   - No.
   - Worker / Project
   - Type
   - Latest Deployment
   - Status
   - Errors / Notes
2. เรียงตาม Worker / Project name
3. ระบุสรุป: จำนวนทั้งหมด, จำนวนที deployment ล้มเหลว

###### 6. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ check logs, `/resolve-cicd` หรือ `/resolve-cloudflare-worker-fails`

##### Rules

###### 1. Read Only

- ไม่ redeploy, delete worker, หรือแก้ไข config
- ไม่ push code หรือ deploy อัตโนมัติ

###### 2. Secret Safety

- ไม่ expose `CLOUDFLARE_API_TOKEN`, account ID หรือ credentials ใน output
- ใช้ env vars หรือ `wrangler` credentials เท่านั้น
- mask token ใน logs

###### 3. Auth Required

- ต้อง login ด้วย `wrangler login` หรือมี `CLOUDFLARE_API_TOKEN` ก่อน
- ถ้าไม่มีสิทธิ์ `Workers Scripts:Read` หรือ `Pages:Read` ให้ report

###### 4. Rate Limit

- อย่า query เร็วเกินไป ถ้า workers มาก ให้ batch
- ถ้า API คืน 429 ให้รอและ retry

##### Expected Outcome

- รายการ Cloudflare Workers/Pages พร้อมสถานะล่าสุด
- Workers ที deployment ล้มเหลวถูกทำเครื่องหมายชัดเจน
- ตารางที sort ตาม worker/project name
- รายงานผลการ deploy ทีล้มเหลวพร้อม notes
- ไม่มีการแก้ไข worker หรือ redeploy ใดๆ

## Expected Outcome

- Worker/Pages project ทีระบุถูก resolve หรือทำเครื่องหมาย manual-fix-required
- ตารางสรุป status, action, errors
- ไม่มี auto-deploy โดยไม่ได้รับอนุญาต

