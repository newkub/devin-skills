# Use Case — Social Login and Protected Routes

> Add GitHub/Google sign-in, keep the redirect target, and prevent authenticated markup from flashing for guests. Source: https://www.better-auth.com/docs/authentication/github (accessed 2026-10-20)

## 1. Provider config

```ts
// src/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["read:user", "user:email"],
    },
  },
  trustedOrigins: ["https://app.example.com", "http://localhost:5173"],
})
```

Redirect URI to register: `<baseURL>/api/auth/callback/github`.

## 2. Sign in from the client

```ts
import { createAuthClient } from "better-auth/client"

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL,       // must equal the server baseURL origin
})

await authClient.signIn.social({
  provider: "github",
  callbackURL: location.pathname + location.search,   // where to land after the round trip
})
```

## 3. Gate a route on the session

```ts
// src/routes/_authed.tsx (TanStack Router)
export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) throw redirect({ to: "/login", search: { redirect: location.href } })
    return { user: session.user }
  },
})
```

The check runs before the route renders — no authenticated shell painted for a guest, and the loader cannot leak data.

## 4. Hook for UI state

```tsx
const { data: session, isPending } = authClient.useSession()
if (isPending) return <Skeleton />
return session ? <UserMenu user={session.user} /> : <SignInButton />
```

## Pitfalls

- `callbackURL` pointing outside `trustedOrigins` → the redirect is rejected; add the origin.
- Checking the session only in the component → the route's data loader already ran; guard in `beforeLoad`/middleware.
- Different `baseURL` on client and server → the OAuth callback sets a cookie for the wrong host and login "succeeds" without a session.
- Treating `isPending` as "signed out" → a flash of the sign-in button on every load; render a skeleton while pending.

## Related

- `references/apis.md`
- `best-practices/better-auth.md`
- `usecases/email-password-and-session.md`
