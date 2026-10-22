| key | value |
|---|---|
| docs | https://tanstack.com/devtools/latest/docs |
| status | alpha — API subject to change |
| framework adapters | `@tanstack/react-devtools`, `@tanstack/vue-devtools`, `@tanstack/solid-devtools`, `@tanstack/preact-devtools`, `@tanstack/svelte-devtools`, `@tanstack/angular-devtools` |
| core shell | `@tanstack/devtools` |
| event system | `@tanstack/devtools-event-client`, `@tanstack/devtools-event-bus` |
| build tool | `@tanstack/devtools-vite` |
| utilities | `@tanstack/devtools-utils`, `@tanstack/devtools-ui` |
| repo | https://github.com/TanStack/devtools |

| Area | Entry point |
|------|-------------|
| Mount the workbench | `TanStackDevtools` from the framework adapter |
| Register a panel | `plugins={[{ name, render }]}` — `component` for Vue, Svelte, Angular |
| Panel options | `id`, `defaultOpen` |
| Library panels | `ReactQueryDevtoolsPanel`, `SolidQueryDevtoolsPanel`, `VueQueryDevtoolsPanel`, `TanStackRouterDevtoolsPanel` |
| Custom plugin events | `class X extends EventClient<EventMap>` with `{ pluginId }`; `emit(suffix, payload)`, `on(suffix, cb)` |
| Vite plugin | `devtools({ eventBusConfig, editor, enhancedLogs, removeDevtoolsOnBuild, logging, injectSource, consolePiping })` |
| Production event client | `@tanstack/devtools-event-client/production` |

Default Vite plugin options: `removeDevtoolsOnBuild: true`, `enhancedLogs` on, `injectSource` on, `consolePiping` on, `logging` on.
