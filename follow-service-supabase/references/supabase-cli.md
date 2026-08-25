# Supabase CLI Reference

## Overview

The Supabase CLI enables local development, database migrations, type generation, edge function deployment, and CI/CD workflows for Supabase projects. The local stack runs in Docker containers.

## Version Info

- **Package**: `supabase`
- **Latest stable**: `2.115.0`
- **Node.js requirement**: `>= 20` (when installed via npm/npx)
- **License**: MIT
- **npm**: https://www.npmjs.com/package/supabase
- **GitHub**: https://github.com/supabase/cli

## Install

### npm (Project Dependency)

```sh
npm install supabase --save-dev
# or
pnpm add -D supabase
# or
yarn add -D supabase
# or
bun add -D supabase
```

Pin the version in `package.json` for team consistency. Run commands through your package runner:

```sh
npx supabase --help
# or
pnpm supabase --help
# or
yarn supabase --help
# or
bunx supabase --help
```

### macOS (Homebrew)

```sh
brew install supabase/tap/supabase
```

### Windows (Scoop)

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Linux

Download `.apk`/`.deb`/`.rpm` from [GitHub Releases](https://github.com/supabase/cli/releases):

```sh
sudo apk add --allow-untrusted supabase-x.y.z.apk
sudo dpkg -i supabase-x.y.z.deb
sudo rpm -i supabase-x.y.z.rpm
```

### Beta Channel

```sh
npm install supabase@beta --save-dev
# or
brew install supabase/tap/supabase-beta
brew link --overwrite supabase-beta
```

## Prerequisites

- **Docker** (or compatible container runtime) is required for local development
- Container runtime options: Docker Desktop, Rancher Desktop, Podman, OrbStack, colima

## Initialize Project

```sh
supabase init
```

Creates a `supabase/` folder with `config.toml`. Safe to commit to version control.

## Local Development

```sh
supabase start    # Start full local Supabase stack
supabase stop     # Stop local stack
supabase status   # Check status and show local credentials
```

After `supabase start`, you get:
- **Studio**: `http://127.0.0.1:54323`
- **API URL**: `http://127.0.0.1:54321`
- **Database URL**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## Link To Remote Project

```sh
supabase link --project-ref <project-id>
```

## Database Migrations

```sh
supabase migration new create_users    # Create new migration
supabase migration list                # List migrations
supabase migration up                  # Apply pending migrations
supabase migration down                # Rollback last migration
supabase migration fetch               # Fetch remote migrations
```

## Database Operations

```sh
supabase db pull          # Pull schema from remote
supabase db push          # Push schema to remote
supabase db reset         # Reset database (includes seed)
supabase db dump          # Dump database
supabase db diff          # Diff local vs remote schema
supabase db diff -f name  # Generate migration from diff
```

## Type Generation

```sh
supabase gen types typescript --local > types/supabase.ts
# or from remote:
supabase gen types typescript --project-id <project-id> > types/supabase.ts
# specific schema:
supabase gen types typescript --schema public --schema auth > types/supabase.ts
```

## Edge Functions

```sh
supabase functions new my-function     # Create new function
supabase functions serve               # Serve functions locally
supabase functions deploy my-function  # Deploy function to remote
supabase functions list                # List deployed functions
supabase functions delete my-function  # Delete function
```

## Secrets Management

```sh
supabase secrets set KEY=value         # Set a secret
supabase secrets set KEY=@/path/to/file  # Set from file
supabase secrets list                  # List secrets
supabase secrets unset KEY             # Delete a secret
```

## Storage

```sh
supabase storage ls [path]             # List storage
supabase storage cp <src> <dest>       # Copy files
supabase storage mv <src> <dest>       # Move files
supabase storage rm <path>             # Remove files
```

## Branch Management

```sh
supabase branches create branch-name   # Create a branch
supabase branches list                 # List branches
supabase branches get branch-name      # Get branch details
supabase branches pause branch-name    # Pause a branch
supabase branches delete branch-name   # Delete a branch
```

## Database Inspection

```sh
supabase inspect db bloat              # Check table bloat
supabase inspect db blocking           # Check blocking queries
supabase inspect db long-running-queries  # Check long-running queries
supabase inspect db table-stats        # Check table statistics
supabase inspect report                # Generate health report
```

## Configuration (`supabase/config.toml`)

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

## CI/CD Integration

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v2
        with:
          version: '2.115.0'
      - run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - run: supabase functions deploy my-function
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## Update

```sh
npm update supabase --save-dev    # npm
brew upgrade supabase             # Homebrew
scoop update supabase             # Scoop
```

## Source

- [Supabase CLI Getting Started](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)
- [CLI Reference](https://supabase.com/docs/reference/cli)
- [GitHub Releases](https://github.com/supabase/cli/releases)
