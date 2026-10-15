---
name: follow-service-vercel
description: Deploy applications on Vercel with serverless and edge functions
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deploy-to-vercel
  - watch-browser
  - resolve-errors
  - loop-until-complete

---

## Goal

Deploy applications on the Vercel platform with auto-build, preview deployments, serverless functions, and edge functions

## Scope
- For related skills: `open-web-for-config-secret`, `follow-service-vercel`, `deploy-to-vercel`

Covers installing the Vercel CLI, linking a project, configuring, building, deploying, environment variables, serverless/edge functions, and CI/CD

## Execute

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `## Merged Details → setup-vercel` — Vercel CLI, login, link project |
| Config | `## Merged Details → config-vercel` — env vars, `vercel.json` config |
| Verify | `## Merged Details → verify-connection` — CLI auth, project linked, env vars complete |

Read `workflows/<name>/SKILL.md` per topic and follow the flow there — do not execute from this table directly

### 1. Install Vercel CLI

> Goal: Install and authenticate the Vercel CLI

Latest: `vercel@60.1.3` CLI, `@vercel/node` builder (verified 2026-09-26)

1. Run `bun add -D vercel`
2. Or use `bunx vercel` without installing
3. Run `bunx vercel login` to authenticate

### 2. Link Project

> Goal: Connect the project with Vercel

1. Run `bunx vercel link` in the project directory
2. Confirm the project settings
3. Or use `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` for CI/CD

### 3. Configure vercel.json

> Goal: Define the deployment configuration

`vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/src/index.ts" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. Framework Presets

> Goal: Vercel supports auto-detection for frameworks

- Next.js: uses the `next` preset automatically
- Nuxt: uses the `nuxt` preset with SSR
- SvelteKit: uses the `sveltekit` preset
- Remix: uses the `remix` preset
- Astro: uses the `astro` preset
- Vite: uses the `vite` preset for a static build

### 5. Build And Deploy

> Goal: Build and deploy the application

1. Run `bun run build` or `nitro build` for Nitro projects
2. Verify the build succeeds and the output is ready
3. Run `bunx vercel deploy` for a preview deployment
4. Run `bunx vercel deploy --prod` for production
5. For Nitro: set the `vercel` preset in the nitro config, then run `nitro build` and `bunx vercel deploy --prebuilt`

### 6. Environment Variables

> Goal: Set environment variables

1. Run `bunx vercel env add KEY_NAME`
2. Or use the dashboard to manage variables
3. Use `vercel env pull .env.local` to sync to local
4. Define `NODE_ENV`, `API_URL`, and secrets

### 7. Serverless Functions

> Goal: Create serverless functions in the `api/` directory

`api/hello.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Hello from Vercel' })
}
```

### 8. Edge Functions

> Goal: Create edge functions for edge deployment

`api/edge.ts`:
```typescript
export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  return new Response('Hello from Edge Function')
}
```

### 9. Watch Deployment

> Goal: Check the deployment with a browser preview

1. Do `/watch-browser fix` with the deployment URL
2. Verify the page loads successfully
3. Check console errors and network errors
4. Do `/resolve-errors` when a problem is found
5. Do `/loop-until-complete` until the deployment is live

### 10. CI/CD Deployment

> Goal: Set up automated deployment

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bunx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Rules

### 1. Framework Detection

- Vercel auto-detects the framework from `package.json`
- Define `buildCommand` in `package.json` scripts or `vercel.json`
- Specify `outputDirectory`: `dist`, `build`, or `.next` per framework
- Use `bun install` for Bun projects

### 2. Build Process

- Always run `nitro build` before deploying Nitro projects
- Verify the build output succeeds
- Check the bundle size

### 3. Environment Variables

- Use the `vercel env` CLI or the dashboard
- Use `/follow-secret-manager` to manage `VERCEL_TOKEN` and secrets before syncing to Vercel or CI/CD
- Use `vercel env pull` to sync to local
- Never hardcode secrets

### 4. Functions

- Serverless functions live in the `api/` directory
- Edge functions use `runtime: 'edge'`
- Define `regions` in `vercel.json` when needed

### 5. Deployment

- Every PR creates a preview deployment automatically
- Use `bunx vercel deploy` for preview
- Use `bunx vercel deploy --prod` for production
- Set protection rules for production deployments
- Use `/watch-browser fix` for monitoring
- Do `/loop-until-complete` until the deployment is live

### 6. Advanced Configuration

- Define `rewrites` in `vercel.json` for URL routing
- Define `headers` for security and caching
- Use `crons` for scheduled functions
- Use `ignoreCommand` to skip builds

## Merged Details

### config-vercel

##### Goal

Set/edit Vercel configuration — environment variables and `vercel.json` (rewrites, headers, functions, crons) — without clobbering existing settings

##### Scope

- Covers `vercel.json`, `vercel env`, and project settings
- If the project is not linked yet → do `## Merged Details → setup-vercel` first
- Real deploy → `/deploy-to-vercel`

##### Execute

###### 1. Read Current Config

> Goal: Know the current config before editing

1. Read `vercel.json`, `.vercel/project.json`, and existing env files
2. Run `bunx vercel pull` to sync the latest project settings from the dashboard
3. Do `/deep-review-codebase` domain `review-config` or `/report-config-files` if drift must be known

###### 2. Configure Environment Variables

> Goal: env vars correct per environment

1. Add a key with `bunx vercel env add KEY_NAME` — pick the environment (production/preview/development)
2. Sync to local with `bunx vercel env pull .env.local`
3. secrets → `/follow-secret-manager` first, then push up to Vercel — never put them in `vercel.json`

###### 3. Configure vercel.json

> Goal: config file correct per schema

1. Edit only the necessary keys in `vercel.json` — merge with the existing one, never overwrite the whole file
2. Commonly used keys: `rewrites`, `redirects`, `headers`, `functions`, `crons`, `regions`, `ignoreCommand`
3. Set `buildCommand`/`outputDirectory` only when framework detection is wrong — see official docs https://vercel.com/docs/projects/project-configuration

###### 4. Verify

> Goal: config works for real before deploy

1. Run `bunx vercel build` to check the config builds locally
2. Do `/run-verify` for lint, typecheck
3. If broken → revert the key just changed, then report the diff with `/report-before-after`

##### Rules

- Never put secrets in `vercel.json` or commit `.env.local`
- Edit config incrementally — change one key then verify
- Every added env var must clearly state its target environment

##### Expected Outcome

- env vars synced correctly between local and Vercel
- `vercel.json` passes schema and `vercel build` succeeds
- ready to deploy with `/deploy-to-vercel`

### setup-vercel

##### Goal

Install the Vercel CLI, authenticate, and link the project with Vercel — first-time setup before deploy

##### Scope

- Install the `vercel` CLI, `vercel login`, `vercel link`
- Create `.vercel/project.json` containing `orgId`/`projectId`
- If already linked → verify only; config env/vercel.json → `## Merged Details → config-vercel`; deploy → `/deploy-to-vercel`

##### Execute

###### 1. Check Prerequisites

> Goal: Confirm the project is ready and not yet linked

1. Check `package.json` for `vercel` already present, and see whether `.vercel/project.json` exists
2. If `.vercel/project.json` already exists → skip to the verify step
3. Add `.vercel` to `.gitignore` if it is not there

###### 2. Install CLI

> Goal: Have the Vercel CLI ready to use

1. Run `bun add -D vercel` or use `bunx vercel` without installing
2. Verify the CLI works with `bunx vercel --version`

###### 3. Authenticate

> Goal: CLI logs in to the Vercel account

1. Run `bunx vercel login` and let the user confirm via email/provider
2. Verify auth with `bunx vercel whoami`
3. For CI/CD → store `VERCEL_TOKEN` via `/follow-secret-manager`

###### 4. Link Project

> Goal: Connect the project with a Vercel project

1. Run `bunx vercel link` in the project root, then pick the scope and project (new or existing)
2. Verify `.vercel/project.json` contains `orgId` and `projectId`
3. For CI → store `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` via `/follow-secret-manager`

###### 5. Verify

> Goal: Setup is ready to deploy

1. Run `bunx vercel pull` to sync project settings/env to local
2. Do `/run-verify` for lint, typecheck
3. If verify fails → do `/resolve-errors` max 3 rounds, then stop and report
4. Success → do `/suggest-next-action`

##### Rules

- Never commit `.vercel/` or `VERCEL_TOKEN`
- Use `bunx vercel` or a dev dependency — never rely on an unpinned global install
- Use official docs as the primary source — if unsure → see https://vercel.com/docs

##### Expected Outcome

- Vercel CLI installed and authenticated
- Project linked with `.vercel/project.json`
- Ready for `## Merged Details → config-vercel` or `/deploy-to-vercel`

### verify-connection

##### Goal

Confirm after setup/config that Vercel really connects — CLI authenticated, project linked, env vars fully synced

##### Scope

- Used when `/follow-service-vercel` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not deploy or change env

##### Execute

###### 1. Check CLI Auth

> Goal: vercel login and the correct scope

1. `vercel whoami` — must return the user/team
2. Check the scope matches the project owner (personal vs team) — `vercel teams ls` if needed
3. Auth fail → recommend `## Merged Details → setup-vercel` — do not log in yourself

###### 2. Check Project Link

> Goal: The local project is linked to the correct Vercel project

1. Check `.vercel/project.json` — `projectId`/`orgId` exist and match the expected project
2. `vercel project ls` to find the project — flag if the link points to the wrong project
3. `vercel env ls` — the env vars the code needs exist on Vercel (compare with `.env.example`)

###### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `not-linked` / `env-missing`

##### Rules

- Use ls/inspect commands only — never deploy or env add
- Do not print env var values — show only the missing names
- not-linked → report to run `vercel link` via the setup workflow

##### Expected Outcome

- Verdict with project/org + env coverage evidence

### workflows/deploy-to-vercel

#### Deploy to Vercel

Workflow for deploying projects to Vercel.

##### Steps

1. Install Vercel CLI
   ```bash
   bun i -g vercel
   ```

2. Login to Vercel
   ```bash
   vercel login
   ```

3. Initialize project
   ```bash
   vercel
   ```

4. Configure project settings
   - Set framework preset
   - Configure build settings
   - Set environment variables

5. Deploy
   ```bash
   vercel --prod
   ```

##### Example: Deploy Next.js

```bash
npx create-next-app@latest my-app
cd my-app
vercel
```

##### Example: Deploy Static Site

```bash
vercel --prod
```

##### Best Practices

- Use environment variables for secrets
- Enable preview deployments
- Configure custom domains
- Monitor analytics
- Set up automated deployments

### references/apis

#### Service Vercel API & Dependencies

The Vercel platform is managed via the REST API (`https://api.vercel.com`), the official TypeScript SDK `@vercel/sdk`, and product SDKs for storage and compute primitives.

##### Install

Programmatic platform control (REST API SDK):

```sh
bun add @vercel/sdk
#### or
npm install @vercel/sdk
```

Product SDKs (install what the app uses):

```sh
bun add @vercel/blob        # file/blob storage
bun add @vercel/kv          # Redis-compatible key-value (Upstash)
bun add @vercel/postgres    # serverless Postgres
bun add @vercel/functions   # runtime helpers (waitUntil, geo, ip)
bun add @vercel/edge-config # edge config reads
bun add @vercel/analytics @vercel/speed-insights  # observability
```

##### Version

- `@vercel/sdk`: 1.28.28
- `@vercel/blob`: 2.8.0 · `@vercel/kv`: 3.0.0 · `@vercel/postgres`: 0.10.0 · `@vercel/functions`: 3.9.5
- Vercel CLI (`vercel` package, see `follow-service-vercel-cli`): 59.11.7
- [Package Registry (@vercel/sdk)](https://www.npmjs.com/package/@vercel/sdk)
- [Repository (@vercel/sdk)](https://github.com/vercel/sdk)
- [Repository (platform/CLI)](https://github.com/vercel/vercel)

##### Dependencies

- `@vercel/sdk` is a generated, fully typed client for the Vercel REST API; authenticate with `bearerToken` (create at https://vercel.com/account/tokens).
- Product SDKs read env vars injected by Vercel (`BLOB_READ_WRITE_TOKEN`, `KV_REST_API_URL`/`KV_REST_API_TOKEN`, `POSTGRES_URL`, `EDGE_CONFIG`) — create resources via dashboard or `vercel link`/`vercel env`.
- For CI prefer `VERCEL_TOKEN` env var or `--token` flag rather than embedding tokens.

##### Common API / Commands

`@vercel/sdk` — platform management:

| commands | description | default | options |
|---|---|---|---|
| `new Vercel({ bearerToken })` | Create SDK client | `https://api.vercel.com` | `serverURL`, `httpClient` |
| `vercel.projects.getProjects()` | List projects | team of token | `teamId`, `slug`, `limit`, `search` |
| `vercel.projects.createProject({ requestBody })` | Create a project | — | `name`, `framework`, `gitRepository`, `environmentVariables` |
| `vercel.projects.updateProject({ idOrName, requestBody })` | Update project settings | — | `name`, `sandbox.region`, `failoverRegions`, etc. |
| `vercel.projects.deleteProject({ idOrName })` | Delete a project | — | `teamId` |
| `vercel.deployments.createDeployment({ requestBody })` | Create a deployment | — | `name`, `files`, `projectSettings`, `target` |
| `vercel.deployments.getDeployments()` | List deployments | — | `projectId`, `target`, `state`, `limit` |
| `vercel.deployments.getDeployment({ idOrUrl })` | Get one deployment | — | `teamId` |
| `vercel.deployments.cancelDeployment({ id })` | Cancel a running deployment | — | — |
| `vercel.domains.*` / `vercel.dns.*` | Manage domains and DNS records | — | `domain`, `teamId` |
| `vercel.aliases.*` | Assign aliases to deployments | — | — |
| `vercel.teams.*` / `vercel.user.*` | Team + account info | — | — |
| `vercel.artifacts.uploadArtifact(...)` | Remote cache artifacts (Turborepo) | — | — |
| `vercel.checks.*` / `vercel.checksV2.*` | Deployment checks (integrations) | — | — |
| `vercel.accessGroups.*` / `vercel.authentication.*` / `vercel.security.*` | Access + auth management | — | — |
| `vercel.webhooks.*` / `vercel.logDrains.*` / `vercel.integrations.*` | Webhooks, log drains, marketplace | — | — |
| standalone `funcs/*` imports | Tree-shakeable method calls, return `Result<T, E>` | — | `import { projectsUpdateProject } from '@vercel/sdk/funcs/projectsUpdateProject.js'` |

Product SDKs:

| commands | description | default | options |
|---|---|---|---|
| `put(pathname, body, opts)` (`@vercel/blob`) | Upload a blob | `access: 'public'` | `access`, `addRandomSuffix`, `token`, `multipart` |
| `list()` / `del(url)` / `head(url)` / `copy()` (`@vercel/blob`) | Blob management | — | `prefix`, `limit`, `cursor` |
| `kv.get/set/del/incr/hset/expire` (`@vercel/kv`) | Redis-style commands via `@vercel/kv` | — | `ex`, `nx`, pipeline via `kv.pipeline()` |
| `sql` tagged template (`@vercel/postgres`) | Parameterized queries | pooled connection | `sql.query()`, `createClient()` for transactions |
| `waitUntil(promise)` (`@vercel/functions`) | Extend function lifetime after response | — | — |
| `geolocation(req)` / `ipAddress(req)` (`@vercel/functions`) | Request geo/IP headers | — | — |
| `getEnv()` / `oidc` helpers (`@vercel/functions`) | Runtime metadata + OIDC token for AWS/GCP | — | — |
| `createClient(connectionString)` / `get(id)` (`@vercel/edge-config`) | Read Edge Config values | — | — |
| `<Analytics />` / `<SpeedInsights />` | React components for Web Analytics | — | framework variants: `/react`, `/next`, `/sveltekit`, etc. |

Platform configuration (`vercel.json` — per-project):

| commands | description | default | options |
|---|---|---|---|
| `buildCommand` / `outputDirectory` / `installCommand` | Override build settings | framework preset | strings or `null` to disable |
| `functions` | Serverless/edge function config | — | `maxDuration`, `memory`, `runtime`, `includeFiles` |
| `regions` | Function deployment regions | `iad1` | e.g. `["iad1", "fra1"]` |
| `rewrites` / `redirects` / `headers` / `cleanUrls` / `trailingSlash` | Routing + headers | — | arrays of rules |
| `crons` | Cron jobs hitting endpoints | — | `path`, `schedule` |

##### Source

- Vercel REST API: https://vercel.com/docs/rest-api
- `@vercel/sdk` README: https://github.com/vercel/sdk#readme
- CLI docs (see also `follow-service-vercel-cli`): https://vercel.com/docs/cli
- Blob/KV/Postgres/Functions: https://vercel.com/docs/storage, https://vercel.com/docs/functions
- `vercel.json` config: https://vercel.com/docs/projects/project-configuration

### references/follow-service-vercel-cli--apis

#### Service Vercel Cli API & Dependencies

##### Install

Local (per project, recommended):

```sh
bun add -D vercel
#### or
npm install --save-dev vercel
```

Global:

```sh
bun add -g vercel
#### or
npm install -g vercel
```

Experimental native binaries (no Node.js needed):

```sh
npm install -g @vercel/vc-native -f   # replaces `vercel` and `vc` bins
```

##### Version

- Latest (`vercel`): 59.11.7
- Node.js requirement: `>= 18`
- [Package Registry](https://www.npmjs.com/package/vercel)
- [Repository](https://github.com/vercel/vercel) (`packages/cli`)

##### Dependencies

- The `vercel` npm package ships the `vercel` and `vc` binaries; also published as `@vercel/vc-native` per-OS binaries.
- Auth: `vercel login` (interactive) or `VERCEL_TOKEN` env var / `--token` flag for CI — the flag takes precedence over the env var.
- Self-update: `vercel upgrade`; `--version` prints the installed version.

##### Common API / Commands

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

##### Global Options

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

##### Source

- Official docs: https://vercel.com/docs/cli
- Global options: https://vercel.com/docs/cli/global-options
- Command pages: https://vercel.com/docs/cli/deploy, https://vercel.com/docs/cli/dev, https://vercel.com/docs/cli/env, https://vercel.com/docs/cli/login
- Repo: https://github.com/vercel/vercel/tree/main/packages/cli

### references/follow-service-vercel-cli--routes

#### Follow Service Vercel Cli Route Map

- Website: <https://vercel.com>
- Documentation: <https://vercel.com/docs>
- Total routes discovered: 5000

##### Top routes by section

###### /
- /

###### about
- /about

###### academy
- /academy
- /academy/agent-friendly-apis
- /academy/agent-friendly-apis/add-llms-txt
- ... and 206 more

###### agent
- /agent

###### agents
- /agents

###### ai
- /ai

###### ai-accelerator
- /ai-accelerator

###### ai-gateway
- /ai-gateway
- /ai-gateway/leaderboards/apps
- /ai-gateway/leaderboards/labs
- ... and 270 more

###### ai-sdk
- /ai-sdk

###### blog
- /blog
- /blog/10-next-js-tips-you-might-not-know
- /blog/10-years-of-react
- ... and 487 more

###### careers
- /careers
- /careers/engineering-manager-cdn-5701765004
- /careers/enterprise-account-executive-5042174004
- ... and 20 more

###### changelog
- /changelog
- /changelog/16x-larger-environment-variable-storage-up-to-64kb
- /changelog/2024-01-account-changes
- ... and 1104 more

###### connect
- /connect
- /connect/box
- /connect/g2
- ... and 2 more

###### contact
- /contact
- /contact/partnerships
- /contact/sales

###### customers
- /customers
- /customers/architecting-reliability-stripes-black-friday-site
- /customers/core-construction
- ... and 15 more

###### docs
- /docs
- /docs/accounts
- /docs/activity-log
- ... and 1578 more

###### domains
- /domains

###### enterprise
- /enterprise

###### eve
- /eve

###### events
- /events

### references/follow-service-vercel-cli--vercel-cli

#### Vercel CLI Reference

##### Overview

Vercel CLI is the command-line interface for the Vercel platform. It allows you to deploy, manage, and monitor projects from the terminal, including Next.js, Nuxt, React, and other frameworks.

##### Version Info

- Package: `vercel`
- Latest stable: `59.5.0`
- Node.js requirement: `>= 18`
- License: Apache-2.0
- npm: https://www.npmjs.com/package/vercel

##### Install

```sh
bun add vercel
#### or
pnpm i vercel
#### or
yarn i vercel
#### or
bun i vercel
```

For global install:

```sh
bun add -g vercel
#### or
bun add -g vercel
```

Verify installation:

```sh
vercel --version
```

###### Update

```sh
vercel upgrade
vercel upgrade --dry-run
vercel upgrade --enable-auto
```

Or re-run the install command. Running any command shows an update message when a new version is available.

##### Authentication

```sh
vercel login       # Interactive login
vercel whoami      # Check current authentication
```

For CI/CD, create a token on your [tokens page](https://vercel.com/account/tokens) and authenticate via:
- Set `VERCEL_TOKEN` environment variable (recommended)
- Pass `--token` option to commands

##### Core Commands

###### Deploy

```sh
vercel                    # Create preview deployment
vercel --prod             # Deploy to production
vercel --prebuilt         # Deploy prebuilt output
vercel build              # Build locally
vercel build --prod       # Build for production locally
```

###### Project Management

```sh
vercel link               # Link existing project to Vercel
vercel list               # List deployments
vercel inspect [url]      # Inspect a deployment
vercel ls                 # List projects
```

###### Local Development

```sh
vercel dev                # Start local dev server
vercel dev --listen 3001  # Custom port
```

###### Logs

```sh
vercel logs [url]         # View deployment logs
vercel logs --prod        # View production logs
vercel logs --level error # Filter by level
```

###### Environment Variables

```sh
vercel env add KEY_NAME           # Add environment variable
vercel env ls                     # List environment variables
vercel env pull [file]            # Pull env vars to .env file
vercel env pull .env.local        # Pull to specific file
vercel env rm KEY_NAME            # Remove environment variable
```

###### Domains

```sh
vercel domains add example.com    # Add custom domain
vercel domains ls                 # List domains
vercel domains rm example.com     # Remove domain
vercel alias set [url] [domain]   # Set alias
vercel alias ls                   # List aliases
vercel alias rm [domain]          # Remove alias
```

###### Certificates

```sh
vercel certs ls                   # List certificates
vercel certs issue [domain]       # Issue certificate
vercel certs rm [cert-id]         # Remove certificate
```

###### Rollback

```sh
vercel rollback [url]             # Rollback to previous deployment
```

###### Cache

```sh
vercel cache purge                # Purge all cache
vercel cache purge --type cdn     # Purge CDN cache
vercel cache purge --type data    # Purge data cache
vercel cache invalidate --tag foo # Invalidate by tag
```

##### Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

##### CI/CD Integration

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: npm ci
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

Using `VERCEL_TOKEN` environment variable is recommended over `--token` flag to avoid exposing the token in process lists.

##### Native CLI Binaries (Experimental)

Native binaries reduce setup where Node.js is unnecessary:

```sh
bun add -g @vercel/vc-native -f
```

The `-f` flag replaces existing global `vercel` and `vc` bin links. Supports macOS, Linux, and Windows on x64 and arm64.

##### Source

- [Vercel CLI Overview](https://vercel.com/docs/cli)
- [Vercel CLI Upgrade](https://vercel.com/docs/cli/upgrade)
- [Getting Started with Vercel](https://vercel.com/docs/getting-started-with-vercel)
- [Vercel CLI Release Notes](https://vercel.com/docs/cli/release-notes)

### references/follow-service-vercel-cli--website

#### Service Vercel Cli Official Resources

- [Website](https://vercel.com)
- [Documentation](https://vercel.com/docs)
- [Repository](https://github.com/vercel/vercel)
- [Package Registry](https://www.npmjs.com/package/vercel)
- About: The autonomous stack for every app and agent.

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review-codebase` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `vercel` (Vercel CLI) |
| Registry | `npm` |
| Latest Version | `59.18.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Vercel |
| License | `Apache-2.0` |
| Repository | `https://github.com/vercel/vercel` |
| Website | `https://vercel.com` |
| Documentation | `https://vercel.com/docs/cli` |
| Releases / Changelog | `https://github.com/vercel/vercel/releases` |

##### Install

```bash
bun add -D vercel
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@vercel/node` | `npm` | `13.0.0` | Builder/runtime types (`VercelRequest`, `VercelResponse`) for `api/` serverless functions |

##### Notes

- Breaking changes in latest major: CLI moves fast; `vercel deploy --prod` and `vercel env` flows unchanged; `@vercel/node` major 13 aligns with current build runtime
- Version pinned in SKILL.md: `vercel@59.18.0`

### references/routes

#### Follow Service Vercel Route Map

- Website: <https://vercel.com>
- Documentation: <https://vercel.com/docs>
- Total routes discovered: 5000

##### Top routes by section

###### /
- /

###### about
- /about

###### academy
- /academy
- /academy/agent-friendly-apis
- /academy/agent-friendly-apis/add-llms-txt
- ... and 206 more

###### agent
- /agent

###### agents
- /agents

###### ai
- /ai

###### ai-accelerator
- /ai-accelerator

###### ai-gateway
- /ai-gateway
- /ai-gateway/leaderboards/apps
- /ai-gateway/leaderboards/labs
- ... and 270 more

###### ai-sdk
- /ai-sdk

###### blog
- /blog
- /blog/10-next-js-tips-you-might-not-know
- /blog/10-years-of-react
- ... and 487 more

###### careers
- /careers
- /careers/engineering-manager-cdn-5701765004
- /careers/enterprise-account-executive-5042174004
- ... and 20 more

###### changelog
- /changelog
- /changelog/16x-larger-environment-variable-storage-up-to-64kb
- /changelog/2024-01-account-changes
- ... and 1104 more

###### connect
- /connect
- /connect/box
- /connect/g2
- ... and 2 more

###### contact
- /contact
- /contact/partnerships
- /contact/sales

###### customers
- /customers
- /customers/architecting-reliability-stripes-black-friday-site
- /customers/core-construction
- ... and 15 more

###### docs
- /docs
- /docs/accounts
- /docs/activity-log
- ... and 1578 more

###### domains
- /domains

###### enterprise
- /enterprise

###### eve
- /eve

###### events
- /events

### references/vercel-cli

#### follow-service-vercel-cli (merged content)

##### Goal

Use the Vercel CLI to deploy, manage, and monitor projects on the Vercel platform

##### Scope

Used for projects deployed to Vercel, including Next.js, Nuxt, React, and other frameworks

##### Execute

###### 1. Install And Authenticate

> Goal: Install And Authenticate

Install and set up the Vercel CLI

1. Install the Vercel CLI with `bun add -g vercel` or `bun add -g vercel`
2. Check the version with `vercel --version`
3. Log in with `vercel login` to connect to the Vercel account
4. Pick the team and scope you want
5. Verify authentication with `vercel whoami`

###### 2. Initialize Project

> Goal: Initialize Project

Create and link the project with Vercel

1. Link an existing project with `vercel link`
2. Create a new project with `vercel`
3. Set the project name and settings
4. Pick a framework preset or custom build settings
5. Create a `vercel.json` config file when needed

###### 3. Local Development

> Goal: Local Development

Develop and test in the local environment

1. Run the local dev server with `vercel dev`
2. Check logs and errors in the terminal
3. Use the `--listen` flag for a custom port
4. Test environment variables and build settings
5. Simulate the production environment locally

###### 4. Deploy To Preview

> Goal: Deploy To Preview

Deploy to preview environments

1. Deploy with `vercel` to create a preview deployment
2. Check the deployment URL and status
3. View logs with `vercel logs`
4. Test the preview deployment before merge
5. Share the preview URL for code review

###### 5. Deploy To Production

> Goal: Deploy To Production

Deploy to the production environment

1. Deploy to production with `vercel --prod`
2. Use the `--prebuilt` flag for prebuilt deployments
3. Check the production deployment status
4. Monitor production logs with `vercel logs --prod`
5. Roll back when needed with `vercel rollback`

###### 6. Manage Environment Variables

> Goal: Manage Environment Variables

Manage environment variables and secrets

1. Set an environment variable with `vercel env add`
2. List environment variables with `vercel env ls`
3. Pull environment variables with `vercel env pull`
4. Use environment-specific variables with `--environment`
5. Never commit secrets to git

###### 7. Monitor And Debug

> Goal: Monitor And Debug

Monitor and debug deployments

1. View logs with `vercel logs`
2. Filter logs with the `--level` flag
3. Monitor a specific deployment with `--deployment`
4. Inspect build output with `vercel inspect`
5. View deployment metrics with `vercel metrics`

###### 8. Manage Domains

> Goal: Manage Domains

Manage custom domains

1. Add a custom domain with `vercel domains add`
2. List domains with `vercel domains ls`
3. Remove a domain with `vercel domains rm`
4. Verify DNS configuration
5. SSL certificates are configured automatically

###### 9. Team And Project Management

> Goal: Team And Project Management

Manage teams and projects

1. List projects with `vercel list`
2. Switch teams with `vercel switch`
3. Manage team members via the dashboard
4. Configure project settings
5. Manage billing and usage

##### Rules

###### 1. Configuration Management

Manage configuration files systematically

- Use `vercel.json` for custom build settings
- Set `buildCommand` and `outputDirectory` correctly
- Use environment-specific configs with `--environment`
- Never hardcode secrets in config files
- Use `.env` files for local development
- Use the Vercel dashboard for sensitive configs

###### 2. Deployment Best Practices

Follow deployment best practices

- Always deploy to preview before production
- Use Git integration for automatic deployments
- Test preview deployments before merging a PR
- Use `--prebuilt` for faster deployments
- Monitor logs after every deploy
- Set deployment protection for production

###### 3. Environment Variable Security

Keep environment variables secure

- Never commit secrets to version control
- Use `/follow-secret-manager` to manage `VERCEL_TOKEN` and secrets instead of plain `.env`
- Use `vercel env add` instead of editing config files
- Use environment-specific variables for isolation
- Rotate secrets regularly
- Check variable access logs
- Use different environments for dev/staging/prod

###### 4. Development Workflow

Use an efficient development workflow

- Use `vercel dev` for local development
- Simulate the production environment locally
- Test environment variables locally
- Monitor logs and errors in real time
- Use Git integration for automatic preview deployments
- Use branch-based deployments for feature branches

###### 5. Performance Optimization

Improve deployment performance

- Use the `--prebuilt` flag for faster builds
- Optimize the build process with caching
- Use edge functions for dynamic content
- Monitor build times and deployment duration
- Use image optimization for assets
- Check bundle size and loading performance

###### 6. CI/CD Integration

Integrate the Vercel CLI with CI/CD pipelines

- Use `VERCEL_TOKEN` for authentication
- Use `vercel --prod --token` in CI
- Set environment variables in CI/CD
- Use `vercel env pull` for local development
- Test before deploy with `vercel dev`
- Use GitHub Actions or GitLab CI for automation

###### 7. Monitoring And Debugging

Monitor and debug deployments effectively

- Use `vercel logs` for real-time monitoring
- Filter logs with `--level error` for errors
- Monitor a specific deployment with `--deployment`
- Use `vercel inspect` for build debugging
- Check deployment metrics and analytics
- Use the Vercel dashboard for detailed insights

- Use /open-web-for-config-secret if needed
- Use /follow-service-vercel if needed

##### Expected Outcome

- Vercel CLI installed and configured correctly
- Projects deploy smoothly
- Environment variables managed securely
- Development workflow is efficient
- CI/CD integration works automatically
- Monitoring and debugging are effective

### references/vercel-overview

##### Goal

Use the Vercel platform to deploy and host web applications with CI/CD, edge functions, and serverless APIs

##### Scope

Used for deploying Next.js, React, Vue, Svelte apps with preview deployments and a global edge network

##### Execute

###### 1. Installation

Install the Vercel CLI with `bun add -D vercel`

###### 2. Login

Log in with `bun vercel login`

###### 3. Deploy

Deploy with `bun vercel`

###### 4. Git Integration

Use Git integration for automatic deployments

###### 5. Preview Deployments

Use preview deployments for testing

###### 6. Environment Variables

Configure environment variables in the dashboard

###### 7. Edge Functions

Use edge functions for low latency

###### 8. Image Optimization

Use image optimization for performance

###### 9. Monitor

Monitor deployments in the dashboard

##### Rules

- Use `bun add -D vercel` for development
- Use the Vercel CLI for local development
- Use Git integration for automatic deployments
- Use preview deployments for testing
- Configure environment variables in the dashboard
- Use edge functions for low latency
- Use image optimization for performance
- Monitor deployments in the dashboard

##### Expected Outcome

- Instant deployments with Git integration
- Preview deployments for collaboration
- Global edge network for performance

### references/vercel-website

#### Vercel Website Resources

Official website and documentation resources for Vercel.

##### Official Website

- Main Website: https://vercel.com
- Documentation: https://vercel.com/docs
- Status Page: https://status.vercel.com
- Pricing: https://vercel.com/pricing

##### Key Documentation Sections

###### Getting Started
- Quick Start Guide
- Deployment Guide
- Project Setup

###### Features
- Edge Functions
- Serverless Functions
- Static Site Generation
- Image Optimization
- Analytics

###### CLI Documentation
- Vercel CLI Reference
- Configuration Options
- Environment Variables

##### Tools

- Vercel Dashboard: https://vercel.com/dashboard
- Project Settings: Configuration management
- Logs: Real-time logs and monitoring
- Analytics: Performance analytics

##### Community

- GitHub: https://github.com/vercel/vercel
- Discord: Community server
- Twitter: @vercel
- Blog: https://vercel.com/blog

##### Related Services

- Next.js: https://nextjs.org
- Turbopack: https://turbo.build
- Nuxt: https://nuxt.com

### references/website

#### Service Vercel Official Resources

- [Website](https://vercel.com)
- [Documentation](https://vercel.com/docs)
- [Repository](https://github.com/vercel/vercel)
- [Package Registry](https://www.npmjs.com/package/vercel)
- About: The autonomous stack for every app and agent.

## Expected Outcome

- Application successfully deployed on Vercel
- Auto-build configuration supporting multiple frameworks
- Serverless and Edge functions working correctly
- CI/CD pipeline deploying automatically to both preview and production
- Environment variables managed securely
- Deployment live with no console or network errors

## Guide

Additional references:

- [## Merged Details → `### references/vercel-overview`](## Merged Details → `### references/vercel-overview`) — overview of the Vercel platform
- [## Merged Details → `### references/vercel-website`](## Merged Details → `### references/vercel-website`) — main Vercel links

