---
name: follow-service-cloudflare
description: ใช้งาน Cloudflare Workers, Pages, D1, KV, R2 และ Nitro ผ่าน Wrangler CLI สำหรับ develop และ deploy
argument-hint: "[setup-wrangler|config-bindings|deploy-worker|migrate-pages-to-workers|verify] [scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - create-cloudflare
  - deploy-to-cloudflare
  - resolve-errors
  - follow-tool-mise
  - follow-tasks

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

Latest: `wrangler@4.141.0`, `@cloudflare/workers-types@5.20260926.1` (verified 2026-09-26)

1. ติดตั้ง Wrangler ด้วย `bun add -D wrangler`
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

### Workflows

> Goal: dispatch ไปยัง workflow ตาม topic/argument

| Topic/Argument | Workflow |
|----------------|----------|
| `setup`, `install`, `login`, `auth` | `workflows/setup-wrangler/SKILL.md` — wrangler install, auth, `whoami` |
| `config`, `bindings`, `kv`, `r2`, `d1`, `vars`, `env` | `workflows/config-bindings/SKILL.md` — bindings และ environments |
| `deploy`, `worker` | `workflows/deploy-worker/SKILL.md` — `wrangler deploy`, staging/production, verify |
| `migrate`, `pages-to-workers` | `workflows/migrate-pages-to-workers/SKILL.md` — Pages → Workers migration |
| `verify`, `verify-connection` | `workflows/verify-connection/SKILL.md` — `wrangler whoami`, resource access, bindings พร้อม |

1. ถ้า argument ตรง topic → อ่าน `workflows/<name>/SKILL.md` แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง
2. ถ้าไม่ระบุ → ทำตาม steps 1-10 ตามลำดับ

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

- ใช้ /open-web-for-config-secret ถ้าจำเป็น (service cloudflare)
- ใช้ /create-cloudflare-token ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /resolve-cicd ถ้าจำเป็น
- ใช้ /follow-tool-mise ถ้าจำเป็น
- ใช้ /follow-tasks ถ้าจำเป็น

- ใช้ /resolve-errors ถ้าจำเป็น

## Merged Details

### config-bindings

##### Goal

ตั้งค่า/แก้ไข bindings และ environments ใน `wrangler.toml`/`wrangler.jsonc` ให้ Worker เชื่อม KV, R2, D1, Durable Objects และ vars ได้ถูกต้อง โดยไม่ clobber config เดิม

##### Scope

- ครอบคลุม: `kv_namespaces`, `r2_buckets`, `d1_databases`, `durable_objects`, `vars`, `env.<name>` environments
- ไม่ครอบคลุม: install/auth (ใช้ `workflows/setup-wrangler`), deploy (ใช้ `workflows/deploy-worker`)

##### Execute

###### 1. Read Current Config

> Goal: เข้าใจ config เดิมก่อนแก้

1. อ่าน `wrangler.toml` หรือ `wrangler.jsonc` ที่มีอยู่ — ถ้าไม่พบ → ทำ `workflows/setup-wrangler` หรือ `wrangler init` ก่อน
2. ทำ `/check-config-drift` ถ้าสงสัยว่า config ไม่ตรงกับ resources จริง
3. ระบุ bindings ที่ต้องเพิ่ม/แก้ จาก argument หรือ code usage (`env.MY_KV` ฯลฯ)

###### 2. Provision Resources

> Goal: สร้าง resources บน Cloudflare ก่อน bind

1. KV: `wrangler kv namespace create <NAME>` — เก็บ `id` ที่ได้
2. R2: `wrangler r2 bucket create <NAME>`
3. D1: `wrangler d1 create <NAME>` — เก็บ `database_id` ที่ได้
4. ถ้า resource มีอยู่แล้ว → list หา id (`wrangler kv namespace list`, `wrangler r2 bucket list`, `wrangler d1 list`)

###### 3. Add Bindings

> Goal: merge bindings เข้า config โดยไม่ลบของเดิม

1. เพิ่มเฉพาะ keys ที่จำเป็นใน config:
   - KV → `[[kv_namespaces]]` กำหนด `binding`, `id`
   - R2 → `[[r2_buckets]]` กำหนด `binding`, `bucket_name`
   - D1 → `[[d1_databases]]` กำหนด `binding`, `database_name`, `database_id`
   - Durable Objects → `[[durable_objects.bindings]]` กำหนด `name`, `class_name` และ `[[migrations]]` สำหรับ class ใหม่
   - vars → `[vars]` สำหรับ non-secret values
2. binding name ต้องตรงกับที่ code อ้างผ่าน `env.*`
3. secrets ห้ามใส่ใน `vars` — ใช้ `wrangler secret put` ผ่าน `/follow-secret-manager`
4. ถ้าไม่แน่ใจ schema → ดู official docs ผ่าน `/learn-from-web` หรือ `/use-wrangler`

###### 4. Configure Environments

> Goal: แยก staging/production ด้วย `env.*`

1. เพิ่ม `[env.staging]` / `[env.production]` (หรือ `env.staging` ใน jsonc)
2. แต่ละ env ต้องมี bindings ของตัวเอง — top-level bindings ไม่ inherit เข้า named environments
3. provision resources แยกต่อ env (เช่น `CACHE-staging`, `CACHE-production`)

###### 5. Verify

> Goal: config valid และ types ตรง

1. รัน `wrangler types` เพื่อ regenerate `Env` interface
2. รัน `wrangler deploy --dry-run` เพื่อ validate config โดยไม่ deploy
3. ถ้าจำเป็น → รัน `wrangler dev` smoke test binding จริง
4. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว `/resolve-errors`; ผ่าน → `/report-before-after`

##### Rules

###### 1. Merge Not Overwrite

- แก้เฉพาะ keys ที่จำเป็น ห้าม rewrite config ทั้งไฟล์
- binding `name`/`binding` ต้องตรง code usage ทุกจุด

###### 2. Secrets Separation

- secrets → `wrangler secret put` เท่านั้น ห้ามอยู่ใน config
- `vars` ใช้เฉพาะ non-secret values

###### 3. Environment Isolation

- named environments ต้องประกาศ bindings เองครบ
- ใช้ชื่อ resource แยกต่อ env เพื่อ isolation

##### Expected Outcome

- bindings ครบตาม code usage และ `wrangler types` ผ่าน
- environments แยก staging/production ถูกต้อง
- `wrangler deploy --dry-run` validate ผ่านโดยไม่ clobber config เดิม

### deploy-worker

##### Goal

Deploy Worker ไปยัง Cloudflare จน live และ verify ได้ — deploy staging ก่อน production พร้อม rollback path

##### Scope

- ครอบคลุม: `wrangler deploy`, `--env <name>`, `wrangler deployments list`, post-deploy smoke test
- ถ้า deploy target ไม่ใช่ Workers เดี่ยวๆ (Pages, framework, CI pipeline) → ใช้ `/deploy-to-cloudflare` แทน
- prerequisites: auth พร้อม (`workflows/setup-wrangler`), config/bindings ครบ (`workflows/config-bindings`)

##### Execute

###### 1. Pre-Deploy Checks

> Goal: พร้อม deploy จริงก่อนลงมือ

1. รัน `wrangler whoami` ยืนยัน account — CI ใช้ `CLOUDFLARE_API_TOKEN` ผ่าน `/follow-secret-manager`
2. ทำ `/run-check` — lint/typecheck/tests ต้องผ่าน
3. รัน `wrangler deploy --dry-run` เพื่อ validate config และ bundle
4. ตรวจ secrets ครบด้วย `wrangler secret list`

###### 2. Deploy Staging

> Goal: verify บน staging ก่อน production

1. รัน `wrangler deploy --env staging`
2. เก็บ deployment URL และ version id จาก output
3. smoke test endpoint จริงด้วย `curl` หรือ browser — ต้องตอบ expected response
4. ถ้า fail → `/resolve-errors` max 3 รอบ แล้ว stop report

###### 3. Deploy Production

> Goal: production live อย่างปลอดภัย

1. confirm กับ user ก่อน deploy production
2. รัน `wrangler deploy` (หรือ `wrangler deploy --env production` ถ้าใช้ named env)
3. เก็บ deployment URL และ version id

###### 4. Post-Deploy Verify

> Goal: production ทำงานจริง

1. รัน `wrangler deployments list` เพื่อดู active deployment และ version history
2. smoke test production URL — health endpoint และ critical routes
3. ตรวจ logs ด้วย `wrangler tail` ช่วงสั้นๆ ว่าไม่มี error
4. ถ้า fail → rollback ไป version เดิม (`wrangler rollback` หรือ redeploy version เดิม — ดู official docs) แล้ว report
5. สำเร็จ → report URL + version แล้ว `/suggest-next-action`

##### Rules

###### 1. Staging First

- deploy staging และ verify ก่อน production เสมอ
- production deploy ต้อง user confirm

###### 2. Keep Evidence

- เก็บ URL + version id ทุก deployment
- ใช้ `wrangler deployments list` เป็น source of truth ของสถานะ deploy

###### 3. Rollback Ready

- ระบุ version เดิมที่จะ rollback ก่อน deploy production
- ถ้าไม่แน่ใจ rollback command → ดู official docs

##### Expected Outcome

- Worker live บน production พร้อม URL + version id
- smoke tests ผ่านและ logs สะอาด
- rollback path พร้อมใช้ถ้าจำเป็น

### migrate-pages-to-workers

##### Goal

ย้ายโปรเจกต์จาก Cloudflare Pages ไป Workers (Static Assets + Worker script) อย่างปลอดภัย — เว็บทำงานเหมือนเดิมและ rollback ได้

##### Scope

- ครอบคลุม: Pages static site → Workers Static Assets, Pages Functions (`functions/`) → Worker routes, `_redirects`/`_headers`, cutover และ rollback
- ไม่ทำพร้อม feature work — migration แยก commit ต่อ step ให้ bisect ได้

##### Execute

###### 1. Plan Migration

> Goal: map from→to ชัดเจนก่อนเริ่ม

1. ทำ `/plan`: ระบุสิ่งที่ Pages ใช้อยู่ — static output dir, `functions/` routes, `_redirects`, `_headers`, env vars/secrets, custom domains
2. อ่าน official migration guide (Workers Static Assets docs) — ถ้าไม่แน่ใจทำ `/learn` (web)
3. เขียน rollback path: Pages project เดิมยังอยู่จนกว่า cutover สำเร็จ — กลับได้ด้วยการชี้ domain กลับ
4. ถ้า scope ไม่ชัดหรือกระทบ production domain → `/ask-me`

###### 2. Create Worker Config

> Goal: `wrangler.jsonc`/`wrangler.toml` สำหรับ Workers + assets

1. กำหนด `name`, `main` (worker entry), `compatibility_date` เป็นวันปัจจุบัน
2. ตั้ง `assets` ชี้ไป static output dir เดิมของ Pages (ดู official docs สำหรับ assets config fields ล่าสุด)
3. ย้าย vars จาก Pages settings → `vars` และ secrets → `wrangler secret put`
4. รัน `wrangler types` หลังตั้ง config

###### 3. Migrate Functions To Worker

> Goal: `functions/` handlers ทำงานใน Worker

1. map แต่ละ `functions/<route>.ts` → route ใน Worker `fetch` handler
2. ย้าย `context.env` bindings → `env` ของ Worker — bindings ต้องตรง (ดู `workflows/config-bindings`)
3. แปลง `_redirects`/`_headers` → logic ใน Worker หรือ assets config ตาม official docs
4. test local ด้วย `wrangler dev` ทุก route ที่ migrate
5. ถ้า routes fail → `/resolve-errors`

###### 4. Deploy And Verify

> Goal: Workers ใหม่ live และเทียบผลกับ Pages เดิม

1. deploy ไป staging env ก่อนด้วย `wrangler deploy --env staging` (ดู `workflows/deploy-worker`)
2. smoke test เทียบทุก route กับ Pages URL เดิม — status, headers, content ต้องเท่ากัน
3. deploy production ด้วย `wrangler deploy` แล้วชี้ custom domain/routes ไป Worker
4. verify domain จริง แล้วเก็บ Pages project เดิมไว้เป็น rollback จนกว่า stable

###### 5. Cleanup

> Goal: ปิดของเก่าหลัง stable

1. หลัง production stable (user confirm window) → disable/delete Pages project
2. ลบ config ที่ไม่ใช้แล้ว และทำ `/update-references` ถ้ามีไฟล์ย้าย
3. ทำ `/report-before-after` สรุป URLs, routes และ bindings ที่เปลี่ยน

##### Rules

###### 1. Rollback First

- Pages project เดิมต้องพร้อม rollback จนกว่า Workers ใหม่ stable — ห้ามลบก่อน confirm
- แยก commit ต่อ migration step ให้ bisect/revert ได้

###### 2. Parity Check

- ทุก route/redirect/header ต้องเทียบกับ Pages เดิม — ห้ามสันนิษฐาน
- bindings และ env vars ต้องครบก่อน deploy

###### 3. Docs First

- fields ของ assets config และ limits เปลี่ยนได้ — อ้าง official docs ผ่าน `/use-wrangler` แทนการเดา

##### Expected Outcome

- site ทำงานบน Workers ครบทุก route/redirect เท่า Pages เดิม
- custom domain ชี้ไป Worker แล้ว และ rollback path (Pages เดิม) พร้อม
- รายงาน before/after ชัดเจน

### setup-wrangler

##### Goal

ติดตั้ง Wrangler CLI และเชื่อมต่อกับ Cloudflare account ให้พร้อมสำหรับ develop และ deploy — first-time setup ที่ verify ได้และ idempotent

##### Scope

ใช้สำหรับติดตั้ง `wrangler`, ตั้งค่า authentication (`wrangler login` หรือ `CLOUDFLARE_API_TOKEN`) และ verify ด้วย `wrangler whoami` — ไม่ครอบคลุม bindings (ใช้ `workflows/config-bindings`) หรือ deploy (ใช้ `workflows/deploy-worker`)

##### Execute

###### 1. Check Prerequisites

> Goal: ตรวจ current state ก่อนติดตั้ง (idempotent)

1. ตรวจว่ามี Wrangler แล้วหรือยังด้วย `wrangler --version`
2. ถ้ามีแล้ว → ข้ามไป Step 3 เพื่อ verify auth ทันที
3. ตรวจ package manager ของ project จาก `package.json` (`bun`, `pnpm`, `npm`)

###### 2. Install Wrangler

> Goal: ติดตั้ง Wrangler ตาม ecosystem ของ project

1. ติดตั้งเป็น devDependency ด้วย `bun add -D wrangler` (หรือ package manager ที่ project ใช้)
2. ถ้าต้องการ global → ทำ `/follow-tool-mise` หรือ `mise use -g wrangler` ก่อน แล้วค่อยพิจารณา package manager ของระบบ
3. ถ้าใช้ TypeScript → ติดตั้ง `@cloudflare/workers-types` ด้วย `bun add -D @cloudflare/workers-types`
4. verify version ด้วย `wrangler --version`

###### 3. Authenticate

> Goal: เชื่อมต่อ Wrangler กับ Cloudflare account

1. Interactive: รัน `wrangler login` — เปิด browser ให้ user authorize
2. CI/headless: ใช้ `CLOUDFLARE_API_TOKEN` environment variable — สร้าง token ตาม `/create-cloudflare-token` แล้วเก็บผ่าน `/follow-secret-manager`
3. ห้าม commit token หรือใส่ใน config files

###### 4. Verify

> Goal: ยืนยัน auth ทำงานและ account ถูกต้อง

1. รัน `wrangler whoami` — ต้องแสดง account name และ account ID
2. ถ้ามีหลาย accounts → เลือก account ที่ถูกต้องให้ user confirm
3. ถ้า verify fail → ทำ `/resolve-errors` max 3 รอบ (re-login, ตรวจ token scope) แล้ว stop report
4. สำเร็จ → report account ที่ใช้แล้ว `/suggest-next-action`

##### Rules

###### 1. Idempotent Setup

- ตรวจ version และ auth state ก่อนเสมอ — ถ้า setup ไปแล้ว verify เท่านั้น
- ติดตั้งตาม package manager ของ project ห้ามผสม

###### 2. Credential Safety

- ใช้ `/follow-secret-manager` จัดการ `CLOUDFLARE_API_TOKEN` — ห้าม hardcode หรือ commit
- CI ใช้ API token แทน `wrangler login` เสมอ

###### 3. Docs First

- ถ้าไม่แน่ใจ command/flag → ดู official docs ผ่าน `/learn` (web) หรือ `/use-wrangler` แทนการเดา

##### Expected Outcome

- `wrangler --version` แสดง version ที่ติดตั้ง
- `wrangler whoami` ยืนยัน account ถูกต้อง
- credentials เก็บอย่างปลอดภัย พร้อมใช้ทั้ง local และ CI

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Cloudflare เชื่อมต่อได้จริง — wrangler authenticated, account เข้าถึงได้, bindings ตอบกลับ

##### Scope

- ใช้เมื่อ `/follow-service-cloudflare` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ config/bindings

##### Execute

###### 1. Check Wrangler Auth

> Goal: wrangler login และ account พร้อม

1. `wrangler whoami` — ต้องแสดง account name/id
2. ถ้าใช้ `CLOUDFLARE_API_TOKEN` → ตรวจ token มีและ permissions ครบ
3. ถ้า auth fail → แนะนำ `workflows/setup-wrangler/SKILL.md` — ไม่ login เอง

###### 2. Check Resource Access

> Goal: bindings/resources ที่ config อ้างเข้าถึงได้

1. `wrangler kv namespace list`, `wrangler r2 bucket list`, `wrangler d1 list` ตามที่ `wrangler.toml`/`wrangler.jsonc` ใช้
2. flag bindings ที่ config อ้างแต่ resource ไม่มีใน account
3. ถ้ามี Worker → `wrangler deployments list` ดู deployment ล่าสุด

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `missing-resources` / `partial`

##### Rules

- ใช้ list/read commands เท่านั้น — ห้าม deploy/put/delete
- ไม่ print token values
- missing resource → รายงาน binding name + resource ที่ขาด

##### Expected Outcome

- Verdict connection พร้อม account + resources evidence

### references/apis

#### Service Cloudflare API & Dependencies

##### Install

Cloudflare recommends installing Wrangler locally in each project rather than globally:

```sh
bun add -D wrangler
#### or
npm install --save-dev wrangler
```

Run it via the package runner:

```sh
bunx wrangler <command>
#### or
npx wrangler <command>
```

##### Version

- Latest (`wrangler`): 4.129.1
- [Package Registry](https://www.npmjs.com/package/wrangler)
- [Repository](https://github.com/cloudflare/workers-sdk)

##### Dependencies

- `wrangler` bundles `esbuild`, `miniflare`, and `workerd` for the local dev server — no extra runtime deps required.
- Optional: `wrangler types` generates `worker-configuration.d.ts`; `@cloudflare/workers-types` is an alternative types package.
- Auth uses `wrangler login` (OAuth) or `CLOUDFLARE_API_TOKEN` env var for CI.

##### Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `wrangler init [name]` | Create a new Worker project | interactive prompts | `--yes`, `--from-dash`, `--type` |
| `wrangler dev` | Start local dev server (Miniflare/workerd) | port 8787, local mode | `--port`, `--ip`, `--local`, `--remote`, `--test-scheduled`, `--show-interactive-dev-session` |
| `wrangler deploy` | Deploy Worker to Cloudflare | production env | `--env`, `--name`, `--dry-run`, `--outdir`, `--minify`, `--compatibility-date` |
| `wrangler types` | Generate TypeScript types from `wrangler.toml`/config | `worker-configuration.d.ts` | `--env-interface` |
| `wrangler tail` | Stream live Worker logs | all events | `--format`, `--status`, `--sampling-rate`, `--search` |
| `wrangler delete` | Delete a Worker script | prompts for confirmation | `--name`, `--env`, `--force` |
| `wrangler login` | OAuth login to Cloudflare account | browser flow | `--browser` |
| `wrangler logout` | Remove stored credentials | — | — |
| `wrangler whoami` | Show current user / account / permissions | — | — |
| `wrangler deployments list` | List recent deployments | — | — |
| `wrangler deployments status` | Show current deployment status | — | — |
| `wrangler versions upload` | Upload a new Worker version | not deployed | `--tag`, `--message`, `--preview-alias` |
| `wrangler versions deploy` | Deploy a specific version (gradual rollout) | 100% traffic | `--percentage` |
| `wrangler versions list` | List uploaded versions | — | — |
| `wrangler rollback` | Roll back to a previous deployment | previous version | version ID |
| `wrangler triggers deploy` | Apply cron/route trigger changes | — | — |
| `wrangler secret put <KEY>` | Create/update an encrypted secret | prompts for value | `--env`, `--name` |
| `wrangler secret list` | List secret names (values hidden) | — | `--env` |
| `wrangler secret delete <KEY>` | Delete a secret | prompts | `--env`, `--force` |
| `wrangler secret bulk <file>` | Upload secrets from JSON/.env file | — | `--env` |
| `wrangler kv namespace create <NS>` | Create a KV namespace | — | `--preview`, `--env` |
| `wrangler kv key put <KEY> <VALUE>` | Write a KV entry | — | `--namespace-id`, `--binding`, `--ttl`, `--path` |
| `wrangler kv key get <KEY>` | Read a KV entry | — | `--namespace-id`, `--binding` |
| `wrangler kv key delete <KEY>` | Delete a KV entry | — | `--namespace-id`, `--binding` |
| `wrangler kv bulk put/delete <file>` | Bulk KV operations from JSON | — | `--namespace-id`, `--binding` |
| `wrangler d1 create <NAME>` | Create a D1 database | — | `--location` |
| `wrangler d1 execute <DB> --command <SQL>` | Run SQL against D1 | local | `--remote`, `--file`, `--json` |
| `wrangler d1 migrations apply <DB>` | Apply migration files | local | `--remote`, `--env` |
| `wrangler d1 export <DB>` | Export D1 database to SQL | — | `--output`, `--remote` |
| `wrangler r2 bucket create <NAME>` | Create an R2 bucket | — | `--location`, `--storage-class` |
| `wrangler r2 object put <BUCKET>/<KEY>` | Upload object to R2 | — | `--file`, `--pipe`, `--remote` |
| `wrangler r2 object get <BUCKET>/<KEY>` | Download object from R2 | — | `--file`, `--pipe`, `--remote` |
| `wrangler queues create <NAME>` | Create a Queue | — | `--delivery-delay`, `--message-retention-period` |
| `wrangler queues consumer add <Q> <WORKER>` | Attach a Worker consumer | — | `--batch-size`, `--max-retries`, `--dead-letter-queue` |
| `wrangler pages dev [dir]` | Pages local dev server | — | `--port`, `--binding`, `--kv`, `--d1` |
| `wrangler pages deploy [dir]` | Deploy a Pages project | preview deployment | `--project-name`, `--branch`, `--commit-hash` |
| `wrangler workflows list` | List Workflows | — | — |
| `wrangler workflows instances list <W>` | List Workflow instances | — | — |
| `wrangler hyperdrive create <NAME>` | Create Hyperdrive config | — | `--connection-string`, `--caching-disabled` |
| `wrangler vectorize create <NAME>` | Create a Vectorize index | — | `--dimensions`, `--metric` |
| `wrangler containers deploy` | Deploy a Workers Container | — | `--image` |
| `wrangler secrets-store store create` | Create a Secrets Store | — | `--scopes` |
| `wrangler check startup` | Check Worker startup time / config | — | — |
| `wrangler docs` | Open Wrangler docs search | — | search term |

##### Global Flags

| commands | description | default | options |
|---|---|---|---|
| `--config <path>` | Path to Wrangler config file | `wrangler.toml` / `wrangler.json(c)` | `-c` |
| `--env <name>` | Target environment in config | top-level env | `-e` |
| `--cwd <path>` | Run as if started in directory | current dir | — |
| `--profile <name>` | Use a specific auth profile | default profile | — |
| `--log-level <level>` | Logging verbosity | `log` | `debug`, `info`, `warn`, `error` |
| `--version` / `--help` | Show version / help | — | `-v`, `-h` |

##### Source

- Official docs: https://developers.cloudflare.com/workers/wrangler/commands/
- Install & update: https://developers.cloudflare.com/workers/wrangler/install-and-update/
- Workers docs: https://developers.cloudflare.com/workers/

### references/bindings

#### Wrangler Bindings

Bindings เชื่อม Worker กับ Cloudflare resources (Secrets, D1, KV, R2)

##### Secrets

Secrets เป็น encrypted environment variables สำหรับ sensitive data

| Command | Description |
|---|---|
| `wrangler secret put KEY_NAME` | Set a secret (prompts for value) |
| `wrangler secret list` | List all secrets |
| `wrangler secret delete KEY_NAME` | Delete a secret |
| `wrangler secret bulk [FILE]` | Bulk upload secrets from JSON or .env file |
| `wrangler secret bulk [FILE] --env production` | Bulk upload for specific environment |

###### Local Development Secrets

ใช้ `.dev.vars` หรือ `.env` (เลือกอย่างเดียว) ใน project root:

```bash
#### .dev.vars
API_KEY=your_api_key_here
DB_CONNECTION_STRING=your_connection_string
```

###### Declare Required Secrets

```jsonc
{
  "secrets": {
    "required": ["API_KEY", "DB_CONNECTION_STRING"]
  }
}
```

##### D1 Databases

D1 เป็น serverless SQLite database

| Command | Description |
|---|---|
| `wrangler d1 create my-db` | Create a D1 database |
| `wrangler d1 list` | List D1 databases |
| `wrangler d1 execute my-db --command "SELECT 1"` | Run SQL command |
| `wrangler d1 execute my-db --file schema.sql` | Run SQL file |
| `wrangler d1 execute my-db --local` | Run against local DB |
| `wrangler d1 execute my-db --remote` | Run against remote DB |
| `wrangler d1 delete my-db` | Delete a D1 database |
| `wrangler d1 backup create my-db` | Create a backup |
| `wrangler d1 backup list my-db` | List backups |
| `wrangler d1 time-travel info my-db` | View time travel info |
| `wrangler d1 time-travel restore my-db --bookmark=<ID>` | Restore to bookmark |

ดู `d1-migrations.md` สำหรับ migration workflow

##### KV Namespaces

KV เป็น globally distributed key-value store

| Command | Description |
|---|---|
| `wrangler kv namespace create CACHE` | Create KV namespace |
| `wrangler kv namespace list` | List KV namespaces |
| `wrangler kv namespace delete --binding CACHE` | Delete KV namespace |
| `wrangler kv key put KEY VALUE --binding CACHE` | Put a key-value pair |
| `wrangler kv key list --binding CACHE` | List keys |
| `wrangler kv key get KEY --binding CACHE` | Get a value |
| `wrangler kv key delete KEY --binding CACHE` | Delete a key |

##### R2 Buckets

R2 เป็น object storage เหมือน S3 แต่ไม่มี egress fees

| Command | Description |
|---|---|
| `wrangler r2 bucket create my-bucket` | Create R2 bucket |
| `wrangler r2 bucket list` | List R2 buckets |
| `wrangler r2 bucket delete my-bucket` | Delete R2 bucket |
| `wrangler r2 bucket info my-bucket` | View bucket info |
| `wrangler r2 object put my-bucket/KEY --file ./path` | Upload object |
| `wrangler r2 object get my-bucket/KEY --file ./path` | Download object |
| `wrangler r2 object delete my-bucket/KEY` | Delete object |
| `wrangler r2 object list my-bucket` | List objects in bucket |

##### Configuration

Bindings ประกาศใน `wrangler.jsonc` หรือ `wrangler.toml`:

```jsonc
{
  "vars": {
    "API_HOST": "api.example.com"
  },
  "kv_namespaces": [
    { "binding": "CACHE", "id": "<KV_ID>" }
  ],
  "d1_databases": [
    { "binding": "DB", "database_name": "my-db", "database_id": "<D1_ID>" }
  ],
  "r2_buckets": [
    { "binding": "STORAGE", "bucket_name": "my-bucket" }
  ]
}
```

Bindings ไม่ inherit ระหว่าง environments ต้องประกาศใหม่ในแต่ละ env

### references/ci-cd

#### Wrangler CI/CD Integration

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '22'
      - run: npm ci
      - run: npx wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Key environment variables for CI/CD:
- `CLOUDFLARE_API_TOKEN` — API token for authentication
- `CLOUDFLARE_ACCOUNT_ID` — Account ID (optional, can be in config)

### references/commands

#### Wrangler Commands

คำสั่งหลักและ advanced platform commands

##### Core Commands

| Command | Description |
|---|---|
| `wrangler init [name]` | Create a new Worker project |
| `wrangler dev` | Start local dev server |
| `wrangler dev --port 8787` | Custom port |
| `wrangler dev --local` | Local-only mode |
| `wrangler dev --remote` | Access remote resources |
| `wrangler dev --test-scheduled` | Test cron triggers locally |
| `wrangler deploy` | Deploy to production |
| `wrangler deploy --env staging` | Deploy to specific environment |
| `wrangler deploy --dry-run` | Preview without deploying |
| `wrangler setup` | Configure without deploying |
| `wrangler types` | Generate TypeScript types |
| `wrangler tail` | Stream live logs (ดู `tail-and-logs.md`) |
| `wrangler delete` | Delete a Worker |
| `wrangler versions` | Manage Worker versions (ดู `versions-and-rollback.md`) |
| `wrangler rollback` | Rollback to previous version |
| `wrangler deployments list` | List recent deployments |
| `wrangler deployments status` | View current deployment status |

##### Advanced Platform Products

| Command | Description |
|---|---|
| `wrangler pages deploy [dir]` | Deploy Cloudflare Pages (ดู `pages.md`) |
| `wrangler pages dev [dir]` | Pages local dev server |
| `wrangler queues create my-queue` | Create a Queue |
| `wrangler queues list` | List Queues |
| `wrangler queues delete my-queue` | Delete a Queue |
| `wrangler workflows deploy` | Deploy a Workflow |
| `wrangler workflows list` | List Workflows |
| `wrangler workflows instances list` | List Workflow instances |
| `wrangler hyperdrive create my-hd` | Create Hyperdrive config |
| `wrangler hyperdrive list` | List Hyperdrive configs |
| `wrangler vectorize create my-index` | Create Vectorize index |
| `wrangler vectorize list` | List Vectorize indexes |
| `wrangler triggers deploy` | Apply trigger changes (ดู `triggers-and-cron.md`) |

##### Global Flags

| Flag | Alias | Description |
|---|---|---|
| `--config` | `-c` | Path to Wrangler configuration file |
| `--env` | `-e` | Environment to use |
| `--cwd` | - | Run as if started in specified directory |
| `--profile` | - | Use a specific auth profile |
| `--version` | `-v` | Show version number |
| `--log-level` | - | Logging level (debug, info, warn, error) |

### references/d1-migrations

#### Wrangler D1 Migrations

D1 migrations สำหรับ versioning database schema changes

##### Subcommands

| Command | Description |
|---|---|
| `wrangler d1 migrations create [DB] [MESSAGE]` | Create a new migration file |
| `wrangler d1 migrations list [DB]` | List unapplied migrations |
| `wrangler d1 migrations apply [DB]` | Apply unapplied migrations |

##### Migration Workflow

```bash
#### 1. Create migration
npx wrangler d1 migrations create my-db create_user_table
#### สร้าง migrations/0001_create_user_table.sql

#### 2. Edit SQL file
#### เพิ่ม CREATE TABLE, ALTER TABLE, etc.

#### 3. Apply to local
npx wrangler d1 migrations apply my-db --local

#### 4. Apply to remote
npx wrangler d1 migrations apply my-db --remote

#### 5. List unapplied
npx wrangler d1 migrations list my-db
```

##### Flags

| Flag | Description |
|---|---|
| `--local` | Apply to local DB (สำหรับ `wrangler dev`) |
| `--remote` | Apply to remote DB (production) |
| `--preview` | Apply to preview D1 DB |
| `--persist-to [DIR]` | Custom persistence directory (ต้องใช้กับ `--local`) |

##### Migration File Format

- ตั้งชื่อ: `{VERSION}_{DESCRIPTION}.sql` (เช่น `0001_create_user_table.sql`)
- เก็บใน `migrations/` folder (สร้างอัตโนมัติ)
- แต่ละไฟล์คือ SQL queries ที่จะ run ตามลำดับ version

```sql
-- migrations/0001_create_user_table.sql
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  email_address TEXT,
  created_at INTEGER,
  deleted INTEGER,
  settings TEXT
);
```

##### Configuration

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-db",
      "database_id": "<UUID>",
      "migrations_table": "d1_migrations",
      "migrations_dir": "migrations",
      "migrations_pattern": "migrations/*.sql"
    }
  ]
}
```

| Key | Default | Description |
|---|---|---|
| `migrations_table` | `d1_migrations` | ชื่อตาราง tracking |
| `migrations_dir` | `migrations` | โฟลเดอร์เก็บ migration files |
| `migrations_pattern` | `${migrations_dir}/*.sql` | Glob pattern สำหรับหา files |

##### ORM Integration (Drizzle)

สำหรับ nested layout เช่น Drizzle (`migrations/0001_init/migration.sql`):

```jsonc
{
  "migrations_dir": "migrations",
  "migrations_pattern": "migrations/*/migration.sql"
}
```

##### Rollback

###### Automatic Rollback

ถ้า migration ล้มเหลว ระบบ rollback อัตโนมัติ migration ก่อนหน้ายัง applied อยู่

###### Time Travel Restore

D1 ไม่มี `rollback` command แยก ใช้ Time Travel แทน:

```bash
npx wrangler d1 time-travel info my-db
npx wrangler d1 time-travel restore my-db --bookmark=<BOOKMARK_ID>
```

##### Best Practices

- ใช้ database name (ไม่ใช่ binding name) เพื่อหลีกเลี่ยงการ run ผ่าน binding ผิด
- Test ใน local ก่อน apply remote เสมอ
- ตั้งชื่อ migration ให้ descriptive
- ใช้ `PRAGMA defer_foreign_keys = true;` ถ้ามี foreign key constraints

##### Source

- [D1 and Workers](https://developers.cloudflare.com/d1/)
- [D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)

### references/init-and-config

#### Wrangler Initialize And Configuration

##### Initialize A New Project

```sh
npx wrangler init my-project
```

This creates:
- `wrangler.jsonc` or `wrangler.toml` config file
- `src/index.ts` entry point
- `package.json` with scripts

##### Configuration File

Cloudflare recommends `wrangler.jsonc` for new projects. Supported since Wrangler v3.91.0. TOML (`wrangler.toml`) is still supported.

###### `wrangler.jsonc`

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-24",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "vars": {
    "API_HOST": "api.example.com"
  },
  "kv_namespaces": [
    { "binding": "CACHE", "id": "<KV_ID>" }
  ],
  "d1_databases": [
    { "binding": "DB", "database_name": "my-db", "database_id": "<D1_ID>" }
  ],
  "r2_buckets": [
    { "binding": "STORAGE", "bucket_name": "my-bucket" }
  ],
  "env": {
    "staging": {
      "name": "my-worker-staging",
      "vars": {
        "API_HOST": "staging-api.example.com"
      }
    }
  }
}
```

###### Environments

Define environment-specific configs under `env`:

```sh
npx wrangler deploy --env staging
```

Bindings (`vars`, `kv_namespaces`, etc.) are not inherited — define them explicitly per environment.

### references/install-and-auth

#### Wrangler Install And Authentication

##### Install

Install locally in your project (Cloudflare recommends this over global install):

```sh
bun add -D wrangler@latest
#### or
yarn add -D wrangler@latest
#### or
pnpm add -D wrangler@latest
#### or
bun add -d wrangler@latest
```

Verify installation:

```sh
npx wrangler --version
```

If Wrangler is not installed, running `npx wrangler` uses the latest version automatically.

##### Authentication

```sh
npx wrangler login      # Interactive browser login
npx wrangler whoami     # Check current authentication
```

For CI/CD, set the `CLOUDFLARE_API_TOKEN` environment variable instead of using `wrangler login`.

### references/overview

#### Wrangler CLI Overview

##### Overview

Wrangler is the Cloudflare Developer Platform command-line interface (CLI) for managing Worker projects. It supports creating, developing, deploying, and managing Cloudflare Workers and Developer Platform products (D1, KV, R2, Queues, Workflows, Pages, Hyperdrive, Vectorize).

##### Version Info

- Package: `wrangler`
- Latest stable: `4.125.0`
- Node.js requirement: `>=22.0.0`
- Peer dependency: `@cloudflare/workers-types` (optional)
- License: MIT OR Apache-2.0
- npm: https://www.npmjs.com/package/wrangler

##### Migration From v3 To v4

```sh
bun add -D wrangler@4
```

Wrangler v4 is a smaller set of changes compared to previous major versions. Existing workflows are unlikely to change.

##### Source

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Install/Update Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Migrate v3 to v4](https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/)

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `wrangler` |
| Registry | `npm` |
| Latest Version | `4.131.1` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Cloudflare |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/cloudflare/workers-sdk` |
| Website | `https://workers.cloudflare.com/` |
| Documentation | `https://developers.cloudflare.com/workers/wrangler/` |
| Releases / Changelog | `https://github.com/cloudflare/workers-sdk/releases` |

##### Install

```bash
bun add -D wrangler
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@cloudflare/workers-types` | `npm` | `5.20260916.1` | TypeScript types for Workers runtime |
| `create-cloudflare` | `npm` | `unknown` | Scaffolding CLI behind `npm create cloudflare@latest` |

##### Notes

- Breaking changes in latest major: Wrangler 4.x requires `wrangler.jsonc`/`toml` config conventions and `compatibility_date`; `events` field needs >= 4.68; `wrangler deploy` can auto-detect frameworks without a config file
- Version pinned in SKILL.md: `wrangler@4.132.0`, `@cloudflare/workers-types@5.20260916.1`

### references/pages

#### Wrangler Pages

`wrangler pages` สำหรับ Cloudflare Pages (static sites + Functions)

##### Subcommands

###### `wrangler pages dev`

Local dev server สำหรับ Pages

```bash
npx wrangler pages dev [DIRECTORY]
npx wrangler pages dev ./dist
npx wrangler pages dev --port 3000 --ip 127.0.0.1 ./dist
npx wrangler pages dev ./dist --kv=MY_KV --d1=MY_DB
npx wrangler pages dev ./dist --live-reload
npx wrangler pages dev --local-protocol=https ./dist
```

| Flag | Description |
|---|---|
| `--port` | Port (default: 8788) |
| `--ip` | IP address (default: `0.0.0.0`) |
| `--binding` / `-b` | Bind KEY=VALUE |
| `--kv` / `-k` | KV namespace binding |
| `--d1` | D1 database binding |
| `--r2` | R2 bucket binding |
| `--do` / `-o` | Durable Object binding |
| `--live-reload` | Auto reload HTML |
| `--local-protocol` | `http` หรือ `https` |
| `--persist-to` | Persistence directory |

###### `wrangler pages deploy`

Deploy static assets

```bash
npx wrangler pages deploy [DIRECTORY]
npx wrangler pages deploy ./dist
npx wrangler pages deploy ./dist --branch=feature/new
npx wrangler pages deploy ./dist --project-name=my-site
npx wrangler pages deploy ./dist --commit-hash=abc123 --commit-message="Add feature"
```

| Flag | Description |
|---|---|
| `--project-name` | ชื่อ Pages project |
| `--branch` | Branch (infer จาก git ได้) |
| `--commit-hash` | SHA สำหรับ deployment |
| `--commit-message` | Commit message |
| `--skip-caching` | Skip asset caching |
| `--no-bundle` | ไม่ bundle `_worker.js` |

###### `wrangler pages project`

| Command | Description |
|---|---|
| `wrangler pages project create [NAME]` | Create project |
| `wrangler pages project list` | List projects |
| `wrangler pages project delete [NAME]` | Delete project |

```bash
npx wrangler pages project create my-site --production-branch main
npx wrangler pages project list --json
npx wrangler pages project delete my-site --yes
```

###### `wrangler pages deployment`

| Command | Description |
|---|---|
| `wrangler pages deployment list` | List deployments |
| `wrangler pages deployment tail [ID]` | Stream logs |
| `wrangler pages deployment delete [ID]` | Delete deployment |

```bash
npx wrangler pages deployment list --environment=production
npx wrangler pages deployment tail --environment=preview
npx wrangler pages deployment tail --format=json
npx wrangler pages deployment delete <ID> --force
```

###### `wrangler pages secret`

| Command | Description |
|---|---|
| `wrangler pages secret put KEY` | Set secret |
| `wrangler pages secret bulk [FILE]` | Bulk upload (JSON หรือ .env) |
| `wrangler pages secret list` | List secrets |
| `wrangler pages secret delete KEY` | Delete secret |

```bash
npx wrangler pages secret put API_KEY --project-name=my-app
npx wrangler pages secret bulk ./secrets.json --env=preview
```

###### `wrangler pages functions build`

Compile Pages Functions เป็น single Worker

```bash
npx wrangler pages functions build [DIRECTORY]
npx wrangler pages functions build --minify --sourcemap
npx wrangler pages functions build --watch
```

###### `wrangler pages download config`

Download dashboard config เป็น wrangler file

```bash
npx wrangler pages download config my-site
npx wrangler pages download config my-site --force
```

##### Configuration

Required fields สำหรับ Pages:

```jsonc
{
  "name": "my-pages-app",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2026-08-24"
}
```

| Key | Required | Description |
|---|---|---|
| `name` | Yes | ชื่อ project |
| `pages_build_output_dir` | Yes | Build output directory |
| `compatibility_date` | Recommended | Workers runtime version |
| `compatibility_flags` | Optional | Feature flags |

###### Environments

Pages รองรับแค่ `production` และ `preview`:

```jsonc
{
  "env": {
    "preview": {
      "vars": { "API_URL": "https://preview-api.example.com" }
    }
  }
}
```

Bindings ไม่ inherit ต้องประกาศใหม่ในแต่ละ env

##### Pages vs Workers

| Aspect | Pages | Workers |
|---|---|---|
| Command | `pages deploy` | `deploy` |
| Deploys | Static assets + functions | Worker script |
| Config key | `pages_build_output_dir` | `main` |
| Environments | `production`, `preview` | custom |
| Project flag | `--project-name` | `--name` |
| Secret commands | `pages secret` | `secret` |

##### Source

- [Pages Configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [wrangler pages](https://developers.cloudflare.com/workers/wrangler/commands/pages/)

### references/routes

#### Follow Service Cloudflare Route Map

- Website: <https://developers.cloudflare.com/workers/wrangler>
- Documentation: <https://developers.cloudflare.com/workers/get-started/guide/>
- Total routes discovered: 5000

##### Top routes by section

###### /
- /

###### 1.1.1.1
- /1.1.1.1
- /1.1.1.1/additional-options
- /1.1.1.1/additional-options/dns-in-google-sheets
- ... and 37 more

###### agent-lee
- /agent-lee

###### agent-memory
- /agent-memory
- /agent-memory/api
- /agent-memory/api/http-api
- ... and 8 more

###### agent-setup
- /agent-setup
- /agent-setup/bionic
- /agent-setup/claude-code
- ... and 7 more

###### agents
- /agents
- /agents/communication-channels
- /agents/communication-channels/chat
- ... and 122 more

###### ai
- /ai
- /ai/models
- /ai/models/%40cf/ai4bharat/indictrans2-en-indic-1b
- ... and 235 more

###### ai-crawl-control
- /ai-crawl-control
- /ai-crawl-control/changelog
- /ai-crawl-control/configuration
- ... and 31 more

###### ai-gateway
- /ai-gateway
- /ai-gateway/changelog
- /ai-gateway/configuration
- ... and 91 more

###### ai-search
- /ai-search
- /ai-search/agent-sdks
- /ai-search/agent-sdks/agents-sdk
- ... and 82 more

###### analytics
- /analytics
- /analytics/account-and-zone-analytics
- /analytics/account-and-zone-analytics/account-analytics
- ... and 101 more

###### api-shield
- /api-shield
- /api-shield/api-gateway
- /api-shield/changelog
- ... and 34 more

###### argo-smart-routing
- /argo-smart-routing
- /argo-smart-routing/analytics
- /argo-smart-routing/argo-for-packets
- ... and 1 more

###### artifacts
- /artifacts
- /artifacts/api
- /artifacts/api/errors
- ... and 29 more

###### automatic-platform-optimization
- /automatic-platform-optimization
- /automatic-platform-optimization/about
- /automatic-platform-optimization/about/plugin-compatibility
- ... and 13 more

###### billing
- /billing
- /billing/get-started
- /billing/get-started/create-billing-profile
- ... and 30 more

###### bots
- /bots
- /bots/account-abuse-protection
- /bots/additional-configurations
- ... and 47 more

###### browser-run
- /browser-run
- /browser-run/cdp
- /browser-run/cdp/mcp-clients
- ... and 46 more

###### byoip
- /byoip
- /byoip/address-maps
- /byoip/address-maps/setup
- ... and 18 more

###### cache
- /cache
- /cache/advanced-configuration
- /cache/advanced-configuration/cache-reserve
- ... and 84 more

### references/tail-and-logs

#### Wrangler Tail And Logs

`wrangler tail` สำหรับ stream live logs จาก deployed Workers

##### Basic Usage

```bash
npx wrangler tail [WORKER]
```

ถ้า run จาก project directory ที่มี `wrangler.jsonc` จะ infer worker name อัตโนมัติ

##### Options

###### Output Format

| Flag | Values | Description |
|---|---|---|
| `--format` | `json` \| `pretty` | Default: `pretty` ใน TTY, `json` นอก TTY |

###### Filtering

| Flag | Type | Description |
|---|---|---|
| `--status` | array | `ok`, `error`, `canceled` (ระบุได้หลายครั้ง) |
| `--method` | array | HTTP method (GET, POST, etc.) |
| `--header` | string | `Header-Key` หรือ `Header-Key:value` |
| `--ip` | array | Client IP (ใช้ `"self"` สำหรับ IP ตัวเอง) |
| `--search` | string | ค้น text ใน console.log messages |
| `--sampling-rate` | number | 0-1 (เช่น 0.1 = 10%) |
| `--version-id` | string | Filter by Worker version ID |

##### Output Structure

แต่ละ log event มี fields:

| Field | Description |
|---|---|
| `outcome` | `ok`, `exception`, `exceededCpu`, `canceled` |
| `scriptName` | ชื่อ Worker |
| `eventTimestamp` | Unix timestamp (ms) |
| `logs` | Array ของ console entries (`message`, `level`, `timestamp`) |
| `exceptions` | Array ของ exceptions (`name`, `message`, `stack`) |
| `event` | Triggering event (request, scheduled, alarm, etc.) |

##### Common Examples

```bash
#### Stream production logs
npx wrangler tail --env production

#### Errors only
npx wrangler tail --status error

#### Filter by IP (debug user issues)
npx wrangler tail --ip 203.0.113.42
npx wrangler tail --ip self --status error

#### Sample 10% (high-traffic Workers)
npx wrangler tail --sampling-rate 0.1

#### Filter by method + search
npx wrangler tail --method POST --search "TypeError"

#### Filter by header
npx wrangler tail --header "X-Debug-Id:7f3a"

#### JSON output + jq
npx wrangler tail --format=json | jq .event.request.url

#### Compact triage for failed requests
npx wrangler tail --status error --format json | jq -c '{
  t: (.eventTimestamp / 1000 | todate),
  outcome,
  url: .event.request.url,
  err: (.exceptions[0].message // "none")
}'
```

##### Observability (Persistent Logs)

เปิดใน `wrangler.jsonc` เพื่อเก็บ logs ถาวร:

```jsonc
{
  "observability": {
    "enabled": true,
    "logs": {
      "enabled": true,
      "head_sampling_rate": 1
    }
  }
}
```

##### Limitations

- High-traffic Workers เข้าสู่ sampling mode อาจ drop messages
- สูงสุด 10 clients ดู logs พร้อมกัน
- Real-time logs ไม่ persist ถ้าไม่เปิด observability
- WebSocket handlers: logs แสดงหลัง connection close เท่านั้น
- ใช้เวลาถึง 60 วินาที หลังเพิ่ม filter เพื่อออกจาก sampling mode

##### Debug Environment Variables

| Variable | Description |
|---|---|
| `WRANGLER_LOG=debug` | เปิด debug logging |
| `WRANGLER_LOG_PATH=./logs/` | เขียน logs ไปยัง file/directory |
| `WRANGLER_LOG_SANITIZE=false` | แสดง data ที่ถูก sanitize |

##### Source

- [wrangler tail](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)

### references/triggers-and-cron

#### Wrangler Triggers And Cron

Cron Triggers สำหรับ run Worker ตาม schedule

##### Overview

- Cron Triggers run ตาม UTC time
- ใช้ underutilized machines เพื่อ efficiency
- Changes ใช้เวลาถึง 15 นาที propagate
- ถ้าใช้ Wrangler ควรจัดการ triggers ผ่าน config เท่านั้น

##### `wrangler triggers deploy`

Apply trigger changes (สำหรับ versions workflow)

```bash
npx wrangler triggers deploy --name my-worker --triggers "*/5 * * * *"
npx wrangler triggers deploy --name my-worker --triggers "*/5 * * * *" "0 0 * * *"
npx wrangler triggers deploy --name my-worker --triggers "0 * * * *" --dry-run
```

| Flag | Alias | Description |
|---|---|---|
| `--name` | - | Worker name (required) |
| `--triggers` | `--schedule`, `--schedules` | Cron schedules |
| `--routes` | `--route` | Routes to upload |
| `--dry-run` | - | ไม่ deploy จริง |

##### Configuration

###### wrangler.jsonc

```jsonc
{
  "triggers": {
    "crons": [
      "*/3 * * * *",
      "0 15 1 * *",
      "59 23 LW * *"
    ]
  }
}
```

###### Per-Environment

```jsonc
{
  "env": {
    "dev": {
      "triggers": {
        "crons": ["0 * * * *"]
      }
    }
  }
}
```

###### Behavior

- Deploy แล้ว crons ใหม่ replace ของเดิมทั้งหมด
- `crons: []` = ลบ triggers ทั้งหมด
- `crons` undefined = ไม่เปลี่ยน triggers ปัจจุบัน
- Comment out ไม่ได้หมายถึง disable ต้องใช้ empty array

##### Cron Syntax

5 fields: minute, hour, day-of-month, month, weekday

| Field | Values | Special chars |
|---|---|---|
| Minute | 0-59 | `*` `,` `-` `/` |
| Hours | 0-23 | `*` `,` `-` `/` |
| Day of Month | 1-31 | `*` `,` `-` `/` `L` `W` |
| Month | 1-12 หรือ JAN-DEC | `*` `,` `-` `/` |
| Weekday | 1-7 หรือ SUN-SAT | `*` `,` `-` `/` `L` `#` |

สำคัญ: weekday 1=Sunday ถึง 7=Saturday (ต่างจาก cron อื่นที่ 0=Sunday)

| Special | Description |
|---|---|
| `L` | Last (เช่น last day of month) |
| `W` | Nearest weekday |
| `#` | Nth weekday (เช่น 3#2 = second Tuesday) |

##### Common Expressions

| Expression | Description |
|---|---|
| `* * * * *` | ทุกนาที |
| `*/5 * * * *` | ทุก 5 นาที |
| `*/30 * * * *` | ทุก 30 นาที |
| `0 * * * *` | ทุกชั่วโมงตรง |
| `0 2 * * *` | ทุกวัน 02:00 UTC |
| `0 0 * * 1` | ทุกจันทร์ 00:00 UTC |
| `0 17 * * sun` | ทุกอาทิตย์ 17:00 UTC |
| `10 7 * * mon-fri` | 07:10 UTC วันธรรมดา |
| `0 15 1 * *` | วันแรกของเดือน 15:00 UTC |
| `0 18 * * 6L` | ศุกร์สุดท้ายของเดือน 18:00 UTC |
| `59 23 LW * *` | วันธรรมดาสุดท้ายของเดือน 23:59 UTC |

##### Scheduled Handler

```typescript
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    console.log("cron processed");
  },
};
```

###### Multiple Crons

```typescript
export default {
  async scheduled(controller, env, ctx) {
    switch (controller.cron) {
      case "*/5 * * * *":
        await refreshCache(env);
        break;
      case "0 0 * * *":
        await dailyReport(env);
        break;
    }
  },
};
```

###### ScheduledController Properties

| Property | Description |
|---|---|
| `controller.cron` | Cron expression ที่ trigger |
| `controller.type` | คืนค่า `"scheduled"` |
| `controller.scheduledTime` | เวลาที่ schedule (ms since epoch) |

##### Testing Locally

```bash
npx wrangler dev --test-scheduled
```

เปิด test endpoint:
- JS/TS: `http://localhost:8787/__scheduled`
- Python: `http://localhost:8787/cdn-cgi/handler/scheduled`

```bash
#### Trigger with specific cron
curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*"

#### Override scheduled time
curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*&time=1234567890000"
```

##### Limits

| Plan | Crons per account |
|---|---|
| Free | 5 |
| Paid | 250 |

##### Source

- [wrangler triggers](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

### references/troubleshooting

#### Wrangler Troubleshooting

ปัญหาที่พบบ่อยและวิธีแก้

##### Authentication Errors

###### `wrangler login` ไม่ผ่าน

Error: `localhost refused to connect` หรือ `ERR_CONNECTION_REFUSED`

สาเหตุ: IPv6 disabled, VPN, WSL networking, port 8976 ไม่เปิด

แก้:
```bash
#### ใช้ device flow (Wrangler 4.119.0+)
wrangler login --device

#### หรือเปิด URL เอง
wrangler login --browser=false
```

###### API Token ไม่ทำงาน

Error: `Failed to fetch auth token: 400 Bad Request`

แก้:
- ตรวจ token ยัง active ใน dashboard
- ตรวจ permissions: Workers Scripts Edit, KV Edit, D1 Edit, Tail Read
- ถ้าเปลี่ยนเป็น OAuth: `unset CLOUDFLARE_API_TOKEN && wrangler logout && wrangler login`

###### Error 9106 (Bad Credentials)

```bash
wrangler logout && wrangler login
```

##### Deploy Failures

###### Worker Name Mismatch

Error: name ใน config ไม่ตรงกับ dashboard

แก้: อัปเดต `name` ใน `wrangler.jsonc` ให้ตรง

###### Missing Configuration File

Error: `Missing entry-point`

แก้: เพิ่ม `wrangler.jsonc` หรือ `wrangler.toml` ใน root พร้อม `main` field

###### Incorrect Account ID

Error: `Could not route to /client/v4/accounts/... [code: 7003]`

แก้: ลบ `account_id` ใน config หรือใส่ให้ถูกต้อง

###### Error 10004 (Malformed Parameter)

แก้: ลบและสร้าง Worker ใหม่ หรือ retry

##### Configuration Errors

###### Invalid Route

Error: `Expected "route" to be either a string, or an object...`

แก้:
```toml
route = "https://example.com/*"
#### หรือ
[route]
pattern = "example.com/*"
zone_id = "your-zone-id"
```

###### Bindings ไม่ inherit

Bindings (`vars`, `kv_namespaces`, etc.) ไม่ inherit ระหว่าง environments ต้องประกาศใหม่ในแต่ละ env

##### Version Conflicts

###### Node.js Version

- ต้องการ >= 22.0.0 (Wrangler 4.87.0+)
- ใช้ nvm/mise/Volta สำหรับจัดการ version

```bash
nvm install --lts
nvm use --lts
```

###### Compatibility Date Warning

Warning: requested date ใหม่กว่าที่ workerd รองรับ

แก้: `npm update wrangler` (ห้าม ignore warning)

###### nodejs_compat

ใช้ `nodejs_compat` flag แทน `--node-compat` ที่ deprecated:

```jsonc
{
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"]
}
```

##### Debug Mode

```bash
WRANGLER_LOG=debug npx wrangler deploy
WRANGLER_LOG_PATH=./logs/ npx wrangler deploy
WRANGLER_LOG_SANITIZE=false npx wrangler deploy
npx wrangler dev --log-level debug
```

##### Network And Proxy Issues

###### Proxy Errors

Error: `UND_ERR_SOCKET` หรือ `TypeError: fetch failed`

แก้:
```bash
unset http_proxy
unset HTTPS_PROXY
wrangler dev
```

###### IPv6/IPv4

Error: `Could not proxy request: TypeError: fetch failed`

แก้: ปิด IPv6 ชั่วคราว หรือตั้งให้ OS prefer IPv4

###### WSL

```bash
export http_proxy=""
export https_proxy=""
```

##### Permission Errors

###### API Token Permissions

ต้องมี:
- Account > Workers Scripts > Edit
- Account > Workers KV Storage > Edit
- Account > D1 > Edit
- Account > Workers Tail > Read
- Zone > DNS > Edit (ถ้าใช้ routes)
- Zone > Zone > Read (ถ้าใช้ routes)

###### Multiple Accounts

Error: `More than one account available...`

แก้: ตั้ง `CLOUDFLARE_ACCOUNT_ID` env var หรือใส่ `account_id` ใน config

##### Durable Objects Errors

###### No Event Handlers

Error: `No event handlers were registered`

แก้: ตรวจ `dir` และ `main` ใน config, ใช้ `.mjs` ถ้า ES modules

###### Durable Object Overloaded

Error: `Durable Object is overloaded`

แก้:
- Horizontal scaling (หลาย instances)
- ห้าม retry ถ้า `.overloaded === true`

##### Common Error Codes

| Code | Meaning | Solution |
|---|---|---|
| 10002 | Internal server error | Retry, check debug logs |
| 10004 | Malformed parameter | ลบและสร้าง Worker ใหม่ |
| 10006 | Could not parse code | ตรวจ syntax |
| 10021 | Validation error | ตรวจ config |
| 10027 | Worker exceeded size | ลด bundle size |
| 10037 | Exceeded Workers limit | ลบ Workers ที่ไม่ใช้ |
| 7003 | Invalid account_id | ตรวจ account_id |
| 9106 | Auth failed | ตรวจ token/credentials |

##### Getting Help

- Community: https://community.cloudflare.com/
- Discord: Cloudflare Developers Discord
- GitHub Issues: https://github.com/cloudflare/workers-sdk/issues
- เวลาแจ้ง issue แนบ: `wrangler --version`, `node --version`, OS, debug logs

##### Source

- [Wrangler Troubleshooting](https://developers.cloudflare.com/workers/wrangler/)
- [System Requirements](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### references/versions-and-rollback

#### Wrangler Versions And Rollback

`wrangler versions` สำหรับ separate upload จาก deploy รองรับ gradual rollouts

##### Key Concepts

- Version: snapshot ของ Worker ณ เวลาหนึ่ง (code, assets, bindings, compat settings)
- Deployment: version ที่กำลัง serve traffic (100% หรือ split)
- `wrangler deploy` = upload + deploy 100% ในขั้นเดียว
- `wrangler versions` = แยก upload และ deploy เพื่อควบคุมมากขึ้น

##### Commands

###### `wrangler versions upload`

Upload version ใหม่โดยไม่ deploy ทันที

```bash
npx wrangler versions upload [PATH]
npx wrangler versions upload --tag "v1.2.3" --message "Feature release"
npx wrangler versions upload --dry-run
```

| Flag | Description |
|---|---|
| `--tag` | Tag สำหรับ version |
| `--message` | คำอธิบาย version |
| `--dry-run` | Validate โดยไม่ upload |
| `--minify` | Minify Worker |
| `--upload-source-maps` | Upload source maps |

###### `wrangler versions deploy`

Deploy version ที่ upload แล้ว รองรับ traffic splitting

```bash
#### Interactive
npx wrangler versions deploy

#### Deploy 100%
npx wrangler versions deploy --version-id <ID>

#### Traffic split (shorthand @)
npx wrangler versions deploy <v1>@80 <v2>@20

#### By tag
npx wrangler versions deploy --version-tag v1.0.0@100

#### Non-interactive
npx wrangler versions deploy <ID>@100 -y
```

| Flag | Description |
|---|---|
| `--version-id` | Version ID(s) to deploy |
| `--percentage` | Traffic percentage (0-100) |
| `--version-tag` | Tag(s) รองรับ `TAG@PERCENTAGE` |
| `--message` | Description ของ deployment |
| `--yes` / `-y` | ไม่ถาม confirm |
| `--dry-run` | ไม่ deploy จริง |

###### `wrangler versions list`

```bash
npx wrangler versions list
npx wrangler versions list --json
```

###### `wrangler versions view`

```bash
npx wrangler versions view <VERSION-ID>
npx wrangler versions view <VERSION-ID> --json
```

###### `wrangler versions secret`

| Command | Description |
|---|---|
| `wrangler versions secret put KEY` | Add secret (สร้าง version ใหม่ ไม่ deploy) |
| `wrangler versions secret bulk [FILE]` | Bulk add secrets |
| `wrangler versions secret list` | List secrets ของ deployed versions |
| `wrangler versions secret delete KEY` | Delete secret (สร้าง version ใหม่) |

###### `wrangler rollback`

Rollback ไป version ก่อนหน้า ทันที 100% traffic

```bash
#### Auto rollback to latest stable
npx wrangler rollback

#### Rollback to specific version
npx wrangler rollback <VERSION-ID>

#### With message
npx wrangler rollback --message "Rolling back due to errors"

#### Non-interactive
npx wrangler rollback <VERSION-ID> -y
```

###### `wrangler deployments`

```bash
npx wrangler deployments list
npx wrangler deployments status
```

##### Gradual Deployment Workflow

```bash
#### 1. Upload new version
npx wrangler versions upload --tag "v2.0.0" --message "New feature"

#### 2. Canary: 10% new, 90% old
npx wrangler versions deploy --version-tag v2.0.0@10 --version-tag v1.0.0@90

#### 3. Monitor with tail
npx wrangler tail --status error --version-id <v2-id>

#### 4. Increase to 50%
npx wrangler versions deploy --version-tag v2.0.0@50 --version-tag v1.0.0@50

#### 5. Complete 100%
npx wrangler versions deploy --version-tag v2.0.0@100

#### Emergency rollback
npx wrangler rollback --message "Revert breaking change"
```

##### deploy vs versions deploy

| Aspect | `wrangler deploy` | `wrangler versions deploy` |
|---|---|---|
| Version creation | สร้างอัตโนมัติ | ต้อง upload ก่อน |
| Traffic | 100% ทันที | รองรับ split |
| First deployment | ใช้ได้ | ใช้ไม่ได้ (ต้องใช้ deploy ครั้งแรก) |
| Durable Objects | รองรับ lifecycle changes | ไม่รองรับ |
| Secrets | Deploy ทันที | ใช้ `versions secret` แยก |

##### Limitations

- Deploy ได้แค่ 100 versions ล่าสุด
- Traffic split สูงสุด 2 versions
- ต้องใช้ `wrangler deploy` ครั้งแรก
- ต้องใช้ ES modules format
- Durable Object lifecycle changes ต้องใช้ `wrangler deploy`

##### Source

- [wrangler versions](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Versions and Rollbacks](https://developers.cloudflare.com/workers/configuration/)
- [Gradual Deployments](https://developers.cloudflare.com/workers/versions-and-deployments/gradual-deployments/)

### references/website

#### Service Cloudflare Official Resources

- [Website](https://developers.cloudflare.com/workers/wrangler)
- [Documentation](https://developers.cloudflare.com/workers/get-started/guide/)
- [Repository](https://github.com/cloudflare/workers-sdk)
- [Package Registry](https://www.npmjs.com/package/wrangler)
- About: Wrangler is the CLI for the Cloudflare Developer Platform. Use it to build, test, and deploy Workers projects.

### references/workers-overview

#### Cloudflare Workers Reference

##### Overview

Cloudflare Workers is a serverless execution environment that runs on Cloudflare's global edge network. Workers are written in JavaScript, TypeScript, Rust, C, or other languages that compile to WebAssembly, and are deployed via Wrangler CLI.

##### Version Info

- Wrangler (CLI): `4.125.0` (latest stable)
- Node.js requirement: `>=22.0.0`
- Peer dependency: `@cloudflare/workers-types` (optional, for TypeScript support)
- License: MIT OR Apache-2.0

##### Install

Install Wrangler locally in your project (recommended by Cloudflare):

```sh
bun add -D wrangler@latest
#### or
yarn add -D wrangler@latest
#### or
pnpm add -D wrangler@latest
#### or
bun add -d wrangler@latest
```

Install TypeScript types:

```sh
bun add -D @cloudflare/workers-types
```

Verify installation:

```sh
npx wrangler --version
```

##### Create A New Worker Project

Use C3 (create-cloudflare) to scaffold a new project:

```sh
npm create cloudflare@latest -- my-first-worker
#### or
yarn create cloudflare my-first-worker
#### or
pnpm create cloudflare@latest my-first-worker
```

C3 generates:
- `wrangler.jsonc` — Wrangler configuration file
- `src/index.js` — Minimal Hello World Worker in ES module syntax
- `package.json` — Node dependencies configuration
- `package-lock.json` — Lock file

##### Configuration (`wrangler.jsonc`)

Cloudflare recommends `wrangler.jsonc` for new projects. Some newer features are only available with JSON config.

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.js",
  "compatibility_date": "2026-08-24",
  "compatibility_flags": ["nodejs_compat"],
  "workers_dev": false,
  "route": {
    "pattern": "example.org/*",
    "zone_name": "example.org"
  },
  "kv_namespaces": [
    {
      "binding": "MY_NAMESPACE",
      "id": "<KV_ID>"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-db",
      "database_id": "<D1_ID>"
    }
  ],
  "r2_buckets": [
    {
      "binding": "STORAGE",
      "bucket_name": "my-bucket"
    }
  ],
  "observability": {
    "enabled": true
  },
  "env": {
    "staging": {
      "name": "my-worker-staging",
      "route": {
        "pattern": "staging.example.org/*",
        "zone_name": "example.org"
      }
    }
  }
}
```

###### Required Keys

- `name` — Worker name (alphanumeric and dashes only, max 255 chars)
- `main` — Path to entrypoint (e.g. `./src/index.ts`)
- `compatibility_date` — Date in `yyyy-mm-dd` format for runtime version

###### Automatic Resource Provisioning (Beta)

Add bindings without IDs — Wrangler creates resources automatically on deploy:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "MY_KV_NAMESPACE"
    }
  ]
}
```

##### Worker Code Example

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

The `fetch` handler receives three parameters: `request`, `env`, and `context`. The runtime expects a `Response` object or a Promise resolving to one.

##### CLI Commands

| Command | Description |
|---|---|
| `npx wrangler dev` | Start local dev server on `http://localhost:8787` |
| `npx wrangler dev --port 8787` | Start dev server on custom port |
| `npx wrangler dev --local` | Local-only mode |
| `npx wrangler dev --remote` | Access remote resources |
| `npx wrangler deploy` | Deploy to production |
| `npx wrangler deploy --env staging` | Deploy to specific environment |
| `npx wrangler deploy --dry-run` | Preview deployment without deploying |
| `npx wrangler types` | Generate `worker-configuration.d.ts` |
| `npx wrangler secret put KEY_NAME` | Set a secret |
| `npx wrangler secret list` | List secrets |
| `npx wrangler secret delete KEY_NAME` | Delete a secret |
| `npx wrangler d1 create my-db` | Create D1 database |
| `npx wrangler d1 execute my-db --command "SELECT 1"` | Execute SQL on D1 |
| `npx wrangler kv namespace create CACHE` | Create KV namespace |
| `npx wrangler r2 bucket create my-bucket` | Create R2 bucket |
| `npx wrangler tail` | Stream live logs from deployed Worker |
| `npx wrangler login` | Authenticate with Cloudflare account |
| `npx wrangler whoami` | Check authentication status |

##### CI/CD With GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bunx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Use `CLOUDFLARE_API_TOKEN` environment variable for automated deployments. Do not use `wrangler login` in CI.

##### Automatic Framework Detection

Wrangler 4.68+ can auto-detect frameworks and generate configuration:

```sh
npx wrangler deploy
```

When run without a config file, Wrangler will:
1. Detect your framework from `package.json`
2. Prompt for confirmation
3. Install required Cloudflare adapters
4. Generate `wrangler.jsonc` with appropriate settings
5. Add scripts to `package.json` (`deploy`, `preview`, `cf-typegen`)
6. Configure `.gitignore`

##### Source

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler Install/Update](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Get Started Guide](https://developers.cloudflare.com/workers/get-started/guide/)
- [Automatic Configuration](https://developers.cloudflare.com/workers/framework-guides/automatic-configuration/)

## Expected Outcome

- Wrangler CLI ติดตั้งและกำหนดค่าอย่างถูกต้อง
- Workers หรือ Pages deploy ได้อย่างราบรื่น พร้อม gradual rollouts และ rollback
- Bindings และ secrets จัดการอย่างปลอดภัย
- D1 migrations ทำงานได้ทั้ง local และ remote
- Nitro preset กำหนดค่าสำหรับ Nuxt ได้
- CI/CD integration ทำงานได้อัตโนมัติ
- Observability เปิดใช้งาน พร้อม tail debugging
- แก้ปัญหาได้จาก troubleshooting guide
