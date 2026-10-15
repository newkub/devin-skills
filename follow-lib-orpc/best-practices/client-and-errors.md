# Best Practices: oRPC Client, Errors and Query Integration

Guidelines for building a type-safe client, handling errors with `safe()`/`isDefinedError`, and integrating TanStack Query

## Recommended Patterns

- Create the client with `createORPCClient(link)` + `RouterClient<typeof router>` — full auto-completion across the router
- Use a `headers: () => ({...})` function for mutable auth tokens — never snapshot the token at client creation
- Handle errors with `safe()` returning the tuple `[error, data]` — easier to read than try/catch and type-safe
- Use `isDefinedError(error)` to narrow errors from `.errors()` defined on the procedure
- If nearly every call uses `safe()`, let `createSafeClient` wrap it automatically
- TanStack Query via `createTanstackQueryUtils` — `orpc.<path>.queryOptions()`/`mutationOptions()` give type-safe key + fn
- When SSR/CSR environments differ, use `createIsomorphicFn` to split the link config

## Do / Don't

| Do | Don't |
|---|---|
| Use `safe()`/`isDefinedError` for expected errors | catch `unknown` and guess the shape yourself |
| Set `interceptors: [onError(...)]` for centralized logging | toast/log the same error at every call site |
| Use `queryOptions`/`mutationOptions` with TanStack Query | hand-write `queryKey` strings |
| Send the auth token through the `headers` function | hardcode the token in the client config |
| Handle network errors separately from typed errors | assume every error is an `ORPCError` |

## Common Pitfalls

- `safe()` returns a tuple — destructuring `[error, data]` in the wrong order or forgetting to check the error creates silent bugs
- `isDefinedError` only checks errors defined in `.errors()` — common errors (`UNAUTHORIZED`) must be handled separately via `error.code`
- The `RouterClient` type not matching the real router — client drift when the server changes; always import the type from a shared package
- Query key mismatch — building keys by hand instead of using `queryOptions` causes cache invalidation misses
- Error `message`/`data` may be shown to users — the server must not leak sensitive info in the first place

## Performance Notes

- The client is light — little bundle impact, but `RouterClient` type inference over a large router slows TS; split the router into sub-types if it gets slow
- TanStack Query caching reduces duplicate calls — set `staleTime` appropriately for data volatility
- Batch when many queries fire together — oRPC supports batching via link config
- WebSocket/event iterators for realtime — use `@orpc/client` event iterators instead of polling loops

## Ecosystem / Integration

- TanStack Query utils → `@orpc/tanstack-query`
- OpenAPI contract testing → `/deep-test api`, `/follow-tool-bruno`
- Error codes map to HTTP status — the OpenAPI handler maps them automatically
