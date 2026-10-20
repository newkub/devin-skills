# deepsec best practices

## Do

- Start with `--scaffold-only` or `--plan --output json` on a new repo — review the `.deepsec/` skeleton before spending money
- Always set `--max-cost-usd` + `--max-duration` on the first run — AI review can take hours on a large repo
- Keep `INFO.md` accurate (entry points, auth boundaries, risky areas) — finding quality depends on it directly
- Commit `generated-matchers.ts` after review — it is that repo's scan coverage
- Re-run the same command after an interrupt — state in `.deepsec/` makes resume free

## Don't

- Don't run directly on untrusted PR/code — use guarded CI mode or `sandbox` (isolated on Vercel, the host keeps credentials)
- Don't keep API keys in the config — deepsec stores only the env var *name*; keys belong in `.env.local` or env
- Don't expect `--model-auth local` with `sandbox` — a machine login can't be brokered into a sandbox; it needs `AI_GATEWAY_API_KEY`
- Don't ignore a coverage pause — check the inventory state and repair `generated-matchers.ts` before processing

## Flow

- `scan` (free) → review candidates → `process` (paid) → `revalidate` (cut FPs) → `export`/`report`
- findings → triage into the `/deep-review` `review-security` domain or the project's fix pipeline
