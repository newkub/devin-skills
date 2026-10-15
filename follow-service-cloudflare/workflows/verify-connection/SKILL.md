---
name: follow-service-cloudflare-verify-connection
description: Confirm Cloudflare really connects — auth, account access, bindings respond
argument-hint: "[scope]"
related:
  - follow-service-cloudflare
  - resolve-errors
  - report
---


## Goal

Confirm after setup/config that Cloudflare really connects — wrangler authenticated, account accessible, bindings responding

## Scope

- Used when `/follow-service-cloudflare` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change config/bindings

## Execute

### 1. Check Wrangler Auth

> Goal: wrangler login and the account are ready

1. `wrangler whoami` — must show the account name/id
2. When using `CLOUDFLARE_API_TOKEN` → check the token exists and has complete permissions
3. Auth fail → recommend `workflows/setup-wrangler/SKILL.md` — do not log in yourself

### 2. Check Resource Access

> Goal: The bindings/resources referenced by the config are accessible

1. `wrangler kv namespace list`, `wrangler r2 bucket list`, `wrangler d1 list` as used by `wrangler.toml`/`wrangler.jsonc`
2. Flag bindings the config references whose resource does not exist in the account
3. If a Worker exists → `wrangler deployments list` to see the latest deployment

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `missing-resources` / `partial`

## Rules

- Use list/read commands only — never deploy/put/delete
- Do not print token values
- Missing resource → report the binding name + the missing resource

## Expected Outcome

- Connection verdict with account + resources evidence

