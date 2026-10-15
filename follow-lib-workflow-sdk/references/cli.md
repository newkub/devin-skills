| Command | Use when |
|---|---|
| `npx workflow inspect runs` | list/inspect local runs (`.workflow-data/`) |
| `npx workflow inspect runs --backend @workflow/world-postgres` | inspect a remote world |
| `npx skills add https://github.com/vercel/workflow --skill migrating-workflow-v4-to-v5` | v4→v5 migration skill for coding agents |

| Env var | Meaning |
|---|---|
| `WORKFLOW_TARGET_WORLD` | pick the World adapter, e.g. `@workflow/world-postgres` |
| `DATABASE_URL` (per world) | world-specific config |
| `VERCEL_DEPLOYMENT_ID` | Vercel detection — requires enabling "Enable access to System Environment Variables" |
| `WORKFLOW_RETAINED_VM` / `WORKFLOW_BATCH_TRANSITIONS` / `WORKFLOW_SEALED_LOG` | v5 runtime tuning kill-switches |

| Observability | Details |
|---|---|
| Local | the `inspect` CLI reads `.workflow-data/` directly |
| Vercel | dashboard — runs, retries, streams, multi-region |
| Custom | `--backend <world>` points at the remote deployment |

> Full reference: https://workflow-sdk.dev/docs/observability, /worlds, /docs/api-reference
