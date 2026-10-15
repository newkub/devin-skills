# Vite DevTools — Best Practices

The Vite ecosystem devtools framework — one dock, type-safe RPC, shared state, plugin `devtools.setup`

## Recommended Patterns

- Enable deliberately — pick `apply` per real need (`'serve'` only during dev if you do not want devtools in the build); never leave `devtools: true` as a play-around leftover
- Use the dock launcher as the on-demand integration install path — integrations already in the project mount automatically, no manual dependency adds
- Build your tool's UI inside `Plugin.devtools.setup` only — dock/palette/terminal/renderer all live on this ctx
- If you already have a Devframe definition → one `createPluginFromDevframe` is enough; do not write a duplicate plugin on top
- Set `embeddedVisibility: 'passive'` for teams annoyed by a permanent dock — `Shift + Alt + D` opens it and the state is remembered
- Read the error codes from the docs (Kit DTK00xx, Rolldown RDDT00xx) before debugging blind

## Common Pitfalls

- `devtools: true` enables both `vite dev` and `vite build` — the shorthand silently ships devtools into built output
- `build.injection: true` without `build.withApp: true` → no effect (injection always requires with-app)
- Forgetting that deployed assets must live under the Vite `base` → the dock works locally but 404s on staging
- Projects where Vite does not serve HTML (JS-only entry, middleware mode, backend integration): setting `embeddedVisibility` has no effect — you must use the client injector from the browser entry
- Importing injector entries for multiple modes at once (`inject` + `inject-passive`) → duplicate docks/conflicting behaviour; pick one entry
- Hardcoding `/__devtools/` in app code — this path must be composed from `base`
- Depending on `@vitejs/devtools-vite`, which upstream still marks "work in progress", as a critical part of a workflow

## Perf / DX Notes

- Keep devtools on `serve` only in projects where build time matters — no need to pay build-analysis cost on every CI build
- Use Rolldown DevTools (module graph, chunk treemap, plugin hook cost, session compare) as the measurement layer before `/optimize bundle`, not after
- The Vitest dock runs `vitest --ui` as an iframe — on CI without a browser, keep it local-only
- If the project already has its own devtools hub (e.g. the `wrikka-vite-devtools` plugin, `/use-wrikka-vite-devtools`), consolidate into one dock via `createPluginFromDevframe` instead of running two systems in parallel

## Do / Don't

| Do | Don't |
|----|-------|
| Choose `apply` to match the intended commands | Leave the shorthand in and get build surprises |
| `build.withApp: true` before `build.injection: true` | Set injection on its own |
| One client injector entry per visibility mode | Import several entries at once |
| Keep dock `id` stable because users bookmark it | Change ids every release |
| Reuse a Devframe definition through the Kit adapter | Write a new integration per host |
| Compose paths from the Vite `base` | Hardcode `/__devtools/` |
