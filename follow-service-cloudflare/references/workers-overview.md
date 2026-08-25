# Cloudflare Workers Reference

## Overview

Cloudflare Workers is a serverless execution environment that runs on Cloudflare's global edge network. Workers are written in JavaScript, TypeScript, Rust, C, or other languages that compile to WebAssembly, and are deployed via Wrangler CLI.

## Version Info

- **Wrangler (CLI)**: `4.125.0` (latest stable)
- **Node.js requirement**: `>=22.0.0`
- **Peer dependency**: `@cloudflare/workers-types` (optional, for TypeScript support)
- **License**: MIT OR Apache-2.0

## Install

Install Wrangler locally in your project (recommended by Cloudflare):

```sh
bun add -D wrangler@latest
# or
yarn add -D wrangler@latest
# or
pnpm add -D wrangler@latest
# or
bun add -d wrangler@latest
```

Install TypeScript types:

```sh
bun add -D @cloudflare/workers-types
```

Verify installation:

```sh
npx wrangler --version
```

## Create A New Worker Project

Use C3 (create-cloudflare) to scaffold a new project:

```sh
npm create cloudflare@latest -- my-first-worker
# or
yarn create cloudflare my-first-worker
# or
pnpm create cloudflare@latest my-first-worker
```

C3 generates:
- `wrangler.jsonc` — Wrangler configuration file
- `src/index.js` — Minimal Hello World Worker in ES module syntax
- `package.json` — Node dependencies configuration
- `package-lock.json` — Lock file

## Configuration (`wrangler.jsonc`)

Cloudflare recommends `wrangler.jsonc` for new projects. Some newer features are only available with JSON config.

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.js",
  "compatibility_date": "2026-08-24",
  "compatibility_flags": ["nodejs_compat"],
  "workers_dev": false,
  "route": {
    "pattern": "example.org/*",
    "zone_name": "example.org"
  },
  "kv_namespaces": [
    {
      "binding": "MY_NAMESPACE",
      "id": "<KV_ID>"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-db",
      "database_id": "<D1_ID>"
    }
  ],
  "r2_buckets": [
    {
      "binding": "STORAGE",
      "bucket_name": "my-bucket"
    }
  ],
  "observability": {
    "enabled": true
  },
  "env": {
    "staging": {
      "name": "my-worker-staging",
      "route": {
        "pattern": "staging.example.org/*",
        "zone_name": "example.org"
      }
    }
  }
}
```

### Required Keys

- `name` — Worker name (alphanumeric and dashes only, max 255 chars)
- `main` — Path to entrypoint (e.g. `./src/index.ts`)
- `compatibility_date` — Date in `yyyy-mm-dd` format for runtime version

### Automatic Resource Provisioning (Beta)

Add bindings without IDs — Wrangler creates resources automatically on deploy:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "MY_KV_NAMESPACE"
    }
  ]
}
```

## Worker Code Example

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

The `fetch` handler receives three parameters: `request`, `env`, and `context`. The runtime expects a `Response` object or a Promise resolving to one.

## CLI Commands

| Command | Description |
|---|---|
| `npx wrangler dev` | Start local dev server on `http://localhost:8787` |
| `npx wrangler dev --port 8787` | Start dev server on custom port |
| `npx wrangler dev --local` | Local-only mode |
| `npx wrangler dev --remote` | Access remote resources |
| `npx wrangler deploy` | Deploy to production |
| `npx wrangler deploy --env staging` | Deploy to specific environment |
| `npx wrangler deploy --dry-run` | Preview deployment without deploying |
| `npx wrangler types` | Generate `worker-configuration.d.ts` |
| `npx wrangler secret put KEY_NAME` | Set a secret |
| `npx wrangler secret list` | List secrets |
| `npx wrangler secret delete KEY_NAME` | Delete a secret |
| `npx wrangler d1 create my-db` | Create D1 database |
| `npx wrangler d1 execute my-db --command "SELECT 1"` | Execute SQL on D1 |
| `npx wrangler kv namespace create CACHE` | Create KV namespace |
| `npx wrangler r2 bucket create my-bucket` | Create R2 bucket |
| `npx wrangler tail` | Stream live logs from deployed Worker |
| `npx wrangler login` | Authenticate with Cloudflare account |
| `npx wrangler whoami` | Check authentication status |

## CI/CD With GitHub Actions

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
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bunx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Use `CLOUDFLARE_API_TOKEN` environment variable for automated deployments. Do not use `wrangler login` in CI.

## Automatic Framework Detection

Wrangler 4.68+ can auto-detect frameworks and generate configuration:

```sh
npx wrangler deploy
```

When run without a config file, Wrangler will:
1. Detect your framework from `package.json`
2. Prompt for confirmation
3. Install required Cloudflare adapters
4. Generate `wrangler.jsonc` with appropriate settings
5. Add scripts to `package.json` (`deploy`, `preview`, `cf-typegen`)
6. Configure `.gitignore`

## Source

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler Install/Update](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Get Started Guide](https://developers.cloudflare.com/workers/get-started/guide/)
- [Automatic Configuration](https://developers.cloudflare.com/workers/framework-guides/automatic-configuration/)
