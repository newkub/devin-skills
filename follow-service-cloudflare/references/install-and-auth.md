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
npx wrangler --version
```

If Wrangler is not installed, running `npx wrangler` uses the latest version automatically.

## Authentication

```sh
npx wrangler login      # Interactive browser login
npx wrangler whoami     # Check current authentication
```

For CI/CD, set the `CLOUDFLARE_API_TOKEN` environment variable instead of using `wrangler login`.