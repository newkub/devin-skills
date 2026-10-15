
# Wrangler Versions And Rollback

`wrangler versions` separates upload from deploy and supports gradual rollouts

## Key Concepts

- Version: a snapshot of the Worker at a point in time (code, assets, bindings, compat settings)
- Deployment: the version currently serving traffic (100% or split)
- `wrangler deploy` = upload + deploy 100% in one step
- `wrangler versions` = split upload and deploy for more control

## Commands

### `wrangler versions upload`

Upload a new version without deploying it immediately

```bash
npx wrangler versions upload [PATH]
npx wrangler versions upload --tag "v1.2.3" --message "Feature release"
npx wrangler versions upload --dry-run
```

| Flag | Description |
|---|---|
| `--tag` | Tag for the version |
| `--message` | Description of the version |
| `--dry-run` | Validate without uploading |
| `--minify` | Minify Worker |
| `--upload-source-maps` | Upload source maps |

### `wrangler versions deploy`

Deploy a version that was already uploaded; supports traffic splitting

```bash
# Interactive
npx wrangler versions deploy

# Deploy 100%
npx wrangler versions deploy --version-id <ID>

# Traffic split (shorthand @)
npx wrangler versions deploy <v1>@80 <v2>@20

# By tag
npx wrangler versions deploy --version-tag v1.0.0@100

# Non-interactive
npx wrangler versions deploy <ID>@100 -y
```

| Flag | Description |
|---|---|
| `--version-id` | Version ID(s) to deploy |
| `--percentage` | Traffic percentage (0-100) |
| `--version-tag` | Tag(s) — supports `TAG@PERCENTAGE` |
| `--message` | Description of the deployment |
| `--yes` / `-y` | Do not ask for confirm |
| `--dry-run` | Do not really deploy |

### `wrangler versions list`

```bash
npx wrangler versions list
npx wrangler versions list --json
```

### `wrangler versions view`

```bash
npx wrangler versions view <VERSION-ID>
npx wrangler versions view <VERSION-ID> --json
```

### `wrangler versions secret`

| Command | Description |
|---|---|
| `wrangler versions secret put KEY` | Add a secret (creates a new version, no deploy) |
| `wrangler versions secret bulk [FILE]` | Bulk add secrets |
| `wrangler versions secret list` | List secrets of deployed versions |
| `wrangler versions secret delete KEY` | Delete a secret (creates a new version) |

### `wrangler rollback`

Roll back to the previous version immediately with 100% of traffic

```bash
# Auto rollback to latest stable
npx wrangler rollback

# Rollback to specific version
npx wrangler rollback <VERSION-ID>

# With message
npx wrangler rollback --message "Rolling back due to errors"

# Non-interactive
npx wrangler rollback <VERSION-ID> -y
```

### `wrangler deployments`

```bash
npx wrangler deployments list
npx wrangler deployments status
```

## Gradual Deployment Workflow

```bash
# 1. Upload new version
npx wrangler versions upload --tag "v2.0.0" --message "New feature"

# 2. Canary: 10% new, 90% old
npx wrangler versions deploy --version-tag v2.0.0@10 --version-tag v1.0.0@90

# 3. Monitor with tail
npx wrangler tail --status error --version-id <v2-id>

# 4. Increase to 50%
npx wrangler versions deploy --version-tag v2.0.0@50 --version-tag v1.0.0@50

# 5. Complete 100%
npx wrangler versions deploy --version-tag v2.0.0@100

# Emergency rollback
npx wrangler rollback --message "Revert breaking change"
```

## deploy vs versions deploy

| Aspect | `wrangler deploy` | `wrangler versions deploy` |
|---|---|---|
| Version creation | Created automatically | Must upload first |
| Traffic | 100% immediately | Supports split |
| First deployment | Works | Does not work (use `deploy` for the first one) |
| Durable Objects | Supports lifecycle changes | Does not support |
| Secrets | Deployed immediately | Use separate `versions secret` |

## Limitations

- Only the latest 100 versions can be deployed
- Traffic split supports at most 2 versions
- The first run must use `wrangler deploy`
- ES modules format is required
- Durable Object lifecycle changes must use `wrangler deploy`

## Source

- [wrangler versions](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Versions and Rollbacks](https://developers.cloudflare.com/workers/configuration/)
- [Gradual Deployments](https://developers.cloudflare.com/workers/versions-and-deployments/gradual-deployments/)

