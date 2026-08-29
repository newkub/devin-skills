---
name: watch-vercel
description: Watch Vercel deployment status และ fix จนกว่าจะ live สำเร็จ
related:
  - follow-service-vercel
  - deploy-to-vercel
  - fix
  - watch-browser-and-fix
  - resolve-errors
---

## Goal

Watch Vercel deployment status ด้วย CLI และ URL poll แล้ว fix จน deployment live สำเร็จ

## Scope

ใช้หลัง deploy ไป Vercel แล้วต้องการตรวจสอบสถานะ หา runtime errors และ fix จน URL ใช้งานได้

## Execute

### 1. Identify Project And URL

> Goal: ระบุ Vercel project และ URL

1. รับ project name, deployment URL จาก user หรือ `vercel.json`
2. ถ้าไม่มี → รัน `bunx vercel project ls` และ `bunx vercel deployments ls`
3. ยืนยัน auth ด้วย `bunx vercel whoami`

### 2. Watch Deployment Status

> Goal: ตรวจสอบ status และ logs

1. รัน `bunx vercel inspect <url>` หรือ `bunx vercel deployments ls`
2. บันทึก status, state, created at, inspector URL
3. Poll deployment URL ด้วย `/watch-browser-and-fix` หรือ `curl`
4. ตรวจ logs ด้วย `bunx vercel logs <url>` ถ้ามี error

### 3. Triage Failure

> Goal: จัดประเภท failure

1. URL ตอบ 200 และ logs ไม่มี error → สำเร็จ
2. URL ตอบ 5xx หรือ build error → แก้ source
3. URL ตอบ 404 → รอ propagation
4. auth ผิด → ถาม user

### 4. Locate Project Source

> Goal: หา local path ของ Vercel project

1. ใช้ `vercel.json` หรือ `.vercel/project.json` หา project ID
2. ถ้าไม่รู้ path → ทำ `/list-project-git-in-computer` และ match ชื่อ
3. ยืนยัน path ก่อนแก้

### 5. Fix Until Live

> Goal: แก้จน deploy ผ่าน

1. ทำ `/resolve-errors` หรือ `/fix` กับ errors
2. แก้ source น้อยที่สุด
3. รัน `/run-check` ก่อน redeploy
4. ทำ `/deploy-to-vercel` เพื่อ deploy ใหม่
5. วนซ้ำไปขั้นตอน 2 จนสำเร็จ

### 6. Report

> Goal: สรุปผล

1. รายงาน project, URL, final status
2. ถ้ายังไม่ผ่าน → สรุป error ค้าง

## Rules

- ไม่ deploy หรือ build เองโดยตรง — ใช้ `/deploy-to-vercel`
- ใช้ `bunx vercel` หรือ `vercel` CLI
- URL poll ทุก 10 วินาที สูงสุด 300 วินาที
- สร้าง checkpoint ด้วย `git stash` ก่อนแก้

## Expected Outcome

- Vercel deployment ถูก watch จนผ่านหรือ timeout
- Runtime errors ถูก triage และ fix
- URL ใช้งานได้หรือรายงานสาเหตุ
