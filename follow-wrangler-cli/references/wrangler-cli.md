# Wrangler CLI Reference

## Overview

Wrangler is the Cloudflare Developer Platform command-line interface (CLI) for managing Worker projects. It supports creating, developing, deploying, and managing Cloudflare Workers and Developer Platform products (D1, KV, R2, Queues, Workflows, Pages, Hyperdrive, Vectorize).

## Version Info

- **Package**: `wrangler`
- **Latest stable**: `4.125.0`
- **Node.js requirement**: `>=22.0.0`
- **Peer dependency**: `@cloudflare/workers-types` (optional)
- **License**: MIT OR Apache-2.0
- **npm**: https://www.npmjs.com/package/wrangler

## Install

Install locally in your project (Cloudflare recommends this over global install):

```sh
npm i -D wrangler@latest
# or
yarn add -D wrangler@latest
# or
pnpm add -D wrangler@latest
# or
bun add -d wrangler@latest
```

Verify installation:

```sh
npx wrangler --version
```

If Wrangler is not installed, running `npx wrangler` uses the latest version automatically.

## Authentication

```sh
npx wrangler login      # Interactive browser login
npx wrangler whoami     # Check current authentication
```

For CI/CD, set the `CLOUDFLARE_API_TOKEN` environment variable instead of using `wrangler login`.

## Initialize A New Project

```sh
npx wrangler init my-project
```

This creates:
- `wrangler.jsonc` or `wrangler.toml` config file
- `src/index.ts` entry point
- `package.json` with scripts

## Configuration File

Cloudflare recommends `wrangler.jsonc` for new projects. Supported since Wrangler v3.91.0. TOML (`wrangler.toml`) is still supported.

### `wrangler.jsonc`

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-24",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "vars": {
    "API_HOST": "api.example.com"
  },
  "kv_namespaces": [
    { "binding": "CACHE", "id": "<KV_ID>" }
  ],
  "d1_databases": [
    { "binding": "DB", "database_name": "my-db", "database_id": "<D1_ID>" }
  ],
  "r2_buckets": [
    { "binding": "STORAGE", "bucket_name": "my-bucket" }
  ],
  "env": {
    "staging": {
      "name": "my-worker-staging",
      "vars": {
        "API_HOST": "staging-api.example.com"
      }
    }
  }
}
```

### Environments

Define environment-specific configs under `env`:

```sh
npx wrangler deploy --env staging
```

Bindings (`vars`, `kv_namespaces`, etc.) are not inherited — define them explicitly per environment.

## CLI Commands

### Core Commands

| Command | Description |
|---|---|
| `wrangler init [name]` | Create a new Worker project |
| `wrangler dev` | Start local dev server |
| `wrangler dev --port 8787` | Custom port |
| `wrangler dev --local` | Local-only mode |
| `wrangler dev --remote` | Access remote resources |
| `wrangler deploy` | Deploy to production |
| `wrangler deploy --env staging` | Deploy to specific environment |
| `wrangler deploy --dry-run` | Preview without deploying |
| `wrangler setup` | Configure without deploying |
| `wrangler types` | Generate TypeScript types |
| `wrangler tail` | Stream live logs from deployed Worker |
| `wrangler delete` | Delete a Worker |
| `wrangler versions` | Manage Worker versions |

### Secrets

| Command | Description |
|---|---|
| `wrangler secret put KEY_NAME` | Set a secret (prompts for value) |
| `wrangler secret list` | List all secrets |
| `wrangler secret delete KEY_NAME` | Delete a secret |

### D1 Databases

| Command | Description |
|---|---|
| `wrangler d1 create my-db` | Create a D1 database |
| `wrangler d1 list` | List D1 databases |
| `wrangler d1 execute my-db --command "SELECT 1"` | Run SQL command |
| `wrangler d1 execute my-db --file schema.sql` | Run SQL file |
| `wrangler d1 delete my-db` | Delete a D1 database |

### KV Namespaces

| Command | Description |
|---|---|
| `wrangler kv namespace create CACHE` | Create KV namespace |
| `wrangler kv key put KEY VALUE --binding CACHE` | Put a key-value pair |
| `wrangler kv key list --binding CACHE` | List keys |
| `wrangler kv key get KEY --binding CACHE` | Get a value |

### R2 Buckets

| Command | Description |
|---|---|
| `wrangler r2 bucket create my-bucket` | Create R2 bucket |
| `wrangler r2 bucket list` | List R2 buckets |
| `wrangler r2 bucket delete my-bucket` | Delete R2 bucket |

### Advanced Platform Products

| Command | Description |
|---|---|
| `wrangler pages deploy [dir]` | Deploy Cloudflare Pages project |
| `wrangler queues create my-queue` | Create a Queue |
| `wrangler workflows deploy` | Deploy a Workflow |
| `wrangler hyperdrive create my-hd` | Create Hyperdrive config |
| `wrangler vectorize create my-index` | Create Vectorize index |

## CI/CD Integration

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Key environment variables for CI/CD:
- `CLOUDFLARE_API_TOKEN` — API token for authentication
- `CLOUDFLARE_ACCOUNT_ID` — Account ID (optional, can be in config)

## Migration From v3 To v4

```sh
npm i -D wrangler@4
```

Wrangler v4 is a smaller set of changes compared to previous major versions. Existing workflows are unlikely to change.

## Source

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Install/Update Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Migrate v3 to v4](https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/)
