# Framework SvelteKit API & Dependencies

## Install

```sh
# Create new project with the sv CLI (recommended)
bunx sv create my-app
# or
npx sv create my-app

# Manual install into an existing Svelte/Vite project
bun add -D @sveltejs/kit @sveltejs/adapter-auto @sveltejs/vite-plugin-svelte svelte vite
# or
npm install --save-dev @sveltejs/kit @sveltejs/adapter-auto @sveltejs/vite-plugin-svelte svelte vite
```

## Version

- Latest: 2.70.3 (`@sveltejs/kit`)
- Requires: Node.js `>=18.13`; peer deps `vite ^5||^6||^7||^8`, `svelte ^4||^5`, `typescript ^5.3.3||^6` (optional), `@sveltejs/vite-plugin-svelte`
- [Package Registry](https://www.npmjs.com/package/@sveltejs/kit)
- [Repository](https://github.com/sveltejs/kit)

## Dependencies

- Runtime deps: `sirv`, `cookie`, `devalue`, `esm-env`, `kleur`, `mrmime`, `set-cookie-parser`, `@standard-schema/spec`, `magic-string`, `acorn`, `@sveltejs/acorn-typescript`.
- SvelteKit is a Vite plugin — `dev`/`build`/`preview` run through `vite` commands.
- Deployment targets need an adapter: `@sveltejs/adapter-auto`, `adapter-node`, `adapter-static`, `adapter-vercel`, `adapter-cloudflare`, `adapter-netlify`.
- `svelte-kit package` was moved to the separate `@sveltejs/package` package (`svelte-package` binary).

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `svelte-kit sync` | Generate types + tsconfig aliases | `.svelte-kit/` output | `--mode` |
| `npx sv create <dir>` | Scaffold SvelteKit project | `minimal` template | `--template minimal\|demo\|library`, `--types ts\|js`, `--add <add-ons>`, `--no-install` |
| `npx sv add <add-on>` | Add integration | interactive pick | `eslint`, `prettier`, `vitest`, `playwright`, `tailwindcss`, `drizzle`, etc. |
| `npx sv migrate <name>` | Run code migration | interactive pick | `svelte-5`, `app-state`, `package` |
| `vite dev` | Start dev server | localhost:5173 | `--port`, `--host`, `--open`, `--mode` |
| `vite build` | Build via active adapter | `.svelte-kit/output` | `--mode`, `--watch` |
| `vite preview` | Preview production build | localhost:4173 | `--port`, `--host` |
| `npx svelte-package` | Package `src/lib` for npm | `@sveltejs/package` | `-i/--input`, `-o/--output`, `-w/--watch`, `-t/--types` |
| `$app/navigation` | Navigation API | client-side | `goto`, `invalidate`, `invalidateAll`, `beforeNavigate`, `afterNavigate`, `onNavigate`, `pushState`, `replaceState`, `preloadData`, `preloadCode`, `refreshAll` |
| `$app/state` | Reactive app state (Svelte 5) | `page`, `navigating`, `updated` | replaces `$app/stores` |
| `$app/environment` | Environment flags | build/runtime | `browser`, `building`, `dev`, `version` |
| `$app/paths` | Configured paths | from `kit.paths` | `base`, `assets`, `resolveRoute` |
| `$app/forms` | Form helpers | progressive enhancement | `enhance`, `applyAction`, `deserialize` |
| `$app/server` | Remote functions (experimental) | server-only | `query`, `form`, `command`, `prerender` |
| `@sveltejs/kit` exports | Server/route helpers | per export | `json`, `text`, `error`, `redirect`, `fail`, `isHttpError`, `isRedirect` |
| `src/hooks.*` | Server/client hooks | optional files | `handle`, `handleError`, `init`, `reroute`, `transport` |
| Route files | File-based routing | `src/routes/` | `+page.svelte`, `+page.js`, `+page.server.js`, `+layout.*`, `+server.js`, `+error.svelte` |

## Source

- Official docs: https://svelte.dev/docs/kit
- CLI reference: https://svelte.dev/docs/kit/cli
- Description: SvelteKit — the official application framework for building Svelte apps (routing, SSR, adapters).
