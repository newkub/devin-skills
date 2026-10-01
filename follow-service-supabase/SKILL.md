---
name: follow-service-supabase
description: ใช้งาน Supabase สำหรับ build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime และ CLI
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

ใช้งาน Supabase สำหรับ build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime และจัดการ local development, migrations, deploy ผ่าน Supabase CLI

## Scope

ใช้สำหรับ:
- Build backend ด้วย PostgreSQL, Auth, Edge Functions, Realtime
- Database management ด้วย PostgreSQL
- Authentication และ authorization
- Realtime subscriptions
- Edge functions ด้วย Deno
- Local development ด้วย Supabase CLI
- Database migrations และ type generation
- Secrets, storage, branches และ CI/CD integration

## Execute

### Workflows

> Goal: dispatch ไปยัง workflow ที่ตรงกับ topic

- Setup: CLI install/login, `supabase init`, `link`, local stack, client init → `workflows/setup-supabase/SKILL.md`
- Config: env vars, `config.toml`, RLS policies, client options → `workflows/config-supabase/SKILL.md`
- Verify: URL/keys valid, auth health, query ตอบกลับ → `workflows/verify-connection/SKILL.md`

### 1. Install And Authenticate

> Goal: ติดตั้งและตั้งค่า Supabase CLI

Latest: `supabase` CLI `2.118.0`, `@supabase/supabase-js@2.117.2` (verified 2026-09-26)

1. ติดตั้ง Supabase CLI ด้วย `bun add -D supabase` หรือ Homebrew/Scoop/standalone binary
2. ตรวจสอบ version ด้วย `supabase --version`
3. Login ด้วย `supabase login` เพื่อเชื่อมต่อกับ Supabase account
4. ตรวจสอบ authentication ด้วย `supabase projects list`
5. ติดตั้ง Docker สำหรับ local development

### 2. Initialize Project

> Goal: สร้างและตั้งค่าโปรเจกต์

1. Initialize project ด้วย `supabase init`
2. สร้าง `supabase/config.toml` config file
3. Link ไปยัง remote project ด้วย `supabase link --project-ref <project-id>`
4. ตั้งค่า project ID และ database URL
5. ตรวจสอบ project status ด้วย `supabase status`

### 3. Local Development

> Goal: พัฒนาและทดสอบใน local environment

1. Start local stack ด้วย `supabase start`
2. Stop local stack ด้วย `supabase stop`
3. ตรวจสอบ status ด้วย `supabase status`
4. Access local database ผ่าน Studio ที่ `http://127.0.0.1:54323`
5. Test migrations และ seed data ใน local

### 4. Database Migrations

> Goal: จัดการ database migrations

1. Create migration ด้วย `supabase migration new migration_name`
2. List migrations ด้วย `supabase migration list`
3. Apply migrations ด้วย `supabase migration up`
4. Rollback migrations ด้วย `supabase migration down`
5. Fetch remote migrations ด้วย `supabase migration fetch`

### 5. Database Operations

> Goal: จัดการ database operations

1. Pull schema จาก remote ด้วย `supabase db pull`
2. Push schema ไป remote ด้วย `supabase db push`
3. Reset database ด้วย `supabase db reset`
4. Dump database ด้วย `supabase db dump`
5. Diff schemas ด้วย `supabase db diff`

### 6. Type Generation

> Goal: สร้าง TypeScript types จาก database schema

1. Generate types ด้วย `supabase gen types typescript --local`
2. Generate types สำหรับ specific schema ด้วย `--schema public --schema auth`
3. Output types ไปยัง file ด้วย `--output`
4. Integrate types กับ ORM หรือ client libraries
5. Regenerate types เมื่อ schema เปลี่ยน

### 7. Edge Functions

> Goal: จัดการ Edge Functions

1. Create function ด้วย `supabase functions new function_name`
2. List functions ด้วย `supabase functions list`
3. Serve locally ด้วย `supabase functions serve`
4. Deploy function ด้วย `supabase functions deploy`
5. Delete function ด้วย `supabase functions delete`

### 8. Secrets And Storage

> Goal: จัดการ secrets และ storage

1. Set secret ด้วย `supabase secrets set KEY=value`
2. List secrets ด้วย `supabase secrets list`
3. Delete secret ด้วย `supabase secrets unset KEY`
4. List storage ด้วย `supabase storage ls`
5. Copy/move/remove files ด้วย `supabase storage cp/mv/rm`

### 9. Branches And Inspection

> Goal: จัดการ branches และตรวจสอบ database health

1. Create branch ด้วย `supabase branches create`
2. List/switch/pause/delete branches
3. Inspect bloat ด้วย `supabase inspect db bloat`
4. Inspect blocking และ long-running queries
5. Generate report ด้วย `supabase inspect report`

### 10. Configuration And API Reference

> Goal: อ่าน configuration และ API reference

1. อ่าน [references/supabase-cli.md](references/supabase-cli.md) สำหรับ CLI commands
2. อ่าน [references/supabase-config.md](references/supabase-config.md) สำหรับ configuration reference
3. อ่าน [references/supabase-client-api.md](references/supabase-client-api.md) สำหรับ Client SDK API reference
4. อ่าน [references/official-resources.md](references/official-resources.md) สำหรับ official links และ resources

## Rules

### 1. Configuration Management

- ใช้ `supabase/config.toml` เป็น single source of truth
- ตั้งค่า `project_id` และ `api_url` อย่างถูกต้อง
- ไม่ commit sensitive data ไปยัง version control
- ใช้ environment-specific configs สำหรับ dev/staging/prod
- ใช้ `.env` files สำหรับ local development

### 2. Migration Best Practices

- Create migrations สำหรับทุก schema changes
- ใช้ descriptive names สำหรับ migrations
- Test migrations ใน local ก่อน deploy
- ไม่ edit migrations ที่ deploy แล้ว
- ใช้ `supabase db diff` สำหรับ review changes

### 3. Type Safety

- Generate types อัตโนมัติด้วย `supabase gen types`
- Regenerate types เมื่อ schema เปลี่ยน
- Integrate types กับ ORM หรือ client libraries
- ใช้ strict type checking

### 4. Secret Security

- ไม่ commit secrets ไปยัง version control
- ใช้ `supabase secrets set` แทนการแก้ config
- Rotate secrets อย่างสม่ำเสมอ
- ใช้ environment-specific secrets

### 5. CI/CD Integration

- ใช้ `SUPABASE_ACCESS_TOKEN` สำหรับ authentication
- ใช้ `supabase db push` ใน CI สำหรับ migrations
- ใช้ `supabase functions deploy` สำหรับ functions
- Test ก่อน deploy ด้วย `supabase db diff`

- ใช้ /follow-service-aws-sdk ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /learn-from-web ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /run-drizzle-studio ถ้าจำเป็น

## Merged Details

### config-supabase

##### Goal

ตั้งค่า/แก้ไข Supabase configuration — env vars, `supabase/config.toml`, RLS policies และ client options — โดยไม่ overwrite config เดิม

##### Scope

- จัดการ env vars (`SUPABASE_URL`, keys) ผ่าน secret manager
- แก้ `supabase/config.toml` (auth, storage, edge runtime)
- เปิด/แก้ RLS policies บน tables
- ไม่ครอบคลุม first-time install → ใช้ `workflows/setup-supabase/SKILL.md`

##### Execute

###### 1. Read Current Config

> Goal: รู้สถานะ config ปัจจุบันก่อนแก้

1. อ่าน `supabase/config.toml` และ `.env*` ที่มีอยู่
2. ทำ `/check-secrets env-vars` เพื่อระบุ vars ที่ขาดหรือซ้ำ
3. ทำ `/deep-review` domain `review-config` ถ้าสงสัยว่า local config ต่างจาก remote
4. ถ้าไม่มี `supabase/config.toml` เลย → ทำ `workflows/setup-supabase/SKILL.md` แทน

###### 2. Configure Env Vars

> Goal: ตั้งค่า environment variables ให้ครบและปลอดภัย

1. กำหนด `SUPABASE_URL` และ `SUPABASE_ANON_KEY` สำหรับ client (public)
2. กำหนด `SUPABASE_SERVICE_ROLE_KEY` สำหรับ server เท่านั้น — เก็บใน `/follow-secret-manager`
3. ใช้ `NEXT_PUBLIC_`/`VITE_` prefix ตาม framework สำหรับค่าที่ expose ไป client
4. ห้ามแก้ config เดิมโดยไม่จำเป็น — merge เฉพาะ keys ที่ต้องการ

###### 3. Configure Auth And Services

> Goal: แก้ `config.toml` เฉพาะ section ที่ต้องการ

1. แก้ `[auth]` section — `site_url`, `additional_redirect_urls`, providers ตามที่ใช้
2. แก้ `[storage]`, `[edge_runtime]` หรือ section อื่นเฉพาะ keys ที่จำเป็น
3. อ้างอิง `references/supabase-config.md` ของ parent หรือ official docs สำหรับ key names

###### 4. Configure RLS And Client Options

> Goal: ป้องกัน data access และตั้ง client options ถูกต้อง

1. เปิด RLS บนทุก table ที่ expose ผ่าน API — `alter table <name> enable row level security`
2. สร้าง policies ด้วย `create policy` ผ่าน migration ไม่ใช่แก้ใน dashboard โดยตรง
3. ตั้ง client options เช่น `auth: { persistSession, autoRefreshToken }` ตาม use case
4. รัน `supabase db diff` ก่อน push เพื่อ review changes

###### 5. Verify

> Goal: ยืนยันว่า config ใหม่ทำงานได้

1. รัน `supabase start`/`supabase status` เพื่อยืนยัน local stack รับ config ใหม่
2. ทำ `/run-verify` และทดสอบ query/auth flow เบื้องต้น
3. ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` max 3 รอบ แล้ว report diff

##### Rules

- Merge กับ config เดิม — ห้าม overwrite `config.toml` ทั้งไฟล์
- Secrets ผ่าน `/follow-secret-manager` เท่านั้น ห้ามใส่ใน `config.toml` หรือ commit
- ทุก table ที่ client เข้าถึงต้องมี RLS enabled + explicit policies
- Test config ใน local ก่อน push remote
- ถ้า key name/option ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

##### Expected Outcome

- Env vars ครบ ปลอดภัย และแยก client/server ชัดเจน
- `config.toml` ถูก merge โดยไม่ clobber settings เดิม
- RLS enabled พร้อม policies ผ่าน migration
- Verify ผ่านและ report before/after สั้นๆ

### setup-supabase

##### Goal

ติดตั้ง Supabase CLI, สร้าง local project, link กับ remote project และ init `@supabase/supabase-js` client ให้พร้อมใช้งาน — first-time setup เท่านั้น

##### Scope

- ติดตั้งและ authenticate Supabase CLI
- `supabase init`, `supabase link`, `supabase start` สำหรับ local development
- สร้าง client จาก env vars
- ไม่ครอบคลุม env/RLS/config ขั้นสูง → ใช้ `workflows/config-supabase/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยัน prerequisites ก่อนติดตั้ง (idempotent)

1. อ่าน `package.json` เพื่อระบุ package manager (`bun`, `npm`, `pnpm`)
2. ตรวจว่ามี `supabase/config.toml` หรือ `supabase/` directory อยู่แล้ว → ถ้ามี skip ไป verify
3. ตรวจ Docker สำหรับ local stack — ถ้าไม่มี → stop และแจ้ง user ติดตั้ง
4. ถ้าไม่มี Supabase account/project → stop และแจ้ง user สร้างจาก dashboard

###### 2. Install And Authenticate CLI

> Goal: ติดตั้งและ login Supabase CLI

1. ติดตั้ง CLI ด้วย `bun add -D supabase` หรือ package manager ของระบบ (`brew`, `scoop`)
2. ตรวจสอบ version ด้วย `supabase --version`
3. Login ด้วย `supabase login` หรือตั้ง `SUPABASE_ACCESS_TOKEN` สำหรับ CI
4. ยืนยัน authentication ด้วย `supabase projects list`

###### 3. Initialize And Link Project

> Goal: สร้าง local project และเชื่อมกับ remote

1. Initialize ด้วย `supabase init` → สร้าง `supabase/config.toml`
2. Link remote ด้วย `supabase link --project-ref <project-ref>`
3. Start local stack ด้วย `supabase start`
4. รัน `supabase status` เพื่ออ่าน local `API URL`, `anon key`, `service_role key`

###### 4. Install Client And Verify

> Goal: สร้าง client ที่อ่านค่าจาก env และทดสอบ connection

1. ติดตั้ง client SDK ด้วย `bun add @supabase/supabase-js`
2. เก็บ `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ใน `/follow-secret-manager` แล้ว inject เข้า `.env`
3. สร้าง client ด้วย `createClient(url, anonKey)` ใน `src/lib/supabase.ts` (หรือ path ที่เหมาะสม)
4. ทำ `/run-verify` และทดสอบ query เบื้องต้น — ถ้า fail → ทำ `resolve-errors` max 3 รอบ

##### Rules

- ใช้ `supabase/config.toml` เป็น single source of truth
- ห้าม hardcode keys หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- `SUPABASE_SERVICE_ROLE_KEY` ใช้ฝั่ง server เท่านั้น ห้าม expose ไป client
- ถ้า command/API ไม่แน่ใจ → ดู official docs หรือทำ `learn` (web) ก่อน
- เสร็จแล้วทำ `/suggest-next-action`

##### Expected Outcome

- Supabase CLI ติดตั้ง, login, link project สำเร็จ
- Local stack รันได้และ `supabase status` แสดงค่าครบ
- Client พร้อมใช้งานและ query ผ่าน verify

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Supabase เชื่อมต่อได้จริง — URL/anon/service keys valid, project healthy, query ตอบกลับ

##### Scope

- ใช้เมื่อ `/follow-service-supabase` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ schema/RLS

##### Execute

###### 1. Check Credentials

> Goal: URL และ keys ครบ format ถูก

1. ตรวจ `SUPABASE_URL` (หรือ `NEXT_PUBLIC_SUPABASE_URL`) + `SUPABASE_ANON_KEY` มี
2. ถ้าใช้ server-side → `SUPABASE_SERVICE_ROLE_KEY` มี — flag ถ้าหลุดไป client bundle
3. local dev → `supabase status` ดู local stack รันอยู่

###### 2. Smoke Test

> Goal: API ตอบกลับจริง

1. `curl <SUPABASE_URL>/auth/v1/health` → 200 = project up
2. init client → query `select 1` หรือ read table ที่มีอยู่
3. flag: 401 (invalid key), 404 (wrong URL/ref), RLS block ที่ไม่คาด

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `project-down` / `rls-blocked`

##### Rules

- ใช้ read calls เท่านั้น — ห้าม insert/update/delete
- ไม่ print service role key — แสดงแค่ key type ที่พบ
- service key ใน client-side code = Critical finding

##### Expected Outcome

- Verdict พร้อม project-ref + health evidence

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

Official links และ resources สำหรับ Supabase

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

Programmatic API reference สำหรับ Supabase client libraries

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

Configuration options reference สำหรับ Supabase CLI

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

- Supabase CLI ติดตั้งและตั้งค่าอย่างถูกต้อง
- Local development environment ทำงานได้
- Database migrations จัดการอย่างเป็นระบบ
- TypeScript types สร้างอัตโนมัติ
- Edge functions deploy ได้อย่างราบรื่น
- Secrets จัดการอย่างปลอดภัย
- CI/CD integration ทำงานได้อัตโนมัติ
- Backend ที่ built ด้วย Supabase พร้อม PostgreSQL, Auth, Realtime
