---
name: follow-service-vercel
description: Deploy applications บน Vercel พร้อม serverless และ edge functions
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deploy-to-vercel
  - watch-browser
  - resolve-errors
  - loop-until-complete

---

## Goal

Deploy applications บน Vercel platform พร้อม auto-build, preview deployments, serverless functions และ edge functions

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `open-web-for-config-secret`, `follow-service-vercel`, `deploy-to-vercel`

ครอบคลุมการติดตั้ง Vercel CLI, link project, configure, build, deploy, environment variables, serverless/edge functions และ CI/CD

## Execute

### Subskills

| Topic  | Subskill |
|--------|----------|
| Setup  | `subskills/setup-vercel/SKILL.md` — Vercel CLI, login, link project |
| Config | `subskills/config-vercel/SKILL.md` — env vars, `vercel.json` config |
| Verify | `subskills/verify-connection/SKILL.md` — CLI auth, project linked, env vars ครบ |

อ่าน `subskills/<name>/SKILL.md` ตาม topic แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 1. Install Vercel CLI

> Goal: ติดตั้งและ authenticate Vercel CLI

Latest: `vercel@60.1.3` CLI, `@vercel/node` builder (verified 2026-09-26)

1. รัน `bun add -D vercel`
2. หรือใช้ `bunx vercel` โดยไม่ต้องติดตั้ง
3. รัน `bunx vercel login` เพื่อ authenticate

### 2. Link Project

> Goal: เชื่อมต่อ project กับ Vercel

1. รัน `bunx vercel link` ใน project directory
2. ยืนยัน project settings
3. หรือใช้ `VERCEL_ORG_ID` และ `VERCEL_PROJECT_ID` สำหรับ CI/CD

### 3. Configure vercel.json

> Goal: กำหนด configuration สำหรับ deployment

`vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/src/index.ts" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. Framework Presets

> Goal: Vercel รองรับ auto-detection สำหรับ frameworks

- Next.js: ใช้ `next` preset อัตโนมัติ
- Nuxt: ใช้ `nuxt` preset พร้อม SSR
- SvelteKit: ใช้ `sveltekit` preset
- Remix: ใช้ `remix` preset
- Astro: ใช้ `astro` preset
- Vite: ใช้ `vite` preset สำหรับ static build

### 5. Build And Deploy

> Goal: Build และ deploy application

1. รัน `bun run build` หรือ `nitro build` สำหรับ Nitro projects
2. ตรวจสอบว่า build สำเร็จและ output พร้อม
3. รัน `bunx vercel deploy` สำหรับ preview deployment
4. รัน `bunx vercel deploy --prod` สำหรับ production
5. สำหรับ Nitro: ตั้ง preset `vercel` ใน nitro config แล้วรัน `nitro build` จากนั้น `bunx vercel deploy --prebuilt`

### 6. Environment Variables

> Goal: ตั้งค่า environment variables

1. รัน `bunx vercel env add KEY_NAME`
2. หรือใช้ dashboard สำหรับ manage variables
3. ใช้ `vercel env pull .env.local` เพื่อ sync ไปยัง local
4. กำหนด `NODE_ENV`, `API_URL` และ secrets

### 7. Serverless Functions

> Goal: สร้าง serverless functions ใน `api/` directory

`api/hello.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Hello from Vercel' })
}
```

### 8. Edge Functions

> Goal: สร้าง edge functions สำหรับ edge deployment

`api/edge.ts`:
```typescript
export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  return new Response('Hello from Edge Function')
}
```

### 9. Watch Deployment

> Goal: ตรวจสอบ deployment ด้วย browser preview

1. ทำ `/watch-browser-and-fix` ด้วย deployment URL
2. ตรวจสอบว่า page load สำเร็จ
3. ตรวจสอบ console errors และ network errors
4. ทำ `/resolve-errors` เมื่อพบปัญหา
5. ทำ `/loop-until-complete` จนกว่า deployment live สำเร็จ

### 10. CI/CD Deployment

> Goal: ตั้งค่า automated deployment

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
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
      - run: bunx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Rules

### 1. Framework Detection

- Vercel จะ auto-detect framework จาก `package.json`
- กำหนด `buildCommand` ใน `package.json` scripts หรือ `vercel.json`
- ระบุ `outputDirectory`: `dist`, `build`, หรือ `.next` ตาม framework
- ใช้ `bun install` สำหรับ Bun projects

### 2. Build Process

- ใช้ `nitro build` ก่อน deploy เสมอ สำหรับ Nitro projects
- ตรวจสอบ build output ว่าสำเร็จ
- ตรวจสอบ bundle size

### 3. Environment Variables

- ใช้ `vercel env` CLI หรือ dashboard
- ใช้ `/follow-secret-manager` สำหรับจัดการ `VERCEL_TOKEN` และ secrets ก่อน sync ไป Vercel หรือ CI/CD
- ใช้ `vercel env pull` สำหรับ sync ไป local
- ไม่ hardcode secrets

### 4. Functions

- Serverless functions สร้างใน `api/` directory
- Edge functions ใช้ `runtime: 'edge'`
- กำหนด `regions` ใน `vercel.json` ถ้าต้องการ

### 5. Deployment

- ทุก PR จะสร้าง preview deployment อัตโนมัติ
- ใช้ `bunx vercel deploy` สำหรับ preview
- ใช้ `bunx vercel deploy --prod` สำหรับ production
- ตั้งค่า protection rules สำหรับ production deployments
- ใช้ `/watch-browser-and-fix` สำหรับ monitoring
- ทำ `/loop-until-complete` จนกว่า deployment live

### 6. Advanced Configuration

- กำหนด `rewrites` ใน `vercel.json` สำหรับ URL routing
- กำหนด `headers` สำหรับ security และ caching
- ใช้ `crons` สำหรับ scheduled functions
- ใช้ `ignoreCommand` สำหรับ skip builds

## Merged Details

### config-vercel

##### Goal

ตั้งค่า/แก้ไข Vercel configuration — environment variables และ `vercel.json` (rewrites, headers, functions, crons) — โดยไม่ clobber settings เดิม

##### Scope

- ครอบคลุม `vercel.json`, `vercel env` และ project settings
- ถ้ายังไม่ได้ link project → ทำ `subskills/setup-vercel/SKILL.md` ก่อน
- deploy จริง → `/deploy-to-vercel`

##### Execute

###### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน `vercel.json`, `.vercel/project.json` และ env files ที่มีอยู่
2. รัน `bunx vercel pull` เพื่อ sync project settings ล่าสุดจาก dashboard
3. ทำ `/check-config-drift` หรือ `/report-config-files` ถ้าต้องรู้ drift

###### 2. Configure Environment Variables

> Goal: env vars ถูกต้องต่อ environment

1. เพิ่ม key ด้วย `bunx vercel env add KEY_NAME` — เลือก environment (production/preview/development)
2. sync ลง local ด้วย `bunx vercel env pull .env.local`
3. secrets → `/follow-secret-manager` ก่อน แล้วค่อย push ขึ้น Vercel — ห้ามใส่ใน `vercel.json`

###### 3. Configure vercel.json

> Goal: config file ถูกต้องตาม schema

1. แก้เฉพาะ keys ที่จำเป็นใน `vercel.json` — merge กับของเดิม ห้าม overwrite ทั้งไฟล์
2. keys ที่ใช้บ่อย: `rewrites`, `redirects`, `headers`, `functions`, `crons`, `regions`, `ignoreCommand`
3. ระบุ `buildCommand`/`outputDirectory` เฉพาะเมื่อ framework detection ไม่ตรง — ดู official docs https://vercel.com/docs/projects/project-configuration

###### 4. Verify

> Goal: config ใช้ได้จริงก่อน deploy

1. รัน `bunx vercel build` เพื่อตรวจว่า config build ได้ local
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff ด้วย `/report-before-after`

##### Rules

- ห้ามใส่ secrets ใน `vercel.json` หรือ commit `.env.local`
- แก้ config แบบ incremental — เปลี่ยนทีละ key แล้ว verify
- ทุก env var ที่เพิ่มต้องระบุ target environment ชัดเจน

##### Expected Outcome

- env vars sync ระหว่าง local กับ Vercel ถูกต้อง
- `vercel.json` ผ่าน schema และ `vercel build` สำเร็จ
- พร้อม deploy ด้วย `/deploy-to-vercel`

### setup-vercel

##### Goal

ติดตั้ง Vercel CLI, authenticate และ link project กับ Vercel — first-time setup ก่อน deploy

##### Scope

- ติดตั้ง `vercel` CLI, `vercel login`, `vercel link`
- สร้าง `.vercel/project.json` ที่มี `orgId`/`projectId`
- ถ้า link แล้ว → verify เท่านั้น; config env/vercel.json → `subskills/config-vercel/SKILL.md`; deploy → `/deploy-to-vercel`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ link

1. ตรวจ `package.json` ว่ามี `vercel` แล้วหรือยัง และดู `.vercel/project.json` ว่ามีอยู่หรือไม่
2. ถ้ามี `.vercel/project.json` แล้ว → skip ไปขั้น verify
3. เพิ่ม `.vercel` ใน `.gitignore` ถ้ายังไม่มี

###### 2. Install CLI

> Goal: มี Vercel CLI พร้อมใช้

1. รัน `bun add -D vercel` หรือใช้ `bunx vercel` โดยไม่ต้องติดตั้ง
2. ตรวจว่า CLI ทำงานด้วย `bunx vercel --version`

###### 3. Authenticate

> Goal: CLI login กับ Vercel account

1. รัน `bunx vercel login` แล้วให้ user ยืนยันผ่าน email/provider
2. ตรวจ auth ด้วย `bunx vercel whoami`
3. สำหรับ CI/CD → เก็บ `VERCEL_TOKEN` ผ่าน `/follow-secret-manager`

###### 4. Link Project

> Goal: project เชื่อมกับ Vercel project

1. รัน `bunx vercel link` ใน project root แล้วเลือก scope และ project (สร้างใหม่หรือ existing)
2. ตรวจ `.vercel/project.json` มี `orgId` และ `projectId`
3. สำหรับ CI → เก็บ `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` ผ่าน `/follow-secret-manager`

###### 5. Verify

> Goal: setup พร้อม deploy

1. รัน `bunx vercel pull` เพื่อ sync project settings/env ลง local
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
4. สำเร็จ → ทำ `/suggest-next-action`

##### Rules

- ห้าม commit `.vercel/` หรือ `VERCEL_TOKEN`
- ใช้ `bunx vercel` หรือ dev dependency — ห้ามพึ่ง global install ที่ไม่ pin
- ใช้ official docs เป็นแหล่งหลัก ถ้าไม่แน่ใจ → ดู https://vercel.com/docs

##### Expected Outcome

- Vercel CLI ติดตั้งและ authenticated
- project link แล้วพร้อม `.vercel/project.json`
- พร้อมไป `subskills/config-vercel/SKILL.md` หรือ `/deploy-to-vercel`

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Vercel เชื่อมต่อได้จริง — CLI authenticated, project linked, env vars sync ครบ

##### Scope

- ใช้เมื่อ `/follow-service-vercel` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ deploy หรือแก้ env

##### Execute

###### 1. Check CLI Auth

> Goal: vercel login และ scope ถูก

1. `vercel whoami` — ต้องคืน user/team
2. ตรวจ scope ตรงกับ project owner (personal vs team) — `vercel teams ls` ถ้าจำเป็น
3. auth fail → แนะนำ `subskills/setup-vercel/SKILL.md` — ไม่ login เอง

###### 2. Check Project Link

> Goal: local project link กับ Vercel project ถูกต้อง

1. ตรวจ `.vercel/project.json` — `projectId`/`orgId` มีและตรง project ที่คาด
2. `vercel project ls` หา project — flag ถ้า link ชี้ project ผิด
3. `vercel env ls` — env vars ที่ code ต้องการมีบน Vercel ครบ (เทียบ `.env.example`)

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `not-linked` / `env-missing`

##### Rules

- ใช้ ls/inspect commands เท่านั้น — ห้าม deploy/env add
- ไม่ print env var values — แสดงแค่ names ที่ขาด
- not-linked → รายงานให้รัน `vercel link` ผ่าน setup subskill

##### Expected Outcome

- Verdict พร้อม project/org + env coverage evidence

### workflows/deploy-to-vercel

#### Deploy to Vercel

Workflow for deploying projects to Vercel.

##### Steps

1. Install Vercel CLI
   ```bash
   bun i -g vercel
   ```

2. Login to Vercel
   ```bash
   vercel login
   ```

3. Initialize project
   ```bash
   vercel
   ```

4. Configure project settings
   - Set framework preset
   - Configure build settings
   - Set environment variables

5. Deploy
   ```bash
   vercel --prod
   ```

##### Example: Deploy Next.js

```bash
npx create-next-app@latest my-app
cd my-app
vercel
```

##### Example: Deploy Static Site

```bash
vercel --prod
```

##### Best Practices

- Use environment variables for secrets
- Enable preview deployments
- Configure custom domains
- Monitor analytics
- Set up automated deployments

### references/apis

#### Service Vercel API & Dependencies

The Vercel platform is managed via the REST API (`https://api.vercel.com`), the official TypeScript SDK `@vercel/sdk`, and product SDKs for storage and compute primitives.

##### Install

Programmatic platform control (REST API SDK):

```sh
bun add @vercel/sdk
#### or
npm install @vercel/sdk
```

Product SDKs (install what the app uses):

```sh
bun add @vercel/blob        # file/blob storage
bun add @vercel/kv          # Redis-compatible key-value (Upstash)
bun add @vercel/postgres    # serverless Postgres
bun add @vercel/functions   # runtime helpers (waitUntil, geo, ip)
bun add @vercel/edge-config # edge config reads
bun add @vercel/analytics @vercel/speed-insights  # observability
```

##### Version

- `@vercel/sdk`: 1.28.28
- `@vercel/blob`: 2.8.0 · `@vercel/kv`: 3.0.0 · `@vercel/postgres`: 0.10.0 · `@vercel/functions`: 3.9.5
- Vercel CLI (`vercel` package, see `follow-service-vercel-cli`): 59.11.7
- [Package Registry (@vercel/sdk)](https://www.npmjs.com/package/@vercel/sdk)
- [Repository (@vercel/sdk)](https://github.com/vercel/sdk)
- [Repository (platform/CLI)](https://github.com/vercel/vercel)

##### Dependencies

- `@vercel/sdk` is a generated, fully typed client for the Vercel REST API; authenticate with `bearerToken` (create at https://vercel.com/account/tokens).
- Product SDKs read env vars injected by Vercel (`BLOB_READ_WRITE_TOKEN`, `KV_REST_API_URL`/`KV_REST_API_TOKEN`, `POSTGRES_URL`, `EDGE_CONFIG`) — create resources via dashboard or `vercel link`/`vercel env`.
- For CI prefer `VERCEL_TOKEN` env var or `--token` flag rather than embedding tokens.

##### Common API / Commands

`@vercel/sdk` — platform management:

| commands | description | default | options |
|---|---|---|---|
| `new Vercel({ bearerToken })` | Create SDK client | `https://api.vercel.com` | `serverURL`, `httpClient` |
| `vercel.projects.getProjects()` | List projects | team of token | `teamId`, `slug`, `limit`, `search` |
| `vercel.projects.createProject({ requestBody })` | Create a project | — | `name`, `framework`, `gitRepository`, `environmentVariables` |
| `vercel.projects.updateProject({ idOrName, requestBody })` | Update project settings | — | `name`, `sandbox.region`, `failoverRegions`, etc. |
| `vercel.projects.deleteProject({ idOrName })` | Delete a project | — | `teamId` |
| `vercel.deployments.createDeployment({ requestBody })` | Create a deployment | — | `name`, `files`, `projectSettings`, `target` |
| `vercel.deployments.getDeployments()` | List deployments | — | `projectId`, `target`, `state`, `limit` |
| `vercel.deployments.getDeployment({ idOrUrl })` | Get one deployment | — | `teamId` |
| `vercel.deployments.cancelDeployment({ id })` | Cancel a running deployment | — | — |
| `vercel.domains.*` / `vercel.dns.*` | Manage domains and DNS records | — | `domain`, `teamId` |
| `vercel.aliases.*` | Assign aliases to deployments | — | — |
| `vercel.teams.*` / `vercel.user.*` | Team + account info | — | — |
| `vercel.artifacts.uploadArtifact(...)` | Remote cache artifacts (Turborepo) | — | — |
| `vercel.checks.*` / `vercel.checksV2.*` | Deployment checks (integrations) | — | — |
| `vercel.accessGroups.*` / `vercel.authentication.*` / `vercel.security.*` | Access + auth management | — | — |
| `vercel.webhooks.*` / `vercel.logDrains.*` / `vercel.integrations.*` | Webhooks, log drains, marketplace | — | — |
| standalone `funcs/*` imports | Tree-shakeable method calls, return `Result<T, E>` | — | `import { projectsUpdateProject } from '@vercel/sdk/funcs/projectsUpdateProject.js'` |

Product SDKs:

| commands | description | default | options |
|---|---|---|---|
| `put(pathname, body, opts)` (`@vercel/blob`) | Upload a blob | `access: 'public'` | `access`, `addRandomSuffix`, `token`, `multipart` |
| `list()` / `del(url)` / `head(url)` / `copy()` (`@vercel/blob`) | Blob management | — | `prefix`, `limit`, `cursor` |
| `kv.get/set/del/incr/hset/expire` (`@vercel/kv`) | Redis-style commands via `@vercel/kv` | — | `ex`, `nx`, pipeline via `kv.pipeline()` |
| `sql` tagged template (`@vercel/postgres`) | Parameterized queries | pooled connection | `sql.query()`, `createClient()` for transactions |
| `waitUntil(promise)` (`@vercel/functions`) | Extend function lifetime after response | — | — |
| `geolocation(req)` / `ipAddress(req)` (`@vercel/functions`) | Request geo/IP headers | — | — |
| `getEnv()` / `oidc` helpers (`@vercel/functions`) | Runtime metadata + OIDC token for AWS/GCP | — | — |
| `createClient(connectionString)` / `get(id)` (`@vercel/edge-config`) | Read Edge Config values | — | — |
| `<Analytics />` / `<SpeedInsights />` | React components for Web Analytics | — | framework variants: `/react`, `/next`, `/sveltekit`, etc. |

Platform configuration (`vercel.json` — per-project):

| commands | description | default | options |
|---|---|---|---|
| `buildCommand` / `outputDirectory` / `installCommand` | Override build settings | framework preset | strings or `null` to disable |
| `functions` | Serverless/edge function config | — | `maxDuration`, `memory`, `runtime`, `includeFiles` |
| `regions` | Function deployment regions | `iad1` | e.g. `["iad1", "fra1"]` |
| `rewrites` / `redirects` / `headers` / `cleanUrls` / `trailingSlash` | Routing + headers | — | arrays of rules |
| `crons` | Cron jobs hitting endpoints | — | `path`, `schedule` |

##### Source

- Vercel REST API: https://vercel.com/docs/rest-api
- `@vercel/sdk` README: https://github.com/vercel/sdk#readme
- CLI docs (see also `follow-service-vercel-cli`): https://vercel.com/docs/cli
- Blob/KV/Postgres/Functions: https://vercel.com/docs/storage, https://vercel.com/docs/functions
- `vercel.json` config: https://vercel.com/docs/projects/project-configuration

### references/follow-service-vercel-cli--apis

#### Service Vercel Cli API & Dependencies

##### Install

Local (per project, recommended):

```sh
bun add -D vercel
#### or
npm install --save-dev vercel
```

Global:

```sh
bun add -g vercel
#### or
npm install -g vercel
```

Experimental native binaries (no Node.js needed):

```sh
npm install -g @vercel/vc-native -f   # replaces `vercel` and `vc` bins
```

##### Version

- Latest (`vercel`): 59.11.7
- Node.js requirement: `>= 18`
- [Package Registry](https://www.npmjs.com/package/vercel)
- [Repository](https://github.com/vercel/vercel) (`packages/cli`)

##### Dependencies

- The `vercel` npm package ships the `vercel` and `vc` binaries; also published as `@vercel/vc-native` per-OS binaries.
- Auth: `vercel login` (interactive) or `VERCEL_TOKEN` env var / `--token` flag for CI — the flag takes precedence over the env var.
- Self-update: `vercel upgrade`; `--version` prints the installed version.

##### Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `vercel` / `vercel deploy` | Deploy current directory to a preview URL | preview | `--prod`, `--yes`, `--name`, `--archive`, `--force` |
| `vercel --prod` | Deploy to production | — | `--archive=tgz` |
| `vercel dev` | Local dev server replicating Vercel env | auto-detects framework | `--listen <port>` |
| `vercel build` | Build project locally (same as CI) | preview | `--prod`, `--target` |
| `vercel pull` | Download project settings + env vars to `.vercel/` | development env | `--environment=preview|production`, `--git-branch` |
| `vercel link` | Link directory to a Vercel project (writes `.vercel/project.json`) | interactive | `--project`, `--yes`, `--repo` |
| `vercel init <template>` | Scaffold a project from an example | — | `vercel init` lists templates |
| `vercel login` | Authenticate account | interactive | provider flags (GitHub/GitLab/Bitbucket/email/SAML) |
| `vercel logout` | Remove local credentials | — | — |
| `vercel whoami` | Show current user | — | — |
| `vercel switch` / `vercel teams` | Switch or manage team scope | — | `vercel teams ls/add/invite` |
| `vercel list` / `vercel ls` | List deployments for the project | — | `--meta`, filter args |
| `vercel inspect <url>` | Deployment details (builds, routes, regions) | — | — |
| `vercel logs <url>` | Runtime/build logs for a deployment | — | `--follow`, `--since`, `--until` |
| `vercel env ls` | List env vars | development | `<environment>` arg, `--git-branch` |
| `vercel env add <NAME>` | Add an env var | all environments | environment arg, `--sensitive`, `--git-branch`, `--force` |
| `vercel env pull [file]` | Download env vars to a file | `.env.local` | `--environment`, `--git-branch`, `--yes` |
| `vercel env rm <NAME> <env>` | Remove an env var | prompts | `--yes` |
| `vercel secrets add/ls/rm` | Legacy secrets management | — | prefer `env` for new projects |
| `vercel domains ls/add/inspect/buy` | Manage domains | — | `vercel domains verify`, `transfer-in` |
| `vercel dns ls/add/rm` | Manage DNS records | — | record type args |
| `vercel certs ls/issue/rm` | Manage SSL certificates | auto-issued | `vercel certs issue <cn>` |
| `vercel alias set <url> <domain>` | Point an alias/domain at a deployment | — | `vercel alias ls`, `vercel alias rm` |
| `vercel promote <url>` | Promote a deployment to production | — | `--timeout` |
| `vercel rollback <url>` | Roll back production to a deployment | — | `--timeout` |
| `vercel rolling-release` | Configure gradual rollout | — | subcommands for approve/configure |
| `vercel remove <name>` | Delete deployments or projects | prompts | `--yes`, `--safe` |
| `vercel redeploy <url>` | Re-deploy an existing deployment | — | — |
| `vercel bisect` | Binary-search deployments to find a bad deploy | interactive | `--good`, `--bad`, `--path`, `--run` |
| `vercel git connect/disconnect` | Manage Git integration | — | — |
| `vercel deploy-hooks` | Manage deploy hooks | — | create/list/remove |
| `vercel project ls/add/rm/inspect` | Manage projects | — | — |
| `vercel target` | Show/set deployment target context | — | `ls`, custom targets |
| `vercel blob list/put/get/del/copy` | Manage Vercel Blob storage | — | — |
| `vercel crons ls` | List cron jobs | — | — |
| `vercel firewall` | Manage WAF/firewall rules | — | — |
| `vercel flags` | Manage feature flags / traffic splits | — | — |
| `vercel integration` | Install/manage Marketplace integrations | — | `install`, `discover`, `open` |
| `vercel install` | Provision Marketplace resources into the project | — | — |
| `vercel open` | Open the project dashboard in browser | — | — |
| `vercel inspect`/`vercel metrics`/`vercel traces`/`vercel usage` | Observability + usage data | — | per-command filters |
| `vercel sandbox` | Run code in a Vercel Sandbox | — | subcommands |
| `vercel mcp` | Vercel MCP server helpers | — | — |
| `vercel agent init` | Generate `AGENTS.md` deploy guidance | — | `--yes` |
| `vercel api <endpoint>` | Authenticated REST API calls (beta) | GET | `-X`, `-F` |
| `vercel curl <path>` | Curl with Vercel auth context | — | — |
| `vercel oauth-apps` / `vercel tokens` / `vercel webhooks` | OAuth apps, tokens, webhooks | — | per-command subcommands |
| `vercel telemetry` | Manage CLI telemetry | — | `status`, `enable`, `disable` |
| `vercel upgrade` | Self-update the CLI | — | `--dry-run`, `--enable-auto` |

##### Global Options

| commands | description | default | options |
|---|---|---|---|
| `--token <token>` | Auth token (overrides `VERCEL_TOKEN`) | env var | — |
| `--scope <team>` | Run against a team scope | personal account | — |
| `--cwd <path>` | Working directory | current dir | — |
| `--yes` | Skip confirmation prompts | off | `-y` |
| `--debug` | Verbose debug output | off | `-d` |
| `--global-config <path>` | Custom global config path | `~/.vercel` or platform config dir | — |
| `--local-config <path>` | Custom `vercel.json` path | `./vercel.json` | — |
| `--version` / `--help` | Version / help | — | `-v`, `-h` |

##### Source

- Official docs: https://vercel.com/docs/cli
- Global options: https://vercel.com/docs/cli/global-options
- Command pages: https://vercel.com/docs/cli/deploy, https://vercel.com/docs/cli/dev, https://vercel.com/docs/cli/env, https://vercel.com/docs/cli/login
- Repo: https://github.com/vercel/vercel/tree/main/packages/cli

### references/follow-service-vercel-cli--routes

#### Follow Service Vercel Cli Route Map

- Website: <https://vercel.com>
- Documentation: <https://vercel.com/docs>
- Total routes discovered: 5000

##### Top routes by section

###### /
- /

###### about
- /about

###### academy
- /academy
- /academy/agent-friendly-apis
- /academy/agent-friendly-apis/add-llms-txt
- ... and 206 more

###### agent
- /agent

###### agents
- /agents

###### ai
- /ai

###### ai-accelerator
- /ai-accelerator

###### ai-gateway
- /ai-gateway
- /ai-gateway/leaderboards/apps
- /ai-gateway/leaderboards/labs
- ... and 270 more

###### ai-sdk
- /ai-sdk

###### blog
- /blog
- /blog/10-next-js-tips-you-might-not-know
- /blog/10-years-of-react
- ... and 487 more

###### careers
- /careers
- /careers/engineering-manager-cdn-5701765004
- /careers/enterprise-account-executive-5042174004
- ... and 20 more

###### changelog
- /changelog
- /changelog/16x-larger-environment-variable-storage-up-to-64kb
- /changelog/2024-01-account-changes
- ... and 1104 more

###### connect
- /connect
- /connect/box
- /connect/g2
- ... and 2 more

###### contact
- /contact
- /contact/partnerships
- /contact/sales

###### customers
- /customers
- /customers/architecting-reliability-stripes-black-friday-site
- /customers/core-construction
- ... and 15 more

###### docs
- /docs
- /docs/accounts
- /docs/activity-log
- ... and 1578 more

###### domains
- /domains

###### enterprise
- /enterprise

###### eve
- /eve

###### events
- /events

### references/follow-service-vercel-cli--vercel-cli

#### Vercel CLI Reference

##### Overview

Vercel CLI is the command-line interface for the Vercel platform. It allows you to deploy, manage, and monitor projects from the terminal, including Next.js, Nuxt, React, and other frameworks.

##### Version Info

- Package: `vercel`
- Latest stable: `59.5.0`
- Node.js requirement: `>= 18`
- License: Apache-2.0
- npm: https://www.npmjs.com/package/vercel

##### Install

```sh
bun add vercel
#### or
pnpm i vercel
#### or
yarn i vercel
#### or
bun i vercel
```

For global install:

```sh
bun add -g vercel
#### or
bun add -g vercel
```

Verify installation:

```sh
vercel --version
```

###### Update

```sh
vercel upgrade
vercel upgrade --dry-run
vercel upgrade --enable-auto
```

Or re-run the install command. Running any command shows an update message when a new version is available.

##### Authentication

```sh
vercel login       # Interactive login
vercel whoami      # Check current authentication
```

For CI/CD, create a token on your [tokens page](https://vercel.com/account/tokens) and authenticate via:
- Set `VERCEL_TOKEN` environment variable (recommended)
- Pass `--token` option to commands

##### Core Commands

###### Deploy

```sh
vercel                    # Create preview deployment
vercel --prod             # Deploy to production
vercel --prebuilt         # Deploy prebuilt output
vercel build              # Build locally
vercel build --prod       # Build for production locally
```

###### Project Management

```sh
vercel link               # Link existing project to Vercel
vercel list               # List deployments
vercel inspect [url]      # Inspect a deployment
vercel ls                 # List projects
```

###### Local Development

```sh
vercel dev                # Start local dev server
vercel dev --listen 3001  # Custom port
```

###### Logs

```sh
vercel logs [url]         # View deployment logs
vercel logs --prod        # View production logs
vercel logs --level error # Filter by level
```

###### Environment Variables

```sh
vercel env add KEY_NAME           # Add environment variable
vercel env ls                     # List environment variables
vercel env pull [file]            # Pull env vars to .env file
vercel env pull .env.local        # Pull to specific file
vercel env rm KEY_NAME            # Remove environment variable
```

###### Domains

```sh
vercel domains add example.com    # Add custom domain
vercel domains ls                 # List domains
vercel domains rm example.com     # Remove domain
vercel alias set [url] [domain]   # Set alias
vercel alias ls                   # List aliases
vercel alias rm [domain]          # Remove alias
```

###### Certificates

```sh
vercel certs ls                   # List certificates
vercel certs issue [domain]       # Issue certificate
vercel certs rm [cert-id]         # Remove certificate
```

###### Rollback

```sh
vercel rollback [url]             # Rollback to previous deployment
```

###### Cache

```sh
vercel cache purge                # Purge all cache
vercel cache purge --type cdn     # Purge CDN cache
vercel cache purge --type data    # Purge data cache
vercel cache invalidate --tag foo # Invalidate by tag
```

##### Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

##### CI/CD Integration

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
      - run: npm ci
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

Using `VERCEL_TOKEN` environment variable is recommended over `--token` flag to avoid exposing the token in process lists.

##### Native CLI Binaries (Experimental)

Native binaries reduce setup where Node.js is unnecessary:

```sh
bun add -g @vercel/vc-native -f
```

The `-f` flag replaces existing global `vercel` and `vc` bin links. Supports macOS, Linux, and Windows on x64 and arm64.

##### Source

- [Vercel CLI Overview](https://vercel.com/docs/cli)
- [Vercel CLI Upgrade](https://vercel.com/docs/cli/upgrade)
- [Getting Started with Vercel](https://vercel.com/docs/getting-started-with-vercel)
- [Vercel CLI Release Notes](https://vercel.com/docs/cli/release-notes)

### references/follow-service-vercel-cli--website

#### Service Vercel Cli Official Resources

- [Website](https://vercel.com)
- [Documentation](https://vercel.com/docs)
- [Repository](https://github.com/vercel/vercel)
- [Package Registry](https://www.npmjs.com/package/vercel)
- About: The autonomous stack for every app and agent.

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `vercel` (Vercel CLI) |
| Registry | `npm` |
| Latest Version | `59.18.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Vercel |
| License | `Apache-2.0` |
| Repository | `https://github.com/vercel/vercel` |
| Website | `https://vercel.com` |
| Documentation | `https://vercel.com/docs/cli` |
| Releases / Changelog | `https://github.com/vercel/vercel/releases` |

##### Install

```bash
bun add -D vercel
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@vercel/node` | `npm` | `13.0.0` | Builder/runtime types (`VercelRequest`, `VercelResponse`) for `api/` serverless functions |

##### Notes

- Breaking changes in latest major: CLI moves fast; `vercel deploy --prod` and `vercel env` flows unchanged; `@vercel/node` major 13 aligns with current build runtime
- Version pinned in SKILL.md: `vercel@59.18.0`

### references/routes

#### Follow Service Vercel Route Map

- Website: <https://vercel.com>
- Documentation: <https://vercel.com/docs>
- Total routes discovered: 5000

##### Top routes by section

###### /
- /

###### about
- /about

###### academy
- /academy
- /academy/agent-friendly-apis
- /academy/agent-friendly-apis/add-llms-txt
- ... and 206 more

###### agent
- /agent

###### agents
- /agents

###### ai
- /ai

###### ai-accelerator
- /ai-accelerator

###### ai-gateway
- /ai-gateway
- /ai-gateway/leaderboards/apps
- /ai-gateway/leaderboards/labs
- ... and 270 more

###### ai-sdk
- /ai-sdk

###### blog
- /blog
- /blog/10-next-js-tips-you-might-not-know
- /blog/10-years-of-react
- ... and 487 more

###### careers
- /careers
- /careers/engineering-manager-cdn-5701765004
- /careers/enterprise-account-executive-5042174004
- ... and 20 more

###### changelog
- /changelog
- /changelog/16x-larger-environment-variable-storage-up-to-64kb
- /changelog/2024-01-account-changes
- ... and 1104 more

###### connect
- /connect
- /connect/box
- /connect/g2
- ... and 2 more

###### contact
- /contact
- /contact/partnerships
- /contact/sales

###### customers
- /customers
- /customers/architecting-reliability-stripes-black-friday-site
- /customers/core-construction
- ... and 15 more

###### docs
- /docs
- /docs/accounts
- /docs/activity-log
- ... and 1578 more

###### domains
- /domains

###### enterprise
- /enterprise

###### eve
- /eve

###### events
- /events

### references/vercel-cli

#### follow-service-vercel-cli (merged content)

##### Goal

ใช้งาน Vercel CLI สำหรับ deploy, manage และ monitor projects บน Vercel platform

##### Scope

ใช้สำหรับโปรเจกต์ที่ deploy ไปยัง Vercel รวมถึง Next.js, Nuxt, React, และ frameworks อื่นๆ

##### Execute

###### 1. Install And Authenticate

> Goal: Install And Authenticate

ติดตั้งและตั้งค่า Vercel CLI

1. ติดตั้ง Vercel CLI ด้วย `bun add -g vercel` หรือ `bun add -g vercel`
2. ตรวจสอบ version ด้วย `vercel --version`
3. Login ด้วย `vercel login` เพื่อเชื่อมต่อกับ Vercel account
4. เลือก team และ scope ที่ต้องการ
5. ตรวจสอบ authentication ด้วย `vercel whoami`

###### 2. Initialize Project

> Goal: Initialize Project

สร้างและ link โปรเจกต์กับ Vercel

1. Link โปรเจกต์ที่มีอยู่ด้วย `vercel link`
2. สร้างโปรเจกต์ใหม่ด้วย `vercel`
3. ตั้งค่า project name และ settings
4. เลือก framework preset หรือ custom build settings
5. สร้าง `vercel.json` config file หากจำเป็น

###### 3. Local Development

> Goal: Local Development

พัฒนาและทดสอบใน local environment

1. รัน local dev server ด้วย `vercel dev`
2. ตรวจสอบ logs และ errors ใน terminal
3. ใช้ `--listen` flag สำหรับ custom port
4. Test environment variables และ build settings
5. Simulate production environment ใน local

###### 4. Deploy To Preview

> Goal: Deploy To Preview

Deploy ไปยัง preview environments

1. Deploy ด้วย `vercel` เพื่อสร้าง preview deployment
2. ตรวจสอบ deployment URL และ status
3. View logs ด้วย `vercel logs`
4. Test preview deployment ก่อน merge
5. Share preview URL สำหรับ code review

###### 5. Deploy To Production

> Goal: Deploy To Production

Deploy ไปยัง production environment

1. Deploy ไป production ด้วย `vercel --prod`
2. ใช้ `--prebuilt` flag สำหรับ prebuilt deployments
3. ตรวจสอบ production deployment status
4. Monitor production logs ด้วย `vercel logs --prod`
5. Rollback หากจำเป็นด้วย `vercel rollback`

###### 6. Manage Environment Variables

> Goal: Manage Environment Variables

จัดการ environment variables และ secrets

1. Set environment variable ด้วย `vercel env add`
2. List environment variables ด้วย `vercel env ls`
3. Pull environment variables ด้วย `vercel env pull`
4. ใช้ environment-specific variables ด้วย `--environment`
5. ไม่ commit secrets ไปยัง git

###### 7. Monitor And Debug

> Goal: Monitor And Debug

Monitor และ debug deployments

1. View logs ด้วย `vercel logs`
2. Filter logs ด้วย `--level` flag
3. Monitor specific deployment ด้วย `--deployment`
4. Inspect build output ด้วย `vercel inspect`
5. View deployment metrics ด้วย `vercel metrics`

###### 8. Manage Domains

> Goal: Manage Domains

จัดการ custom domains

1. Add custom domain ด้วย `vercel domains add`
2. List domains ด้วย `vercel domains ls`
3. Remove domain ด้วย `vercel domains rm`
4. Verify DNS configuration
5. Configure SSL certificates อัตโนมัติ

###### 9. Team And Project Management

> Goal: Team And Project Management

จัดการ teams และ projects

1. List projects ด้วย `vercel list`
2. Switch teams ด้วย `vercel switch`
3. Manage team members ผ่าน dashboard
4. Configure project settings
5. Manage billing และ usage

##### Rules

###### 1. Configuration Management

จัดการ configuration files อย่างเป็นระบบ

- ใช้ `vercel.json` สำหรับ custom build settings
- ตั้งค่า `buildCommand` และ `outputDirectory` อย่างถูกต้อง
- ใช้ environment-specific configs ด้วย `--environment`
- ไม่ hardcode secrets ใน config files
- ใช้ `.env` files สำหรับ local development
- ใช้ Vercel dashboard สำหรับ sensitive configs

###### 2. Deployment Best Practices

ทำตาม best practices สำหรับ deployment

- Deploy ไป preview ก่อน production เสมอ
- ใช้ Git integration สำหรับ automatic deployments
- Test preview deployments ก่อน merge PR
- ใช้ `--prebuilt` สำหรับ faster deployments
- Monitor logs หลัง deploy ทุกครั้ง
- ตั้งค่า deployment protection สำหรับ production

###### 3. Environment Variable Security

รักษาความปลอดภัยของ environment variables

- ไม่ commit secrets ไปยัง version control
- ใช้ `/follow-secret-manager` สำหรับจัดการ `VERCEL_TOKEN` และ secrets แทนการเก็บใน plain `.env`
- ใช้ `vercel env add` แทนการแก้ config files
- ใช้ environment-specific variables สำหรับ isolation
- Rotate secrets อย่างสม่ำเสมอ
- ตรวจสอบ variable access logs
- ใช้ different environments สำหรับ dev/staging/prod

###### 4. Development Workflow

ใช้งาน development workflow ที่มีประสิทธิภาพ

- ใช้ `vercel dev` สำหรับ local development
- Simulate production environment ใน local
- Test environment variables ใน local
- Monitor logs และ errors ใน real-time
- ใช้ Git integration สำหรับ automatic preview deployments
- ใช้ branch-based deployments สำหรับ feature branches

###### 5. Performance Optimization

ปรับปรุง performance ของ deployments

- ใช้ `--prebuilt` flag สำหรับ faster builds
- Optimize build process ด้วย caching
- ใช้ edge functions สำหรับ dynamic content
- Monitor build times และ deployment duration
- ใช้ image optimization สำหรับ assets
- ตรวจสอบ bundle size และ loading performance

###### 6. CI/CD Integration

ผสาน Vercel CLI เข้ากับ CI/CD pipelines

- ใช้ `VERCEL_TOKEN` สำหรับ authentication
- ใช้ `vercel --prod --token` ใน CI
- ตั้งค่า environment variables ใน CI/CD
- ใช้ `vercel env pull` สำหรับ local development
- Test ก่อน deploy ด้วย `vercel dev`
- ใช้ GitHub Actions หรือ GitLab CI สำหรับ automation

###### 7. Monitoring And Debugging

Monitor และ debug deployments อย่างมีประสิทธิภาพ

- ใช้ `vercel logs` สำหรับ real-time monitoring
- Filter logs ด้วย `--level error` สำหรับ errors
- Monitor specific deployment ด้วย `--deployment`
- ใช้ `vercel inspect` สำหรับ build debugging
- ตรวจสอบ deployment metrics แล告 analytics
- ใช้ Vercel dashboard สำหรับ detailed insights

- ใช้ /open-web-for-config-secret ถ้าจำเป็น
- ใช้ /follow-service-vercel ถ้าจำเป็น

##### Expected Outcome

- Vercel CLI ติดตั้งและตั้งค่าอย่างถูกต้อง
- Projects deploy ได้อย่างราบรื่น
- Environment variables จัดการอย่างปลอดภัย
- Development workflow มีประสิทธิภาพ
- CI/CD integration ทำงานได้อัตโนมัติ
- Monitoring และ debugging ทำได้อย่างมีประสิทธิภาพ

### references/vercel-overview

##### Goal

ใช้ Vercel platform สำหรับ deploy และ host web applications ด้วย CI/CD, edge functions และ serverless APIs

##### Scope

ใช้สำหรับการ deploy Next.js, React, Vue, Svelte apps ด้วย preview deployments และ global edge network

##### Execute

###### 1. Installation

Install Vercel CLI ด้วย `bun add -D vercel`

###### 2. Login

Login ด้วย `bun vercel login`

###### 3. Deploy

Deploy ด้วย `bun vercel`

###### 4. Git Integration

ใช้ Git integration สำหรับ automatic deployments

###### 5. Preview Deployments

ใช้ preview deployments สำหรับ testing

###### 6. Environment Variables

Configure environment variables ใน dashboard

###### 7. Edge Functions

ใช้ edge functions สำหรับ low latency

###### 8. Image Optimization

ใช้ image optimization สำหรับ performance

###### 9. Monitor

Monitor deployments ใน dashboard

##### Rules

- ใช้ `bun add -D vercel` สำหรับ development
- ใช้ Vercel CLI สำหรับ local development
- ใช้ Git integration สำหรับ automatic deployments
- ใช้ preview deployments สำหรับ testing
- Configure environment variables ใน dashboard
- ใช้ edge functions สำหรับ low latency
- ใช้ image optimization สำหรับ performance
- Monitor deployments ใน dashboard

##### Expected Outcome

- Instant deployments ด้วย Git integration
- Preview deployments สำหรับ collaboration
- Global edge network สำหรับ performance

### references/vercel-website

#### Vercel Website Resources

Official website and documentation resources for Vercel.

##### Official Website

- Main Website: https://vercel.com
- Documentation: https://vercel.com/docs
- Status Page: https://status.vercel.com
- Pricing: https://vercel.com/pricing

##### Key Documentation Sections

###### Getting Started
- Quick Start Guide
- Deployment Guide
- Project Setup

###### Features
- Edge Functions
- Serverless Functions
- Static Site Generation
- Image Optimization
- Analytics

###### CLI Documentation
- Vercel CLI Reference
- Configuration Options
- Environment Variables

##### Tools

- Vercel Dashboard: https://vercel.com/dashboard
- Project Settings: Configuration management
- Logs: Real-time logs and monitoring
- Analytics: Performance analytics

##### Community

- GitHub: https://github.com/vercel/vercel
- Discord: Community server
- Twitter: @vercel
- Blog: https://vercel.com/blog

##### Related Services

- Next.js: https://nextjs.org
- Turbopack: https://turbo.build
- Nuxt: https://nuxt.com

### references/website

#### Service Vercel Official Resources

- [Website](https://vercel.com)
- [Documentation](https://vercel.com/docs)
- [Repository](https://github.com/vercel/vercel)
- [Package Registry](https://www.npmjs.com/package/vercel)
- About: The autonomous stack for every app and agent.

## Expected Outcome

- Application ที่ deploy บน Vercel ได้สำเร็จ
- Auto-build configuration ที่รองรับ multiple frameworks
- Serverless และ Edge functions ที่ทำงานได้ถูกต้อง
- CI/CD pipeline ที่ deploy อัตโนมัติทั้ง preview และ production
- Environment variables ที่จัดการอย่างปลอดภัย
- Deployment live และใช้งานได้ ไม่มี console หรือ network errors

## Guide

อ้างอิงเพิ่มเติม:

- [references/vercel-overview.md](references/vercel-overview.md) — overview ของ Vercel platform
- [references/vercel-website.md](references/vercel-website.md) — links หลักของ Vercel

