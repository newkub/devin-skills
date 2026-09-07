---
name: follow-service-cloudflare-ci
description: ใช้ Cloudflare CI SDK รัน build, lint, test, typecheck บน Workflows
argument-hint: "[scope]"
related:
  - follow-service-cloudflare
  - deploy-to-cloudflare
  - resolve-cicd
  - follow-tool-github-actions
  - follow-tool-vitest
  - run-test
  - run-lint
  - run-typecheck
  - run-build
  - follow-secret-manager
  - open-web-for-config-secret
  - improve-error-handling
  - report-table
---

## Goal

สร้างและรัน CI pipeline บน Cloudflare ด้วย `CI SDK` และ `Workflows` — ตั้งแต่ install dependencies, cache, build, lint, typecheck, test โดยไม่รวม deploy

## Scope

ใช้สำหรับ:
- รัน CI บน Cloudflare Workflows ที่ถูก trigger จาก `artifact push` events
- Build, lint, typecheck, test ใน sandboxed environment บน Cloudflare
- Cache dependencies ระหว่าง CI steps ด้วย `cache.inputs`
- Self-healing CI ด้วย AI agent ที่แก้ไข broken steps (optional)
- ไม่รวม deploy Worker/Pages — ใช้ `/deploy-to-cloudflare` หรือ `/follow-service-cloudflare` สำหรับ deploy

## Execute

### 1. Verify Prerequisites

> Goal: ตรวจสอบว่า project พร้อมใช้ Cloudflare CI

1. ตรวจ `wrangler.jsonc` ว่าเปิดใช้ `nodejs_compat` compatibility flag
2. ตรวจว่า project มี `package.json` และ lockfile (`bun.lock`, `pnpm-lock.yaml`, `package-lock.json`)
3. ตรวจ `CLOUDFLARE_API_TOKEN` และ `CLOUDFLARE_ACCOUNT_ID` สำหรับ Wrangler
4. ใช้ `/open-web-for-config-secret` ถ้า keys ยังไม่อยู่ใน secret manager

### 2. Install CI SDK

> Goal: ติดตั้ง `@cloudflare/ci` สำหรับ Workers runtime

1. รัน `bun add -D @cloudflare/ci` หรือ `npm add -D @cloudflare/ci`
2. ตรวจสอบว่า `wrangler` version >= 4.68 เพื่อรองรับ `events` field
3. ติดตั้ง `@cloudflare/workers-types` ถ้าใช้ TypeScript

### 3. Define CI Workflow Worker

> Goal: สร้าง Worker ที่ host CI Workflow

1. สร้างไฟล์ `ci/index.ts` หรือ `workers/ci.ts`
2. Import `CIWorkflow` และ types จาก `@cloudflare/ci`:
   ```ts
   import { CIWorkflow } from '@cloudflare/ci';
   import type { CiContext, CiParams, CloudflareArtifacts } from '@cloudflare/ci';
   import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
   ```
3. สร้าง class ที่ extends `CIWorkflow`:
   ```ts
   export class CI extends CIWorkflow<CloudflareArtifacts, Bindings> {
     protected async pipeline(
       _event: WorkflowEvent<CiParams>,
       _step: WorkflowStep,
       ci: CiContext,
     ): Promise<void> {
       // define steps
     }
   }
   ```
4. Export Worker entry ด้วย `export { CI }` หรือ bind ใน `wrangler.jsonc`

### 4. Define CI Steps

> Goal: กำหนด install, build, lint, typecheck, test steps

1. สร้าง install step พร้อม cache:
   ```ts
   const deps = await ci.runner({
     name: 'install',
     command: 'bun install --frozen-lockfile',
     cache: { inputs: ['package.json', 'bun.lock'] },
   });
   ```
2. รัน checks แบบ parallel จาก install result:
   ```ts
   await Promise.all([
     deps.runner({ name: 'lint', command: 'bun run lint' }),
     deps.runner({ name: 'test', command: 'bun run test' }),
     deps.runner({ name: 'typecheck', command: 'bun run typecheck' }),
     deps.runner({ name: 'build', command: 'bun run build' }),
   ]);
   ```
3. ใช้ lockfile ทีตรงกับ package manager จริง (`pnpm-lock.yaml`, `package-lock.json`)
4. ถ้า step ไหน fail → Workflow หยุดและ report error ทันที

### 5. Configure Wrangler Events

> Goal: trigger CI Workflow เมื่อมี artifact push

1. เพิ่ม `events` field ใน `wrangler.jsonc`:
   ```jsonc
   {
     "name": "ci-worker",
     "main": "src/index.ts",
     "compatibility_date": "2026-09-01",
     "compatibility_flags": ["nodejs_compat"],
     "events": [
       {
         "type": "cf.artifacts.repo.pushed",
         "source": "*"
       }
     ]
   }
   ```
2. กรอง repo/branch ด้วย `source` pattern ถ้าต้องการ
3. รัน `wrangler deploy` เพื่อลงทะเบียน Workflow กับ events

### 6. Set Up Artifacts Repo

> Goal: เชื่อม repo ที่ต้องการ run CI

1. ตรวจสอบว่า repo ถูก push ไปยัง Cloudflare Artifacts
2. ใช้ `wrangler artifacts` หรือ dashboard สำหรับจัดการ repos
3. ตรวจสอบว่า `artifact push` event ถูกส่งไปยัง CI Workflow

### 7. Monitor And Debug

> Goal: ติดตามผลลัพธ์ของ CI run

1. ใช้ `wrangler workflows instances list` ดู instances
2. ใช้ `wrangler workflows instances logs <id>` ดู logs
3. ใช้ `wrangler tail` สำหรับ real-time logs
4. ตรวจสอบ error ด้วย `/resolve-cicd` หรือ `/follow-service-cloudflare`

### 8. Add Self-Healing (Optional)

> Goal: ให้ AI agent ช่วยแก้ broken steps

1. ศึกษา example จาก `https://github.com/cloudflare/ci/tree/main/examples/self-healing`
2. เพิ่ม agent step ที่ consume `CiRunnerFailureDiagnostics`
3. ใช้ `isCiRunnerFailure` เพื่อตรวจ failure แล้วส่งไปยัง agent
4. บังคับ agent push commit กลับมาให้ user อนุมัติก่อน merge

## Rules

### 1. No Deploy

- skill นี้รัน CI เท่านั้น ไม่ deploy
- ถ้าต้องการ deploy ให้เรียก `/deploy-to-cloudflare` หรือ `/follow-service-cloudflare`
- ห้ามเขียน deploy step ใน CI Workflow ภายใต้ skill นี้

### 2. Idempotent Commands

- ทุก command ใน `ci.runner()` ต้อง idempotent เพราะ Cloudflare Workflows มี retry
- ห้ามใช้ command ที่มี side effect ซ้ำซ้อนเมื่อ retry

### 3. Cache Discipline

- cache inputs ต้องชี้ไปยัง lockfile ทีตรงกับ package manager จริง
- ตรวจสอบว่า lockfile ไม่ขาดหายก่อน commit
- ถ้า lockfile เปลี่ยน → install step จะรันใหม่โดยอัตโนมัติ

### 4. Security

- ใช้ `/follow-secret-manager` สำหรับ `CLOUDFLARE_API_TOKEN`
- ห้าม hardcode credentials ใน `wrangler.jsonc` หรือ CI code
- ใช้ `vars` หรือ `secrets` สำหรับ account IDs และ tokens

### 5. Compatibility

- เปิด `nodejs_compat` เสมอสำหรับ `@cloudflare/ci`
- ใช้ `wrangler` version >= 4.68 สำหรับ `events` field
- ใช้ commands ทีตรงกับ package manager (`bun`, `pnpm`, `npm`)

## Expected Outcome

- `@cloudflare/ci` ติดตั้งและพร้อมใช้งาน
- CI Workflow ถูกกำหนดด้วย install, build, lint, typecheck, test steps
- `artifact push` events trigger CI run บน Cloudflare Workflows
- Dependencies ถูก cache ระหว่าง steps
- CI logs ตรวจสอบได้ผ่าน `wrangler`
- ไม่มี deploy step ใน CI Workflow
- พร้อมส่งต่อ `/deploy-to-cloudflare` ถ้าต้องการ deploy ต่อ
