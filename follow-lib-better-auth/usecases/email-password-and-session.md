# Use Case — Email/Password Auth with Server-Side Sessions

> Own the session on the server, mount the handler at `/api/auth/*`, and read the session in an API guard. Source: https://www.better-auth.com/docs/authentication/email-password (accessed 2026-10-20)

## 1. Server config

```ts
// src/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    requireEmailVerification: true,
  },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
})
```

## 2. Mount the handler

```ts
// src/index.ts
import { Elysia } from "elysia"
import { auth } from "./auth"

new Elysia()
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .listen(3000)
```

Everything (sign-in, sign-up, verify, callback, session) lives under that one path — do not re-implement individual endpoints.

## 3. Read the session in a guard

```ts
export async function requireSession(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw new Response("Unauthorized", { status: 401 })
  return session.user          // { id, email, emailVerified, ... }
}
```

`sessions` are stored in your DB, so a revoked session stops working on the next request — unlike a bare JWT.

## 4. Client

```ts
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient()

await authClient.signUp.email({ email, password, name })
await authClient.signIn.email({ email, password })
const { data: session } = authClient.useSession()
await authClient.signOut()
```

## Pitfalls

- Running the migration for better-auth tables nowhere → sign-in fails with "relation session does not exist"; generate and apply the schema first.
- Enabling `requireEmailVerification` without a mailer → users can never sign in.
- Verifying the session by decoding a cookie client-side → the truth is the DB row; call `getSession` server-side.
- Setting `baseURL`/trusted origins wrong → OAuth callbacks and cookies fail only in production.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/better-auth.md`
- `usecases/social-login-and-route-protection.md`
