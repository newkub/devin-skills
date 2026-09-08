# Framework Nuxt API & Dependencies

## Install

```sh
# Create new project (recommended)
bunx nuxi@latest init my-app
# or
npx nuxi@latest init my-app
# or
npm create nuxt@latest my-app

# Add a Nuxt module
bunx nuxi@latest module add <name>
```

## Version

- Latest: 4.5.2 (`nuxt` package); Nuxt 3.x reached EOL — use Nuxt 4 for new projects
- Requires: Node.js `^22.19.0 || ^24.11.0 || >=26.0.0`, Vue `3.5+`
- [Package Registry](https://www.npmjs.com/package/nuxt)
- [Repository](https://github.com/nuxt/nuxt)

## Dependencies

- Ships with `@nuxt/cli` (nuxi), `@nuxt/kit`, `@nuxt/schema`, `@nuxt/vite-builder`, `@nuxt/nitro-server`, `@nuxt/devtools`, `vue`, `vue-router`, `unhead`, `unimport`.
- Server engine: Nitro (`@nuxt/nitro-server`) — deploys to Node, serverless, edge via presets.
- App code lives in `app/` directory in Nuxt 4 (`app/pages/`, `app/components/`, `app/composables/`); `server/` for API routes.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `nuxi init <dir>` | Scaffold a new Nuxt project | latest template | `-t/--template`, `--packageManager`, `--gitInit`, `--modules`, `-f/--force` |
| `nuxi dev` | Start dev server | localhost:3000 | `-p/--port`, `--host`, `-o/--open`, `--https`, `--dotenv`, `-c/--clipboard` |
| `nuxi build` | Build for production | `.output/` via Nitro | `--prerender`, `--preset`, `--dotenv` |
| `nuxi generate` | Pre-render all routes to static HTML | `.output/public` | `--preset`, `--dotenv` |
| `nuxi preview` | Preview production build locally | `.output/` | `--dotenv`, `--envName`, `-p/--port` |
| `nuxi analyze` | Analyze production bundle | interactive serve | `-n/--name`, `--serve` |
| `nuxi prepare` | Generate types + `.nuxt/` directory | current project | `--dotenv`, `--logLevel` |
| `nuxi typecheck` | Run vue-tsc typecheck | `nuxi typecheck` | `--logLevel` |
| `nuxi add <template>` | Scaffold component/page/layout/etc. | `components/` target | `component`, `composable`, `layout`, `middleware`, `page`, `plugin`, `server-route`, `--force` |
| `nuxi module <cmd>` | Manage Nuxt modules | interactive search | `add`, `search`, plus module name e.g. `icon`, `image` |
| `nuxi upgrade` | Upgrade Nuxt to latest | latest stable | `-f/--force`, `-ch/--channel` (`stable`, `nightly`) |
| `nuxi cleanup` | Clean generated dirs + caches | `.nuxt`, `.output`, caches | `--nuxt`, `--modules` |
| `nuxi info` | Print environment info | stdout | `--copy` |
| `nuxi devtools` | Enable/disable Nuxt DevTools | per project | `enable`, `disable` |
| `nuxi build-module` | Build a Nuxt module | module stub | `--stub` |
| `defineNuxtConfig` | Typed `nuxt.config.ts` | project defaults | `ssr`, `routeRules`, `modules`, `runtimeConfig`, `app`, `nitro` |
| `#app` composables | Framework APIs (auto-imported) | `nuxt` exports | `useFetch`, `useAsyncData`, `useState`, `useRoute`, `useRouter`, `navigateTo`, `defineNuxtPlugin`, `defineNuxtRouteMiddleware`, `useRequestFetch`, `useRuntimeConfig` |
| `server/` conventions | Nitro server routes | file-based | `server/api/*`, `server/routes/*`, `server/middleware/*` (`defineEventHandler`) |

## Source

- Official docs: https://nuxt.com/docs
- CLI/API reference: https://nuxt.com/docs/api/commands
- Description: Nuxt — full-stack Vue framework for type-safe, performant, production-grade web applications and websites.
