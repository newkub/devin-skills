---
name: follow-lib-workflow-sdk
description: ใช้ Workflow SDK (workflow-sdk.dev, Vercel) ครบวงจร — durable functions "use workflow"/"use step", sleep/hooks/webhooks, Worlds adapters, deploy + inspect
argument-hint: "[framework-or-world]"
allowed-tools:
  - exec
  - read
  - write
  - edit
  - grep
  - find_file_by_name
related:
  - follow-my-techstack
  - run-install
  - run-dev
  - run-test
  - follow-lib-tanstack-start
  - follow-service-vercel
---

## Goal

ใช้ Workflow SDK (package `workflow`, Vercel OSS) สร้าง durable workflows — long-running stateful logic ที่ persist progress ผ่าน event log และ resume หลัง restart/failure — รันเหมือนกันบน local dev, Vercel, หรือ infra อื่นผ่าน World adapters

## Scope

ใช้เมื่อ feature ต้องการ long-running/multi-step logic ที่ทน failure: AI agents, pipelines, scheduled jobs, human-in-the-loop approvals — framework support: Next.js, Vite, React Router, Astro, Express, Fastify, Hono, Nitro, Nuxt, SvelteKit, TanStack Start, NestJS (beta), Python (beta)

- Catalog default → `/follow-my-techstack`; TanStack Start integration → `/follow-lib-tanstack-start`; Vercel deploy → `/follow-service-vercel`

## Execute

### 1. Install And Integrate

> Goal: ติดตั้งเข้า framework ที่ใช้

1. `bun add workflow` ผ่าน `/run-install` + framework integration ตาม docs (Next.js/Vite/Hono/Start ฯลฯ)
2. Local dev ใช้ **Local World** อัตโนมัติ — state ใน `.workflow-data/` (gitignore ไว้), ไม่ต้อง config
3. Structure: `workflows/<name>/index.ts` (workflow fns) + `steps.ts` หรือ `steps/` folder + `workflows/shared/` — แยกไฟล์ช่วยเลี่ยง bundler bugs

### 2. Write Workflows

> Goal: แยก orchestration กับ work ให้ถูก

```ts
export async function processOrderWorkflow(orderId: string) {
  "use workflow";                    // sandboxed, deterministic, replayed
  const order = await fetchOrder(orderId);
  const payment = await chargePayment(order);
  return { orderId, status: "completed" };
}

async function chargePayment(order: Order) {
  "use step";                        // full Node.js, auto-retry (3x), persisted
  const stripe = new Stripe(process.env.STRIPE_KEY);
  return stripe.charges.create({ amount: order.total, currency: "usd", source: order.paymentToken });
}
```

- `"use workflow"` — orchestrate ด้วย conditionals/loops/try-catch/`Promise.all`; no Node.js runtime, npm limited; ต้อง deterministic (framework freeze `Math.random`/`Date` ให้ — safe ใช้ใน workflow)
- `"use step"` — real work, npm เต็มรูปแบบ, retry, result persisted; เรียกนอก workflow = normal fn (no retry/observability)

### 3. Suspension Primitives

> Goal: ใช้ wait/hook/webhook ให้ถูก

```ts
import { sleep, createWebhook } from "workflow";

await sleep("30d");                 // suspend ไม่เผา compute
const webhook = createWebhook();    // resume เมื่อ external system POST
await sendApprovalEmail(webhook.url);
const data = await webhook;
```

- Suspension เกิดที่: step hand-off, `sleep`, webhook await — state ไป event log, resume ต่อจุดเดิม
- Secrets/tokens unguessable → generate ใน step (seeded random ใน workflow ไม่ใช่ secret)

### 4. Deploy Via Worlds

> Goal: เลือก backend ให้ตรง environment

1. **Local** — default dev, `.workflow-data/`
2. **Vercel** — zero config; durable storage + managed queue + dashboard observability + multi-region; **ต้องเปิด "Enable access to System Environment Variables"** ไม่งั้น `VERCEL_DEPLOYMENT_ID` หาย → fallback Local World → fail บน read-only FS
3. **Custom** — `WORKFLOW_TARGET_WORLD=@workflow/world-postgres` + `DATABASE_URL=...` หรือ build World เอง

### 5. Inspect And Test

> Goal: observe และ verify

1. `npx workflow inspect runs` (local) / `--backend @workflow/world-postgres` (remote)
2. `/run-dev` ให้ dev server รัน workflows จริง → `/run-test` e2e ผ่าน workflow entry
3. v4 → v5: `npx skills add https://github.com/vercel/workflow --skill migrating-workflow-v4-to-v5` แล้วให้ agent migrate (v5: inline steps, batched writes, compressed payloads — ถึง ~80% compute cost บน Vercel)

## Rules

### 1. Determinism

- Workflow fn ถูก replay หลายครั้ง — ห้าม side effects นอก steps; non-determinism (network, fs, time จริง) ไปอยู่ใน `"use step"` เท่านั้น
- Pass-by-value เสมอ — mutate object ที่ส่งเข้า step ไม่มีผลกลับ workflow; return data แทน

### 2. Step Design

- Step = idempotent ที่ดีที่สุด — retry 3x default อาจซ้ำ work; side-effect ข้างนอกต้อง dedup เอง
- Long step → hand to queue เมื่อ inline budget หมด — ออกแบบเผื่อ

### 3. Deployment

- Production บน Vercel = System Env Vars ON — จำขึ้นใจก่อน deploy
- `WORKFLOW_TARGET_WORLD` + world-specific env ต้อง set ทั้ง build และ runtime

- ใช้ /follow-my-techstack ก่อนเลือก orchestration tool
- ใช้ /run-dev + /run-test verify run จริง

## Expected Outcome

- Workflow/step แยกชัด: orchestrator deterministic, steps idempotent + retryable
- Deploy ได้ทั้ง local/Vercel/custom World; inspect runs ได้; resume หลัง failure ถูกต้อง
