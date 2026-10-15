---
name: follow-service-supabase
description: Use Supabase to build backends with PostgreSQL, Auth, Edge Functions, Realtime, CLI
argument-hint: "[scope]"
related:
  - follow-service-aws-sdk
  - follow-service-cloudflare
  - follow-secret-manager
  - follow-best-practice
  - learn
  - setup-cicd
  - delete
  - run-drizzle-studio
---

## Goal

Use Supabase to build backends with PostgreSQL, Auth, Edge Functions, and Realtime, and manage local development, migrations, and deploy via the Supabase CLI

## Scope

Used for:
- Building backends with PostgreSQL, Auth, Edge Functions, Realtime
- Database management with PostgreSQL
- Authentication and authorization
- Realtime subscriptions
- Edge functions with Deno
- Local development with the Supabase CLI
- Database migrations and type generation
- Secrets, storage, branches, and CI/CD integration

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

- Setup: CLI install/login, `supabase init`, `link`, local stack, client init → `## Merged Details → setup-supabase`
- Config: env vars, `config.toml`, RLS policies, client options → `## Merged Details → config-supabase`
- Verify: URL/keys valid, auth healthy, queries respond → `## Merged Details → verify-connection`

### 1. Install And Authenticate

> Goal: Install and set up the Supabase CLI

Latest: `supabase` CLI `2.118.0`, `@supabase/supabase-js@2.117.2` (verified 2026-09-26)

1. Install the Supabase CLI with `bun add -D supabase` or Homebrew/Scoop/standalone binary
2. Check the version with `supabase --version`
3. Log in with `supabase login` to connect your Supabase account
4. Verify authentication with `supabase projects list`
5. Install Docker for local development

### 2. Initialize Project

> Goal: Create and set up the project

1. Initialize the project with `supabase init`
2. Create the `supabase/config.toml` config file
3. Link to the remote project with `supabase link --project-ref <project-id>`
4. Set the project ID and database URL
5. Check project status with `supabase status`

### 3. Local Development

> Goal: Develop and test in the local environment

1. Start the local stack with `supabase start`
2. Stop the local stack with `supabase stop`
3. Check status with `supabase status`
4. Access the local database via Studio at `http://127.0.0.1:54323`
5. Test migrations and seed data locally

### 4. Database Migrations

> Goal: Manage database migrations

1. Create a migration with `supabase migration new migration_name`
2. List migrations with `supabase migration list`
3. Apply migrations with `supabase migration up`
4. Roll back migrations with `supabase migration down`
5. Fetch remote migrations with `supabase migration fetch`

### 5. Database Operations

> Goal: Manage database operations

1. Pull the schema from remote with `supabase db pull`
2. Push the schema to remote with `supabase db push`
3. Reset the database with `supabase db reset`
4. Dump the database with `supabase db dump`
5. Diff schemas with `supabase db diff`

### 6. Type Generation

> Goal: Generate TypeScript types from the database schema

1. Generate types with `supabase gen types typescript --local`
2. Generate types for a specific schema with `--schema public --schema auth`
3. Output types to a file with `--output`
4. Integrate types with ORM or client libraries
5. Regenerate types whenever the schema changes

### 7. Edge Functions

> Goal: Manage Edge Functions

1. Create a function with `supabase functions new function_name`
2. List functions with `supabase functions list`
3. Serve locally with `supabase functions serve`
4. Deploy a function with `supabase functions deploy`
5. Delete a function with `supabase functions delete`

### 8. Secrets And Storage

> Goal: Manage secrets and storage

1. Set a secret with `supabase secrets set KEY=value`
2. List secrets with `supabase secrets list`
3. Delete a secret with `supabase secrets unset KEY`
4. List storage with `supabase storage ls`
5. Copy/move/remove files with `supabase storage cp/mv/rm`

### 9. Branches And Inspection

> Goal: Manage branches and inspect database health

1. Create a branch with `supabase branches create`
2. List/switch/pause/delete branches
3. Inspect bloat with `supabase inspect db bloat`
4. Inspect blocking and long-running queries
5. Generate a report with `supabase inspect report`

### 10. Configuration And API Reference

> Goal: Read configuration and API references

1. Read [## Merged Details → `### references/supabase-cli`](## Merged Details → `### references/supabase-cli`) for CLI commands
2. Read [## Merged Details → `### references/supabase-config`](## Merged Details → `### references/supabase-config`) for the configuration reference
3. Read [## Merged Details → `### references/supabase-client-api`](## Merged Details → `### references/supabase-client-api`) for the Client SDK API reference
4. Read [## Merged Details → `### references/official-resources`](## Merged Details → `### references/official-resources`) for official links and resources

## Rules

### 1. Configuration Management

- Use `supabase/config.toml` as the single source of truth
- Set `project_id` and `api_url` correctly
- Never commit sensitive data to version control
- Use environment-specific configs for dev/staging/prod
- Use `.env` files for local development

### 2. Migration Best Practices

- Create migrations for every schema change
- Use descriptive names for migrations
- Test migrations locally before deploy
- Never edit migrations already deployed
- Use `supabase db diff` to review changes

### 3. Type Safety

- Generate types automatically with `supabase gen types`
- Regenerate types whenever the schema changes
- Integrate types with ORM or client libraries
- Use strict type checking

### 4. Secret Security

- Never commit secrets to version control
- Use `supabase secrets set` instead of editing config
- Rotate secrets regularly
- Use environment-specific secrets

### 5. CI/CD Integration

- Use `SUPABASE_ACCESS_TOKEN` for authentication
- Use `supabase db push` in CI for migrations
- Use `supabase functions deploy` for functions
- Test before deploy with `supabase db diff`

- Use /follow-service-aws-sdk if needed
- Use /follow-service-cloudflare if needed
- Use /follow-secret-manager if needed
- Use /follow-best-practice if needed
- Use /learn-from-web if needed
- Use /setup-cicd if needed
- Use /run-drizzle-studio if needed

## Merged Details

### config-supabase

##### Goal

Set/edit Supabase configuration — env vars, `supabase/config.toml`, RLS policies, and client options — without overwriting the existing config

##### Scope

- Manage env vars (`SUPABASE_URL`, keys) via a secret manager
- Edit `supabase/config.toml` (auth, storage, edge runtime)
- Enable/edit RLS policies on tables
- Does not cover first-time install → use `## Merged Details → setup-supabase`

##### Execute

###### 1. Read Current Config

> Goal: Know the current config state before editing

1. Read the existing `supabase/config.toml` and `.env*`
2. Do `/check-secrets env-vars` to identify missing or duplicated vars
3. Do `/deep-review` domain `review-config` if the local config is suspected to differ from remote
4. If there is no `supabase/config.toml` at all → do `## Merged Details → setup-supabase` instead

###### 2. Configure Env Vars

> Goal: Set environment variables completely and securely

1. Define `SUPABASE_URL` and `SUPABASE_ANON_KEY` for the client (public)
2. Define `SUPABASE_SERVICE_ROLE_KEY` for server-side only — store it in `/follow-secret-manager`
3. Use the `NEXT_PUBLIC_`/`VITE_` prefix per framework for values exposed to the client
4. Never edit the existing config unnecessarily — merge only the needed keys

###### 3. Configure Auth And Services

> Goal: Edit only the needed `config.toml` sections

1. Edit the `[auth]` section — `site_url`, `additional_redirect_urls`, providers per use
2. Edit `[storage]`, `[edge_runtime]`, or other sections only for the necessary keys
3. Reference the parent's `## Merged Details → references/supabase-config` or official docs for key names

###### 4. Configure RLS And Client Options

> Goal: Guard data access and set client options correctly

1. Enable RLS on every table exposed via the API — `alter table <name> enable row level security`
2. Create policies with `create policy` through a migration, not by editing the dashboard directly
3. Set client options such as `auth: { persistSession, autoRefreshToken }` per the use case
4. Run `supabase db diff` before push to review changes

###### 5. Verify

> Goal: Confirm the new config works

1. Run `supabase start`/`supabase status` to confirm the local stack picks up the new config
2. Do `/run-verify` and test a basic query/auth flow
3. If it fails → revert the keys just changed, do `resolve-errors` max 3 rounds, then report the diff

##### Rules

- Merge with the existing config — never overwrite the whole `config.toml`
- Secrets only through `/follow-secret-manager` — never put them in `config.toml` or commit
- Every table the client accesses must have RLS enabled + explicit policies
- Test the config locally before pushing to remote
- If unsure about a key name/option → check official docs or `learn` (web)

##### Expected Outcome

- Env vars complete, secure, and clearly separated client vs server
- `config.toml` merged without clobbering existing settings
- RLS enabled with policies delivered via migration
- Verify passes and a short before/after report is produced

### setup-supabase

##### Goal

Install the Supabase CLI, create the local project, link it to the remote project, and init the `@supabase/supabase-js` client ready to use — first-time setup only

##### Scope

- Install and authenticate the Supabase CLI
- `supabase init`, `supabase link`, `supabase start` for local development
- Create the client from env vars
- Does not cover advanced env/RLS/config → use `## Merged Details → config-supabase`

##### Execute

###### 1. Check Prerequisites

> Goal: Confirm prerequisites before installing (idempotent)

1. Read `package.json` to identify the package manager (`bun`, `npm`, `pnpm`)
2. Check whether `supabase/config.toml` or a `supabase/` directory already exists → if so, skip to verify
3. Check Docker for the local stack — if absent → stop and tell the user to install it
4. If there is no Supabase account/project → stop and tell the user to create one from the dashboard

###### 2. Install And Authenticate CLI

> Goal: Install and log in the Supabase CLI

1. Install the CLI with `bun add -D supabase` or the system package manager (`brew`, `scoop`)
2. Check the version with `supabase --version`
3. Log in with `supabase login` or set `SUPABASE_ACCESS_TOKEN` for CI
4. Confirm authentication with `supabase projects list`

###### 3. Initialize And Link Project

> Goal: Create the local project and connect it to remote

1. Initialize with `supabase init` → creates `supabase/config.toml`
2. Link remote with `supabase link --project-ref <project-ref>`
3. Start the local stack with `supabase start`
4. Run `supabase status` to read the local `API URL`, `anon key`, `service_role key`

###### 4. Install Client And Verify

> Goal: Create a client that reads from env and test the connection

1. Install the client SDK with `bun add @supabase/supabase-js`
2. Store `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `/follow-secret-manager`, then inject them into `.env`
3. Create the client with `createClient(url, anonKey)` in `src/lib/supabase.ts` (or a suitable path)
4. Do `/run-verify` and test a basic query — if it fails → do `resolve-errors` max 3 rounds

##### Rules

- Use `supabase/config.toml` as the single source of truth
- Never hardcode keys or commit secrets — always use `/follow-secret-manager`
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only — never expose it to the client
- If unsure about a command/API → check official docs or do `learn` (web) first
- When done, do `/suggest-next-action`

##### Expected Outcome

- Supabase CLI installed, logged in, and project linked successfully
- Local stack runs and `supabase status` shows all values
- Client ready to use and a query passes verify

### verify-connection

##### Goal

Confirm after setup/config that Supabase really connects — URL/anon/service keys valid, project healthy, queries respond

##### Scope

- Used when `/follow-service-supabase` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change schema/RLS

##### Execute

###### 1. Check Credentials

> Goal: URL and keys complete with correct format

1. Check `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) + `SUPABASE_ANON_KEY` exist
2. If server-side is used → `SUPABASE_SERVICE_ROLE_KEY` exists — flag it if it leaks into the client bundle
3. Local dev → `supabase status` shows the local stack running

###### 2. Smoke Test

> Goal: the API really responds

1. `curl <SUPABASE_URL>/auth/v1/health` → 200 = project up
2. Init the client → query `select 1` or read an existing table
3. Flag: 401 (invalid key), 404 (wrong URL/ref), unexpected RLS blocks

###### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `project-down` / `rls-blocked`

##### Rules

- Use read calls only — never insert/update/delete
- Do not print the service role key — show only the key type found
- A service key in client-side code = a Critical finding

##### Expected Outcome

- Verdict with project-ref + health evidence

### references/apis

#### Service Supabase API & Dependencies

##### Install

Supabase CLI (dev dependency — runs local stack, migrations, deploys):

```sh
bun add -D supabase
#### or
npm install --save-dev supabase
#### Windows / macOS system installs:
scoop install supabase
brew install supabase/tap/supabase
```

JS client library (runtime dependency for app code):

```sh
bun add @supabase/supabase-js
#### or
npm install @supabase/supabase-js
```

##### Version

- CLI latest (`supabase`): 2.116.0
- JS client latest (`@supabase/supabase-js`): 2.116.0
- [Package Registry (CLI)](https://www.npmjs.com/package/supabase)
- [Package Registry (client)](https://www.npmjs.com/package/@supabase/supabase-js)
- [Repository (CLI)](https://github.com/supabase/cli)
- [Repository (client)](https://github.com/supabase/supabase-js)

##### Dependencies

- CLI requires Docker Desktop for `supabase start` (local stack: Postgres, PostgREST, GoTrue auth, Storage, Studio).
- CI: set `SUPABASE_ACCESS_TOKEN` (skip `login`) and `SUPABASE_DB_PASSWORD` for db commands.
- `@supabase/supabase-js` composes `postgrest-js`, `gotrue-js` (auth), `storage-js`, `realtime-js`, `functions-js` — all auto-installed.

##### Common API / Commands

Supabase CLI:

| commands | description | default | options |
|---|---|---|---|
| `supabase init` | Create `supabase/config.toml` in project | interactive off | `--force`, `-i/--interactive`, `--use-orioledb` |
| `supabase login` | Auth with personal access token | browser flow | `--token`, `--no-browser`, `--name` |
| `supabase link --project-ref <ref>` | Link local project to hosted project | prompts | `-p/--password`, `--skip-pooler` |
| `supabase start` | Start local Supabase stack | all services | `-x <services>` to exclude, `--ignore-health-check` |
| `supabase stop` | Stop local stack | keeps data | `--no-backup` to drop data |
| `supabase status` | Show local service URLs/keys | pretty output | `-o env|json|yaml|toml` |
| `supabase db push` | Push local migrations to remote | prompts | `--dry-run`, `--include-all`, `-p` |
| `supabase db pull` | Pull remote schema into migration | — | `--schema`, `-p` |
| `supabase db reset` | Reset local DB, reapply migrations + seed | — | `--version` |
| `supabase db diff` | Diff local vs remote schema | — | `--schema`, `-f <file>` writes migration |
| `supabase migration new <name>` | Create timestamped migration file | — | — |
| `supabase migration list` | List local vs applied migrations | — | `-p` |
| `supabase migration up/repair/squash` | Apply / fix / squash migration history | — | `--local`, `--status` |
| `supabase functions new <name>` | Scaffold an Edge Function (Deno) | — | `--verify-jwt` |
| `supabase functions serve` | Serve functions locally | — | `--env-file`, `--no-verify-jwt` |
| `supabase functions deploy <name>` | Deploy Edge Function | — | `--project-ref`, `--no-verify-jwt`, `--import-map` |
| `supabase secrets set K=V` | Set Edge Function secrets | — | `--env-file` |
| `supabase gen types typescript` | Generate DB types from schema | stdout | `--local`, `--linked`, `--project-id`, `--schema` |
| `supabase projects list/create/api-keys` | Manage hosted projects | — | `--org-id` |
| `supabase branches create/list` | Preview branches | — | `--region` |
| `supabase storage ls/cp/mv/rm` | Manage Storage objects (experimental) | — | `--recursive` |
| `supabase test db/new` | pgTAP tests | — | — |
| `supabase bootstrap <template>` | Scaffold from a quickstart template | — | `-p` |
| `supabase inspect db` | DB stats (bloat, indexes, etc.) | — | `--linked` |
| `supabase --help` | Command help | — | global flags: `--debug`, `--workdir`, `--yes`, `--create-ticket`, `--experimental` |

`@supabase/supabase-js` client:

| commands | description | default | options |
|---|---|---|---|
| `createClient(url, key, opts)` | Create client | — | `auth.persistSession`, `auth.autoRefreshToken`, `db.schema`, `global.headers` |
| `supabase.from('t').select('*')` | Query rows | all columns | `.eq()`, `.neq()`, `.gt()`, `.lt()`, `.like()`, `.ilike()`, `.in()`, `.is()`, `.order()`, `.limit()`, `.range()`, `.single()`, `.maybeSingle()`, `select('*, rel(*)')` embeds |
| `supabase.from('t').insert({...})` | Insert row(s) | returns inserted rows | `.select()` after, `count` option |
| `supabase.from('t').update({...})` | Update matching rows | — | requires filters `.eq()` etc. |
| `supabase.from('t').upsert({...})` | Insert or update on conflict | PK conflict | `onConflict`, `ignoreDuplicates` |
| `supabase.from('t').delete()` | Delete matching rows | — | requires filters |
| `supabase.rpc('fn', { args })` | Call a Postgres function | — | `count`, `get` options |
| `supabase.auth.signUp({ email, password })` | Email sign-up | sends confirm email | `options.emailRedirectTo`, `data` metadata |
| `supabase.auth.signInWithPassword({ email, password })` | Email sign-in | — | — |
| `supabase.auth.signInWithOAuth({ provider })` | OAuth sign-in (Google, GitHub…) | browser redirect | `options.redirectTo`, `scopes` |
| `supabase.auth.signInWithOtp({ email })` | Magic-link/OTP sign-in | — | `shouldCreateUser` |
| `supabase.auth.signOut()` | Sign out | local scope | `scope: 'global' \| 'local' \| 'others'` |
| `supabase.auth.getUser()` / `getSession()` | Current user / session | from storage | — |
| `supabase.auth.onAuthStateChange(cb)` | Auth event subscription | — | events: `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED` |
| `supabase.storage.from('bucket').upload(path, file)` | Upload file | — | `cacheControl`, `upsert`, `contentType` |
| `supabase.storage.from('bucket').download(path)` / `createSignedUrl()` / `getPublicUrl()` | Read files | — | `expiresIn` for signed URLs |
| `supabase.channel('name').on('postgres_changes', ...).subscribe()` | Realtime DB changes | — | `event: '*' \| 'INSERT' \| 'UPDATE' \| 'DELETE'`, `schema`, `table`, `filter` |
| `supabase.functions.invoke('name', { body })` | Invoke Edge Function | POST | `headers`, `method` |

##### Source

- CLI reference: https://supabase.com/docs/reference/cli
- JS client reference: https://supabase.com/docs/reference/javascript
- Local development: https://supabase.com/docs/guides/local-development
- Client repo: https://github.com/supabase/supabase-js

### references/official-resources

#### Website Reference

##### Purpose

Official links and resources for Supabase

##### Official Resources

| Resource | Link |
|----------|------|
| Website | https://supabase.com |
| GitHub | https://github.com/supabase/supabase |
| npm | https://www.npmjs.com/package/@supabase/supabase-js |
| Docs | https://supabase.com/docs |

##### Documentation

| Resource | Link |
|----------|------|
| CLI Reference | https://supabase.com/docs/reference/cli/introduction |
| Database | https://supabase.com/docs/guides/database/overview |
| Auth | https://supabase.com/docs/guides/auth |
| Storage | https://supabase.com/docs/guides/storage |
| Realtime | https://supabase.com/docs/guides/realtime |
| Edge Functions | https://supabase.com/docs/guides/functions |

##### GitHub

| Resource | Link |
|----------|------|
| Repository | https://github.com/supabase/supabase |
| CLI | https://github.com/supabase/cli |
| Client JS | https://github.com/supabase/supabase-js |
| Dashboard | https://github.com/supabase/supabase |

##### Community

| Resource | Link |
|----------|------|
| Discord | https://discord.supabase.com |
| Forum | https://supabase.com/dashboard |
| Blog | https://supabase.com/blog |

##### Packages

| Package | npm | Description |
|--------|-----|-------------|
| Client | [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) | JS client |
| Auth | [@supabase/auth-helpers](https://www.npmjs.com/package/@supabase/auth-helpers) | Auth helpers |
| SSR | [@supabase/ssr](https://www.npmjs.com/package/@supabase/ssr) | SSR support |

##### Summary

| Category | Link |
|----------|------|
| Docs | https://supabase.com/docs |
| CLI | https://supabase.com/docs/reference/cli |
| GitHub | https://github.com/supabase/supabase |
| Discord | https://discord.supabase.com |

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `supabase` (Supabase CLI) |
| Registry | `npm` |
| Latest Version | `2.118.0` |
| Release Date | `2026-09-12` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Supabase |
| License | `MIT` |
| Repository | `https://github.com/supabase/cli` |
| Website | `https://supabase.com/` |
| Documentation | `https://supabase.com/docs/reference/cli` |
| Releases / Changelog | `https://github.com/supabase/cli/releases` |

##### Install

```bash
bun add -D supabase
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@supabase/supabase-js` | `npm` | `2.116.0` | Client SDK for Auth, PostgREST, Realtime, Storage |
| Docker | `system` | `unknown` | Required for `supabase start` local stack |

##### Notes

- Breaking changes in latest major: CLI 2.x line is current; `supabase/config.toml` is the single source of truth
- Version pinned in SKILL.md: `supabase@2.118.0` (CLI), `@supabase/supabase-js@2.116.0`

### references/routes

#### Follow Service Supabase Route Map

- Website: <https://github.com/supabase/cli#readme>
- Routes discovered (homepage): 30

##### Routes

- /collections
- /contact/report-content
- /customer-stories
- /enterprise
- /enterprise/premium-support
- /enterprise/startups
- /features
- /features/actions
- /features/ai/github-app
- /features/code-quality
- /features/code-review
- /features/codespaces
- /features/copilot
- /features/copilot/copilot-business
- /features/issues
- /login
- /marketplace
- /mcp
- /open-source/sponsors
- /orgs/community/discussions
- /partners
- /pricing
- /resources
- /resources/articles
- /resources/events
- /resources/whitepapers
- /security
- /security/advanced-security
- /security/advanced-security/code-security
- /security/advanced-security/secret-protection

### references/supabase-cli

#### Supabase CLI Reference

##### Overview

The Supabase CLI enables local development, database migrations, type generation, edge function deployment, and CI/CD workflows for Supabase projects. The local stack runs in Docker containers.

##### Version Info

- Package: `supabase`
- Latest stable: `2.115.0`
- Node.js requirement: `>= 20` (when installed via npm/npx)
- License: MIT
- npm: https://www.npmjs.com/package/supabase
- GitHub: https://github.com/supabase/cli

##### Install

###### npm (Project Dependency)

```sh
bun add supabase -D
#### or
pnpm add -D supabase
#### or
yarn add -D supabase
#### or
bun add -D supabase
```

Pin the version in `package.json` for team consistency. Run commands through your package runner:

```sh
npx supabase --help
#### or
pnpm supabase --help
#### or
yarn supabase --help
#### or
bunx supabase --help
```

###### macOS (Homebrew)

```sh
brew install supabase/tap/supabase
```

###### Windows (Scoop)

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

###### Linux

Download `.apk`/`.deb`/`.rpm` from [GitHub Releases](https://github.com/supabase/cli/releases):

```sh
sudo apk add --allow-untrusted supabase-x.y.z.apk
sudo dpkg -i supabase-x.y.z.deb
sudo rpm -i supabase-x.y.z.rpm
```

###### Beta Channel

```sh
bun add supabase@beta -D
#### or
brew install supabase/tap/supabase-beta
brew link --overwrite supabase-beta
```

##### Prerequisites

- Docker (or compatible container runtime) is required for local development
- Container runtime options: Docker Desktop, Rancher Desktop, Podman, OrbStack, colima

##### Initialize Project

```sh
supabase init
```

Creates a `supabase/` folder with `config.toml`. Safe to commit to version control.

##### Local Development

```sh
supabase start    # Start full local Supabase stack
supabase stop     # Stop local stack
supabase status   # Check status and show local credentials
```

After `supabase start`, you get:
- Studio: `http://127.0.0.1:54323`
- API URL: `http://127.0.0.1:54321`
- Database URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

##### Link To Remote Project

```sh
supabase link --project-ref <project-id>
```

##### Database Migrations

```sh
supabase migration new create_users    # Create new migration
supabase migration list                # List migrations
supabase migration up                  # Apply pending migrations
supabase migration down                # Rollback last migration
supabase migration fetch               # Fetch remote migrations
```

##### Database Operations

```sh
supabase db pull          # Pull schema from remote
supabase db push          # Push schema to remote
supabase db reset         # Reset database (includes seed)
supabase db dump          # Dump database
supabase db diff          # Diff local vs remote schema
supabase db diff -f name  # Generate migration from diff
```

##### Type Generation

```sh
supabase gen types typescript --local > types/supabase.ts
#### or from remote:
supabase gen types typescript --project-id <project-id> > types/supabase.ts
#### specific schema:
supabase gen types typescript --schema public --schema auth > types/supabase.ts
```

##### Edge Functions

```sh
supabase functions new my-function     # Create new function
supabase functions serve               # Serve functions locally
supabase functions deploy my-function  # Deploy function to remote
supabase functions list                # List deployed functions
supabase functions delete my-function  # Delete function
```

##### Secrets Management

```sh
supabase secrets set KEY=value         # Set a secret
supabase secrets set KEY=@/path/to/file  # Set from file
supabase secrets list                  # List secrets
supabase secrets unset KEY             # Delete a secret
```

##### Storage

```sh
supabase storage ls [path]             # List storage
supabase storage cp <src> <dest>       # Copy files
supabase storage mv <src> <dest>       # Move files
supabase storage rm <path>             # Remove files
```

##### Branch Management

```sh
supabase branches create branch-name   # Create a branch
supabase branches list                 # List branches
supabase branches get branch-name      # Get branch details
supabase branches pause branch-name    # Pause a branch
supabase branches delete branch-name   # Delete a branch
```

##### Database Inspection

```sh
supabase inspect db bloat              # Check table bloat
supabase inspect db blocking           # Check blocking queries
supabase inspect db long-running-queries  # Check long-running queries
supabase inspect db table-stats        # Check table statistics
supabase inspect report                # Generate health report
```

##### Configuration (`supabase/config.toml`)

```toml
project_id = "my-project"

[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]

[db]
port = 54322

[auth]
enabled = true
site_url = "http://127.0.0.1:3000"

[storage]
enabled = true
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
      - uses: supabase/setup-cli@v3
        with:
          version: '2.115.0'
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - run: supabase functions deploy my-function
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

##### Update

```sh
npm update supabase -D    # npm
brew upgrade supabase             # Homebrew
scoop update supabase             # Scoop
```

##### Source

- [Supabase CLI Getting Started](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)
- [CLI Reference](https://supabase.com/docs/reference/cli)
- [GitHub Releases](https://github.com/supabase/cli/releases)

### references/supabase-client-api

#### Programmatic API

##### Purpose

Programmatic API reference for Supabase client libraries

##### Scope

- Client Setup
- Database API
- Auth API
- Storage API

##### Client Setup

###### TypeScript/JavaScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://127.0.0.1:54321',
  'your-anon-key'
)

// With custom options
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
```

###### Environment Variables

```typescript
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
)
```

##### Database API

###### Select

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'test@example.com')
  .single()
```

###### Insert

```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    email: 'test@example.com',
    name: 'John Doe',
  })
  .select()
```

###### Update

```typescript
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane Doe' })
  .eq('id', '123')
  .select()
```

###### Delete

```typescript
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', '123')
```

###### Upsert

```typescript
const { data, error } = await supabase
  .from('users')
  .upsert({ id: '123', name: 'Jane' })
```

###### Query Builder

```typescript
// Filters
.supabase.from('users').select('*').eq('id', 1)
.supabase.from('users').select('*').neq('id', 1)
.supabase.from('users').select('*').gt('age', 18)
.supabase.from('users').select('*').like('name', '%john%')
.supabase.from('users').select('*').in('id', [1, 2, 3])

// Pagination
.supabase.from('users').select('*').range(0, 9)
.supabase.from('users').select('*').limit(10).order('name')
```

##### Auth API

###### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
})
```

###### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})
```

###### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

###### Get Session

```typescript
const { data: { session } } = await supabase.auth.getSession()
```

###### Get User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

###### On Auth State Change

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

##### Storage API

###### Upload File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-123/avatar.png', file)
```

###### Download File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download('user-123/avatar.png')
```

###### Public URL

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-123/avatar.png')
```

###### Delete File

```typescript
const { error } = await supabase.storage
  .from('avatars')
  .remove(['user-123/avatar.png'])
```

###### List Files

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .list('user-123', { limit: 10 })
```

##### Realtime API

###### Subscribe

```typescript
const channel = supabase
  .channel('schema-db-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log(payload)
  })
  .subscribe()
```

###### Unsubscribe

```typescript
supabase.removeChannel(channel)
```

##### Edge Functions

###### Invoke Function

```typescript
const { data, error } = await supabase.functions
  .invoke('hello-world', {
    body: { name: 'John' }
  })
```

##### Summary

| API | Methods |
|-----|---------|
| Client | createClient |
| Database | select, insert, update, delete |
| Auth | signUp, signIn, signOut |
| Storage | upload, download, remove |
| Realtime | channel, subscribe |

### references/supabase-config

#### Configuration Reference

##### Purpose

Configuration options reference for the Supabase CLI

##### Scope

- config.toml
- Environment Variables
- Docker Configuration

##### config.toml

###### Basic Structure

```toml
[project]
project_id = "local-project-123"

[api]
enabled = true
port = 54321
max_rows = 1000
```

###### Project Section

| Key | Type | Description |
|-----|------|-------------|
| `project_id` | string | Project identifier |

###### API Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable API |
| `port` | number | `54321` | API port |
| `max_rows` | number | `1000` | Max rows per request |

###### DB Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `port` | number | `54322` | Database port |
| `major_version` | number | `15` | Postgres version |

###### Studio Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable Studio |
| `port` | number | `54323` | Studio port |

###### Auth Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable auth |
| `port` | number | `54321` | Auth port |

###### Storage Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable storage |
| `port` | number | `54321` | Storage port |

###### Realtime Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable realtime |
| `port` | number | `54321` | Realtime port |

##### Environment Variables

###### CLI Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_ACCESS_TOKEN` | CLI access token |
| `SUPABASE_DB_PASSWORD` | Database password |
| `SUPABASE_WORKDIR` | Working directory |

###### Local Development

```bash
export SUPABASE_URL="http://127.0.0.1:54321"
export SUPABASE_ANON_KEY="eyJhbGci..."
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
```

###### CI/CD

```bash
export SUPABASE_ACCESS_TOKEN=${{ secrets.SUPABASE_ACCESS_TOKEN }}
export SUPABASE_DB_PASSWORD=${{ secrets.DB_PASSWORD }}
```

##### Docker Configuration

###### Exclude Services

```bash
supabase start -x gotrue,imgproxy
supabase start -x gotrue,realtime,storage-api
```

###### Services List

| Service | Port | Description |
|---------|------|-------------|
| `gotrue` | - | Authentication |
| `realtime` | - | WebSocket |
| `storage-api` | - | Storage |
| `imgproxy` | - | Image transforms |
| `kong` | 54321 | API gateway |
| `studio` | 54323 | Dashboard |
| `postgres-meta` | 54321 | Postgres meta |
| `postgrest` | 54321 | REST API |
| `vector` | 54321 | Vector search |

##### Migration Directory

```
supabase/
├── config.toml
├── migrations/
│   ├── 20230101000000_initial.sql
│   ├── 20230102000000_add_users.sql
│   └── 20230103000000_add_profiles.sql
└── seed.sql
```

###### Migration File Format

```sql
-- Migration name
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
```

###### Seed File

```sql
-- supabase/seed.sql
INSERT INTO profiles (display_name) VALUES ('Admin');
```

##### Summary

| Category | Options |
|----------|---------|
| Config | project_id, api, db, studio |
| Env | SUPABASE_ACCESS_TOKEN, DB_PASSWORD |
| Services | -x flag to exclude services |

### references/website

#### Service Supabase Official Resources

- [Website](https://github.com/supabase/cli#readme)
- [Documentation](https://github.com/supabase/cli/tree/develop/docs)
- [Repository](https://github.com/supabase/cli)
- [Package Registry](https://www.npmjs.com/package/supabase)
- About: Supabase CLI. Manage postgres migrations, run Supabase locally, deploy edge functions. Postgres backups. Generating types from your datab...

## Expected Outcome

- Supabase CLI installed and configured correctly
- Local development environment working
- Database migrations managed systematically
- TypeScript types generated automatically
- Edge functions deployed smoothly
- Secrets managed securely
- CI/CD integration working automatically
- A backend built with Supabase using PostgreSQL, Auth, and Realtime
