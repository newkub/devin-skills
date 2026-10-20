# TanStack Start — Best Practices

Full-stack SSR — server functions, API routes, middleware, streaming, deploy

## Recommended Patterns

- Treat every `createServerFn` as a public endpoint: declare `method`, and validate input with `inputValidator` (Standard Schema works) so types flow to the client call site
- Keep server-only modules (db clients, secrets, fs) reachable only from handlers or a `serverOnly` boundary — never from a module that a route imports into the client graph
- Loaders must be isomorphic since they run during SSR and on client navigation; move server-only work into a server function
- Use server functions for app-internal RPC, and `createFileRoute(...)({ server: { handlers } })` API routes for external contracts (webhooks, third-party clients)
- Put auth, logging and rate limiting in `createMiddleware()` and chain it onto the server functions that need it
- Stream: render the shell first and defer slow data instead of awaiting everything in the loader
- The root route owns the document — `Meta`, `Scripts`, hydration shell and `<Outlet/>`
- Verify with a real production build and the built output before choosing a deploy adapter

## Common Pitfalls

- Importing a db client or env secret from a component-reachable module leaks it into the client bundle
- Skipping `inputValidator` lets an unvalidated payload reach the database
- Touching `window`/`document`/`localStorage` in a loader or render path breaks SSR
- Hydration mismatch from `Date.now()`, `Math.random()` or locale formatting during render
- Wrong Vite plugin order or a missing Start plugin yields a build that never SSRs
- Prerendering dynamic routes without enumerating params produces missing pages
- Assuming the dev server equals production — adapters change routing, headers and asset serving

## Perf Notes

- Deferred/streamed data keeps TTFB low; block only what the first paint truly needs
- Prerender static routes and cache them at the edge when the adapter supports it
- Serialize only fields the client renders in server function responses

## Do / Don't

| Do | Don't |
|----|-------|
| `inputValidator` on every input-taking server fn | trusting client payloads |
| server functions as the server/client boundary | importing server modules into shared code |
| API routes for external consumers | exposing RPC internals as a public contract |
| middleware for auth/logging/limits | repeating guards per handler |
| build + run the real output | shipping after a dev-server check only |
