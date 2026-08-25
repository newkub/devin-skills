# Wrangler Initialize And Configuration

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