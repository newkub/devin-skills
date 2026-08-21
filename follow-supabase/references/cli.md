# CLI Commands

## Purpose

Command-line interface reference สำหรับ Supabase CLI

## Scope

- Global Commands
- Database Commands
- Auth Commands
- Storage Commands

## Global Commands

### supabase init

Initialize Supabase project locally

```bash
supabase init
supabase init --force
supabase init --use-orioledb
```

### supabase login

Login to Supabase account

```bash
supabase login
supabase login --token sbp_xxx
```

### supabase link

Link to remote project

```bash
supabase link --project-ref xxx
supabase link --project-ref xxx --password secret
```

### supabase status

Show local stack status

```bash
supabase status
supabase status -o env
```

### supabase stop

Stop local stack

```bash
supabase stop
supabase stop --no-backup
supabase stop --all
```

## Local Development

### supabase start

Start local development stack

```bash
supabase start
supabase start -x gotrue,imgproxy
supabase start --ignore-health-check
```

### supabase db start

Start only database container

```bash
supabase db start
```

## Migration Commands

### supabase migration new

Create new migration

```bash
supabase migration new add_users_table
supabase migration new create_profiles -t pgtap
```

### supabase db reset

Reset local database

```bash
supabase db reset
supabase db reset --no-seed
supabase db reset --version 20230101
```

### supabase db diff

Diff schema changes

```bash
supabase db diff -f new_changes
supabase db diff --linked -f remote_changes
supabase db diff --local -f local_changes
supabase db diff --use-pg-delta -f delta_diff
```

### supabase db push

Push migrations to remote

```bash
supabase db push
supabase db push --dry-run
supabase db push --include-all
supabase db push --include-seed
```

### supabase db pull

Pull remote schema

```bash
supabase db pull
supabase db pull --schema public,auth
```

### supabase db dump

Dump database

```bash
supabase db dump -f schema.sql
supabase db dump --data-only -f data.sql
supabase db dump --role-only -f roles.sql
```

### supabase db lint

Lint database schema

```bash
supabase db lint
supabase db lint --level error
supabase db lint --fail-on warning
```

### supabase db query

Run SQL query

```bash
supabase db query "SELECT * FROM users"
```

## Type Generation

### supabase gen types

Generate types from database

```bash
supabase gen types typescript --local
supabase gen types typescript --linked
supabase gen types typescript --db-url postgres://xxx
supabase gen types go --linked
supabase gen types swift --linked
supabase gen types python --linked
```

### supabase gen signing-key

Generate JWT signing key

```bash
supabase gen signing-key
supabase gen signing-key --algorithm ES256
```

### supabase gen bearer-jwt

Generate bearer JWT

```bash
supabase gen bearer-jwt
supabase gen bearer-jwt --algo RS256
```

## Test Commands

### supabase test db

Run pgTAP tests

```bash
supabase test db
supabase test db --linked
supabase test db --local
```

### supabase test new

Create new test

```bash
supabase test new my_test
supabase test new my_test -t pgtap
```

## Project Commands

### supabase projects list

List projects

```bash
supabase projects list
```

### supabase projects create

Create new project

```bash
supabase projects create my-project
```

## Help

### supabase --help

Show help

```bash
supabase --help
supabase db --help
supabase migration --help
```

### supabase --version

Show version

```bash
supabase --version
```

## See Also

- [Configuration](./configuration.md) - Configuration options
- [API Reference](./api.md) - Programmatic API
