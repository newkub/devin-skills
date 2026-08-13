---
name: follow-deploy-to-cloudflare
description: Deploy Nitro application ไปยัง Cloudflare Workers ด้วย wrangler จนกว่าจะ live สำเร็จ
related:
  - follow-nitro
  - follow-wrangler-cli
  - follow-cloudflare-worker
  - run-build
  - watch-browser
  - resolve-errors
  - loop-until-complete
---

## Goal

Deploy Nitro application ไปยัง Cloudflare Workers ด้วย wrangler จนกว่าจะ live สำเร็จ

## Scope

ใช้กับ Nitro project ที่ต้องการ deploy ด้วย `wrangler` บน Cloudflare Workers ครอบคลุม build, deploy, watch, และ fix errors จนใช้งานได้

## Execute

### 1. Setup Nitro Config

ตั้งค่า Nitro configuration สำหรับ Cloudflare Workers

1. สร้างหรืออัปเดต `nitro.config.ts`
2. ตั้งค่า `preset: "cloudflare_module"`
3. ตั้งค่า `cloudflare.deployConfig: true` สำหรับ auto-generate wrangler config
4. ตั้งค่า `cloudflare.nodeCompat: true` ถ้าใช้ Node.js APIs
5. ตั้งค่า `compatibilityDate: "2024-09-19"` ใน `nitro.config.ts`

### 2. Build Application

Build application สำหรับ deployment

1. Run `bun run build` หรือ `bunx nitro build`
2. ตรวจสอบว่า build สำเร็จ
3. ตรวจสอบว่า `.output/server` ถูกสร้าง
4. ตรวจสอบว่า `wrangler.json` ถูก generate ใน `.output/server` (ถ้าใช้ deployConfig)

### 3. Deploy To Cloudflare Workers

Deploy ไปยัง Cloudflare Workers ด้วย wrangler

1. Login ด้วย `bunx wrangler login`
2. Deploy ด้วย `bunx wrangler deploy` หรือ `bunx wrangler deploy --config .output/server/wrangler.json` ถ้า wrangler ไม่ auto-detect config
3. ตรวจสอบว่า deployment เริ่มขึ้นแล้ว
4. รับ deployment URL จาก output

### 4. Watch Deployment

Watch deployment ด้วย browser preview

1. ทำ `/watch-browser` ด้วย deployment URL
2. ตรวจสอบว่า page load สำเร็จ
3. ตรวจสอบ console errors
4. ตรวจสอบ network errors

### 5. Fix Errors

แก้ไข errors ที่พบ

1. ทำ `/resolve-errors` เมื่อพบปัญหา
2. ตรวจสอบ root cause ของ errors
3. แก้ไข code ตาม root cause
4. Deploy ใหม่และตรวจสอบอีกครั้ง

### 6. Loop Until Live

ทำซ้ำจนกว่า deployment live สำเร็จ

1. ใช้ `/loop-until-complete` สำหรับการทำซ้ำ
2. ทำซ้ำขั้นตอน deploy และ watch
3. หยุดเมื่อ deployment live สำเร็จ
4. ยืนยันว่าไม่มี errors เหลือ

## Rules

### 1. Preset Selection

- ใช้ `cloudflare_module` สำหรับ Cloudflare Workers
- ตั้งค่า `compatibilityDate` เป็น `"2024-09-19"` เสมอ
- ใช้ `cloudflare.deployConfig: true` สำหรับ auto-generate wrangler config
- เปิดใช้งาน `cloudflare.nodeCompat: true` ถ้าใช้ Node.js APIs

### 2. Build Process

- ใช้ `bun run build` หรือ `bunx nitro build` ก่อน deploy เสมอ
- ตรวจสอบ build output ใน `.output/server`
- ตรวจสอบว่า build สำเร็จ

### 3. Wrangler Deployment

- Login ด้วย `bunx wrangler login` ก่อน deploy
- ใช้ `bunx wrangler deploy` สำหรับ Cloudflare Workers หรือระบุ `--config .output/server/wrangler.json` ถ้า wrangler ไม่ auto-detect config
- ตรวจสอบ deployment output
- รับ deployment URL จาก output

### 4. Browser Watch

- ใช้ `/watch-browser` สำหรับ monitoring
- ตรวจสอบ console และ network errors
- ตรวจสอบว่า content แสดงผลถูกต้อง

### 5. Error Handling

- ใช้ `/resolve-errors` เมื่อพบปัญหา
- ตรวจสอบ root cause ก่อนแก้ไข
- Deploy ใหม่และตรวจสอบอีกครั้ง

### 6. Loop Until Success

- ใช้ `/loop-until-complete` สำหรับการทำซ้ำ
- ทำซ้ำจนกว่า deployment live สำเร็จ
- หยุดเมื่อไม่มี errors เหลือ

## Expected Outcome

- Nitro application build สำเร็จ
- Deploy ไปยัง Cloudflare Workers สำเร็จด้วย wrangler
- Deployment live และใช้งานได้
- ไม่มี console errors
- ไม่มี network errors
