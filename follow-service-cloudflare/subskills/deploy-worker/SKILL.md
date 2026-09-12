---
name: follow-service-cloudflare-deploy-worker
description: Deploy Worker ด้วย wrangler — staging/production, deployments list และ post-deploy verify
argument-hint: "[env]"
related:
  - deploy-to-cloudflare
  - follow-secret-manager
  - run-check
  - resolve-errors
  - suggest-next-action
---

## Goal

Deploy Worker ไปยัง Cloudflare จน live และ verify ได้ — deploy staging ก่อน production พร้อม rollback path

## Scope

- ครอบคลุม: `wrangler deploy`, `--env <name>`, `wrangler deployments list`, post-deploy smoke test
- ถ้า deploy target ไม่ใช่ Workers เดี่ยวๆ (Pages, framework, CI pipeline) → ใช้ `/deploy-to-cloudflare` แทน
- prerequisites: auth พร้อม (`subskills/setup-wrangler`), config/bindings ครบ (`subskills/config-bindings`)

## Execute

### 1. Pre-Deploy Checks

> Goal: พร้อม deploy จริงก่อนลงมือ

1. รัน `wrangler whoami` ยืนยัน account — CI ใช้ `CLOUDFLARE_API_TOKEN` ผ่าน `/follow-secret-manager`
2. ทำ `/run-check` — lint/typecheck/tests ต้องผ่าน
3. รัน `wrangler deploy --dry-run` เพื่อ validate config และ bundle
4. ตรวจ secrets ครบด้วย `wrangler secret list`

### 2. Deploy Staging

> Goal: verify บน staging ก่อน production

1. รัน `wrangler deploy --env staging`
2. เก็บ deployment URL และ version id จาก output
3. smoke test endpoint จริงด้วย `curl` หรือ browser — ต้องตอบ expected response
4. ถ้า fail → `/resolve-errors` max 3 รอบ แล้ว stop report

### 3. Deploy Production

> Goal: production live อย่างปลอดภัย

1. confirm กับ user ก่อน deploy production
2. รัน `wrangler deploy` (หรือ `wrangler deploy --env production` ถ้าใช้ named env)
3. เก็บ deployment URL และ version id

### 4. Post-Deploy Verify

> Goal: production ทำงานจริง

1. รัน `wrangler deployments list` เพื่อดู active deployment และ version history
2. smoke test production URL — health endpoint และ critical routes
3. ตรวจ logs ด้วย `wrangler tail` ช่วงสั้นๆ ว่าไม่มี error
4. ถ้า fail → rollback ไป version เดิม (`wrangler rollback` หรือ redeploy version เดิม — ดู official docs) แล้ว report
5. สำเร็จ → report URL + version แล้ว `/suggest-next-action`

## Rules

### 1. Staging First

- deploy staging และ verify ก่อน production เสมอ
- production deploy ต้อง user confirm

### 2. Keep Evidence

- เก็บ URL + version id ทุก deployment
- ใช้ `wrangler deployments list` เป็น source of truth ของสถานะ deploy

### 3. Rollback Ready

- ระบุ version เดิมที่จะ rollback ก่อน deploy production
- ถ้าไม่แน่ใจ rollback command → ดู official docs

## Expected Outcome

- Worker live บน production พร้อม URL + version id
- smoke tests ผ่านและ logs สะอาด
- rollback path พร้อมใช้ถ้าจำเป็น
