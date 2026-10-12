---
name: follow-service-cloudflare-use-jobs
description: ใช้ Cloudflare Queues, Cron Triggers, Workflows, Durable Objects — async jobs และ scheduling
argument-hint: "[queue|cron|workflow|do]"
related:
  - follow-service-cloudflare
  - run-test
  - resolve-errors
---

## Goal

ใช้ async/scheduled features ของ Workers — Queues (producer/consumer), Cron Triggers, Workflows (durable multi-step), Durable Objects (stateful coordination)

## Scope

background jobs และ scheduling — เลือกให้ถูก: Queue = fire-and-forget/async offload, Cron = scheduled runs, Workflow = multi-step durable execution, DO = strongly-consistent per-key state; detail ใน `references/triggers-and-cron.md`

## Execute

### 1. Queues

```bash
wrangler queues create my-queue
```

```ts
// wrangler.jsonc: queues.producers + queues.consumers
// producer
await env.MY_QUEUE.send({ job: 'resize', id })   // sendBatch สำหรับหลายข้อความ

// consumer — export ใน Worker
export default {
  async queue(batch: MessageBatch, env: Env) {
    for (const msg of batch.messages) { await process(msg.body); msg.ack() }
    // batch.retryAll() เมื่อ fail ทั้งก้อน; dead letter queue ตั้งใน config
  },
}
```

### 2. Cron Triggers

1. `wrangler.jsonc`: `triggers: { crons: ["*/5 * * * *"] }`
2. Handler: `export default { async scheduled(event, env, ctx) { ctx.waitUntil(job()) } }`
3. Test local: `wrangler dev --test-scheduled` + `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"`
4. `wrangler triggers deploy` เมื่อต้อง deploy เฉพาะ triggers

### 3. Workflows (multi-step durable)

```ts
export class MyWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const a = await step.do('step-1', async () => fetchA())
    await step.sleep('wait', '10 minutes')
    return await step.do('step-2', async () => fetchB(a))
  }
}
// trigger: await env.MY_WORKFLOW.create({ params })
```

- `step.do`/`step.sleep`/`step.waitForEvent` — retry + persist อัตโนมัติต่อ step

### 4. Durable Objects (ถ้าต้อง coordination)

- `class` extends `DurableObject` + binding + `[[migrations]]` tag — per-object strong consistency, websockets, alarms
- ใช้เฉพาะเมื่อ KV/Queue ไม่พอ (per-entity locks, realtime rooms)

### 5. Verify

1. `wrangler dev` — queue consumer, scheduled handler, workflow steps ทดสอบจริง
2. `/run-test`; fail → `/resolve-errors`

## Rules

- Consumer handlers ต้อง `ack()` หรือ `retry()` ทุก message — ห้าม swallow errors
- `ctx.waitUntil` สำหรับงานที่ยืดหลัง response ใน fetch/scheduled
- Workflow steps ต้อง idempotent — step อาจ retry
- DO เพิ่ม `[[migrations]]` entry ทุกครั้งที่เพิ่ม class ใหม่

## Expected Outcome

- Jobs/schedule ที่เลือกทำงานบน local + deployed
- Dead-letter/retry semantics ถูกต้อง
