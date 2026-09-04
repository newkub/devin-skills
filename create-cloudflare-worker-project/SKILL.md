---
name: create-cloudflare-worker-project
argument-hint: "[--name <project-name>] [--repo <owner/repo>] [--access]"
description: สร้าง Cloudflare Workers project ใหม่ เชื่อม Git repository และ deploy โดยไม่ต้องกรอกฟอร์ม dashboard
related:
  - deploy-to-cloudflare
  - follow-service-cloudflare
  - run-deploy
  - follow-my-tech-stack
  - follow-secret-manager
  - open-web-for-config-secret
  - resolve-cicd
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

สร้าง Cloudflare Workers project ใหม่ พร้อมเชื่อม Git repository อัตโนมัติ โดย user ไม่ต้องกรอกฟอร์มบน Cloudflare dashboard

## Scope

- ใช้ `wrangler` CLI หรือ Cloudflare API v4 สร้าง Workers project
- เชื่อม Git repository ผ่าน Cloudflare Workers Builds API
- รองรับ frontend framework เช่น Vite, Solid, React, Svelte
- ถาม user ก่อนเสมอว่าต้องการเปิดใช้งาน Cloudflare Access หรือไม่
- เก็บ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ใน secret manager หรือ `.env` (gitignored)

## Execute

### 1. Verify Tech Stack And Prerequisites

> Goal: ตรวจสอบว่า project เป้น Workers ประเภทไหน และพร้อมสร้าง
1. ทำ `/follow-my-tech-stack` เพื่อสรุป stack
2. ตรวจไฟล์ `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`
3. ตรวจ `package.json` scripts และ build output
4. ถ้าไม่มียังหน่อยงาน → สร้าง `wrangler.toml` ด้วย `name`, `main`, `compatibility_date`, และ `[assets]` หรือ `[site]`
5. ตรวจ `wrangler --version` หรือ `bunx wrangler --version`
6. ถ้า Wrangler ยังไม่ auth → รัน `bunx wrangler login` หรือใช้ `/follow-secret-manager`/`/open-web-for-config-secret` แล้ว `wrangler config`
7. ตรวจ `CLOUDFLARE_ACCOUNT_ID` จาก `wrangler whoami` หรือให้ user ใส่
8. ตรวจ Git remote ด้วย `git remote -v`

### 2. Ask For Cloudflare Access

> Goal: ถาม user ก่อนเปิดใช้ Cloudflare Access
1. ใช้ `/ask-me` ถาม user:
   - ไม่ใช้ Cloudflare Access (default)
   - ใช้ Cloudflare Access จำกัดการเข้าถึง Worker
2. ถ้าเลือกใช้ Access → บันทึกค่า `enable_access = true` และ domain/owner สำหรับ policy

### 3. Create Workers Project

> Goal: สร้าง Worker บน Cloudflare
วิธี A — ใช้ `wrangler deploy` (แนะนำ):
1. รัน `bunx wrangler deploy`
2. Wrangler จะสร้าง project ใหม่อัตโนมัติถ้ายังไม่มี

วิธี B — ใช้ Cloudflare API ถ้าต้องการสร้างล่วงหน้า:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/services" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"<project-name>","script":null,"class":"worker"}'
```

### 4. Connect Git Repository

> Goal: ผูก GitHub repo กับ Workers Builds
1. ระบุ owner/repo จาก `git remote -v` หรือ argument `--repo`
2. เรียก Cloudflare API v4:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/projects" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "<project-name>",
    "production_branch": "main",
    "source": {
      "type": "github",
      "config": {
        "owner": "<github-owner>",
        "repo_name": "<repo-name>",
        "production_branch": "main",
        "pr_comments_enabled": true,
        "deployments_enabled": true
      }
    },
    "build_config": {
      "build_command": "cd <subdirectory> && bun install && bun run build",
      "destination_dir": "<dist-or-build-output>",
      "root_dir": "<subdirectory-or-root>",
      "cwd": "<subdirectory-or-root>"
    }
  }'
```

### 5. Configure wrangler.toml

> Goal: ตั้งค่า Workers ให้พร้อม deploy
1. สร้างหรือตรวจ `wrangler.toml`:
   ```toml
   name = "<project-name>"
   main = "src/worker.js"
   compatibility_date = "2026-08-30"

   [assets]
   directory = "./dist"
   ```
2. ถ้ามี frontend ให้ใช้ `[assets]` แบบใหม่ ไม่ใช่ `[site]` หรือ Workers Sites
3. ถ้าไม่ต้องการ logic พิเศษ สามารถลบ `worker.js` ได้ถ้าใช้ `[assets]` อย่างเดียว

### 6. Configure Build Settings

> Goal: ตั้งค่า build ให้ถูกต้อง
1. ตั้งค่าผ่าน API หรือ dashboard:

   | ฟิลด์ | ค่าที่ใช้ |
   |--------|------------|
   | Project name | `<project-name>` |
   | Production branch | `main` |
   | Build command | `bun install && bun run build` |
   | Build output | `dist` หรือ `build` |
   | Root directory | `.` หรือ `<subdirectory>` |
   | Framework | Vite / Other |

2. หรือเปิด dashboard: `https://dash.cloudflare.com/?to=/:account/workers-and-pages/create`

### 7. Enable Cloudflare Access (Optional)

> Goal: เปิดใช้งาน Cloudflare Access ถ้า user เลือก
1. เปิด Cloudflare Zero Trust dashboard: `https://one.dash.cloudflare.com/`
2. ไปที่ Access → Applications → Add an application
3. เลือก type Self-hosted
4. ใส่ Application name และ Domain = `<project-name>.<account>.workers.dev`
5. สร้าง policy เช่น Allow users with email domain `@example.com`

หรือใช้ API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/access/apps" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "<project-name>",
    "domain": "<project-name>.<account>.workers.dev",
    "type": "self_hosted",
    "session_duration": "24h",
    "policies": [
      {
        "name": "allow-emails",
        "decision": "allow",
        "include": [{"email_domain": {"domain": "<user-domain>"}}]
      }
    ]
  }'
```

### 8. Deploy And Verify

> Goal: deploy ครั้งแรกให้สำเร็จ
1. ถ้าใช้ Workers Builds → push ไป `main` หรือรอ Cloudflare sync
2. ถ้าใช้ Wrangler → รัน `bunx wrangler deploy`
3. บันทึก deployment URL
4. เปิด URL ที deploy แล้ว
5. รัน `bunx wrangler tail` ดู logs
6. รายงาน: Worker name, deployment URL, Git repo ที connect, Cloudflare Access เปิด/ปิด, ขั้นตอนถัดไป

### 9. Report

> Goal: สรุปผล
1. ใช้ `/report-table` คอลัมน์: No., Field, Value
2. แสดง: project name, account ID (masked), worker URL, git repo, Access status, next action
3. ทำ `/suggest-next-action`

## Rules

### 1. Access Consent
- ถาม user ก่อนเสมอว่าเปิด Cloudflare Access หรือไม่
- ไม่เปิด Access โดย default

### 2. Secret Safety
- ไม่รับ token ในแชท ให้ user ใส่ผ่าน `wrangler login` หรือ secret manager
- ไม่ commit `.env` หรือ token ลง repo
- mask `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ใน logs

### 3. Platform
- ใช้ Cloudflare Workers เป้นหลัก ไม่ใช้ Pages สำหรับ Workers ประเภทนี้
- หาก API ไม่สำเร็จ ให้เปิด dashboard พร้อม guide ขั้นตอน

### 4. Package Manager
- รองรับ Bun, npm, pnpm ตาม context ของ project
- ใช้ `bunx wrangler` เป้นค่าเริ่มต้นถ้าตรวจพบ `bun.lockb` หรือ `bun`

## Expected Outcome

- Workers project ถูกสร้างบน Cloudflare
- Git repo เชื่อมต่อกับ Workers Builds หรือพร้อม deploy ด้วย Wrangler
- URL ของ Worker ใช้งานได้
- สถานะ Cloudflare Access ถูกตั้งค่าตามที user เลือก
- ไม่มี secrets หลุดใน source code หรือ output
