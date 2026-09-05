---
name: resolve-cloudflare-worker-fails
argument-hint: "[--worker <worker-name>] [--project <pages-project>]"
description: ตรวจสอบและแก้ไข Cloudflare Worker หรือ Pages project ทีระบุ
related:
  - resolve-all-cloudflare-fails
  - all-cloudflare-projects
  - search-project-in-drive-d
  - resolve-errors
  - list-cloudflare-worker-fails
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

ตรวจสอบและแก้ไข Cloudflare Worker หรือ Pages project ทีระบุ โดยหา local project ใน `D:\` แล้ว deploy ใหม่

## Scope

ใช้กับ worker หรือ pages project เดียว ถ้าไม่ระบุจะหาจาก current project หรือ repo name

ดูเพิ่มเติม: /all-cloudflare-projects, /resolve-all-cloudflare-fails, /list-cloudflare-worker-fails

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
1. ใช้ `/report-table` คอลัมน์: No., Worker/Project, Type, Latest Deployment, Status, Action Taken, Errors / Notes
2. ระบุ: resolve ได้หรือ manual-fix-required

### 6. Suggest Next Action

> Goal: แนะนำต่อ
1. ทำ `/suggest-next-action` เพื่อแนะนำ redeploy, check logs หรือ `resolve-all-cloudflare-fails`

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

## Expected Outcome

- Worker/Pages project ทีระบุถูก resolve หรือทำเครื่องหมาย manual-fix-required
- ตารางสรุป status, action, errors
- ไม่มี auto-deploy โดยไม่ได้รับอนุญาต
