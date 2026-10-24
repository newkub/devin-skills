---
name: follow-service-cloudflare-setup-wrangler
description: Install Wrangler CLI + authenticate + verify whoami (idempotent first-time setup)
argument-hint: "[scope]"
related:
  - follow-service-cloudflare
  - resolve-errors
  - report
---


## Goal

Install the Wrangler CLI and connect to the Cloudflare account, ready for develop and deploy — a verifiable, idempotent first-time setup

## Scope

Used to install `wrangler`, set up authentication (`wrangler login` or `CLOUDFLARE_API_TOKEN`), and verify with `wrangler whoami` — does not cover bindings (use `workflows/config-bindings`) or deploy (use `workflows/deploy-worker`)

## Execute

### 1. Check Prerequisites

> Goal: Check the current state before installing (idempotent)

1. Check whether Wrangler already exists with `wrangler --version`
2. If present → skip to Step 3 to verify auth immediately
3. Detect the project's package manager from `package.json` (`bun`, `pnpm`, `npm`)

### 2. Install Wrangler

> Goal: Install Wrangler per the project's ecosystem

1. Install as a devDependency with `bun add -D wrangler` (or the package manager the project uses)
2. For global → do `/follow-tool-mise` or `mise use -g wrangler` first, then consider the system package manager
3. For TypeScript → install `@cloudflare/workers-types` with `bun add -D @cloudflare/workers-types`
4. Verify the version with `wrangler --version`

### 3. Authenticate

> Goal: Connect Wrangler to the Cloudflare account

1. Interactive: run `wrangler login` — it opens the browser for the user to authorize
2. CI/headless: use the `CLOUDFLARE_API_TOKEN` environment variable — create the token per `/create-cloudflare-token`, then store it via `/follow-secret-manager`
3. Never commit the token or put it in config files

### 4. Verify

> Goal: Confirm auth works and the account is correct

1. Run `wrangler whoami` — it must show the account name and account ID
2. With multiple accounts → pick the correct account and have the user confirm
3. If verify fails → do `/resolve-errors` max 3 rounds (re-login, check token scope), then stop and report
4. Success → report the account in use, then `/suggest-next-action`

## Rules

### 1. Idempotent Setup

- Always check version and auth state first — if already set up, verify only
- Install per the project's package manager — never mix

### 2. Credential Safety

- Use `/follow-secret-manager` to manage `CLOUDFLARE_API_TOKEN` — never hardcode or commit
- CI always uses an API token instead of `wrangler login`

### 3. Docs First

- If unsure about a command/flag → check official docs via `/learn` (web) or `/follow-service-cloudflare` instead of guessing

## Expected Outcome

- `wrangler --version` shows the installed version
- `wrangler whoami` confirms the correct account
- Credentials stored securely, ready for both local and CI

