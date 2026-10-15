| key | value |
|---|---|
| install | `bun add workflow` |
| repo | https://github.com/vercel/workflow |
| docs | https://workflow-sdk.dev/docs (+ `/llms.txt`, `/agents.md` for agent surfaces) |
| current major | v5 (v4 installable as `workflow@4`, stability fixes only) |

| Directive | Applies to | Behavior |
|---|---|---|
| `"use workflow"` | workflow fn (orchestrator) | sandboxed, no Node.js, deterministic, replayed via event log |
| `"use step"` | step fn (real work) | full Node.js + npm, retry ≤3, result persisted; outside a workflow = normal fn |

| Export | API | Purpose |
|---|---|---|
| `workflow` | `sleep("30d" \| ms)` | suspend without burning compute |
| `workflow` | `createWebhook()` | resume via external POST |
| `workflow` | `start(workflow, args)` / `run()` | trigger a run |
| `workflow` | `getStepMetadata()` | metadata inside a step (throws if called outside workflow context) |
| `workflow` | `resumeHook()` | resume hook — 1 round trip (v5) |
| `workflow` | workflow globals | sandbox-safe globals (frozen `Math.random`/`Date`) |

| World | Env | Config |
|---|---|---|
| Local (default) | dev | `.workflow-data/` dir, synchronous steps |
| Vercel | prod | zero config — requires `VERCEL_DEPLOYMENT_ID` (enable System Env Vars in project settings) |
| `@workflow/world-postgres` | self-host | `WORKFLOW_TARGET_WORLD=@workflow/world-postgres` + `DATABASE_URL` |
| community/custom | other | `WORKFLOW_TARGET_WORLD=<pkg>` + world env; you can implement the World contract yourself |

| Runtime tuning (v5) | Use when |
|---|---|
| `WORKFLOW_RETAINED_VM` | disable VM reuse across inline steps |
| `WORKFLOW_BATCH_TRANSITIONS=0` | disable batched event writes |
| `WORKFLOW_SEALED_LOG=0` | revert to pre-allocated log positions |

| Framework | Support |
|---|---|
| Next.js, Vite, React Router, Astro, Express, Fastify, Hono, Nitro, Nuxt, SvelteKit, TanStack Start | stable guides |
| NestJS, Python | beta |
