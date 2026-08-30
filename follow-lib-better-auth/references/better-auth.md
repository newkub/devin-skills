# Better Auth Reference

## Version Info

- Package: `better-auth` v1.6.9 (published ~4 months ago)
- CLI Package: `auth` (Better Auth CLI)
- License: MIT
- Peer Dependencies: None (database adapter installed separately)
- Supported Frameworks: Next.js, Nuxt, SvelteKit, SolidStart, Hono, Elysia, TanStack Start, Express, Cloudflare Workers, Expo
- Source: https://better-auth.com/docs/installation

## Install

```bash
# npm
bun add better-auth

# Bun
bun add better-auth

# For separate client/server setup, install in both parts
```

## Environment Variables

```env
# .env — secret key (min 32 chars, high entropy)
BETTER_AUTH_SECRET=

# Generate with: openssl rand -base64 32

# Base URL of your app
BETTER_AUTH_URL=http://localhost:3000
```

## Server Configuration (`auth.ts`)

```ts
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
})
```

## Database Configuration

### SQLite (built-in Kysely adapter)

```ts
import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'

export const auth = betterAuth({
  database: new Database('./sqlite.db'),
})
```

### PostgreSQL / MySQL (connection string)

```ts
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  database: process.env.DATABASE_URL!,
})
```

### Drizzle adapter

```ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or 'mysql', 'sqlite'
  }),
})
```

## CLI Commands

```bash
# Generate ORM schema or SQL migration file
npx auth@latest generate

# Create required tables directly (Kysely adapter only)
npx auth@latest migrate

# Generate a new secret
npx auth@latest secret
```

## Mount Handler (API Route)

### Next.js App Router

```ts
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
```

### Elysia

```ts
import { Elysia } from 'elysia'
import { auth } from './auth'
import { toElysiaHandler } from 'better-auth/elysia'

const app = new Elysia()
  .mount('/api/auth', toElysiaHandler(auth))
  .listen(3000)
```

## Client Configuration

### React

```ts
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
})

// Export specific methods
export const { signIn, signUp, useSession } = authClient
```

### Vue / Svelte / Solid / Vanilla

```ts
import { createAuthClient } from 'better-auth/vue'     // or /svelte, /solid, /client
```

## Authentication Methods

### Sign Up

```ts
const { data, error } = await authClient.signUp.email({
  email,
  password,    // min 8 characters by default
  name,
  image,       // optional
  callbackURL: '/dashboard',
})
```

### Sign In

```ts
const { data, error } = await authClient.signIn.email({
  email,
  password,
  callbackURL: '/dashboard',
  rememberMe: false,  // default: true
})
```

### Social Sign-On

```ts
await authClient.signIn.social({
  provider: 'github',
  callbackURL: '/dashboard',
  errorCallbackURL: '/error',
  newUserCallbackURL: '/welcome',
})
```

### Sign Out

```ts
await authClient.signOut()
```

## Session Management

### Client side — `useSession` hook

```ts
import { authClient } from '@/lib/auth-client'

const { data: session, isPending, error, refetch } = authClient.useSession()
```

### Server side — `auth.api.getSession`

```ts
import { auth } from './auth'
import { headers } from 'next/headers'

const session = await auth.api.getSession({
  headers: await headers(),
})
```

## Plugins

### Server-side — add plugin

```ts
import { betterAuth } from 'better-auth'
import { twoFactor } from 'better-auth/plugins'

export const auth = betterAuth({
  plugins: [
    twoFactor(),
  ],
})
```

### Client-side — add plugin

```ts
import { createAuthClient } from 'better-auth/client'
import { twoFactorClient } from 'better-auth/client/plugins'

const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      twoFactorPage: '/two-factor',
    }),
  ],
})
```

## Sources

- Installation: https://better-auth.com/docs/installation
- Basic Usage: https://better-auth.com/docs/basic-usage
- CLI: https://better-auth.com/docs/concepts/cli
- Database: https://better-auth.com/docs/concepts/database
