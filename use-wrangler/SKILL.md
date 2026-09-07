---
name: use-wrangler
description: ใช้ Wrangler CLI สำหรับ Cloudflare Workers/Pages — dev, deploy, secrets, bindings และ tail logs
argument-hint: "[command-or-worker]"
related:
  - create-cloudflare-worker
  - deploy-to-cloudflare
  - resolve-cloudflare-worker-fails
  - follow-service-cloudflare
  - follow-deploy
  - resolve-errors
---

## Goal

ใช้ `wrangler` CLI จัดการ Cloudflare Workers/Pages ครบวงจร — init, dev, deploy, secrets, bindings (KV/D1/R2/Queues) และ tail logs

## Scope

ใช้เมื่อ task เกี่ยวกับ Cloudflare Workers, Pages, KV, D1, R2, Queues, Durable Objects — ครอบคลุม local dev, deploy, config (`wrangler.toml`/`wrangler.jsonc`) และ observability — สร้าง project ใหม่ทำตาม `/create-cloudflare-worker` ก่อนแล้วใช้ skill นี้สำหรับ day-to-day commands

## Execute

### 1. Verify Setup

> Goal: wrangler พร้อมใช้และ authenticated

1. `bunx wrangler --version` หรือ `npx wrangler --version`
2. `bunx wrangler whoami` ตรวจ auth — ถ้าไม่ได้ login → แจ้ง user ให้ `wrangler login` (ห้าม login แทน)
3. ตรวจ `wrangler.toml` หรือ `wrangler.jsonc` ที่ project root

### 2. Local Development

> Goal: รัน worker ใน local

```bash
bunx wrangler dev                        # local dev server
bunx wrangler dev --remote               # dev บน Cloudflare edge จริง
bunx wrangler dev --port 8787
```

### 3. Deploy

> Goal: deploy อย่างถูกต้อง

```bash
bunx wrangler deploy                     # deploy worker
bunx wrangler deploy --dry-run --outdir dist   # ตรวจ output ก่อน deploy จริง
bunx wrangler versions list              # ดู versions
bunx wrangler rollback                   # rollback version ล่าสุดก่อนหน้า
bunx wrangler pages deploy <dir>         # deploy Pages project
```

- deploy จริงต้องผ่าน `/run-verify` ก่อน และ user confirm สำหรับ production

### 4. Secrets And Vars

> Goal: จัดการ secrets และ environment

```bash
bunx wrangler secret put <NAME>          # ใส่ secret (ไม่ commit ใน repo)
bunx wrangler secret list
bunx wrangler secret delete <NAME>
```

- vars ธรรมดาใส่ใน `wrangler.toml` `[vars]` — secrets เท่านั้นที่ใช้ `wrangler secret`
- ไม่ echo/print secret values ลง logs

### 5. Bindings

> Goal: จัดการ KV, D1, R2, Queues

```bash
bunx wrangler kv namespace list / kv key get <key> --namespace-id <id>
bunx wrangler d1 list / d1 execute <db> --command "SELECT ..."
bunx wrangler r2 bucket list
bunx wrangler queues list
```

### 6. Logs And Observability

> Goal: debug ผ่าน logs

```bash
bunx wrangler tail                       # live logs
bunx wrangler tail --format json
bunx wrangler deployments list           # ดู deployment history
```

### 7. Report

> Goal: สรุปผล

1. แสดงผลด้วย `/report-table` (No., Resource, Status, URL/ID)
2. ทำ `/suggest-next-action` ท้ายรายงาน

## Rules

### 1. Config As Source

- `wrangler.toml`/`wrangler.jsonc` คือ source of truth — แก้ config ในนั้น ไม่ใช่ผ่าน dashboard ถ้าไม่จำเป็น
- ตรวจ `compatibility_date` และ `compatibility_flags` ให้ทันสมัย

### 2. Dry Run First

- deploy, rollback, secret delete → dry run หรือยืนยันกับ user ก่อนเสมอ
- ใช้ `deploy --dry-run` เพื่อดู bundle output

### 3. Secrets Safety

- ห้าม commit secrets ใน repo หรือ `wrangler.toml`
- ห้ามแสดง secret values ใน output/logs

### 4. Scope Awareness

- ระบุ `--env <name>` เสมอเมื่อ project มี multiple environments (dev/staging/production)
- production deploy ต้อง user confirm

- ใช้ /resolve-cloudflare-worker-fails ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น

## Expected Outcome

- wrangler commands ทำงานได้ถูกต้องกับ worker ที่ระบุ
- deploy/dev/secrets/bindings จัดการผ่าน CLI ครบ
- ไม่มี secrets รั่วใน repo หรือ logs
- config ใน `wrangler.toml` เป็น source of truth เดียว
