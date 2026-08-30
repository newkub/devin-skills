---
name: update-to-projects-wrikka-com
description: อัปเดตและ maintain project projects-wrikka-com ที D:\newkub\projects-wrikka-com
argument-hint: "[sync|ui|deploy|deps|all]"
related:
  - follow-solid-tanstack
  - deploy-to-cloudflare
  - follow-create-devin-skills
  - create-cloudflare-token
  - add-to-devin-global-skills
---

## Goal

ช่วยให้การอัปเดต project `projects-wrikka-com` ทำได้อย่างปลอดภัย ตรวจสอบได้ และส่งมอบครบ โดยไม่ทำลายของเดิม

## Scope

- อัปเดต dependencies ของ project
- ซิงค์ข้อมูล GitHub หรือปรับปรุง server functions
- ปรับปรุง UX/UI เมื่อ user ต้องการ (theme สีส้ม, icons, mobile-friendly)
- ดูแล routes `/`, `/projects`, `/projects/$repoName`
- Build, typecheck, และ deploy ไป Cloudflare Workers
- จัดการ basic auth ผ่าน `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`
- สร้างหรือแก้ไข Devin skill นี้เมื่อ project เปลี่ยนแปลง

## Execute

### 1. Prepare

1. ตรวจสอบสถานะ project ที `D:\newkub\projects-wrikka-com`
2. อ่าน `package.json`, `wrangler.jsonc`, `vite.config.ts`, `src/lib/github.ts`, และ `src/start.ts`
3. ตรวจสอบ `GITHUB_TOKEN`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` ใน `.env` (local) และ `wrangler secret` (production)
4. ตรวจสอบ disk space ก่อนรัน build

### 2. Sync GitHub Data

1. เปิด `src/lib/github.ts`
2. ปรับ GraphQL query หรือ REST endpoints ตาม requirement ใหม่
3. เพิ่ม `User-Agent` ทุก request เสมอ
4. รัน `bun run build` เพื่อ typecheck
5. ถ้ามี error → `resolve-errors` สูงสุด 3 รอบ

### 3. Update UI

1. แก้ไข components ใน `src/components/`
2. ตรวจ responsive และ mobile-friendly ด้วย breakpoints `md:`
3. ตรวจ syntax highlight ใน `src/lib/markdown.ts`
4. ปรับ theme สีส้มใน `uno.config.ts` (brand 50-950)
5. รัน build ใหม่อีกครั้ง

### 4. Deploy

1. รัน `bun run build`
2. ตรวจ `wrangler whoami`
3. ถ้าไม่ authenticated → รัน `wrangler login` หรือขอ `CLOUDFLARE_API_TOKEN`
4. ตั้งค่า/อัปเดต secrets ด้วย `bunx wrangler secret bulk .env` หรือ `bunx wrangler secret put <key>`
5. รัน `bun run deploy`
6. ตรวจสอบ URL ทีได้รับ

### 5. Update Skill

1. ถ้า project structure หรือ scripts เปลี่ยน ให้ update `SKILL.md` นี้
2. ตรวจสอบ `related` skills
3. บันทึกเวอร์ชันล่าสุดของเทคโนโลยีทีใช้

## Rules

1. ห้าม commit หรือ expose `GITHUB_TOKEN`, `BASIC_AUTH_PASS`
2. ห้าม overwrite `dist` โดยไม่ build ใหม่อย่างถูกต้อง
3. ใช้ `bun` เป็น package manager หลักสำหรับ project นี้
4. ตรวจ typecheck (`tsc --noEmit`) ก่อน deploy ทุกครั้ง
5. ถ้า deploy ไม่ผ่านให้หยุดและ report ก่อน retry
6. ห้ามลบ `wrangler.jsonc`, `vite.config.ts`, `src/router.tsx`, `src/routes/__root.tsx`, `src/start.ts` โดยไม่สร้างใหม่

## Expected Outcome

- Project build ผ่านและ typecheck ผ่าน
- Deploy ไป Cloudflare Workers ได้
- Devin skill นี้สะท้อนขั้นตอนล่าสุดของ project
- User ทราบ URL, credentials ที่จำเป็น และข้อจำกัดทีเกิดขึ้น
