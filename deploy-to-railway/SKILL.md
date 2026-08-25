---
name: deploy-to-railway
description: Deploy application ไปยัง Railway ด้วย railway up จนกว่าจะ live สำเร็จ
argument-hint: "[target]"
---

## Goal

Deploy application ไปยัง Railway ด้วย `railway up` จนกว่า deployment จะ live สำเร็จ

## Scope

ครอบคลุมการติดตั้ง CLI, ตั้งค่า project, deploy, ตรวจสอบ deployment และ fix errors

## Execute

### 1. Install And Authenticate

> Goal: Install And Authenticate

ติดตั้ง Railway CLI และตั้งค่า authentication

1. ตรวจสอบว่ามี `railway` CLI หรือไม่ ถ้าไม่มีให้ติดตั้งด้วย `bash <(curl -fsSL https://railway.com/install.sh)` หรือ `bun add -g @railway/cli`
2. ถ้ายังไม่ authenticated ให้รัน `railway login` (เปิด browser สำหรับ OAuth) หรือ `railway login --browserless` สำหรับ headless
3. สำหรับ CI/CD ให้ตั้งค่า `RAILWAY_TOKEN` หรือ `RAILWAY_API_TOKEN` แทน interactive login
4. ตรวจสอบด้วย `railway whoami --json` ว่า authenticated แล้ว

### 2. Setup Project

> Goal: Setup Project

ตั้งค่า Railway project และ service

1. รัน `railway status --json` เพื่อตรวจสอบว่ามี linked project หรือไม่
2. ถ้าไม่มี linked project ให้เลือก:
   - `railway up -y` เพื่อสร้าง project + service ใหม่และ deploy ในครั้งเดียว
   - `railway link --project <name>` เพื่อ link กับ existing project
   - `railway init --name <name>` เพื่อสร้าง project ใหม่
3. ถ้าเป็น monorepo ให้ตั้งค่า `rootDirectory` ใน service settings หรือใช้ `railway up <path>`
4. ตรวจสอบด้วย `railway status --json` ว่า link ถูกต้อง

### 3. Configure Environment

> Goal: Configure Environment

ตั้งค่า environment variables และ domains

1. ตั้งค่า environment variables ด้วย `railway variables set KEY=value --service <svc>`
2. สร้าง `.env.example` เพื่อ document variables ที่จำเป็น
3. ตั้งค่า custom domain ด้วย `railway domain add <domain>` (ถ้าต้องการ)
4. ตรวจสอบ variables ด้วย `railway variables list --json`

### 4. Deploy

> Goal: Deploy

Deploy application ไปยัง Railway

1. ทำ `/run-build` เพื่อ build application ก่อน (optional แต้วแลนะแนะนำ)
2. รัน `railway up` เพื่อ deploy แบบ attached mode (stream logs)
3. สำหรับ CI/CD ให้ใช้ `railway up --ci` หรือ `railway up --detach` แล้ว poll ด้วย `railway deployment list --json`
4. สำหรับ agent-driven deploy ให้ใช้ `railway up -y` เพื่อ skip prompts
5. ตรวจสอบ exit code: 0 = SUCCESS, 1 = FAILED

### 5. Watch Deployment

> Goal: Watch Deployment

ตรวจสอบ deployment จนกว่าจะ live

1. ตรวจสอบ deployment status ด้วย `railway deployment list --json`
2. รอจนกว่า status เป็น `SUCCESS` (ห้ามรายงานสำเร็จก่อนถึงขั้นนี้)
3. ถ้า status เป็น `FAILED` หรือ `CRASHED` ให้ทำ `/resolve-errors`
4. ตรวจสอบ logs ด้วย `railway logs --lines 200`
5. ทำ `/watch-browser` ด้วย deployment URL ถ้ามี domain

### 6. Fix Errors

> Goal: Fix Errors

แก้ไข errors ที่พบ

1. ทำ `/resolve-errors` เมื่อพบปัญหา
2. ตรวจสอบ root cause จาก build logs หรือ runtime logs
3. แก้ไข code ตาม root cause
4. รัน `railway redeploy` เพื่อ redeploy โดยไม่ upload code ใหม่ (ถ้าเป็น config issue)
5. หรือรัน `railway up` ใหม่หลังแก้ code

### 7. Loop Until Live

> Goal: Loop Until Live

ทำซ้ำจนกว่า deployment live สำเร็จ

1. ใช้ `/loop-until-complete` สำหรับการทำซ้ำ
2. ทำซ้ำขั้นตอน deploy และ watch
3. หยุดเมื่อ deployment status เป็น `SUCCESS`
4. ยืนยันว่าไม่มี errors เหลือ

## Rules

### 1. CLI Installation

- ติดตั้งด้วย `bash <(curl -fsSL https://railway.com/install.sh)` หรือ `bun add -g @railway/cli`
- ตรวจสอบ version ด้วย `railway --version`
- อัพเดทด้วย `railway upgrade` ถ้า command ไม่รู้จัก

### 2. Authentication

- ใช้ `railway login` สำหรับ interactive (เปิด browser)
- ใช้ `railway login --browserless` สำหรับ headless (device-code flow)
- ใช้ `RAILWAY_TOKEN` สำหรับ CI/CD (project-scoped)
- ใช้ `RAILWAY_API_TOKEN` สำหรับ CI/CD (account-scoped)
- `railway up` สามารถ sign up + deploy ในครั้งเดียวได้

### 3. Deployment Modes

- Attached (default): `railway up` — stream logs จนจบ
- Detached: `railway up --detach` — return ทันทีหลัง queue, poll ด้วย `railway deployment list --json`
- CI: `railway up --ci` — stream build logs only, exit เมื่อ build จบ
- JSON: `railway up --json` — output เป็น JSON (implies CI mode)

### 4. File Handling

- Railway อ่าน `.gitignore` โดย default
- ใช้ `.railwayignore` สำหรับ Railway-specific ignore patterns
- ใช้ `--no-gitignore` เพื่อ include ignored files
- ใช้ `railway up <path>` เพื่อ deploy subdirectory
- ใช้ `--path-as-root` เพื่อใช้ path เป็น archive root

### 5. Verify Before Reporting

- ห้ามรายงาน deploy สำเร็จโดยไม่ตรวจสอบ terminal status
- `railway up --detach` ที่ return แปลว่า build queued ไม่ใช่ success
- ต้อง poll `railway deployment list --json` จนกว่า status เป็น `SUCCESS` หรือ `FAILED`
- exit code 0 = SUCCESS, exit code 1 = FAILED

### 6. Monorepo Support

- ตั้งค่า `rootDirectory` ใน service settings สำหรับ sub-app
- ใช้ `railway up <path>` เพื่อ deploy subdirectory
- แต่ละ sub-app ควรเป็น service แยกใน project เดียวกัน

### 7. CI/CD Integration

- ใช้ `RAILWAY_TOKEN` สำหรับ automated deployments
- ใช้ `railway up --ci` ใน GitHub Actions
- ใช้ `deployment_status` event สำหรับ post-deploy actions
- สร้าง PR environments อัตโนมัติด้วย GitHub Actions

## Expected Outcome

- Railway CLI ติดตั้งและ authenticated สำเร็จ
- Project และ service ตั้งค่าถูกต้อง
- Environment variables ครบถ้วน
- Deploy สำเร็จ status เป็น `SUCCESS`
- Deployment live และใช้งานได้
- ไม่มี build errors หรือ runtime errors
- Custom domain ใช้งานได้ (ถ้าตั้งค่า)