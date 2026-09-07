# Framework Astro API & Dependencies

## Install

```sh
# Create new project (recommended)
bunx create-astro@latest
# or
npm create astro@latest

# Manual install into an existing project
bun add astro
# or
npm install astro
```

## Version

- Latest: 7.3.1
- Requires: Node.js `>=22.12.0`
- [Package Registry](https://www.npmjs.com/package/astro)
- [Repository](https://github.com/withastro/astro)

## Dependencies

- Built on Vite 8 and esbuild; uses zod, shiki, unstorage internally.
- Adapters and integrations are separate packages (`@astrojs/node`, `@astrojs/vercel`, `@astrojs/cloudflare`, `@astrojs/mdx`, etc.).
- `astro check` requires `@astrojs/check` and `typescript`.
- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `astro dev` | Start dev server | localhost:4321 | `--port`, `--host`, `--open`, `--force`, `--mode` |
| `astro build` | Build site for production | `dist/` output | `--outDir`, `--mode`, `--devOutput`, `--copy` |
| `astro preview` | Preview production build locally | localhost:4321 | `--port`, `--host`, `--open` |
| `astro add` | Add integrations/adapters | interactive prompts | `--yes`, integration name e.g. `react`, `tailwind`, `node` |
| `astro check` | Run TypeScript diagnostics | all files | `--watch`, `--minimumFailingSeverity`, `--tsconfig` |
| `astro sync` | Generate types for content collections/env | current project | `--force` |
| `astro info` | Print environment/debug info | stdout | `--copy` |
| `astro docs` | Open docs site | (none) | (none) |
| `astro preferences` | Manage user preferences | stored config | `list`, `enable`, `disable`, `reset` |
| `astro telemetry` | Configure telemetry | enabled | `enable`, `disable`, `reset` |
| `defineConfig` | Typed config in `astro.config.mjs` | project defaults | `output`, `adapter`, `site`, `base`, `integrations` |
| `import 'astro:content'` | Content collections API | virtual module | `getCollection`, `getEntry`, `render`, `defineCollection` |
| `import 'astro:actions'` | Type-safe server actions | virtual module | `defineAction`, `actions` |
| `import 'astro:env/*'` | Type-safe env variables | virtual module | `astro:env/server`, `astro:env/client` |
| `client:*` directives | Islands hydration control | server-rendered only | `client:load`, `client:idle`, `client:visible`, `client:media`, `client:only`, `server:defer` |

## Source

- Official docs: https://docs.astro.build/
- CLI reference: https://docs.astro.build/en/reference/cli-reference/
- Description: Astro is a modern site builder with web best practices, performance, and DX front-of-mind.
