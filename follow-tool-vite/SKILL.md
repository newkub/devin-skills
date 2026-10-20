---
name: follow-tool-vite
description: Set up and use Vite 8 (Rolldown bundler) for modern web applications
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - follow-tool-devfra
  - follow-tool-rolldown
  - follow-tool-tsdown
  - follow-tool-vitepress
  - follow-tool-vite-plugins
  - follow-create-plugins
  - follow-tool-biome
  - follow-lang-typescript

---

## Goal

Set up and use Vite 8+ (Rolldown as the single bundler, Oxc for transform/minify) for development and production builds, in both single projects and monorepos

## Scope

Use for modern web applications that use Vite as their build tool and dev server

- gzip/brotli pre-compression: see `references/apis.md`

- Boundary: Vite is for app dev server/build — library bundling → `/follow-tool-tsdown`; raw bundler internals → `/follow-tool-rolldown`; static docs site → `/follow-tool-vitepress`; devtools (inspector/analyzer mounted in the app or standalone) → `/follow-tool-devfra`; testing setup → `/follow-tool-vitest`

## Execute

### 1. Installation

> Goal: Install Vite and verify the environment

1. Check Node.js is at least 20.19 or 22.12
2. Install Vite with `bun add -D vite` (latest `8.3.1`, verified 2026-09-26)
3. Verify the version with `bunx vite --version`
4. See details in [references/apis.md](references/apis.md)

### 2. Configuration

> Goal: Create `vite.config.ts`

1. Create `vite.config.ts` at the root
2. Use `defineConfig` from `vite`
3. Configure plugins for the framework used — pick from the `/follow-tool-vite-plugins` catalog
4. Define `resolve.alias` with absolute paths
5. Enable `resolve.tsconfigPaths: true`
6. Use the top-level `tsconfig` option (Vite 8.3+) when specifying the tsconfig Vite uses for resolve/transform
7. Set `envPrefix` if needed
8. See config patterns in [references/apis.md](references/apis.md)

### 3. Development

> Goal: Set up the dev server and HMR

1. Run `bunx vite` or `bun run dev`
2. Use `server.proxy` for API requests
3. Use `.env` files per mode
4. Configure `server.warmup.clientFiles` for pre-transform
5. Use `server.open: true` to warm up the entry

### 4. Production Build

> Goal: Build for production

1. Run `bunx vite build`
2. Use `build.target: 'baseline-widely-available'`
3. Vite 8 uses Rolldown as the single bundler by default — no opt-in or `rolldown-vite` needed anymore (the preview package is discontinued); migrate from Vite ≤7 by upgrading `vite` straight to `^8`
4. Use `build.rolldownOptions.output.advancedChunks`/`manualChunks` for vendor splitting
5. Drop console/debugger via `build.rolldownOptions.output.minify.compress` (`dropConsole`, `dropDebugger`) — the `esbuild`/`esbuild.drop` options are deprecated (`debugger` is removed by default)
6. Set `chunkSizeWarningLimit` to monitor bundle size

### 5. Performance Optimization

> Goal: Tune performance

1. Avoid barrel files; import from direct files
2. Use explicit import paths with extensions
3. Use `moduleResolution: "bundler"` in `tsconfig.json`
4. Enable `optimizeDeps.include` for deps Vite may miss
5. Use `vite --profile` for profiling (Vite 8.3+ supports `vite --profile <name>` to name the CPU profile)

### 6. Testing and Deployment

> Goal: Integrate tests and deploy

1. Do `/follow-tool-vitest` to set up testing — component tests with Testing Library → `workflows/testing-library/SKILL.md`
2. Run `bunx vitest run` or `bun run test`
3. Set `base` in `vite.config.ts` for the public path
4. Use `vite preview` to test the production build
5. Deploy to the static host the project uses

### Workflows

> Goal: Dispatch specialized work to the right workflow

| Topic | Workflow |
|-------|----------|
| Set up/edit `vite.config.ts` (plugins, resolve, build, server) | `workflows/config-vite/SKILL.md` |
| optimize build/bundle (chunk splitting, minify, sourcemap) | `workflows/optimize-build/SKILL.md` |
| Migrate from Vite ≤7/`rolldown-vite` to Vite 8 | `workflows/migrate-to-vite8/SKILL.md` |
| Component testing with Testing Library (setup + queries + user-event) | `workflows/testing-library/SKILL.md` |
| Pick/setup plugins — unified + frontend-lib catalogs | `/follow-tool-vite-plugins` |
## Rules

### 1. Configuration

- `vite.config.ts` is required at the root
- Always use `defineConfig`
- Use conditional config when there are mode-specific options

### 2. Development

- Use HMR for instant updates
- Configure `server.proxy` for APIs
- Use `.env.[mode]` files for environment config

### 3. Build

- Use `build.target: 'baseline-widely-available'`
- Vite 8 uses Rolldown + Oxc by default — use the `oxc` option instead of `esbuild` (deprecated), and `optimizeDeps.rolldownOptions` instead of `optimizeDeps.esbuildOptions`
- Use `manualChunks`/`advancedChunks` for vendor splitting

### 4. Environment Variables

- Use the `VITE_` prefix or a defined `envPrefix`
- Access through `import.meta.env.*`
- Never hard-code secrets

### 5. Monorepo

- Vite detects linked packages automatically
- Add linked deps to `optimizeDeps.include` if they are not ESM
- Use absolute paths for `resolve.alias`

- Use /follow-tool-vitest for test setup (see `### 6. Testing and Deployment`)
- Use /follow-tool-devfra if needed (devtool/inspector for the app)
- Use /follow-tool-rolldown if needed
- Use /follow-tool-vite-plugins for plugin selection/setup
- Use /follow-tool-tsdown if needed
- Use /follow-tool-vitepress if needed
- Use /follow-create-plugins (vite) if needed (tool vite)
- Use /follow-tool-biome if needed
- Use /follow-lang-typescript if needed

## References

- [CLI reference](references/cli.md)

## File Structure

Canonical file structure + layer table: [templates/file-structure-web-vite-spa.md](templates/file-structure-web-vite-spa.md)

- See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

- Vite 8 installed and working
- Dev server with HMR and warmup
- Production build optimized
- Test setup integrated with Vitest
- Deployment config correct

