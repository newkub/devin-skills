---
name: follow-create-github-app
description: สร้าง GitHub App จริงด้วย Octokit/Probot พร้อม webhooks, permissions และ installation flow
argument-hint: "[scope]"
related:
  - follow-create-github-bots
  - follow-tool-github-actions
  - follow-my-tech-stack
  - review-techstack
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-lang-typescript
  - search-npm-libraries
  - run-test
  - deploy-to-cloudflare
  - report-table
---

## Goal

สร้าง GitHub App ที่ register กับ GitHub จริง (ไม่ใช่ bot wrapper): app manifest, private key auth, webhook endpoint, permissions และ installation flow

## Scope

ใช้สำหรับสร้าง GitHub App จาก scratch ด้วย TypeScript/Bun — ครอบคลุม app registration, JWT auth, installation tokens, webhook handlers และ event subscriptions — ถ้าต้องการเพียง bot ง่ายๆ ที่ทำงานผ่าน Actions ให้ใช้ `/follow-create-github-bots`

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review dependencies และ library design
3. บันทึกเหตุผลที่เลือก stack สำหรับ reference

### 2. Gather Requirements

> Goal: รู้ว่า app ต้องทำอะไร

1. ถาม user: app name, purpose (checks, PR automation, issue triage, sync), และ events ที่ subscribe
2. ระบุ permissions ที่ต้องการตาม least-privilege: `issues`, `pull_requests`, `checks`, `contents`, `metadata`
3. ระบุ runtime: `Bun` (default) หรือ `Node.js`
4. ระบุ hosting: webhook endpoint (Workers/Vercel/Railway) หรือ self-hosted

### 3. Register GitHub App

> Goal: มี app credentials ครบ

1. เปิด GitHub App creation page ด้วย `/open-web` หรือแนะนำ user ไป `Settings → Developer settings → GitHub Apps → New`
2. หรือใช้ app manifest flow: POST manifest JSON แล้ว redirect user เพื่อรับ `code` → แลกเป็น credentials
3. เก็บ `APP_ID`, `PRIVATE_KEY` (PEM), `WEBHOOK_SECRET`, `CLIENT_ID`, `CLIENT_SECRET`
4. ใช้ `/follow-secret-manager` จัดเก็บ — ห้าม commit หรือ log private key

### 4. Setup Project

> Goal: โครงสร้าง project พร้อม auth

1. ใช้ `/search-npm-libraries` เลือก library: `@octokit/app` (low-level) หรือ `probot` (framework) — default `probot` สำหรับ event-driven bots
2. สร้าง `src/app.ts`, `src/index.ts`, `src/handlers/`, `src/config.ts`
3. สร้าง webhook endpoint ที่ verify signature ด้วย `WEBHOOK_SECRET` (HMAC-SHA256)
4. ใช้ `/follow-lang-typescript` สำหรับ type-safe payloads

### 5. Implement Handlers

> Goal: handlers ต่อ event ที่ subscribe

1. สร้าง handler ต่อ event: `issues.opened`, `pull_request.opened`, `check_suite.requested` ฯลฯ
2. ใช้ installation token ผ่าน `octokit` จาก context — ไม่ใช้ personal access token
3. เขียน responses: comments, check runs, PR reviews, status updates
4. เพิ่ม error handling และ idempotency (GitHub ส่ง webhook ซ้ำได้)

### 6. Test Locally

> Goal: ทดสอบก่อน install จริง

1. รัน `bun dev` และ tunnel webhook ด้วย `cloudflared` หรือ Smee.io
2. ทดสอบ auth: JWT generation → installation token → API call
3. ทำ `/run-test` สำหรับ handlers ด้วย mock payloads จาก `test/fixtures/`

### 7. Install And Deploy

> Goal: app ใช้งานได้จริงบน repos

1. Deploy webhook endpoint ด้วย `/deploy-to-cloudflare`, `/deploy-to-railway` หรือ `/deploy-to-vercel`
2. อัปเดต Webhook URL ใน app settings
3. Install app ลง repo/org เป้าหมายผ่าน installation URL
4. Verify: trigger event จริงแล้วดู app ตอบสนอง

## Rules

- ห้าม hardcode `APP_ID`, `PRIVATE_KEY`, `WEBHOOK_SECRET` — ใช้ `/follow-secret-manager`
- ใช้ installation tokens เสมอ — ห้ามใช้ PAT แทน app identity
- Request permissions แบบ least-privilege เท่านั้น
- Webhook handler ต้อง verify signature และ ack ภายใน timeout (GitHub retry ถ้าช้า)
- Handlers ต้อง idempotent — GitHub ส่ง events ซ้ำได้
- ไม่ commit `.env`, `.pem` หรือ app credentials

- ใช้ /follow-create-github-bots ถ้าจำเป็น
- ใช้ /open-web-for-config-secret ถ้าจำเป็น
- ใช้ /report-table ถ้าจำเป็น

## Expected Outcome

- GitHub App register แล้วพร้อม credentials ครบและปลอดภัย
- Webhook endpoint verify signature และ handle events ตาม subscription
- App install ลง repo/org ได้และตอบสนอง events จริง
- พร้อม deploy และขยาย handlers ต่อ
