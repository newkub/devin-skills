
# Wrangler Install And Authentication

## Install

Install locally in your project (Cloudflare recommends this over global install):

```sh
bun add -D wrangler@latest
# or
yarn add -D wrangler@latest
# or
pnpm add -D wrangler@latest
# or
bun add -d wrangler@latest
```

Verify installation:

```sh
bunx wrangler --version
```

If Wrangler is not installed, running `bunx wrangler` uses the latest version automatically.

## Authentication

```sh
bunx wrangler login      # Interactive browser login
bunx wrangler whoami     # Check current authentication
```

For CI/CD, set the `CLOUDFLARE_API_TOKEN` environment variable instead of using `wrangler login`.

