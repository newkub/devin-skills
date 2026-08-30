---
name: create-cloudflare-worker
description: สร้าง Cloudflare Workers project พร้อม Git connect และ Cloudflare Access setup
argument-hint: "[project-name]"
related:
  - create-cloudflare-token
  - deploy-to-cloudflare
  - follow-secret-manager
  - open-web-for-config-secret
---

## Goal

สร้าง Cloudflare Workers project ใหม่ พร้อมเชื่อม Git repository อัตโนมัติ โดย user ไม่ต้องกรอกฟอร์มบน Cloudflare dashboard เอง และถามก่อนเสมอว่าต้องการเปิดใช้งาน Cloudflare Access หรือไม่

## Scope

- ใช้ Wrangler CLI หรือ Cloudflare API v4 สร้าง Workers project
- เชื่อม Git repository ผ่าน Cloudflare Workers Builds API หรือ dashboard
- รองรับ frontend framework เช่น Vite, Solid, React, Svelte
- ถาม user ก่อนว่าต้องการ Cloudflare Access หรือไม่
- เก็บ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ใน secret manager หรือ `.env` (gitignored)

## Execute

### 1. Verify Tech Stack

> Goal: ตรวจสอบว่า project เป็น Workers ประเภทไหน

1. ทำ `/follow-my-tech-stack` เพื่อสรุป stack
2. ตรวจไฟล์ `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`
3. ตรวจ `package.json` scripts และ build output
4. ถ้าไม่มี `wrangler.toml` → สร้างใหม่ด้วย `name`, `main`, `compatibility_date`, และ `[assets]` หรือ `[site]`

### 2. Check Prerequisites

> Goal: ยืนยันว่าพร้อมสร้างและ deploy

1. ตรวจ `wrangler --version` หรือ `bunx wrangler --version`
2. ถ้า Wrangler ยังไม่ auth → รัน `bunx wrangler login` หรือใช้ `/create-cloudflare-token` แล้ว `wrangler config`
3. ตรวจ `CLOUDFLARE_ACCOUNT_ID` จาก `wrangler whoami` หรือให้ user ใส่
4. ตรวจ Git remote ของ repo ปัจจุบัน:
   ```bash
   git remote -v
   ```

### 3. Ask For Cloudflare Access

> Goal: ถาม user ก่อนเปิดใช้ Cloudflare Access

ถาม user ด้วยตัวเลือก:

| No. | ตัวเลือก |
|-----|----------|
| 1 | ไม่ใช้ Cloudflare Access (default) |
| 2 | ใช้ Cloudflare Access จำกัดการเข้าถึง Worker |

ถ้าเลือก 2 → ขั้นตอนหลัง deploy ให้เปิด **Cloudflare Access** แล้วเพิ่ม policy ใน Zero Trust

### 4. Create Workers Project

> Goal: สร้าง Worker บน Cloudflare

วิธี A — ใช้ Wrangler (แนะนำ):
```bash
bunx wrangler deploy
```
Wrangler จะสร้าง project ใหม่อัตโนมัติถ้ายังไม่มี

วิธี B — ใช้ Cloudflare API ถ้าต้องการสร้างล่วงหน้า:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/services" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"<project-name>","script":null,"class":"worker"}'
```

### 5. Connect Git Repository

> Goal: ผูก GitHub repo กับ Workers Builds

วิธี A — ใช้ Cloudflare API v4 (แนะนำสำหรับ automation):
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
3. `worker.js` สำหรับ static assets:
   ```javascript
   export default {
     async fetch(request, env) {
       try {
         return await env.ASSETS.fetch(request);
       } catch (e) {
         return new Response(`Not found: ${e.message}`, { status: 404 });
       }
     },
   };
   ```
4. ถ้าไม่ต้องการ logic พิเศษ สามารถลบ `worker.js` ได้ถ้าใช้ `[assets]` อย่างเดียว

### 6. Connect Git Repository

> Goal: ผูก GitHub repo กับ Workers Builds

วิธี A — ใช้ Cloudflare API v4 (แนะนำสำหรับ automation):
```
https://dash.cloudflare.com/?to=/:account/workers-and-pages/create
```

### 6. Configure Build Settings

> Goal: ตั้งค่า build ให้ถูกต้อง

ตั้งค่าผ่าน API หรือ dashboard:

| ฟิลด์ | ค่าที่ใช้ |
|--------|------------|
| Project name | `<project-name>` |
| Production branch | `main` |
| Build command | `bun install && bun run build` |
| Build output | `dist` หรือ `build` |
| Root directory | ปกติ `.` หรือ `<subdirectory>` |
| Framework | Vite / Other |

### 7. Enable Cloudflare Access (Optional)

> Goal: เปิดใช้งาน Cloudflare Access ถ้า user เลือก

1. เปิด Cloudflare Zero Trust dashboard:
   ```
   https://one.dash.cloudflare.com/
   ```
2. ไปที่ Access → Applications → Add an application
3. เลือก type Self-hosted
4. ใส่ Application name และ Domain = `<project-name>.<account>.workers.dev`
5. สร้าง policy เช่น Allow users with email domain `@example.com`
6. บันทึก

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

### 8. Trigger First Deploy

> Goal: deploy ครั้งแรกให้สำเร็จ

1. ถ้าใช้ Workers Builds → push ไป `main` หรือรอ Cloudflare sync
2. ถ้าใช้ Wrangler → รัน:
   ```bash
   bunx wrangler deploy
   ```
3. บันทึก deployment URL

### 9. Verify And Report

> Goal: ยืนยันว่า Worker live และใช้งานได้

1. เปิด URL ที่ deploy แล้ว
2. รัน `bunx wrangler tail` ดู logs
3. รายงาน:
   - Worker name
   - Deployment URL
   - Git repo ที่ connect
   - Cloudflare Access เปิด/ปิด
   - ขั้นตอนที่ต้องทำต่อ (ถ้ามี)

## Rules

- ถาม user ก่อนเสมอว่าเปิด Cloudflare Access หรือไม่
- ไม่รับ token ในแชท ให้ user ใส่ผ่าน `wrangler login` หรือ secret manager
- ใช้ Cloudflare Workers เป็นหลัก ไม่ใช้ Pages สำหรับ Workers ประเภทนี้
- ถ้า API ไม่สำเร็จ ให้เปิด dashboard พร้อม guide ขั้นตอน
- ไม่ commit `.env` หรือ token ลง repo
- รองรับ Bun, npm, pnpm ตาม context ของ project

- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /open-web-for-config-secret ถ้าจำเป็น

## Expected Outcome

- Workers project ถูกสร้างบน Cloudflare
- Git repo เชื่อมต่อกับ Workers Builds หรือพร้อม deploy ด้วย Wrangler
- URL ของ Worker ใช้งานได้
- สถานะ Cloudflare Access ถูกตั้งค่าตามที่ user เลือก
- ไม่มี secrets หลุดใน source code
