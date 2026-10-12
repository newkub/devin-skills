| Command | ใช้เมื่อ |
|---|---|
| `npx workflow inspect runs` | list/inspect local runs (`.workflow-data/`) |
| `npx workflow inspect runs --backend @workflow/world-postgres` | inspect remote world |
| `npx skills add https://github.com/vercel/workflow --skill migrating-workflow-v4-to-v5` | v4→v5 migration skill สำหรับ coding agent |

| Env var | ความหมาย |
|---|---|
| `WORKFLOW_TARGET_WORLD` | เลือก World adapter เช่น `@workflow/world-postgres` |
| `DATABASE_URL` (ต่อ world) | world-specific config |
| `VERCEL_DEPLOYMENT_ID` | Vercel detection — ต้องเปิด "Enable access to System Environment Variables" |
| `WORKFLOW_RETAINED_VM` / `WORKFLOW_BATCH_TRANSITIONS` / `WORKFLOW_SEALED_LOG` | v5 runtime tuning kill-switches |

| Observability | รายละเอียด |
|---|---|
| Local | `inspect` CLI อ่าน `.workflow-data/` โดยตรง |
| Vercel | dashboard — runs, retries, streams, multi-region |
| Custom | `--backend <world>` ชี้ไป remote deployment |

> Full reference: https://workflow-sdk.dev/docs/observability, /worlds, /docs/api-reference
