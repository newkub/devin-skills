# Service Cloudflare API & Dependencies

## Install

Cloudflare recommends installing Wrangler locally in each project rather than globally:

```sh
bun add -D wrangler
# or
npm install --save-dev wrangler
```

Run it via the package runner:

```sh
bunx wrangler <command>
# or
npx wrangler <command>
```

## Version

- Latest (`wrangler`): 4.129.1
- [Package Registry](https://www.npmjs.com/package/wrangler)
- [Repository](https://github.com/cloudflare/workers-sdk)

## Dependencies

- `wrangler` bundles `esbuild`, `miniflare`, and `workerd` for the local dev server — no extra runtime deps required.
- Optional: `wrangler types` generates `worker-configuration.d.ts`; `@cloudflare/workers-types` is an alternative types package.
- Auth uses `wrangler login` (OAuth) or `CLOUDFLARE_API_TOKEN` env var for CI.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `wrangler init [name]` | Create a new Worker project | interactive prompts | `--yes`, `--from-dash`, `--type` |
| `wrangler dev` | Start local dev server (Miniflare/workerd) | port 8787, local mode | `--port`, `--ip`, `--local`, `--remote`, `--test-scheduled`, `--show-interactive-dev-session` |
| `wrangler deploy` | Deploy Worker to Cloudflare | production env | `--env`, `--name`, `--dry-run`, `--outdir`, `--minify`, `--compatibility-date` |
| `wrangler types` | Generate TypeScript types from `wrangler.toml`/config | `worker-configuration.d.ts` | `--env-interface` |
| `wrangler tail` | Stream live Worker logs | all events | `--format`, `--status`, `--sampling-rate`, `--search` |
| `wrangler delete` | Delete a Worker script | prompts for confirmation | `--name`, `--env`, `--force` |
| `wrangler login` | OAuth login to Cloudflare account | browser flow | `--browser` |
| `wrangler logout` | Remove stored credentials | — | — |
| `wrangler whoami` | Show current user / account / permissions | — | — |
| `wrangler deployments list` | List recent deployments | — | — |
| `wrangler deployments status` | Show current deployment status | — | — |
| `wrangler versions upload` | Upload a new Worker version | not deployed | `--tag`, `--message`, `--preview-alias` |
| `wrangler versions deploy` | Deploy a specific version (gradual rollout) | 100% traffic | `--percentage` |
| `wrangler versions list` | List uploaded versions | — | — |
| `wrangler rollback` | Roll back to a previous deployment | previous version | version ID |
| `wrangler triggers deploy` | Apply cron/route trigger changes | — | — |
| `wrangler secret put <KEY>` | Create/update an encrypted secret | prompts for value | `--env`, `--name` |
| `wrangler secret list` | List secret names (values hidden) | — | `--env` |
| `wrangler secret delete <KEY>` | Delete a secret | prompts | `--env`, `--force` |
| `wrangler secret bulk <file>` | Upload secrets from JSON/.env file | — | `--env` |
| `wrangler kv namespace create <NS>` | Create a KV namespace | — | `--preview`, `--env` |
| `wrangler kv key put <KEY> <VALUE>` | Write a KV entry | — | `--namespace-id`, `--binding`, `--ttl`, `--path` |
| `wrangler kv key get <KEY>` | Read a KV entry | — | `--namespace-id`, `--binding` |
| `wrangler kv key delete <KEY>` | Delete a KV entry | — | `--namespace-id`, `--binding` |
| `wrangler kv bulk put/delete <file>` | Bulk KV operations from JSON | — | `--namespace-id`, `--binding` |
| `wrangler d1 create <NAME>` | Create a D1 database | — | `--location` |
| `wrangler d1 execute <DB> --command <SQL>` | Run SQL against D1 | local | `--remote`, `--file`, `--json` |
| `wrangler d1 migrations apply <DB>` | Apply migration files | local | `--remote`, `--env` |
| `wrangler d1 export <DB>` | Export D1 database to SQL | — | `--output`, `--remote` |
| `wrangler r2 bucket create <NAME>` | Create an R2 bucket | — | `--location`, `--storage-class` |
| `wrangler r2 object put <BUCKET>/<KEY>` | Upload object to R2 | — | `--file`, `--pipe`, `--remote` |
| `wrangler r2 object get <BUCKET>/<KEY>` | Download object from R2 | — | `--file`, `--pipe`, `--remote` |
| `wrangler queues create <NAME>` | Create a Queue | — | `--delivery-delay`, `--message-retention-period` |
| `wrangler queues consumer add <Q> <WORKER>` | Attach a Worker consumer | — | `--batch-size`, `--max-retries`, `--dead-letter-queue` |
| `wrangler pages dev [dir]` | Pages local dev server | — | `--port`, `--binding`, `--kv`, `--d1` |
| `wrangler pages deploy [dir]` | Deploy a Pages project | preview deployment | `--project-name`, `--branch`, `--commit-hash` |
| `wrangler workflows list` | List Workflows | — | — |
| `wrangler workflows instances list <W>` | List Workflow instances | — | — |
| `wrangler hyperdrive create <NAME>` | Create Hyperdrive config | — | `--connection-string`, `--caching-disabled` |
| `wrangler vectorize create <NAME>` | Create a Vectorize index | — | `--dimensions`, `--metric` |
| `wrangler containers deploy` | Deploy a Workers Container | — | `--image` |
| `wrangler secrets-store store create` | Create a Secrets Store | — | `--scopes` |
| `wrangler check startup` | Check Worker startup time / config | — | — |
| `wrangler docs` | Open Wrangler docs search | — | search term |

## Global Flags

| commands | description | default | options |
|---|---|---|---|
| `--config <path>` | Path to Wrangler config file | `wrangler.toml` / `wrangler.json(c)` | `-c` |
| `--env <name>` | Target environment in config | top-level env | `-e` |
| `--cwd <path>` | Run as if started in directory | current dir | — |
| `--profile <name>` | Use a specific auth profile | default profile | — |
| `--log-level <level>` | Logging verbosity | `log` | `debug`, `info`, `warn`, `error` |
| `--version` / `--help` | Show version / help | — | `-v`, `-h` |

## Source

- Official docs: https://developers.cloudflare.com/workers/wrangler/commands/
- Install & update: https://developers.cloudflare.com/workers/wrangler/install-and-update/
- Workers docs: https://developers.cloudflare.com/workers/
