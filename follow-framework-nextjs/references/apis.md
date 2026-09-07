# Framework Next.js API & Dependencies

## Install

```sh
# Create new project (recommended)
bunx create-next-app@latest my-app
# or
npx create-next-app@latest my-app

# Manual install into an existing project
bun add next@latest react@latest react-dom@latest
# or
npm install next@latest react@latest react-dom@latest
```

## Version

- Latest: 16.3.4
- Requires: Node.js `>=20.9.0`, React `^18.2 || ^19`, TypeScript `>=5.1` (optional)
- [Package Registry](https://www.npmjs.com/package/next)
- [Repository](https://github.com/vercel/next.js)

## Dependencies

- Peer dependencies: `react`, `react-dom` (required); `sass`, `@playwright/test`, `@opentelemetry/api`, `babel-plugin-react-compiler` (optional).
- Bundles `@next/env`, `styled-jsx`, `@swc/helpers`, `caniuse-lite`, `postcss`; platform binaries via `@next/swc-*` optional deps.
- Turbopack is the stable default bundler for both `dev` and `build` (Webpack via `--webpack`).
- `next lint` was removed in v16 — run `eslint` directly instead.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `next dev` | Start dev server | localhost:3000, Turbopack | `-p/--port`, `-H/--hostname`, `--turbopack`, `--webpack`, `--experimental-https` |
| `next build` | Build production bundle | Turbopack, `.next/` output | `--webpack`, `--profile`, `--debug`, `--debug-prerender`, `--experimental-build-mode` |
| `next start` | Start production server | localhost:3000 | `-p/--port`, `-H/--hostname`, `--keepAliveTimeout` |
| `next info` | Print system/environment info | stdout | `--verbose` |
| `next telemetry` | Manage anonymous telemetry | enabled | `enable`, `disable`, `status` |
| `next typegen` | Generate route/env type definitions | `.next/types` | `--watch` |
| `next experimental-test` | Run Playwright tests | `playwright` runner | `--help` for runner options |
| `next experimental-analyze` | Analyze bundle output | build artifacts | `--serve`, `--output` |
| `bunx @next/codemod` | Run upgrade codemods | interactive pick | `upgrade`, codemod name e.g. `app-router-prefetch-default` |
| `next/*` module imports | Framework APIs | per module | `next/link`, `next/image`, `next/font/*`, `next/navigation`, `next/server`, `next/headers`, `next/cache` |
| File conventions | App Router routes | `app/` directory | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `template.tsx`, `default.tsx` |

## Source

- Official docs: https://nextjs.org/docs
- CLI reference: https://nextjs.org/docs/app/api-reference/cli/next
- Description: Next.js — The React Framework for production-grade full-stack web apps (App Router, RSC, Turbopack).
