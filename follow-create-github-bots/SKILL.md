---
name: follow-create-github-bots
description: สร้าง GitHub bots ด้วย GitHub Apps หรือ Probot พร้อม webhooks และ deployment
argument-hint: "[scope]"
related:
  - use-github-ship-bots
  - follow-create-bun-cli
  - follow-create-web
  - follow-service-cloudflare
  - follow-service-vercel
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-github-actions
---
## Goal

สร้าง GitHub bot ด้วย GitHub Apps หรือ Probot framework พร้อมรับ webhooks, จัดการ events, และ deploy ไปยัง production

## Scope

ใช้สำหรับสร้าง GitHub bot ด้วย TypeScript/Bun/Node.js ครอบคลุม app registration, webhooks (issues, pull requests, push), auth, tests, และ deployment

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Choose Stack

> Goal: เลือก stack ทีเหมาะสมกับ use case

1. ใช้ Probot เมื่องต้องการ framework พร้อม built-in webhook handling และ `context.octokit`
2. ใช้ `@octokit/app` + `@octokit/webhooks` เมื่องต้องการควบคุมเต็มรูปแบบหรือ deploy serverless
3. ใช้ `follow-create-bun-cli` ถ้า bot เป็น Bun CLI + server
4. ใช้ `follow-create-web` ถ้า bot มี dashboard หรือ configuration UI

### 3. Setup Project

> Goal: สร้าง project structure และ dependencies

1. สร้าง directory `{bot-name}/`
2. สร้าง `package.json` ด้วย `name: github-bot-{name}`
3. ติดตั้ง dependencies ตาม stack:
   - Probot: `bun add probot @probot/adapter`
   - Octokit: `bun add @octokit/app @octokit/webhooks @octokit/rest`
   - Serverless: `bun add @octokit/app`
4. สร้าง `tsconfig.json` ด้วย `strict: true`
5. สร้าง `.env.example` ด้วย `APP_ID`, `PRIVATE_KEY`, `WEBHOOK_SECRET`, `WEBHOOK_PROXY_URL`

### 4. Register GitHub App

> Goal: ลงทะเบียน GitHub App ให้ถูกต้อง

1. ไปยัง GitHub Settings > Developer settings > GitHub Apps > New GitHub App
2. ระบุ Homepage URL, Webhook URL, Webhook Secret
3. เลือก permissions ตาม events ที bot จะใช้ เช่น `issues`, `pull_requests`, `contents`
4. Subscribe events เช่น `issues`, `pull_request`, `push`
5. ดาวน์โหลด private key และบันทึก `APP_ID`
6. Install app เข้า repositories หรือ organization ทีต้องการ

### 5. Implement Webhook Handlers

> Goal: implement event handlers สำหรับ bot

1. สร้าง `src/index.ts` เป็น entry point
2. สร้าง `src/handlers/` แยกตาม event type:
   - `issues.ts`
   - `pull-request.ts`
   - `push.ts`
3. ใช้ Probot pattern:
   ```ts
   import { Probot } from "probot";
   export default (app: Probot) => {
     app.on("issues.opened", async (context) => { ... });
   };
   ```
4. หรือใช้ `@octokit/webhooks`:
   ```ts
   import { Webhooks } from "@octokit/webhooks";
   const webhooks = new Webhooks({ secret: process.env.WEBHOOK_SECRET });
   webhooks.on("issues.opened", async ({ payload }) => { ... });
   ```
5. แยก business logic ออกจาก webhook wiring → `src/domain/`
6. ใช้ `try/catch` รอบ handler และ log errors

### 6. Add Local Development Proxy

> Goal: ทดสอบ webhooks ใน local

1. ใช้ Smee (smee.io) สำหรับ webhook proxy
2. ตั้งค่า `WEBHOOK_PROXY_URL` ใน `.env`
3. รัน `bun run dev` หรือ `bunx smee -u <url> -p 3000`
4. ทดสอบ events จาก GitHub จริง

### 7. Add Tests

> Goal: ทดสอบ handlers โดยไม่ต้องรัน GitHub App จริง

1. สร้าง `test/handlers/` ด้วย fixtures ของ webhook payloads
2. ใช้ `nock` หรือ `msw` สำหรับ mock Octokit API calls
3. รัน `bun test`
4. ตรวจสอบ idempotency และ error handling

### 8. Deploy

> Goal: deploy bot ไปยัง production

1. เลือก platform:
   - Cloudflare Workers: ใช้ `follow-service-cloudflare`
   - Vercel Functions: ใช้ `follow-service-vercel`
   - Railway/Render/Fly.io: ใช้ `follow-deploy`
   - VPS/Container: ใช้ Docker + `bun start`
2. ตั้งค่า environment variables บน platform
3. อัปเดต Webhook URL ใน GitHub App settings
4. ตรวจสอบ health endpoint `/health` หรือ `/`

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Naming

- ใช้ `github-bot-{name}` สำหรับ bot-specific
- ใช้ `probot-{name}` สำหรับ Probot-based
- ชื่อ GitHub App ใน GitHub settings ควรตรงกับ repo name

### 2. Security

- เก็บ `PRIVATE_KEY`, `WEBHOOK_SECRET` ใน environment variables / secret manager
- ไม่ hardcode secrets ใน source code
- ใช้ `WEBHOOK_SECRET` ตรวจสอบ signature ของทุก webhook
- ใช้ `crypto.timingSafeEqual` เมื่องเปรียบเทียบ signatures

### 3. Webhooks

- ตอบ 200 OK ให้ GitHub ทันที แล้วประมวลผล async
- จัดการ idempotency ด้วย `delivery` ID
- รองรับ retries จาก GitHub โดยไม่ทำงานซ้ำ
- จำกัด permissions ตามล่าสุดทีจำเป็น

### 4. Error Handling

- Log errors ด้วย context (event, repository, action)
- ไม่ expose stack trace หรือ secrets ใน HTTP response
- มี fallback handler สำหรับ unhandled events

### 5. Testing

- ทดสอบทุก handler ด้วย fixtures
- Mock Octokit API calls ทังหมด
- ทดสอบ error paths

- ใช้ /use-github-ship-bots ถ้าจำเป็น

## Expected Outcome

- GitHub App ลงทะเบียนถูกต้องและ install บน target repos
- Webhook handlers ทำงานได้ทัง local และ production
- Tests ผ่านทุก event type
- Secrets จัดการอย่างปลอดภัย
- Deploy live พร้อม health endpoint

## Examples

```text
my-github-bot/
├── src/
│   ├── index.ts
│   ├── handlers/
│   │   ├── issues.ts
│   │   ├── pull-request.ts
│   │   └── push.ts
│   ├── domain/
│   │   └── auto-label.ts
│   └── github/
│       └── client.ts
├── test/
│   └── handlers/
│       └── issues.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Guide

- `follow-create-bun-cli` — Bun CLI setup
- `follow-service-cloudflare` — Cloudflare Workers deploy
- `follow-service-vercel` — Vercel deploy
- `follow-deploy` — deployment configuration
- `follow-tool-github-actions` — GitHub Actions CI/CD
- [Probot Docs](https://probot.github.io/docs/)
- [GitHub Apps Docs](https://docs.github.com/en/apps)

