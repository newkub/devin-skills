---
name: create-cloudflare-project
description: สร้าง Cloudflare Workers project ใหม่ (ไม่ใช่ Pages) พร้อม Git connect
argument-hint: "[project-name]"
related:
  - create-github-repo
  - create-cloudflare-token
  - create-cloudflare-tokens
  - deploy-to-cloudflare
  - follow-secret-manager
---

## Goal

สร้าง Cloudflare Workers project ใหม่ โดย default เป็น Workers ไม่ใช่ Pages พร้อมเชื่อม Git repository อัตโนมัติ (สร้าง GitHub repo ก่อนถ้ายังไม่มี) โดย user ไม่ต้องกรอกฟอร์มบน Cloudflare dashboard เอง และถามก่อนเสมอว่าต้องการเปิดใช้งาน Cloudflare Access หรือไม่

## Scope

- สร้าง GitHub repo ก่อนถ้ายังไม่มี remote
- ใช้ Wrangler CLI หรือ Cloudflare API v4 สร้าง Workers project
- ค่าเริ่มต้นต้องเป็น Workers ไม่ใช่ Pages
- เชื่อม Git repository ผ่าน Cloudflare Workers Builds API หรือ dashboard
- รองรับ frontend framework เช่น Vite, Solid, React, Svelte
- ถาม user ก่อนว่าต้องการ Cloudflare Access หรือไม่
- เก็บ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` ใน secret manager หรือ `.env` (gitignored)

## Execute

### 1. Ensure GitHub Repository Exists

> Goal: สร้าง GitHub repo ก่อนถ้ายังไม่มี

1. ตรวจสอบว่าอยู่ใน project directory ที่ต้องการ deploy
2. รัน `git remote -v`
3. ถ้ามี remote แล้ว → บันทึก `owner/repo-name` แล้วไปขั้นตอนถัดไป
4. ถ้าไม่มี remote → เรียก `/create-github-repo` หรือรัน:
   ```bash
   gh repo create <repo-name> --<visibility>
   ```
5. ถ้า `gh` ยังไม่ login → แจ้งให้ user ทำ `gh auth login` ก่อน
6. ตั้งชื่อ project จาก repo name ตาม pattern `<repo-name>-wrikka-com`

### 2. Verify Tech Stack

> Goal: ตรวจสอบว่า project เป็น Workers ประเภทไหน

1. ทำ `/follow-my-tech-stack` เพื่อสรุป stack
2. ตรวจไฟล์ `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`
3. ตรวจ `package.json` scripts และ build output
4. ถ้าไม่มี `wrangler.toml` → สร้างใหม่ด้วย `name`, `main`, `compatibility_date`, และ `[assets]`

### 3. Check Prerequisites

> Goal: ยืนยันว่าพร้อมสร้างและ deploy

1. ตรวจ `wrangler --version` หรือ `bunx wrangler --version`
2. ถ้า Wrangler ยังไม่ auth → รัน `bunx wrangler login` หรือใช้ `/create-cloudflare-token` แล้ว `wrangler config`
3. ตรวจ `CLOUDFLARE_ACCOUNT_ID` จาก `wrangler whoami` หรือให้ user ใส่
4. ตรวจ Git remote ของ repo ปัจจุบัน

### 4. Ask For Cloudflare Access

> Goal: ถาม user ก่อนเปิดใช้ Cloudflare Access

ถาม user ด้วยตัวเลือก:

| No. | ตัวเลือก |
|-----|----------|
| 1 | ไม่ใช้ Cloudflare Access (default) |
| 2 | ใช้ Cloudflare Access จำกัดการเข้าถึง Worker |

ถ้าเลือก 2 → ขั้นตอนหลัง deploy ให้เปิด Cloudflare Access แล้วเพิ่ม policy ใน Zero Trust

### 5. Create Workers Project

> Goal: สร้าง Worker บน Cloudflare

วิธี A — ใช้ Wrangler (แนะนำ):
```bash
bunx wrangler deploy
```
Wrangler จะสร้าง Workers project ใหม่อัตโนมัติถ้ายังไม่มี

วิธี B — ใช้ Cloudflare API สร้าง `workers/services` ล่วงหน้าถ้าต้องการ

### 6. Connect Git Repository

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

วิธี B — ใช้ dashboard: Workers and Pages → Connect to Git

### 7. Configure wrangler.toml

> Goal: ตั้นค่า Workers ให้พร้อม deploy

1. สร้างหรือตรวจ `wrangler.toml`:
   ```toml
   name = "<project-name>"
   main = "src/worker.js"
   compatibility_date = "<today>"

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

### 8. Create CI/CD Token

> Goal: สร้าง token สำหรับ GitHub Actions

ใช้ `/create-cloudflare-tokens` ด้วยชื่อ project `<project-name>`

### 10. Create GitHub Actions Workflow

> Goal: deploy อัตโนมัติเมื่อ push

สร้าง `.github/workflows/deploy-<repo-name>.yml`:

```yaml
name: Deploy <repo-name>

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: <project-directory>
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install
      - run: bun run typecheck
      - run: bun run build
      - env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: bunx wrangler deploy
```

### 11. Enable Cloudflare Access (Optional)

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

หรือใช้ Cloudflare Access API สร้าง application ตาม pattern ของ domain

### 12. Trigger First Deploy

> Goal: deploy ครั้งแรกให้สำเร็จ

1. ถ้าใช้ Workers Builds → push ไป `main` หรือรอ Cloudflare sync
2. ถ้าใช้ Wrangler → รัน:
   ```bash
   bunx wrangler deploy
   ```
3. บันทึก deployment URL

### 13. Verify And Report

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

- ค่าเริ่มต้น project type ต้องเป็น Workers ไม่ใช่ Pages
- ถ้ายังไม่มี GitHub repo ให้สร้างก่อนด้วย `/create-github-repo` หรือ `gh repo create`
- ถาม user ก่อนเสมอว่าเปิด Cloudflare Access หรือไม่
- ไม่รับ token ในแชท ให้ user ใส่ผ่าน `wrangler login` หรือ secret manager
- ไม่ commit `.env` หรือ token ลง repo
- รองรับ Bun, npm, pnpm ตาม context ของ project

- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น

## Expected Outcome

- GitHub repo พร้อมใช้งาน (ถ้ายังไม่มีจะถูกสร้างก่อน)
- Workers project ถูกสร้างบน Cloudflare
- Git repo เชื่อมต่อกับ Workers Builds หรือพร้อม deploy ด้วย Wrangler
- URL ของ Worker ใช้งานได้
- GitHub Actions workflow พร้อม deploy
- Token URL สำหรับ CI/CD ถูกสร้าง
- สถานะ Cloudflare Access ถูกตั้นค่าตามที่ user เลือก
- ไม่มี secrets หลุดใน source code