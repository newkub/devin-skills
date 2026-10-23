---
name: follow-lib-tanstack-devtools
description: Set up TanStack Devtools — unified panel, framework adapter, library plugins, custom plugins
argument-hint: "[framework]"
related:
  - follow-lib-tanstack-ecosystem
  - follow-lib-tanstack-query
  - follow-lib-tanstack-router
  - resolve-errors
---

## Goal

Set up TanStack Devtools — one workbench that hosts TanStack library panels and product-specific inspectors, with source inspection, console piping, and production stripping

## Scope

Use when wiring devtools into a TanStack app — framework adapter, library plugin panels, the Vite plugin, and custom plugins; dev-only by default

- part of TanStack ecosystem — selection/dispatch lives in `/follow-lib-tanstack-ecosystem`
- Query and Router behavior themselves live in `/follow-lib-tanstack-query` and `/follow-lib-tanstack-router`
- References: [TanStack Devtools — Best Practices](best-practices/tanstack-devtools.md), [apis](references/apis.md)

## Execute

### 1. Confirm The Framework And Existing Devtools

> Goal: know which adapter to install and what to merge

1. Read `package.json` for the framework and the installed `@tanstack/*` libraries
2. Search the root entry for an existing `TanStackDevtools` mount — merge, never add a second shell
3. If no TanStack library is installed → `/follow-lib-tanstack-ecosystem` first

### 2. Install The Adapter And Vite Plugin

> Goal: one dev dependency pair, nothing in the runtime install

| Framework | Adapter |
|-----------|---------|
| React | `@tanstack/react-devtools` |
| Solid | `@tanstack/solid-devtools` |
| Vue | `@tanstack/vue-devtools` |
| Preact | `@tanstack/preact-devtools` |
| Svelte | `@tanstack/svelte-devtools` |
| Angular | `@tanstack/angular-devtools` |

```bash
npm install -D @tanstack/react-devtools @tanstack/devtools-vite
```

Install the library panel packages as dev dependencies too — `@tanstack/react-query-devtools` and `@tanstack/react-router-devtools` for the React pair.

### 3. Mount The Shell Once

> Goal: the workbench renders at the app root, not inside a route

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <TanStackDevtools />
  </StrictMode>,
)
```

The shell handles the trigger, tabs, settings, persistence, and hotkeys. Mount it beside `App`, not inside a provider that unmounts on navigation.

### 4. Register Library Panels As Plugins

> Goal: each library gets a tab with its real state

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

<TanStackDevtools
  plugins={[
    { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
    { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
  ]}
/>
```

- React, Preact, and Solid pass `render`; Vue, Svelte, and Angular pass `component`
- optional `id` gives a stable identity; `defaultOpen` opens a panel on first load
- use the `*Panel` exports, not the standalone floating components

### 5. Add The Vite Plugin First

> Goal: source inspection, console piping, and production stripping

```ts
import { devtools } from '@tanstack/devtools-vite'

export default {
  plugins: [devtools(), /* rest of your plugins */],
}
```

- it must be the first plugin in the array
- `removeDevtoolsOnBuild` defaults to `true`, stripping devtools imports from the production build
- `consolePiping` sends browser logs to the terminal and server logs to the browser console
- `injectSource` powers go-to-source; `editor.open` is the escape hatch for unsupported editors
- `eventBusConfig.enabled: false` when running under Storybook or Vitest

### 6. Build A Custom Plugin When The Product Needs One

> Goal: product state gets a panel beside the library inspectors

1. Declare an event map keyed by suffix — the client prepends `pluginId`
2. Extend `EventClient` from `@tanstack/devtools-event-client` with `{ pluginId }`
3. `emit()` from state mutations or middleware; `on()` inside the panel returns a cleanup function
4. Register `{ name, render: <Panel /> }` in the same `plugins` array

### 7. Verify

> Goal: devtools work in dev and do not reach the built output

1. `/run-dev` — the trigger opens, every registered tab renders its state
2. `/run-build`, then grep `dist/` for `@tanstack/react-devtools` — no match
3. `devtools({ logging: false })` only after the setup works; logging is how missing plugins are diagnosed
4. On failure → revert the part just changed, then `/resolve-errors`

### Use Cases

| Scenario | Use case |
|----------|----------|
| Mount Query and Router panels in the workbench | `usecases/query-and-router-devtools.md` |
| Prove devtools never reach the production bundle | `usecases/keep-devtools-out-of-production.md` |
| Mount the adapter and shell in a new app | `usecases/quick-start-framework-adapter.md` |
| Configure source inspection, console piping, and the event bus | `usecases/vite-plugin-features.md` |
| Build a product panel with a typed event client | `usecases/custom-plugin-with-event-client.md` |

## Rules

- Install the adapter, panels, and Vite plugin into `devDependencies`
- Mount `TanStackDevtools` once, at the application root — a second shell duplicates every tab
- Use the `*Panel` exports inside `plugins`, not the standalone floating components
- Put `devtools()` first in the Vite plugin array
- Keep `removeDevtoolsOnBuild` at its default unless production deliberately needs the shell
- Never render a second provider or store for the devtools — inspect the instance the app uses
- Devtools is alpha: re-read the docs before depending on an option name
- See best-practices/ for the pattern and pitfall checklist

## Expected Outcome

- One workbench with a tab per installed library and product plugin
- Source inspection and console piping working through the Vite plugin
- A production build with no devtools code
