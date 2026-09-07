---
name: create-cloudflare-deploy-button
description: เพิ่ม Deploy to Cloudflare button ใน README ให้คนอื่น deploy project ได้ด้วยคลิกเดียว
argument-hint: "[repo-url] [--subdir <path>] [--paid]"
related:
  - create-cloudflare-worker
  - follow-service-cloudflare
  - deploy-to-cloudflare
  - update-readme-md
  - follow-my-tech-stack
  - report
  - ask-me
---

## Goal

ทำให้ repo พร้อมใช้ Deploy to Cloudflare button — เมื่อคนอื่นกดปุ่มใน README, Cloudflare จะ clone repo ไปยัง account ของผู้กด, provision resources (KV, D1, R2) อัตโนมัติ, ตั้ง Workers Builds CI/CD และ deploy ให้ทันที

## Scope

- รองรับเฉพาะ Workers applications เท่านั้น — Pages ไม่รองรับ
- repo ต้อง public บน `github.com` หรือ `gitlab.com` เท่านั้น — private repo หรือ self-hosted Git ไม่รองรับ
- ครอบคลุม: ตรวจ prerequisites, เตรียม `wrangler` config, สร้าง button URL, แทรก snippet ใน `README.md`
- ใช้ /create-cloudflare-worker ถ้าจำเป็น

## Execute

### 1. Verify Button Requirements

> Goal: ยืนยันว่า repo ใช้ Deploy Button ได้

1. ตรวจ git remote ด้วย `git remote -v` — ต้องเป็น `github.com` หรือ `gitlab.com` เท่านั้น
2. ตรวจว่า repo เป็น public — `gh repo view --json visibility` สำหรับ GitHub
3. ตรวจ `wrangler.toml`/`wrangler.jsonc` มี `name`, `main` หรือ `[assets]` ครบ
4. ถ้าไม่ผ่านข้อใด → report blocker และหยุด (เช่น private repo ต้องเปลี่ยนเป็น public ก่อน)

### 2. Prepare Worker Config

> Goal: repo มี config ที่ button deploy ได้จริง

1. ถ้าไม่มี `wrangler.toml`/`wrangler.jsonc` → ทำ `/follow-service-cloudflare` เพื่อสร้าง config ตาม project type (static assets, SPA, Workers API)
2. ประกาศ bindings ทั้งหมดใน config (`[[kv_namespaces]]`, `[[d1_databases]]`, `[[r2_buckets]]`, `[[queues]]`) — Deploy flow จะ auto-provision ให้ผู้กด
3. ถ้ามี build step → ตรวจ `package.json` มี `build` script และ output dir ตรงกับ `[assets].directory`
4. ถ้าใช้ paid Workers features (เช่น Queues, Durable Objects) → ต้องใช้ `paid=true` ในขั้นตอนถัดไป

### 3. Build Button URL

> Goal: ได้ URL ที่ถูกต้องตาม repo structure

1. รูปแบบหลัก:
   ```
   https://deploy.workers.cloudflare.com/?url=<git-repo-url>
   ```
2. repo URL เอาจาก `git remote -v` — ตัด `.git` ออก เช่น `https://github.com/<owner>/<repo>`
3. Monorepo → ระบุ subdirectory ผ่าน tree path:
   ```
   https://deploy.workers.cloudflare.com/?url=https://github.com/<owner>/<repo>/tree/<branch>/<subdir>
   ```
   subdirectory ต้อง self-contained รวม dependencies — ไม่เช่นนั้น build จะ fail
4. ถ้าใช้ paid features → เพิ่ม `&paid=true` ใน href และ `?paid=true` ใน image src

### 4. Insert Snippet Into README

> Goal: ปุ่มอยู่ใน README ในตำแหน่งที่เห็นง่าย

1. ถ้ามี `README.md` → แทรกใต้ title หรือใน badges row เดิม ถ้าไม่มี → ทำ `/update-readme-md` ก่อน
2. Markdown snippet:
   ```markdown
   [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=<repo-url>)
   ```
   หรือ HTML สำหรับ layout control:
   ```html
   <a href="https://deploy.workers.cloudflare.com/?url=<repo-url>"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"/></a>
   ```
3. ถ้า project deploy ผ่าน Workers Builds อยู่แล้ว → ทางเลือก: เปิด dashboard ของ Worker → กด share button แล้ว copy snippet ที่ generate ให้
4. ตรวจว่า URL ใน snippet ตรงกับ repo จริง — ห้ามเผลอใส่ repo ตัวอย่าง

### 5. Verify And Report

> Goal: ยืนยันว่าปุ่มใช้งานได้

1. เปิด button URL ด้วย `/open-web` หรือ `webfetch` เพื่อดูว่า deploy flow render ถูกต้อง (แสดง repo, build config, resources ที่จะ provision)
2. commit และ push `README.md` — ทำ `/git-commit`
3. ทำ `/report` คอลัมน์: `No.`, `Field`, `Value` — แสดง repo URL, subdir, paid flag, resources ที่จะ auto-provision
4. ทำ `/suggest-next-action`

## Rules

### 1. Platform Constraints

- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- repo ต้อง public — ถ้า private → report และหยุด ห้ามเปลี่ยน visibility เอง
- monorepo หลาย Workers apps → สร้าง button แยกต่อ subdirectory ห้ามใช้ปุ่มเดียว

### 2. URL Correctness

- `?url=` ต้องเป็น repo URL จริงที่ push ล่าสุด — verify กับ `git remote -v` เสมอ
- subdirectory ต้อง self-contained — dependencies ที่อยู่นอก subdir ทำให้ build fail
- `paid=true` ต้องใส่ทั้ง image src และ link href

### 3. Secret Safety

- ใช้ /README ถ้าจำเป็น
- env vars ที่ต้องการให้ผู้กดตั้งเอง ให้ระบุใน README section `## Environment Variables`

- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /create-cloudflare-worker ถ้าจำเป็น
- ใช้ /update-readme-md ถ้าจำเป็น

- ใช้ /follow-my-tech-stack ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น
## Expected Outcome

- `README.md` มี Deploy to Cloudflare button ที่ URL ถูกต้อง
- repo ผ่าน prerequisites: public, Workers app, wrangler config ครบ
- button URL เปิด deploy flow ได้จริง
- report แสดง repo URL และ resources ที่จะ auto-provision
