# Use Case — Dev Proxy and Typed Env

> Call a backend on another port during development and expose only the env vars you deliberately publish. Source: https://vite.dev/config/server-options (accessed 2026-10-20)

## 1. Proxy the API

```ts
// vite.config.ts
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_")
  return {
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_ORIGIN ?? "http://localhost:3000",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
  }
})
```

The app calls relative `/api/...` in every environment — no CORS setup and no hardcoded origin in code.

## 2. Env rules

- Client code sees `import.meta.env.VITE_*` plus the built-ins `MODE`, `DEV`, `PROD`, `BASE_URL`.
- `loadEnv(mode, cwd, "VITE_")` reads `.env`, `.env.local`, `.env.[mode]`; the third argument filters by prefix.
- A secret prefixed with `VITE_` is inlined into the bundle — never do it.

## 3. Typed access

```ts
// src/env.ts
const apiOrigin = import.meta.env.VITE_API_ORIGIN
if (!apiOrigin && import.meta.env.PROD) throw new Error("VITE_API_ORIGIN is required")
export const env = { apiOrigin: apiOrigin ?? "" } as const
```

## Pitfalls

- `process.env.X` in client code → `undefined`; Vite does not polyfill `process`.
- `changeOrigin: true` with cookie auth but no `cookieDomainRewrite` → the cookie is dropped.
- Reading `import.meta.env` inside `vite.config.ts` → only `loadEnv` works there.
- Committing `.env.local` → gitignore it and commit `.env.example` instead.

## Related

- `references/apis.md`
- `usecases/build-and-preview.md`
