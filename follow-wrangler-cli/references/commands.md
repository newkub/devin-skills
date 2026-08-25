# Wrangler Commands

คำสั่งหลักและ advanced platform commands

## Core Commands

| Command | Description |
|---|---|
| `wrangler init [name]` | Create a new Worker project |
| `wrangler dev` | Start local dev server |
| `wrangler dev --port 8787` | Custom port |
| `wrangler dev --local` | Local-only mode |
| `wrangler dev --remote` | Access remote resources |
| `wrangler dev --test-scheduled` | Test cron triggers locally |
| `wrangler deploy` | Deploy to production |
| `wrangler deploy --env staging` | Deploy to specific environment |
| `wrangler deploy --dry-run` | Preview without deploying |
| `wrangler setup` | Configure without deploying |
| `wrangler types` | Generate TypeScript types |
| `wrangler tail` | Stream live logs (ดู `tail-and-logs.md`) |
| `wrangler delete` | Delete a Worker |
| `wrangler versions` | Manage Worker versions (ดู `versions-and-rollback.md`) |
| `wrangler rollback` | Rollback to previous version |
| `wrangler deployments list` | List recent deployments |
| `wrangler deployments status` | View current deployment status |

## Advanced Platform Products

| Command | Description |
|---|---|
| `wrangler pages deploy [dir]` | Deploy Cloudflare Pages (ดู `pages.md`) |
| `wrangler pages dev [dir]` | Pages local dev server |
| `wrangler queues create my-queue` | Create a Queue |
| `wrangler queues list` | List Queues |
| `wrangler queues delete my-queue` | Delete a Queue |
| `wrangler workflows deploy` | Deploy a Workflow |
| `wrangler workflows list` | List Workflows |
| `wrangler workflows instances list` | List Workflow instances |
| `wrangler hyperdrive create my-hd` | Create Hyperdrive config |
| `wrangler hyperdrive list` | List Hyperdrive configs |
| `wrangler vectorize create my-index` | Create Vectorize index |
| `wrangler vectorize list` | List Vectorize indexes |
| `wrangler triggers deploy` | Apply trigger changes (ดู `triggers-and-cron.md`) |

## Global Flags

| Flag | Alias | Description |
|---|---|---|
| `--config` | `-c` | Path to Wrangler configuration file |
| `--env` | `-e` | Environment to use |
| `--cwd` | - | Run as if started in specified directory |
| `--profile` | - | Use a specific auth profile |
| `--version` | `-v` | Show version number |
| `--log-level` | - | Logging level (debug, info, warn, error) |
