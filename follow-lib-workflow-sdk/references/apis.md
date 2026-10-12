| key | value |
|---|---|
| install | `bun add workflow` |
| repo | https://github.com/vercel/workflow |
| docs | https://workflow-sdk.dev/docs (+ `/llms.txt`, `/agents.md` สำหรับ agent surfaces) |
| current major | v5 (v4 installable เป็น `workflow@4`, stability fixes เท่านั้น) |

| Directive | ใช้กับ | พฤติกรรม |
|---|---|---|
| `"use workflow"` | workflow fn (orchestrator) | sandboxed, no Node.js, deterministic, replayed ผ่าน event log |
| `"use step"` | step fn (real work) | full Node.js + npm, retry ≤3, result persisted; นอก workflow = normal fn |

| Export | API | หน้าที่ |
|---|---|---|
| `workflow` | `sleep("30d" \| ms)` | suspend โดยไม่ใช้ compute |
| `workflow` | `createWebhook()` | resume ผ่าน external POST |
| `workflow` | `start(workflow, args)` / `run()` | trigger run |
| `workflow` | `getStepMetadata()` | metadata ใน step (throw ถ้าเรียกนอก workflow context) |
| `workflow` | `resumeHook()` | resume hook — 1 round trip (v5) |
| `workflow` | workflow globals | sandbox-safe globals (frozen `Math.random`/`Date`) |

| World | Env | Config |
|---|---|---|
| Local (default) | dev | `.workflow-data/` dir, synchronous steps |
| Vercel | prod | zero config — ต้อง `VERCEL_DEPLOYMENT_ID` (เปิด System Env Vars ใน project settings) |
| `@workflow/world-postgres` | self-host | `WORKFLOW_TARGET_WORLD=@workflow/world-postgres` + `DATABASE_URL` |
| community/custom | อื่นๆ | `WORKFLOW_TARGET_WORLD=<pkg>` + world env; implement World contract เองได้ |

| Runtime tuning (v5) | ใช้เมื่อ |
|---|---|
| `WORKFLOW_RETAINED_VM` | ปิด VM reuse ข้าม inline steps |
| `WORKFLOW_BATCH_TRANSITIONS=0` | ปิด batched event writes |
| `WORKFLOW_SEALED_LOG=0` | กลับไป pre-allocated log positions |

| Framework | Support |
|---|---|
| Next.js, Vite, React Router, Astro, Express, Fastify, Hono, Nitro, Nuxt, SvelteKit, TanStack Start | stable guides |
| NestJS, Python | beta |
