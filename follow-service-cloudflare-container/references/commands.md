# Service Cloudflare Containers Commands

All commands require an authenticated Wrangler session (`wrangler login` or `CLOUDFLARE_API_TOKEN`).

## Deploy And Build

| Command | Description | Options |
|---------|-------------|---------|
| `wrangler deploy` | Build the image, push it, and deploy the Worker | `--dry-run`, `--env <name>`, `--outdir <dir>` |
| `wrangler containers build <path>` | Build an image without deploying | `--tag <tag>`, `--push` |
| `wrangler containers push <image>` | Push a locally built image to the Cloudflare registry | `--tag <tag>` |
| `wrangler versions upload` | Upload a new version without shifting traffic | `--tag`, `--preview-alias` |
| `wrangler versions deploy` | Shift traffic to a version | `--version-id`, `--percentage` |

## Inspect

| Command | Description | Options |
|---------|-------------|---------|
| `wrangler containers list` | List containers in the account | `--json` |
| `wrangler containers images` | List images in the registry | `--json` |
| `wrangler containers info <id>` | Show one instance (image, type, status) | `--json` |
| `wrangler containers delete <id>` | Delete an instance | `--yes` |
| `wrangler containers ssh <id>` | Open a shell in a running instance (beta) | `--` command passthrough |

## Local Development

| Command | Description | Options |
|---------|-------------|---------|
| `wrangler dev` | Build the image locally, then run Worker + container | `--port`, `--local`, `--remote` |
| `wrangler types` | Generate `worker-configuration.d.ts` from bindings | `--env <name>` |

While `wrangler dev` runs, press:

| Key | Action |
|-----|--------|
| `r` | Rebuild the image and restart the container |
| `b` | Open the Worker inspector |
| `x` | Quit |

## Logs And Diagnostics

| Command | Description | Options |
|---------|-------------|---------|
| `wrangler tail` | Stream live logs (Worker and container) | `--format json`, `--status error` |
| `wrangler whoami` | Confirm the authenticated account | |
| `WRANGLER_LOG=debug wrangler deploy` | Verbose deploy diagnostics | |

## Account And Quota

| Command | Description | Options |
|---------|-------------|---------|
| `wrangler containers list` | Count running instances against `max_instances` | `--json` |
| `wrangler deployments list` | List Worker deployments and versions | `--json` |

## Notes

- `wrangler deploy` builds only when the config references a Dockerfile; otherwise the image must already be pushed.
- A real deploy pushes the image to the Cloudflare registry — it cannot use an image from an external registry.
- `--dry-run` validates config and bindings but does not prove the image runs.
- Docker must be running for `wrangler dev` and `wrangler containers build`.
