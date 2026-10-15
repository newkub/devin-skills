# Best Practices: oRPC Server Design

Guidelines for designing procedures, middleware, context, and routers on the server side to be type-safe and maintainable

## Recommended Patterns

- Create the base builder `os` once per app, then derive procedure builders per concern, e.g. `pub` (public), `authed` (passed the auth middleware)
- Use `.$context<T>()` to declare the initial context at the base — makes the type dependency clear from the start of the chain
- Validate every input with `.input(zodSchema)` — never trust client data even when the types match
- Use `.output(zodSchema)` when you want a clear contract + a correct OpenAPI spec
- Group procedures into nested routers by domain (`router.user.list`, `router.order.create`) instead of a long flat list
- Use named-function middleware (`.use(authMiddleware)`) for reused logic; inline middleware only for one-off cases
- Use `next({ context: {...} })` to inject only the values the handler actually needs — context is a typed contract
- Guard with `throw new ORPCError('UNAUTHORIZED')` in middleware before reaching the handler

## Do / Don't

| Do | Don't |
|---|---|
| Export `type Router` for client inference | export the router instance for the client to import directly |
| Use `.errors()` for specific domain errors | define error schemas for common codes on every procedure |
| Pick the handler per runtime (`/fetch`, `/node`) | import the wrong-runtime handler then debug type errors |
| Check `matched` before sending the response | assume the handler matches every request |
| Dedup resource init in middleware (check context first) | create a new db connection on every procedure call |
| Separate initial context (env, headers) from execution context (auth, db) | put everything into the initial context |

## Common Pitfalls

- Forgetting `.$context` before `.use()` — middleware needing the new context gets a type error or `unknown`
- Putting sensitive data (secrets, internal errors) in the `ORPCError` message/data — it gets serialized and sent to the client
- Wrong middleware order — auth must come before procedures using `context.user`; arrange `.use()` correctly
- Rebuilding the router object inside the request handler — the router should be created once at boot
- Using `.errors()` for every common case — `UNAUTHORIZED`, `NOT_FOUND` are common codes and need no defined schema

## Performance Notes

- Middleware runs on every request — heavy work (db connect, token verify) should be cached/deduped or lazy-init
- Zod validation has a cost — very large schemas in hot paths should be measured; `z.lazy`/precompiled schemas help
- A large context object is cloned through `next({context})` — store only references (db client), not data payloads
- Use `interceptors` for centralized logging/error reporting instead of try/catch in every handler

## Ecosystem / Integration

- Zod schemas → `/follow-lib-zod`
- Contract-first: `@orpc/contract` define contract → implement router → `ContractRouterClient`
- The OpenAPI spec from `OpenAPIGenerator` is used with `/run-api-docs` and `/deep-test api`
- TanStack Start integration via `server.handlers` in the route definition
