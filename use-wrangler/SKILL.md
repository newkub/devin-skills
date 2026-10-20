---
name: use-wrangler
description: Use Wrangler CLI for Cloudflare Workers/Pages — dev, deploy, secrets, bindings, and tail logs
argument-hint: "[command-or-worker]"
related:
  - create-cloudflare-worker
  - deploy-to-cloudflare
  - resolve-errors
  - resolve-cloudflare-worker-fails
  - run-verify
  - report
  - suggest-next-action
---

## Goal

Manage Cloudflare Workers/Pages end-to-end with the `wrangler` CLI — init, dev, deploy, secrets, bindings (KV/D1/R2/Queues), and tail logs

## Scope

Use when the task involves Cloudflare Workers, Pages, KV, D1, R2, Queues, or Durable Objects — covering local dev, deploy, config (`wrangler.toml`/`wrangler.jsonc`), and observability — to create a new project follow `/create-cloudflare-worker` first, then use this skill for day-to-day commands

## Execute

### 1. Verify Setup

> Goal: wrangler is ready and authenticated

1. `bunx wrangler --version` — latest `4.151.0 (verified 2026-10-15)`, requires Node >= 22
2. `bunx wrangler whoami` to check auth — if not logged in → tell the user to run `wrangler login` (never log in for them)
3. Check `wrangler.toml` or `wrangler.jsonc` at the project root
4. Run `bunx wrangler types` if you need to regenerate `worker-configuration.d.ts` to match the bindings

### 2. Local Development

> Goal: Run the worker locally

```bash
bunx wrangler dev                        # local dev server
bunx wrangler dev --remote               # dev on the real Cloudflare edge
bunx wrangler dev --port 8787
bunx wrangler check startup              # measure worker startup time (v4)
```

### 3. Deploy

> Goal: Deploy correctly

```bash
bunx wrangler deploy                     # deploy worker
bunx wrangler deploy --dry-run --outdir dist   # inspect output before a real deploy
bunx wrangler versions list              # list versions
bunx wrangler versions upload            # upload a version without deploying
bunx wrangler rollback                   # roll back to the previous version
bunx wrangler pages deploy <dir>         # deploy Pages project
```

- A real deploy must pass `/run-verify` first, and the user must confirm for production

### 4. Secrets And Vars

> Goal: Manage secrets and environment

```bash
bunx wrangler secret put <NAME>          # set a secret (not committed to the repo)
bunx wrangler secret list
bunx wrangler secret delete <NAME>
```

- Plain vars go in `wrangler.toml` `[vars]` — only secrets use `wrangler secret`
- Never echo/print secret values into logs

### 5. Bindings

> Goal: Manage KV, D1, R2, Queues

```bash
bunx wrangler kv namespace list
bunx wrangler kv key get <key> --namespace-id <id>
bunx wrangler d1 list / d1 execute <db> --command "SELECT ..."
bunx wrangler d1 export <db> --output dump.sql
bunx wrangler r2 bucket list
bunx wrangler queues list
```

- v4 uses space syntax (`kv namespace`, `kv key`, `r2 bucket`, `d1 execute`) — legacy colon syntax such as `kv:namespace` has been removed

### 6. Logs And Observability

> Goal: Debug via logs

```bash
bunx wrangler tail                       # live logs
bunx wrangler tail --format json
bunx wrangler deployments list           # view deployment history
```

### 7. Report

> Goal: Summarize results

1. Show results with `/report` (No., Resource, Status, URL/ID)
2. Run `/suggest-next-action` at the end of the report

## Rules

### 1. Config As Source

- `wrangler.toml`/`wrangler.jsonc` is the source of truth — edit config there, not via the dashboard, unless necessary
- Keep `compatibility_date` and `compatibility_flags` up to date

### 2. Dry Run First

- deploy, rollback, secret delete → always dry run or confirm with the user first
- Use `deploy --dry-run` to inspect the bundle output

### 3. Secrets Safety

- Never commit secrets to the repo or `wrangler.toml`
- Never show secret values in output/logs

### 4. Scope Awareness

- Always specify `--env <name>` when the project has multiple environments (dev/staging/production)
- A production deploy requires user confirmation

- Use /resolve-cloudflare-worker-fails if needed
- Use /deploy-to-cloudflare if needed
- Use /resolve-errors if needed


## Expected Outcome

- wrangler commands work correctly against the specified worker
- deploy/dev/secrets/bindings fully managed through the CLI
- No secrets leaked into the repo or logs
- The `wrangler.toml` config is the single source of truth
