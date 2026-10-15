---
name: follow-tool-vite-config-vite
description: Configure vite.config.ts — structure, plugins, resolve/build/server options
argument-hint: "[config-topic]"
related:
  - follow-tool-vite
  - follow-tool-vitest
  - follow-lang-typescript
---

## Goal

Write and tune `vite.config.ts` correctly, covering plugins, resolve, build, and server options per project need, without clobbering the existing config

## Scope

- Covers `vite.config.ts` structure, `defineConfig`, conditional config by mode/command
- Main options: `plugins`, `resolve`, `build`, `server`, `preview`, `envPrefix`, `base`
- Deep bundle optimization → use `workflows/optimize-build/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: know the current state before editing

1. Open and read the root `vite.config.ts`/`vite.config.js` — if absent → go to step 2 to create it
2. Check the framework used from `package.json` to pick the official plugin (`@vitejs/plugin-react`, `@vitejs/plugin-vue`, etc.)
3. If the existing config is large → do `/deep-review-codebase` domain `review-config` to spot unneeded options

### 2. Config Structure

> Goal: use the correct `defineConfig` pattern

1. Always use `defineConfig` from `vite` for type checking
2. Use conditional config `defineConfig(({ command, mode }) => ({ ... }))` when options differ between dev/build
3. Use `loadEnv(mode, ...)` when reading env in the config — don't rely on `process.env` directly

### 3. Plugins

> Goal: Add plugins in the right order

1. Put the official framework plugin first in the `plugins` array
2. For plugins with `enforce: 'pre'/'post'`, check the order per that plugin's docs
3. When unsure about a plugin option → see that plugin's official docs, never guess option names

### 4. Resolve Options

> Goal: Set correct path resolution

1. Use `resolve.alias` with absolute paths such as `fileURLToPath(new URL('./src', import.meta.url))`
2. Enable `resolve.tsconfigPaths: true` when using tsconfig paths
3. Set `resolve.extensions` only when necessary

### 5. Build Options

> Goal: Set the basic build

1. Set `build.target` per the project's browser support (e.g. `'baseline-widely-available'`)
2. Set `build.outDir`, `build.assetsDir` only when non-defaults are wanted
3. Chunk splitting/minify/sourcemap → follow `workflows/optimize-build/SKILL.md`

### 6. Server Options

> Goal: Set up the dev server

1. Set `server.port`, `server.strictPort`, `server.open` per need
2. Use `server.proxy` for API calls — specify `target`, `changeOrigin` clearly
3. Use `server.warmup.clientFiles` for entries that transform slowly
4. Use separate `preview.*` for `vite preview` when the port/host differs from dev

### 7. Verify

> Goal: the config works in both dev and build

1. Run `bunx vite` → the dev server starts with no config error
2. Run `bunx vite build` → the build passes
3. If it breaks → revert the last changed key, then do `/resolve-errors` max 3 rounds

## Rules

### 1. Config

- Always use `defineConfig` — never export a plain object
- Merge with the existing config; never overwrite the whole file unless necessary
- Never put secrets in the config — use env files per `envPrefix`

### 2. Options

- Use only options found in the official docs (`vite.dev`) — never guess option names
- When unsure → do `/learn` (web) before editing

- Use /follow-tool-vite if needed
- Use /follow-tool-vitest if needed
- Use /follow-lang-typescript if needed

## Expected Outcome

- `vite.config.ts` covers the plugins/resolve/build/server the project needs
- `vite` dev and `vite build` run without config errors
