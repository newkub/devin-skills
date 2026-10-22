# Use Case — Mount the Adapter and Shell in a New App

> Get one devtools workbench rendering in a React, Solid, Vue, Svelte, or Angular app. Source: https://tanstack.com/devtools/latest/docs/quick-start (accessed 2026-10-20)

## 1. Install the adapter and the Vite plugin

```bash
npm install -D @tanstack/react-devtools @tanstack/devtools-vite
```

Pick the adapter that matches the app — `@tanstack/solid-devtools`, `@tanstack/vue-devtools`, `@tanstack/preact-devtools`, `@tanstack/svelte-devtools`, or `@tanstack/angular-devtools`. Everything here is a dev dependency.

## 2. Mount the shell at the root

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <TanStackDevtools />
  </StrictMode>,
)
```

Solid uses the same component inside `render(() => ...)`. Vue mounts `<TanStackDevtools />` in the root template, Svelte in the root layout, and Angular imports `TanStackDevtoolsComponent` as a standalone component.

## 3. Put the Vite plugin first

```ts
// vite.config.ts
import { devtools } from '@tanstack/devtools-vite'

export default {
  plugins: [devtools(), /* rest of your plugins */],
}
```

The plugin is optional for Vue but recommended — it adds source inspection, console piping, and production stripping to every framework.

## 4. Confirm the shell owns the chrome

The workbench renders its own trigger button, tabs, settings panel, persistence, and hotkeys. Do not add a second trigger or wrap it in app UI that can unmount:

1. The shell sits beside `App`, not inside a route component
2. Only one `TanStackDevtools` instance exists in the tree
3. The trigger is reachable on every route

## 5. Verify

1. `/run-dev` — the trigger appears and opens an empty workbench with a Settings tab
2. Navigating between routes keeps the shell mounted and its open state intact
3. `/run-build` — the build succeeds and the grep in `usecases/keep-devtools-out-of-production.md` finds nothing
4. `/run-typecheck` — the adapter's types do not leak into app code

## Pitfalls

- Mounting the shell inside a layout that unmounts on navigation, so the panel closes on every route change.
- Installing the adapter as a runtime dependency, which ships it when stripping is disabled.
- Using the React adapter in a Solid app — the package names differ per framework.
- Adding a custom trigger before checking that the shell already renders one.
- Forgetting `devtools()` and then wondering why go-to-source and console piping do nothing.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/query-and-router-devtools.md`
- `usecases/vite-plugin-features.md`
