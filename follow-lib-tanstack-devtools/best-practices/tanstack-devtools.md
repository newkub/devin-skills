# TanStack Devtools — Best Practices

Unified workbench for library panels and product inspectors — one shell, typed events, stripped from production

## Recommended Patterns

- Install the framework adapter, library panels, and `@tanstack/devtools-vite` into `devDependencies`
- Mount `TanStackDevtools` once at the application root, beside `App`
- Register library inspectors as plugins with `{ name, render: <Panel /> }`; Vue, Svelte, and Angular use `component`
- Use the `*Panel` exports, not the standalone floating components
- Put `devtools()` first in the Vite plugin array so source injection and stripping run before other transforms
- Leave `removeDevtoolsOnBuild` at its default and verify the build rather than trusting it
- Give every custom plugin a stable `id` so its tab identity survives a rename
- Keep the EventClient in the library that owns the state; the panel only renders what it receives
- Disable the event bus (`eventBusConfig.enabled: false`) under Storybook or Vitest

## Common Pitfalls

- Mounting a second `TanStackDevtools` shell, which duplicates every tab and the trigger
- Rendering a panel outside the provider that owns the state, so it shows an empty view
- Using `ReactQueryDevtools` instead of `ReactQueryDevtoolsPanel`, which mounts a second floating panel
- Importing the adapter in a shared component so each route bundles a copy
- Declaring event names with the `pluginId` prefix; the client already prepends it
- Expecting `emit()` to buffer forever — it drops events after the connection retries fail
- Reading `@tanstack/devtools-event-client` from the root import and expecting production events; it no-ops outside development
- A devtools major that does not match the inspected library's major, breaking the bridge

## Perf Notes

- The panel costs render time while open — close it before profiling real interactions
- Stripping removes the shell and plugin code from production, so bundle size is a dev-only concern
- Source injection adds attributes during development only; ignore large generated files to keep the transform fast
- Console piping with all levels enabled can flood the terminal — narrow `consolePiping.levels` in noisy apps

## Do / Don't

| Do | Don't |
|----|-------|
| one shell at the root | a second devtools mount |
| `*Panel` inside `plugins` | the standalone floating component |
| `devtools()` first | the plugin last in the array |
| `devDependencies` | adapter as a runtime dependency |
| stable plugin `id` | identity derived from a renameable label |
| grep the build | assume stripping worked |
