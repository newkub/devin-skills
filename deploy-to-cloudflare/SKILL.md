---
name: deploy-to-cloudflare
description: Deploy project ไปยัง Cloudflare Workers ด้วย wrangler จน live โดยไม่ใช้ Pages
related:
  - follow-secret-manager
  - open-web-for-config-secret
---

## Goal

Deploy application ไปยัง Cloudflare Workers ด้วย wrangler ตั้งแต่ build, cleanup, deploy, watch, และ fix จนสำเร็จ โดย **ไม่ใช้ Cloudflare Pages**

## Scope

- ใช้ Cloudflare Workers + `wrangler.toml` เป้นหลัก
- สำหรับ frontend (React/Vite/Solid/อื่นๆ) ใช้ Workers แทน Pages
- รองรับ assets ผ่าน `[assets]` ใน `wrangler.toml`
- ลบ Pages project เก่าก่อน deploy ถ้าต้องการ

## Execute

### 1. Detect Project Type

> Goal: ระบุว่าเป้น Workers raw หรือ full-stack frontend + Workers

1. ตรวจไฟล์ `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`
2. ถ้าไฟล์มี `[[assets]]` หรือ `[assets]` → frontend + Workers
3. ถ้าไฟล์มี `main = "worker/index.ts"` หรือ `src/index.ts` → Workers raw
4. ถ้ายังไม่มียังหน่อยงาน → สร้าง `wrangler.toml` ด้วย `name`, `main`, `compatibility_date`, และ `[assets]` (ถ้ามี frontend)

### 2. Verify And Build

> Goal: ตรวจสอบและ build ก่อน deploy

1. รัน `bun typecheck` และ `bun run test`
2. รัน `bun run build`
3. ตรวจสอบว่า `dist/` หรือ build output มี `index.html` และ static assets (ถ้ามี frontend)
4. ตรวจ worker bundle ว่า build ผ่าน

### 3. Authenticate

> Goal: ตรวจสอบ Wrangler auth

1. รัน `wrangler whoami`
2. ถ้ายังไม่ auth → ใช้ `/follow-secret-manager` หรือ `/open-web-for-config-secret` เพื่อตั้งค่า `CLOUDFLARE_API_TOKEN`
3. สำหรับ CI/CD ให้ใส่ `CLOUDFLARE_API_TOKEN` ใน GitHub/GitLab secrets

### 4. Clean Up Old Pages (Optional)

> Goal: ลบ Pages project เก่าที่ไม่ต้องการใช้งานอีกต่อไป

1. ตรวจชื่อ Pages project เก่าด้วย `wrangler pages project list`
2. ลบด้วยคำสั่ง:
   ```bash
   wrangler pages project delete <old-project-name> --yes
   ```
3. ถ้ามี Worker เก่าที่ต้องการลบ ใช้:
   ```bash
   wrangler delete <old-worker-name>
   ```
4. ถ้าไม่ต้องการลบ → ข้าม step นี้

### 5. Configure wrangler.toml

> Goal: ตั้งค่า Workers ให้พร้อม deploy

1. ตรวจ `name` ใน `wrangler.toml` ให้ตรงกับชื่อ project
2. ตรวจ `main` ชี้ไปยัง worker entrypoint
3. ถ้ามี frontend ตรวจ `[assets]`:
   ```toml
   [assets]
   directory = "dist"
   binding = "ASSETS"
   ```
4. ถ้ามี D1 ตรวจ `[[d1_databases]]` ให้ถูกต้อง
5. ตรวจ `compatibility_date` ให้เป็น latest

### 6. Deploy

> Goal: ส่ง deployment ไป Cloudflare Workers

1. สำหรับ Workers ทั่วไป (ทั้งที่มี frontend หรือไม่มี):
   ```bash
   wrangler deploy
   ```
   หรือ
   ```bash
   bun run deploy
   ```
2. ถ้า deploy ผ่าน CI/CD ให้รัน workflow และรอ status
3. บันทึก deployment URL ที่ได้รับ

### 7. Watch And Fix

> Goal: ยืนยันว่า live และใช้งานได้

1. เปิด Workers URL หรือรัน `wrangler tail` เพื่อดู logs
2. ถ้า fail → ตรวจ logs หา root cause แล้วแก้ไข source
3. วนซ้ำ build และ deploy จนสำเร็จ
4. ทดสอบ API endpoints และหน้าเว็บหลัก

### 8. Commit And Push

> Goal: sync กับ git

1. `git add -A` และ `git commit`
2. `git push`
3. บันทึก deployment URL ใน `README.md` หรือ docs

### 9. Report

> Goal: สรุปผล

1. รายงาน project type, worker name, URL, status
2. ระบุ environment และ secrets ที่ใช้
3. ถ้ามี Pages project เก่าที่ลบไป ระบุด้วย

## Rules

- ใช้ Cloudflare Workers เป้นหลัก ไม่ใช้ Pages สำหรับ deploy ใหม่
- ใช้ `/follow-secret-manager` สำหรับจัดการ `CLOUDFLARE_API_TOKEN` ก่อน deploy
- build สำเร็จก่อน deploy
- ใช้ `wrangler` CLI
- หากมี frontend ให้ใช้ `[assets]` ใน `wrangler.toml` ไม่ใช่ Pages
- หาก fail → ตรวจ logs ด้วย `wrangler tail` หรือ URL ที deploy แล้ว fix
- ไม่ commit ก่อน deploy สำเร็จ

## Expected Outcome

- Deploy ไป Cloudflare Workers สำเร็จ
- Workers URL ใช้งานได้
- Git sync เรียบร้อย
- ไม่มี errors เหลือ
