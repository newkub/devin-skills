# Service Vercel Cli API & Dependencies

## Install

Local (per project, recommended):

```sh
bun add -D vercel
# or
npm install --save-dev vercel
```

Global:

```sh
bun add -g vercel
# or
npm install -g vercel
```

Experimental native binaries (no Node.js needed):

```sh
npm install -g @vercel/vc-native -f   # replaces `vercel` and `vc` bins
```

## Version

- Latest (`vercel`): 59.11.7
- Node.js requirement: `>= 18`
- [Package Registry](https://www.npmjs.com/package/vercel)
- [Repository](https://github.com/vercel/vercel) (`packages/cli`)

## Dependencies

- The `vercel` npm package ships the `vercel` and `vc` binaries; also published as `@vercel/vc-native` per-OS binaries.
- Auth: `vercel login` (interactive) or `VERCEL_TOKEN` env var / `--token` flag for CI — the flag takes precedence over the env var.
- Self-update: `vercel upgrade`; `--version` prints the installed version.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `vercel` / `vercel deploy` | Deploy current directory to a preview URL | preview | `--prod`, `--yes`, `--name`, `--archive`, `--force` |
| `vercel --prod` | Deploy to production | — | `--archive=tgz` |
| `vercel dev` | Local dev server replicating Vercel env | auto-detects framework | `--listen <port>` |
| `vercel build` | Build project locally (same as CI) | preview | `--prod`, `--target` |
| `vercel pull` | Download project settings + env vars to `.vercel/` | development env | `--environment=preview|production`, `--git-branch` |
| `vercel link` | Link directory to a Vercel project (writes `.vercel/project.json`) | interactive | `--project`, `--yes`, `--repo` |
| `vercel init <template>` | Scaffold a project from an example | — | `vercel init` lists templates |
| `vercel login` | Authenticate account | interactive | provider flags (GitHub/GitLab/Bitbucket/email/SAML) |
| `vercel logout` | Remove local credentials | — | — |
| `vercel whoami` | Show current user | — | — |
| `vercel switch` / `vercel teams` | Switch or manage team scope | — | `vercel teams ls/add/invite` |
| `vercel list` / `vercel ls` | List deployments for the project | — | `--meta`, filter args |
| `vercel inspect <url>` | Deployment details (builds, routes, regions) | — | — |
| `vercel logs <url>` | Runtime/build logs for a deployment | — | `--follow`, `--since`, `--until` |
| `vercel env ls` | List env vars | development | `<environment>` arg, `--git-branch` |
| `vercel env add <NAME>` | Add an env var | all environments | environment arg, `--sensitive`, `--git-branch`, `--force` |
| `vercel env pull [file]` | Download env vars to a file | `.env.local` | `--environment`, `--git-branch`, `--yes` |
| `vercel env rm <NAME> <env>` | Remove an env var | prompts | `--yes` |
| `vercel secrets add/ls/rm` | Legacy secrets management | — | prefer `env` for new projects |
| `vercel domains ls/add/inspect/buy` | Manage domains | — | `vercel domains verify`, `transfer-in` |
| `vercel dns ls/add/rm` | Manage DNS records | — | record type args |
| `vercel certs ls/issue/rm` | Manage SSL certificates | auto-issued | `vercel certs issue <cn>` |
| `vercel alias set <url> <domain>` | Point an alias/domain at a deployment | — | `vercel alias ls`, `vercel alias rm` |
| `vercel promote <url>` | Promote a deployment to production | — | `--timeout` |
| `vercel rollback <url>` | Roll back production to a deployment | — | `--timeout` |
| `vercel rolling-release` | Configure gradual rollout | — | subcommands for approve/configure |
| `vercel remove <name>` | Delete deployments or projects | prompts | `--yes`, `--safe` |
| `vercel redeploy <url>` | Re-deploy an existing deployment | — | — |
| `vercel bisect` | Binary-search deployments to find a bad deploy | interactive | `--good`, `--bad`, `--path`, `--run` |
| `vercel git connect/disconnect` | Manage Git integration | — | — |
| `vercel deploy-hooks` | Manage deploy hooks | — | create/list/remove |
| `vercel project ls/add/rm/inspect` | Manage projects | — | — |
| `vercel target` | Show/set deployment target context | — | `ls`, custom targets |
| `vercel blob list/put/get/del/copy` | Manage Vercel Blob storage | — | — |
| `vercel crons ls` | List cron jobs | — | — |
| `vercel firewall` | Manage WAF/firewall rules | — | — |
| `vercel flags` | Manage feature flags / traffic splits | — | — |
| `vercel integration` | Install/manage Marketplace integrations | — | `install`, `discover`, `open` |
| `vercel install` | Provision Marketplace resources into the project | — | — |
| `vercel open` | Open the project dashboard in browser | — | — |
| `vercel inspect`/`vercel metrics`/`vercel traces`/`vercel usage` | Observability + usage data | — | per-command filters |
| `vercel sandbox` | Run code in a Vercel Sandbox | — | subcommands |
| `vercel mcp` | Vercel MCP server helpers | — | — |
| `vercel agent init` | Generate `AGENTS.md` deploy guidance | — | `--yes` |
| `vercel api <endpoint>` | Authenticated REST API calls (beta) | GET | `-X`, `-F` |
| `vercel curl <path>` | Curl with Vercel auth context | — | — |
| `vercel oauth-apps` / `vercel tokens` / `vercel webhooks` | OAuth apps, tokens, webhooks | — | per-command subcommands |
| `vercel telemetry` | Manage CLI telemetry | — | `status`, `enable`, `disable` |
| `vercel upgrade` | Self-update the CLI | — | `--dry-run`, `--enable-auto` |

## Global Options

| commands | description | default | options |
|---|---|---|---|
| `--token <token>` | Auth token (overrides `VERCEL_TOKEN`) | env var | — |
| `--scope <team>` | Run against a team scope | personal account | — |
| `--cwd <path>` | Working directory | current dir | — |
| `--yes` | Skip confirmation prompts | off | `-y` |
| `--debug` | Verbose debug output | off | `-d` |
| `--global-config <path>` | Custom global config path | `~/.vercel` or platform config dir | — |
| `--local-config <path>` | Custom `vercel.json` path | `./vercel.json` | — |
| `--version` / `--help` | Version / help | — | `-v`, `-h` |

## Source

- Official docs: https://vercel.com/docs/cli
- Global options: https://vercel.com/docs/cli/global-options
- Command pages: https://vercel.com/docs/cli/deploy, https://vercel.com/docs/cli/dev, https://vercel.com/docs/cli/env, https://vercel.com/docs/cli/login
- Repo: https://github.com/vercel/vercel/tree/main/packages/cli
