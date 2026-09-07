# Service Supabase API & Dependencies

## Install

Supabase CLI (dev dependency — runs local stack, migrations, deploys):

```sh
bun add -D supabase
# or
npm install --save-dev supabase
# Windows / macOS system installs:
scoop install supabase
brew install supabase/tap/supabase
```

JS client library (runtime dependency for app code):

```sh
bun add @supabase/supabase-js
# or
npm install @supabase/supabase-js
```

## Version

- CLI latest (`supabase`): 2.116.0
- JS client latest (`@supabase/supabase-js`): 2.116.0
- [Package Registry (CLI)](https://www.npmjs.com/package/supabase)
- [Package Registry (client)](https://www.npmjs.com/package/@supabase/supabase-js)
- [Repository (CLI)](https://github.com/supabase/cli)
- [Repository (client)](https://github.com/supabase/supabase-js)

## Dependencies

- CLI requires Docker Desktop for `supabase start` (local stack: Postgres, PostgREST, GoTrue auth, Storage, Studio).
- CI: set `SUPABASE_ACCESS_TOKEN` (skip `login`) and `SUPABASE_DB_PASSWORD` for db commands.
- `@supabase/supabase-js` composes `postgrest-js`, `gotrue-js` (auth), `storage-js`, `realtime-js`, `functions-js` — all auto-installed.

## Common API / Commands

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

## Source

- CLI reference: https://supabase.com/docs/reference/cli
- JS client reference: https://supabase.com/docs/reference/javascript
- Local development: https://supabase.com/docs/guides/local-development
- Client repo: https://github.com/supabase/supabase-js
