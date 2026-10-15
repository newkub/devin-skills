# Elysia — Best Practices

Bun-native web framework — type-safe routes, plugins and lifecycle discipline

## Recommended Patterns

- `new Elysia()` + chained `.get`/`.post`/`.group` — group routes with a prefix instead of a long flat list
- TypeBox schemas (`t.Object`, `t.String`) on `body`/`query`/`params` — validation + type inference + OpenAPI for free
- Plugins: `app.use(plugin)` for reusable modules — a plugin = an exported `new Elysia().derive(...)`
- `derive`/`decorate` for request-scoped values (`derive` = computed per request) vs app-level (`decorate`)
- Lifecycle hooks: `onRequest` → `derive` → `beforeHandle` → handler → `afterHandle`/`onError` — know the order to place logic at the right point

## Common Pitfalls

- Swapping `derive` vs `decorate`: decorate = shared global object (beware mutation), derive = per-request
- `onError` doesn't catch errors thrown early in `onRequest` — put auth/validation in `beforeHandle`/`derive`
- The type-inference chain breaks if you don't chain in one file — Elysia infers through method chaining; export `app` as an `App` type for the Eden client
- Manual `Bun.serve` over an Elysia app — use Elysia's `.listen()` or `app.fetch` per the adapter

## Perf Notes

- Elysia is fast on Bun — keep handlers sync/async minimal; heavy CPU → offload to a worker
- `staticPlugin`/file serving — use the built-in instead of a handler that reads files itself
- Schema validation has cost — validate at the boundary, not again in every middleware

## Do / Don't

| Do | Don't |
|----|-------|
| `t.*` schemas on every input | validate manually inside handlers |
| plugins for reuse | copy-paste routes across modules |
| `derive` per-request state | mutate `decorate` objects per request |
| Eden treaty for client types | re-declare API types on the client side |
