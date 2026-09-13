# Framework Svelte API & Dependencies

## Install

```sh
# Create new project with the sv CLI (recommended)
bunx sv create my-app
# or
npx sv create my-app

# Manual install into an existing project
bun add -D svelte
# or
npm install --save-dev svelte
```

## Version

- Latest: 5.57.0 (Svelte 5 — runes-based reactivity)
- Requires: Node.js `>=18`
- [Package Registry](https://www.npmjs.com/package/svelte)
- [Repository](https://github.com/sveltejs/svelte)

## Dependencies

- Compiles `.svelte` components at build time — no runtime virtual DOM.
- Bundles compiler deps: `acorn`, `@sveltejs/acorn-typescript`, `esrap`, `magic-string`, `zimmerframe`, `aria-query`, `axobject-query`.
- Vite integration via `@sveltejs/vite-plugin-svelte`; typechecking via `svelte-check`.
- `sv` is the official CLI (`npm create svelte` is replaced by `sv create`).

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `npx sv create <dir>` | Scaffold a new project | `minimal` template | `--template minimal\|demo\|library`, `--types ts\|js`, `--add <add-ons>`, `--no-add-ons`, `--no-install`, `--no-git` |
| `npx sv add <add-on>` | Add integration to existing project | interactive pick | `drizzle`, `eslint`, `prettier`, `tailwindcss`, `vitest`, `playwright`, `mdsvex`, `paraglide`, etc. |
| `npx sv migrate <name>` | Run code migration | interactive pick | `svelte-5`, `svelte-4`, `self-closing-tags`, `app-state`, `package` |
| `npx sv check` | Typecheck `.svelte` files | wraps svelte-check | `--tsconfig`, `--watch` |
| `$state` | Reactive state rune | deep reactive | `$state(raw)`, `$state.snapshot()`, `$state.eager()` |
| `$derived` | Derived reactive value | lazy | `$derived(expr)`, `$derived.by(() => ...)` |
| `$effect` | Side-effect rune | post-render | `$effect(fn)`, `$effect.pre`, `$effect.tracking()`, `$effect.root()` |
| `$props` | Component props | destructurable | `let { a, b = 1 } = $props()`; `$bindable()` for two-way props |
| Other runes | Reactivity helpers | compiler-level | `$inspect`, `$host`, `$bindable` |
| `mount` / `hydrate` / `unmount` | App entry APIs | `svelte` exports | `mount(App, { target })`, `hydrate(App, { target })` |
| `import 'svelte/*'` | Subpath modules | per module | `svelte/store` (`writable`, `readable`), `svelte/motion`, `svelte/transition`, `svelte/animate`, `svelte/easing`, `svelte/events`, `svelte/reactivity`, `svelte/attachments`, `svelte/elements`, `svelte/legacy`, `svelte/server`, `svelte/compiler` |
| `{#if}` / `{#each}` / `{#key}` / `{#await}` | Template blocks | HTML-embedded | `{#snippet}`/`{@render}`, `{@attach}`, `{@html}`, `{@const}`, `{@debug}` |

## Source

- Official docs: https://svelte.dev/docs/svelte
- CLI docs: https://svelte.dev/docs/cli/overview
- Description: Svelte — cybernetically enhanced web apps; a compiler that turns components into efficient vanilla JS.
