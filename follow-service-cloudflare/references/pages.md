
# Wrangler Pages

`wrangler pages` covers Cloudflare Pages (static sites + Functions)

## Subcommands

### `wrangler pages dev`

Local dev server for Pages

```bash
npx wrangler pages dev [DIRECTORY]
npx wrangler pages dev ./dist
npx wrangler pages dev --port 3000 --ip 127.0.0.1 ./dist
npx wrangler pages dev ./dist --kv=MY_KV --d1=MY_DB
npx wrangler pages dev ./dist --live-reload
npx wrangler pages dev --local-protocol=https ./dist
```

| Flag | Description |
|---|---|
| `--port` | Port (default: 8788) |
| `--ip` | IP address (default: `0.0.0.0`) |
| `--binding` / `-b` | Bind KEY=VALUE |
| `--kv` / `-k` | KV namespace binding |
| `--d1` | D1 database binding |
| `--r2` | R2 bucket binding |
| `--do` / `-o` | Durable Object binding |
| `--live-reload` | Auto reload HTML |
| `--local-protocol` | `http` or `https` |
| `--persist-to` | Persistence directory |

### `wrangler pages deploy`

Deploy static assets

```bash
npx wrangler pages deploy [DIRECTORY]
npx wrangler pages deploy ./dist
npx wrangler pages deploy ./dist --branch=feature/new
npx wrangler pages deploy ./dist --project-name=my-site
npx wrangler pages deploy ./dist --commit-hash=abc123 --commit-message="Add feature"
```

| Flag | Description |
|---|---|
| `--project-name` | Pages project name |
| `--branch` | Branch (can be inferred from git) |
| `--commit-hash` | SHA for the deployment |
| `--commit-message` | Commit message |
| `--skip-caching` | Skip asset caching |
| `--no-bundle` | Do not bundle `_worker.js` |

### `wrangler pages project`

| Command | Description |
|---|---|
| `wrangler pages project create [NAME]` | Create project |
| `wrangler pages project list` | List projects |
| `wrangler pages project delete [NAME]` | Delete project |

```bash
npx wrangler pages project create my-site --production-branch main
npx wrangler pages project list --json
npx wrangler pages project delete my-site --yes
```

### `wrangler pages deployment`

| Command | Description |
|---|---|
| `wrangler pages deployment list` | List deployments |
| `wrangler pages deployment tail [ID]` | Stream logs |
| `wrangler pages deployment delete [ID]` | Delete deployment |

```bash
npx wrangler pages deployment list --environment=production
npx wrangler pages deployment tail --environment=preview
npx wrangler pages deployment tail --format=json
npx wrangler pages deployment delete <ID> --force
```

### `wrangler pages secret`

| Command | Description |
|---|---|
| `wrangler pages secret put KEY` | Set secret |
| `wrangler pages secret bulk [FILE]` | Bulk upload (JSON or .env) |
| `wrangler pages secret list` | List secrets |
| `wrangler pages secret delete KEY` | Delete secret |

```bash
npx wrangler pages secret put API_KEY --project-name=my-app
npx wrangler pages secret bulk ./secrets.json --env=preview
```

### `wrangler pages functions build`

Compile Pages Functions into a single Worker

```bash
npx wrangler pages functions build [DIRECTORY]
npx wrangler pages functions build --minify --sourcemap
npx wrangler pages functions build --watch
```

### `wrangler pages download config`

Download the dashboard config as a wrangler file

```bash
npx wrangler pages download config my-site
npx wrangler pages download config my-site --force
```

## Configuration

Required fields for Pages:

```jsonc
{
  "name": "my-pages-app",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2026-08-24"
}
```

| Key | Required | Description |
|---|---|---|
| `name` | Yes | Project name |
| `pages_build_output_dir` | Yes | Build output directory |
| `compatibility_date` | Recommended | Workers runtime version |
| `compatibility_flags` | Optional | Feature flags |

### Environments

Pages supports only `production` and `preview`:

```jsonc
{
  "env": {
    "preview": {
      "vars": { "API_URL": "https://preview-api.example.com" }
    }
  }
}
```

Bindings are not inherited — re-declare them in each env

## Pages vs Workers

| Aspect | Pages | Workers |
|---|---|---|
| Command | `pages deploy` | `deploy` |
| Deploys | Static assets + functions | Worker script |
| Config key | `pages_build_output_dir` | `main` |
| Environments | `production`, `preview` | custom |
| Project flag | `--project-name` | `--name` |
| Secret commands | `pages secret` | `secret` |

## Source

- [Pages Configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [wrangler pages](https://developers.cloudflare.com/workers/wrangler/commands/pages/)

