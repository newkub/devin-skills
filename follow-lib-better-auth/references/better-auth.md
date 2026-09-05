# Better Auth Reference

## Version Info

- Package: `better-auth` v1.7.2 (published Aug 26, 2026)
- CLI Package: `auth` (Better Auth CLI)
- License: MIT
- Peer Dependencies: None (database adapter installed separately)
- Supported Frameworks: Next.js, Nuxt, SvelteKit, SolidStart, Hono, Elysia, TanStack Start, Express, Cloudflare Workers, Expo
- Source: https://better-auth.com/docs/installation

## Install

```bash
npm install better-auth
# or
pnpm add better-auth
yarn add better-auth
bun add better-auth
```

สำหรับ separate client/server setup ให้ติดตั้งทั้งสองฝั่ง

## Environment Variables

```env
# .env — secret key (min 32 chars, high entropy)
BETTER_AUTH_SECRET=

# Generate with: openssl rand -base64 32

# Base URL of your app
BETTER_AUTH_URL=http://localhost:3000
```

สามารถหมุน secret โดยไม่ทำให้ session เก่าใช้ไม่ได้ด้วย `BETTER_AUTH_SECRETS`

## Server Configuration (`auth.ts`)

```ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})
```

## Database Configuration

### SQLite (built-in Kysely adapter)

```ts
import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
})
```

### PostgreSQL / MySQL connection string

```ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  database: process.env.DATABASE_URL!,
})
```

### Drizzle adapter

```ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { db } from "@/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "sqlite", "mysql"
  }),
})
```

### Prisma adapter

```ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
})
```

## CLI Commands

```bash
# Initialize Better Auth in a Next.js project
npx auth@latest init

# Generate schema or SQL migration
npx auth@latest generate
npx auth@latest generate --adapter prisma
npx auth@latest generate --adapter drizzle

# Apply migrations (built-in Kysely adapter only)
npx auth@latest migrate

# Upgrade Better Auth packages
npx auth@latest upgrade

# Generate a secret
npx auth@latest secret
```

## Mount Handler

### Next.js App Router

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)
```

### Elysia

```ts
import { Elysia } from "elysia"
import { auth } from "./auth"
import { toElysiaHandler } from "better-auth/elysia"

const app = new Elysia()
  .mount("/api/auth", toElysiaHandler(auth))
  .listen(3000)
```

## Client Configuration

### React

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
})

export const { signIn, signUp, useSession, signOut } = authClient
```

### Vue / Svelte / Solid / Vanilla

```ts
import { createAuthClient } from "better-auth/vue"     // or /svelte, /solid, /client
```

## Authentication Methods

```ts
// Email/password
await authClient.signUp.email({
  name: "John Doe",
  email: "john@example.com",
  password: "password1234", // 8-128 chars by default
  callbackURL: "/dashboard",
})

await authClient.signIn.email({
  email: "john@example.com",
  password: "password1234",
  rememberMe: true,
  callbackURL: "/dashboard",
})

await authClient.signOut()

// Social
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/dashboard",
})
```

## Session Management

### Client side — `useSession`

```ts
const { data: session, isPending, error, refetch } = authClient.useSession()
```

### Server side — `auth.api.getSession`

```ts
import { auth } from "./auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({
  headers: await headers(),
})
```

## Plugins

### Server-side

```ts
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [twoFactor()],
})
```

### Client-side

```ts
import { createAuthClient } from "better-auth/client"
import { twoFactorClient } from "better-auth/client/plugins"

const authClient = createAuthClient({
  plugins: [twoFactorClient()],
})
```

## v1.7 Notes

- เป็น major release สำหรับ OAuth, OpenID Connect, MCP, SCIM, device authorization
- อัปเกรด `better-auth` และ `@better-auth/*` พร้อมกัน
- อ่าน migration guide ก่อนใช้งาน v1.7
- Sources ดูใน [website.md](website.md)
