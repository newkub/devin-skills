---
name: follow-deploy
description: ตั้งค่า deployment configuration และ CI/CD ครบถ้วน
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-tool-github-actions
  - follow-service-cloudflare
  - follow-service-vercel
  - follow-service-vercel-cli
  - deploy-to-railway
---

## Goal

ตั้งค่า deployment configuration และ CI/CD pipeline สำหรับ automated deployment

## Scope

ตั้งค่า deployment สำหรับ Vercel, Cloudflare, Railway และ platforms อื่นๆ พร้อม CI/CD

## Execute

### 1. Select Platform

> Goal: เลือก platform ที่เหมาะสมกับ project type และ requirements

เลือก platform ที่เหมาะสมกับ project

1. ตรวจสอบ project type และ requirements
2. เลือก platform ที่เหมาะสม:
   - Cloudflare Workers/Pages: ทำ `/follow-service-cloudflare`
   - Vercel: ทำ `/follow-service-vercel` และ `/follow-service-vercel-cli`
   - Railway: ทำ `/deploy-to-railway`
3. ตรวจสอบว่า platform configuration พร้อม

### 2. Setup Environment Variables

> Goal: ตั้งค่า environment variables ครบถ้วนสำหรับ deployment

ตั้งค่า environment variables สำหรับ deployment

1. สร้าง `.env.example` สำหรับ environment variables ที่จำเป็น
2. ใช้ `/follow-secret-manager` สำหรับจัดการ secrets ก่อน deploy ไปยัง platform
3. ตั้งค่า environment variables ใน platform:
   - Cloudflare: ใช้ `wrangler secret put`
   - Vercel: ใช้ Vercel dashboard หรือ CLI
   - Railway: ใช้ `railway variables set KEY=value` หรือ Railway dashboard
3. ตรวจสอบว่า environment variables ครบถ้วนและถูกต้อง

### 3. Setup CI/CD

> Goal: ตั้งค่า GitHub Actions สำหรับ automated deployment

ตั้งค่า GitHub Actions สำหรับ automated deployment

1. ทำ `/follow-tool-github-actions` เพื่อตั้งค่า GitHub Actions
2. เลือก workflows ตามความต้องการ:
   - Base CI/CD: `ci.yml` (lint, typecheck, test)
   - Deployment: `deploy-staging.yml`, `deploy-production.yml`
   - Security: `codeql.yml`, `dependabot.yml`
3. ตั้งค่า Renovate สำหรับ dependency updates
4. ตั้งค่า Release-it สำหรับ automated releases (ถ้าจำเป็น)

### 4. Setup Platform-Specific Configuration

> Goal: ตั้งค่า configuration ไฟล์ตาม platform ที่เลือก

ตั้งค่า configuration ตาม platform ที่เลือก

- Cloudflare: ตั้งค่า `wrangler.jsonc` สำหรับ Workers/Pages
- Vercel: ตั้งค่า `vercel.json` หรือ `next.config.js`
- Railway: ตั้งค่า `railway.json` หรือ environment variables

### 5. Test Deployment

> Goal: ทดสอบ deployment ใน staging environment ก่อน production

ทดสอบ deployment ใน staging environment

1. Deploy ไปยัง staging environment
2. ตรวจสอบว่า deployment สำเร็จ
3. ทดสอบ application ว่าทำงานได้
4. ตรวจสอบ logs ว่าไม่มี error

## Rules

### 1. Platform Selection

- เลือก platform ตาม project type และ requirements
- Cloudflare: เหมาะกับ edge computing, serverless
- Vercel: เหมาะกับ Next.js, React applications
- Railway: เหมาะกับ full-stack applications ที่ต้องการ database

### 2. Environment Variables

- ต้องตั้งค่า environment variables ครบถ้วน
- ใช้ `/follow-secret-manager` สำหรับจัดการ secrets ทั้งหมดก่อน deploy
- ใช้ `.env.example` เพื่อ document variables ที่จำเป็น
- ห้าม hardcode secrets ใน code
- ใช้ secrets management ของ platform

### 3. CI/CD

- ต้องมี base CI/CD workflow (lint, typecheck, test)
- Deployment workflows ต้องแยก staging และ production
- ต้องมี security workflows สำหรับ production
- ต้องมี dependency updates (Renovate)

### 4. Platform Configuration

- Configuration ต้องถูกต้องตาม platform
- ต้องมี proper error handling
- ต้องมี proper logging
- ต้องมี proper monitoring

### 5. Testing

- ต้องทดสอบ deployment ใน staging ก่อน production
- ต้องตรวจสอบว่า application ทำงานได้
- ต้องตรวจสอบ logs ว่าไม่มี error

## Expected Outcome

- Platform configuration ตั้งค่าครบถ้วน
- Environment variables ตั้งค่าครบถ้วน
- CI/CD pipeline ทำงานอัตโนมัติ
- Deployment ทำงานได้ใน staging environment