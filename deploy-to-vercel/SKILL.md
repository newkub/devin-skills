---
name: deploy-to-vercel
description: Deploy application ไปยัง Vercel จนกว่าจะ live สำเร็จ
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-service-vercel
  - watch-vercel
  - run-build
  - git-commit
  - watch-browser-and-fix
---

## Goal

Deploy application ไปยัง Vercel ด้วย CLI ตั้งแต่ build, deploy, commit/push จนถึง post-deploy validation

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `open-web-for-config-secret`, `follow-service-vercel`

ครอบคลุม Vercel CLI, link project, build, deploy, watch, และ fix ถ้าไม่ผ่าน

## Execute

### 1. Verify And Build

> Goal: ตรวจสอบและ build

1. ทำ `/run-verify-fast`
2. ทำ `/run-build`
3. ตรวจสอบ build artifacts

### 2. Authenticate And Link

> Goal: เชื่อมต่อ Vercel project

1. รัน `bunx vercel login` ถ้ายังไม่ auth
2. รัน `bunx vercel link` ใน project directory
3. ยืนยัน project ID ใน `.vercel/project.json`

### 3. Deploy

> Goal: ส่ง deployment ไป Vercel

1. รัน `bunx vercel --yes` หรือ `bunx vercel deploy --yes`
2. บันทึก preview URL และ deployment ID
3. สำหรับ production → `bunx vercel --prod --yes`

### 4. Watch And Validate

> Goal: ยืนยันว่า deployment live

1. ทำ `/watch-vercel` ด้วย preview URL
2. ทำ `/watch-browser-and-fix` ด้วย URL
3. รอจนสถานะ `READY`

### 5. Commit And Push

> Goal: sync กับ git

1. ทำ `/git-commit`
2. ทำ `/git-push`

### 6. Report

> Goal: สรุปผล

1. รายงาน project, URL, status
2. ระบุ environment (preview/production)

## Rules

- ต้อง build สำเร็จก่อน deploy
- ใช้ `/follow-secret-manager` สำหรับจัดการ `VERCEL_TOKEN` และ secrets ก่อน deploy
- ใช้ `bunx vercel` หรือ `vercel` CLI
- ไม่ commit ก่อนยืนยันว่า deployment live
- หาก fail → ทำ `/resolve-errors` แล้ว redeploy

## Expected Outcome

- Deploy ไป Vercel สำเร็จ
- URL ใช้งานได้
- Git sync เรียบร้อย
