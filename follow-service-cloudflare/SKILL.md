---
name: follow-service-cloudflare
description: ใช้งาน Cloudflare Workers, Pages, D1, KV, R2 และ Nitro ผ่าน Wrangler CLI สำหรับ develop และ deploy
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-cloudflare-token
  - deploy-to-cloudflare
  - watch-cicd-and-resolve
  - follow-tool-mise
  - follow-tasks
  - follow-package-manifest
---

## Goal

ใช้งาน Cloudflare platform สำหรับ develop, build, deploy และ manage Workers, Pages, D1, KV, R2, Queues, Workflows และ Nitro preset ผ่าน Wrangler CLI

## Scope

ใช้สำหรับ:
- Cloudflare Workers — serverless edge deployment ด้วย Wrangler CLI
- Cloudflare Pages — static site hosting และ preview deployments
- D1 databases — migrations, queries, bindings
- KV namespaces, R2 buckets, Queues, Workflows, Hyperdrive, Vectorize
- Nitro preset สำหรับ Nuxt และ framework อื่นๆ ที่ deploy ไป Cloudflare
- Secrets, environment variables, bindings และ CI/CD integration
- Local development, staging/production deploy, version management และ rollback

## Execute

### 1. Install And Authenticate

> Goal: ติดตั้ง Wrangler CLI และเชื่อมต่อกับ Cloudflare account

1. ติดตั้ง Wrangler ด้วย `bun add -D wrangler` หรือ `bun add -D wrangler`
2. ตรวจสอบ version ด้วย `wrangler --version` (ต้อง >= 4.0)
3. Login ด้วย `wrangler login` หรือใช้ `CLOUDFLARE_API_TOKEN` สำหรับ CI
4. ตรวจสอบ authentication ด้วย `wrangler whoami`
5. ติดตั้ง `@cloudflare/workers-types` สำหรับ TypeScript support

### 2. Initialize Project

> Goal: สร้างและกำหนดค่าโปรเจกต์

1. สร้างโปรเจกต์ใหม่ด้วย `wrangler init project-name` หรือ `npm create cloudflare@latest`
2. ใช้ `wrangler deploy` โดยไม่ต้องมี config file — Wrangler 4.68+ auto-detect framework และสร้าง `wrangler.jsonc`
3. กำหนดค่า `name`, `main`, `compatibility_date`, `compatibility_flags` ใน config
4. เปิดใช้งาน `nodejs_compat` flag สำหรับ Node.js modules
5. ดูรายละเอียดใน [references/init-and-config.md](references/init-and-config.md)

### 3. Local Development

> Goal: พัฒนาและทดสอบใน local environment

1. รัน local dev server ด้วย `wrangler dev`
2. ใช้ `--port 8787` สำหรับ custom port
3. ใช้ `--local` สำหรับ local-only mode
4. ใช้ `--remote` สำหรับ access remote resources
5. ตรวจสอบ logs และ test bindings ใน local
6. ถ้า project มี `package.json` ให้ตั้งค่า `dev` script เป็น `wrangler dev` แทน default dev server (ดู Rules Package Scripts)

### 4. Configure Bindings

> Goal: ตั้งค่า D1, KV, R2, Queues และ bindings

1. สร้าง D1 database ด้วย `wrangler d1 create my-db`
2. สร้าง KV namespace ด้วย `wrangler kv namespace create CACHE`
3. สร้าง R2 bucket ด้วย `wrangler r2 bucket create my-bucket`
4. เพิ่ม bindings ใน `wrangler.jsonc` หรือใช้ automatic provisioning (beta)
5. รัน `wrangler types` เพื่อ generate `worker-configuration.d.ts`
6. ดูรายละเอียดใน [references/bindings.md](references/bindings.md) และ [references/d1-migrations.md](references/d1-migrations.md)

### 5. Manage Secrets

> Goal: จัดการ secrets และ environment variables

1. Set secrets ด้วย `wrangler secret put SECRET_NAME`
2. List secrets ด้วย `wrangler secret list`
3. Delete secrets ด้วย `wrangler secret delete`
4. ใช้ `vars` สำหรับ non-secret variables
5. ห้าม commit secrets ไปยัง git

### 6. Typecheck And Build

> Goal: ตรวจสอบ types และ build

1. รัน `wrangler types` เพื่อ generate `Env` interface
2. รัน `bun run typecheck` และแก้ไข errors จนผ่าน
3. รัน `bun run build` หรือ `wrangler deploy --dry-run`
4. ตรวจสอบ bundle size (limit 1 MB สำหรับ Workers)
5. Optimize bundle ถ้าเกิน limit
6. ถ้า deploy target เป็น Cloudflare Workers/Pages ให้ตั้ง `build` script ใน `package.json` เป็น `wrangler build` แทน default build (ดู Rules Package Scripts); จากนั้นรัน build ด้วย `bun run build`

### 7. Deploy Staging And Production

> Goal: Deploy ไป staging ก่อน production

1. เพิ่ม staging environment ใน `wrangler.jsonc` ภายใต้ `env.staging`
2. รัน `wrangler deploy --env staging --dry-run` เพื่อตรวจสอบ
3. Deploy staging: `wrangler deploy --env staging`
4. Test staging environment ด้วย curl หรือ browser
5. Deploy production: `wrangler deploy`
6. ดูรายละเอียดใน [references/versions-and-rollback.md](references/versions-and-rollback.md)

### 8. Nitro Preset For Nuxt

> Goal: กำหนดค่า Nuxt สำหรับ deploy ไป Cloudflare

1. กำหนดใน `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
```
2. ใช้ `bunx nuxi build` เพื่อ build สำหรับ Cloudflare
3. ใช้ `wrangler deploy` เพื่อ deploy

### 9. Advanced Features

> Goal: ใช้งาน features ขั้นสูง

1. ใช้ `wrangler pages deploy` สำหรับ Pages projects (ดู [references/pages.md](references/pages.md))
2. ใช้ `wrangler queues` สำหรับ message queues
3. ใช้ `wrangler workflows` สำหรับ workflows
4. ใช้ `wrangler hyperdrive` สำหรับ database connections
5. ใช้ `wrangler vectorize` สำหรับ vector embeddings
6. ใช้ `wrangler triggers deploy` สำหรับ cron schedules (ดู [references/triggers-and-cron.md](references/triggers-and-cron.md))

### 10. CI/CD, Logs And Troubleshoot

> Goal: ตั้งค่า CI/CD, monitor logs และ debug

1. ตั้งค่า CI/CD ด้วย `CLOUDFLARE_API_TOKEN` (ดู [references/ci-cd.md](references/ci-cd.md))
2. ใช้ `wrangler tail` สำหรับ live logs (ดู [references/tail-and-logs.md](references/tail-and-logs.md))
3. เปิดใช้งาน `observability.enabled` ใน config
4. ใช้ `WRANGLER_LOG=debug` สำหรับ verbose logging
5. ดู error codes ใน [references/troubleshooting.md](references/troubleshooting.md)

## Rules

### 1. Configuration Management

- ใช้ `wrangler.jsonc` เป็น single source of truth (แนะนำสำหรับโปรเจกต์ใหม่)
- กำหนดค่า `compatibility_date` เป็นวันปัจจุบันเสมอ
- เปิดใช้งาน `nodejs_compat` flag สำหรับ Node.js modules
- ใช้ environment-specific configs ด้วย `env.staging`, `env.production`
- ห้าม hardcode secrets ใน config files

### 2. Binding Management

- สร้าง resources ผ่าน CLI ก่อน bind ใน config
- ใช้ descriptive names สำหรับ namespaces และ buckets
- รัน `wrangler types` เมื่อ add หรือ rename bindings
- ใช้ environment-specific bindings สำหรับ isolation
- Clean up unused resources

### 3. Secret Security

- ห้าม commit secrets ไปยัง version control
- ใช้ `/follow-secret-manager` สำหรับจัดการ `CLOUDFLARE_API_TOKEN` และ secrets ก่อน inject เข้า Wrangler
- ใช้ `wrangler secret put` แทนการแก้ config files
- Rotate secrets เป็นระยะ
- ใช้ environment-specific secrets

### 4. Deployment

- Deploy staging ก่อน production เสมอ
- ใช้ `--dry-run` เพื่อตรวจสอบก่อน deploy จริง
- ใช้ versioning สำหรับ rollback capability
- ใช้ `CLOUDFLARE_API_TOKEN` สำหรับ automated deploy

### 5. Build Process

- Typecheck ล้มเหลว: แก้ไขก่อน build
- Build ล้มเหลว: วิเคราะห์และแก้ไข
- Optimize bundle ถ้าเกิน 1 MB limit
- ใช้ `wrangler types` generate types ไม่ hand-write

### 6. Package Scripts

ถ้า task หรือ project ใช้ Cloudflare (Workers/Pages) ให้ตั้งค่า `package.json` scripts ดังนี้:

- `dev`: `wrangler dev` — แทน default dev server (`bun run src/index.ts`, `vite dev`, `next dev` ฯลฯ)
- `build`: `wrangler build` — แทน `bun build`/`vite build`/`next build` เมื่อ deploy ไป Cloudflare
- `deploy`: `wrangler deploy`
- `deploy:staging`: `wrangler deploy --env staging` (ถ้ามี staging environment)

หมายเหตุ: ถ้า Wrangler version ในเครื่องไม่รองรับ subcommand `build` ให้ใช้ `wrangler deploy --dry-run` หรือ `wrangler deploy` ก่อน deploy จริง

## Expected Outcome

- Wrangler CLI ติดตั้งและกำหนดค่าอย่างถูกต้อง
- Workers หรือ Pages deploy ได้อย่างราบรื่น พร้อม gradual rollouts และ rollback
- Bindings และ secrets จัดการอย่างปลอดภัย
- D1 migrations ทำงานได้ทั้ง local และ remote
- Nitro preset กำหนดค่าสำหรับ Nuxt ได้
- CI/CD integration ทำงานได้อัตโนมัติ
- Observability เปิดใช้งาน พร้อม tail debugging
- แก้ปัญหาได้จาก troubleshooting guide
