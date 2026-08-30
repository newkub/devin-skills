# Vercel CLI Reference

## Overview

Vercel CLI is the command-line interface for the Vercel platform. It allows you to deploy, manage, and monitor projects from the terminal, including Next.js, Nuxt, React, and other frameworks.

## Version Info

- Package: `vercel`
- Latest stable: `59.5.0`
- Node.js requirement: `>= 18`
- License: Apache-2.0
- npm: https://www.npmjs.com/package/vercel

## Install

```sh
bun add vercel
# or
pnpm i vercel
# or
yarn i vercel
# or
bun i vercel
```

For global install:

```sh
bun add -g vercel
# or
bun add -g vercel
```

Verify installation:

```sh
vercel --version
```

### Update

```sh
vercel upgrade
vercel upgrade --dry-run
vercel upgrade --enable-auto
```

Or re-run the install command. Running any command shows an update message when a new version is available.

## Authentication

```sh
vercel login       # Interactive login
vercel whoami      # Check current authentication
```

For CI/CD, create a token on your [tokens page](https://vercel.com/account/tokens) and authenticate via:
- Set `VERCEL_TOKEN` environment variable (recommended)
- Pass `--token` option to commands

## Core Commands

### Deploy

```sh
vercel                    # Create preview deployment
vercel --prod             # Deploy to production
vercel --prebuilt         # Deploy prebuilt output
vercel build              # Build locally
vercel build --prod       # Build for production locally
```

### Project Management

```sh
vercel link               # Link existing project to Vercel
vercel list               # List deployments
vercel inspect [url]      # Inspect a deployment
vercel ls                 # List projects
```

### Local Development

```sh
vercel dev                # Start local dev server
vercel dev --listen 3001  # Custom port
```

### Logs

```sh
vercel logs [url]         # View deployment logs
vercel logs --prod        # View production logs
vercel logs --level error # Filter by level
```

### Environment Variables

```sh
vercel env add KEY_NAME           # Add environment variable
vercel env ls                     # List environment variables
vercel env pull [file]            # Pull env vars to .env file
vercel env pull .env.local        # Pull to specific file
vercel env rm KEY_NAME            # Remove environment variable
```

### Domains

```sh
vercel domains add example.com    # Add custom domain
vercel domains ls                 # List domains
vercel domains rm example.com     # Remove domain
vercel alias set [url] [domain]   # Set alias
vercel alias ls                   # List aliases
vercel alias rm [domain]          # Remove alias
```

### Certificates

```sh
vercel certs ls                   # List certificates
vercel certs issue [domain]       # Issue certificate
vercel certs rm [cert-id]         # Remove certificate
```

### Rollback

```sh
vercel rollback [url]             # Rollback to previous deployment
```

### Cache

```sh
vercel cache purge                # Purge all cache
vercel cache purge --type cdn     # Purge CDN cache
vercel cache purge --type data    # Purge data cache
vercel cache invalidate --tag foo # Invalidate by tag
```

## Configuration (`vercel.json`)

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
      - run: npm ci
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

Using `VERCEL_TOKEN` environment variable is recommended over `--token` flag to avoid exposing the token in process lists.

## Native CLI Binaries (Experimental)

Native binaries reduce setup where Node.js is unnecessary:

```sh
bun add -g @vercel/vc-native -f
```

The `-f` flag replaces existing global `vercel` and `vc` bin links. Supports macOS, Linux, and Windows on x64 and arm64.

## Source

- [Vercel CLI Overview](https://vercel.com/docs/cli)
- [Vercel CLI Upgrade](https://vercel.com/docs/cli/upgrade)
- [Getting Started with Vercel](https://vercel.com/docs/getting-started-with-vercel)
- [Vercel CLI Release Notes](https://vercel.com/docs/cli/release-notes)
