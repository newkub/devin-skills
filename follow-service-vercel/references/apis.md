# Service Vercel API & Dependencies

The Vercel platform is managed via the REST API (`https://api.vercel.com`), the official TypeScript SDK `@vercel/sdk`, and product SDKs for storage and compute primitives.

## Install

Programmatic platform control (REST API SDK):

```sh
bun add @vercel/sdk
# or
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

## Version

- `@vercel/sdk`: 1.28.28
- `@vercel/blob`: 2.8.0 · `@vercel/kv`: 3.0.0 · `@vercel/postgres`: 0.10.0 · `@vercel/functions`: 3.9.5
- Vercel CLI (`vercel` package, see `follow-service-vercel-cli`): 59.11.7
- [Package Registry (@vercel/sdk)](https://www.npmjs.com/package/@vercel/sdk)
- [Repository (@vercel/sdk)](https://github.com/vercel/sdk)
- [Repository (platform/CLI)](https://github.com/vercel/vercel)

## Dependencies

- `@vercel/sdk` is a generated, fully typed client for the Vercel REST API; authenticate with `bearerToken` (create at https://vercel.com/account/tokens).
- Product SDKs read env vars injected by Vercel (`BLOB_READ_WRITE_TOKEN`, `KV_REST_API_URL`/`KV_REST_API_TOKEN`, `POSTGRES_URL`, `EDGE_CONFIG`) — create resources via dashboard or `vercel link`/`vercel env`.
- For CI prefer `VERCEL_TOKEN` env var or `--token` flag rather than embedding tokens.

## Common API / Commands

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

## Source

- Vercel REST API: https://vercel.com/docs/rest-api
- `@vercel/sdk` README: https://github.com/vercel/sdk#readme
- CLI docs (see also `follow-service-vercel-cli`): https://vercel.com/docs/cli
- Blob/KV/Postgres/Functions: https://vercel.com/docs/storage, https://vercel.com/docs/functions
- `vercel.json` config: https://vercel.com/docs/projects/project-configuration
