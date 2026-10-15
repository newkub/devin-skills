# Better Auth — Best Practices

Recommended patterns, security and pitfalls for Better Auth

## Recommended Patterns

- Use the plugin architecture — enable only the plugins you actually use (`twoFactor`, `organization`, `admin`) — every plugin adds surface area
- Pick the database adapter according to the ORM you already have (drizzle/prisma/kysely) — don't use 2 ORMs in one project
- Session: `useSession` (client) / `auth.api.getSession({ headers })` (server) — server-side check on every protected route, don't trust client state
- Use `auth.handler` mounted at a single route (`/api/auth/*`) — don't wrap the handler yourself unless necessary
- Hooks (`before`/`after`) for side effects: audit log, user provisioning — don't put business logic in the component

## Common Pitfalls

- `BETTER_AUTH_SECRET` must be strong + come from env only — never commit/hardcode; changing the secret = invalidating every session
- `trustedOrigins` must be specified explicitly — wildcards open CSRF; production ≠ the same localhost list
- Social providers: the callback URL must match the provider console exactly (protocol+host+path) — mismatch = silent redirect fail
- Rate limiting: enable the built-in rate limiter on sign-in/sign-up endpoints — auth endpoints are always the first brute-force target

## Security Notes

- CSRF: Better Auth uses cookie-based auth → `trustedOrigins` must be correct + SameSite cookies (default lax already)
- Store sessions in the DB adapter — stateless JWT mode suits edge but is hard to revoke; choose per revocation needs
- Admin/plugin endpoints: guard with the plugin's role checks, not just route hiding

## Do / Don't

| Do | Don't |
|----|-------|
| Only the plugins you need | enable every plugin "just in case" |
| server-side session check on every route | trust client `useSession` alone |
| rate-limit auth endpoints | leave sign-in unlimited |
| env secret + explicit trustedOrigins | wildcard origins / hardcoded secret |
