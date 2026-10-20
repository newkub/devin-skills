# TanStack Devtools — Best Practices

Inspection panel for Query/Router/DB state — dev-only, zero production cost

## Recommended Patterns

- Install devtools into `devDependencies`; they are never runtime dependencies
- Render devtools inside the provider they inspect (`QueryClientProvider`, `RouterProvider`) or they see no state
- Guard with a dev flag and load lazily so the production bundle excludes the code entirely
- Use the unified panel plus one plugin per library when several TanStack libs are present
- Merge into existing provider composition — never overwrite the app entry config
- Verify a production build afterwards and confirm no devtools chunks remain
- Read the current package names from the docs; adapters are split per framework

## Common Pitfalls

- Rendering devtools outside its provider shows an empty panel
- A plain import (instead of a dev-gated lazy import) ships devtools to production
- Combining a devtools version with a different major of the library it inspects breaks the bridge
- Adding a second provider to host devtools duplicates clients and state
- Leaving devtools open by default hides the UI under the panel during development
- Committing devtools into a shared production entry point used by SSR

## Perf Notes

- The panel adds overhead while open — close it when profiling real interactions
- Lazy loading keeps startup fast and the dev overlay out of the initial chunk
- For query-heavy apps, inspect cache size and gcTime rather than leaving devtools mounted forever

## Do / Don't

| Do | Don't |
|----|-------|
| `devDependencies` | devtools as a runtime dependency |
| dev-gated lazy import | static import in the app entry |
| render inside the provider | mount outside the provider |
| merge existing config | rewrite the entry point |
| verify the production bundle | assume tree-shaking removed it |
