# Cloudflare Vite Plugin

`@cloudflare/vite-plugin` is the official Cloudflare plugin for Vite that integrates Vite with the Workers runtime via the Vite Environment API

## When To Install

- Projects deploying to Cloudflare Workers or Pages
- Projects using Vite as the build tool (has `vite.config.ts` or `vite` in `devDependencies`)
- Supports TanStack Start, React Router v8, SPA, standalone Workers, multi-Worker

## Install

```bash
bun add -D @cloudflare/vite-plugin wrangler
```

## Configure Vite

Add the `cloudflare()` plugin in `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
});
```

If using another framework plugin (e.g. React), place `cloudflare()` after the framework plugin:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
});
```

### TanStack Start (Solid or React)

For TanStack Start, place `cloudflare()` before `tanstackStart()` and set `viteEnvironment`:

```ts
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    solidPlugin({ ssr: true }),
  ],
});
```

`wrangler.jsonc` for TanStack Start uses the server-entry export as `main`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_date": "2025-08-13",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/solid-start/server-entry",
  "observability": { "enabled": true }
}
```

For TanStack Start + React, use `@tanstack/react-start/server-entry` instead

## Wrangler Config

The plugin automatically reads `wrangler.jsonc`, `wrangler.json` or `wrangler.toml` in the root; no extra configuration is needed unless you want to override

Example `wrangler.jsonc` for an SPA:

```jsonc
{
  "name": "my-app",
  "main": "./worker/index.ts",
  "compatibility_date": "2026-08-26",
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application"
  }
}
```

## Build And Deploy

After installing the plugin, build and deploy with Vite + Wrangler:

```bash
# Build with Vite (the plugin creates the output for Workers)
vite build

# Deploy with wrangler
wrangler deploy
```

`vite preview` is supported to preview the build output in the Workers runtime before a real deploy

## Verify Install

1. Check that `vite.config.ts` has `cloudflare()` in the `plugins` array
2. `vite build` runs successfully without errors
3. Check that `wrangler.jsonc` or `wrangler.toml` exists in the root
4. Run `wrangler whoami` to confirm authentication

## CI Deploy Tips

### GitHub Actions

Use `cloudflare/wrangler-action@v4` for auth in CI because running `bunx wrangler deploy` directly often does not detect the `CLOUDFLARE_API_TOKEN` env var in a non-interactive environment:

```yaml
- uses: actions/checkout@v7
- uses: oven-sh/setup-bun@v2
- name: Install dependencies
  run: bun install --frozen-lockfile
- name: Build
  run: bun run build
- name: Deploy to Cloudflare Workers
  uses: cloudflare/wrangler-action@v4
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy
    packageManager: bun
```

Note: `wrangler-action@v4` installs Wrangler v4 by default — if you need to pin Wrangler v3, add `wranglerVersion: "3.90.0"` under `with:`

### Common Pitfalls

- Frozen lockfile: CI uses `bun install --frozen-lockfile`; if `bun.lock` is out of sync with `package.json` it fails — run `bun install` locally and commit the updated lockfile
- Missing secret: set `CLOUDFLARE_API_TOKEN` as a GitHub secret (`gh secret set CLOUDFLARE_API_TOKEN`)
- `.wrangler` directory: add `.wrangler` to `.gitignore` and linter ignores
- Stale wrangler.toml: when migrating from an old Nitro/SolidStart setup that used `.output/server/index.mjs`, convert to `wrangler.jsonc` and set `main` per the current framework
- Biome schema version: when Biome updates, run `bunx biome migrate --write` and update the `$schema` URL in `biome.jsonc`

## Source

- [Vite plugin docs](https://developers.cloudflare.com/workers/vite-plugin/)
- [Get started](https://developers.cloudflare.com/workers/vite-plugin/get-started/)
- [API reference](https://developers.cloudflare.com/workers/vite-plugin/reference/api/)
- [@cloudflare/vite-plugin on npm](https://www.npmjs.com/package/@cloudflare/vite-plugin)
- [Bun package registry](https://bun.com/docs/installation)
