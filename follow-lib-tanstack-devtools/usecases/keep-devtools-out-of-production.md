# Use Case — Keep Devtools Out of the Production Bundle

> Rely on the Vite plugin's stripping, then prove it by searching the built output. Source: https://tanstack.com/devtools/latest/docs/production (accessed 2026-10-20)

## 1. Know what stripping removes

With `removeDevtoolsOnBuild: true` (the default), the Vite plugin replaces imports of these packages with empty modules:

- `@tanstack/react-devtools`
- `@tanstack/solid-devtools`
- `@tanstack/vue-devtools`
- `@tanstack/preact-devtools`
- `@tanstack/devtools`

The matching JSX or component usage disappears with the import. You do not need a second environment guard when the plugin is active.

## 2. Keep the default

```ts
import { devtools } from '@tanstack/devtools-vite'

export default {
  plugins: [devtools()],
}
```

Passing `removeDevtoolsOnBuild: false` is a deliberate production decision, not a debugging shortcut — it ships the shell and every registered plugin.

## 3. Build and search the output

```bash
npm run build
grep -r "@tanstack/react-devtools" dist/
grep -r "ReactQueryDevtoolsPanel" dist/
```

Both searches must come back empty. Searching for the package id is more reliable than reading a bundle report, because the plugin chunk is separate from the entry chunk.

## 4. Handle a non-Vite build manually

```tsx
// devtools-setup.tsx
import { TanStackDevtools } from '@tanstack/react-devtools'

export default function Devtools() {
  return <TanStackDevtools plugins={[]} />
}
```

```tsx
// App.tsx
const Devtools =
  process.env.NODE_ENV === 'development'
    ? await import('./devtools-setup')
    : () => null
```

The guard sits around the dynamic `import()` itself, and the bundler must statically replace `process.env.NODE_ENV`. A guard the bundler cannot fold still ships the module.

## 5. Know the event client's own behavior

The root import of `@tanstack/devtools-event-client` no-ops outside development: when `NODE_ENV` is anything but `development`, the real client is replaced and tree-shaken. This happens independently of the Vite plugin.

```ts
// stripped outside development
import { EventClient } from '@tanstack/devtools-event-client'

// never stripped — for libraries that deliberately emit in production
import { EventClient } from '@tanstack/devtools-event-client/production'
```

Use the `/production` subpath only when a published library must emit events in a consumer's production app. An unset `NODE_ENV` counts as non-development, so the root import no-ops there too.

## 6. Decide before shipping devtools on purpose

If production really needs the workbench:

1. Install the adapter as a regular dependency, not a dev dependency
2. Set `removeDevtoolsOnBuild: false`
3. Accept that every plugin's code ships to users

For anything else, keep devtools development-only.

## 7. Verify

1. `/run-dev` — the workbench still opens and shows its panels
2. `/run-build` then serve the output — the trigger is gone and the app renders normally
3. Grep the build for adapter and panel names — no matches
4. `/deep-review` when a bundle needs formal confirmation

## Pitfalls

- Setting `removeDevtoolsOnBuild: false` to debug a production-only issue and forgetting to revert it.
- Guarding with `import.meta.env.MODE === 'development'` in a build that sets a custom mode, so devtools vanish in dev too.
- Checking only the entry chunk; the devtools code lives in its own chunk.
- Expecting the event client to be active in production from the root import.
- Importing `@tanstack/devtools-event-client/production` for an app that should not emit anything.
- Leaving a `console.log` of devtools internals, which keeps a reference alive after tree-shaking.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/vite-plugin-features.md`
- `usecases/custom-plugin-with-event-client.md`
