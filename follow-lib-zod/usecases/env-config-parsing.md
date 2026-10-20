# Use Case — Fail-Fast Environment Config

> Validate the environment once at boot, coerce strings to real types, and fail with a readable list instead of `undefined` in production. Source: https://zod.dev/api (accessed 2026-10-20)

## 1. Declare the env contract

```ts
import * as z from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  FEATURE_CHECKOUT: z.stringbool().default(false),   // "true"/"1"/"0" -> boolean
})

export const env = envSchema.parse(process.env)   // throws at boot, not at first use
export type Env = z.infer<typeof envSchema>
```

`z.coerce.number()` turns `"3000"` into `3000`; `z.stringbool()` maps the strings env vars actually contain to booleans (v4).

## 2. Runtime variants

- Vite client env: only `VITE_*` is exposed — parse `import.meta.env` with a separate schema so a server-only key can never be read by the client.
- Bun reads `Bun.env`; Cloudflare Workers receive bindings per request — parse the bindings object inside the handler, not at module scope.
- Tests: parse `{ ...process.env, ...testOverrides }` so a missing key fails that test file, not the whole suite.

## 3. Report all problems at once

```ts
const result = envSchema.safeParse(process.env)
if (!result.success) {
  console.error(z.prettifyError(result.error))   // KEY: message lines
  process.exit(1)
}
```

## Pitfalls

- `z.string()` for numbers/booleans → config stays a string and comparisons silently fail (`PORT === 3000`).
- `.default()` on a required secret → hides the missing value until the first request; keep secrets required.
- Logging the whole `result.error` → issues can echo the offending value; log only `path` + `message`.
- Parsing at module scope on Workers/edge → bindings are undefined there.
- Committing `.env` with real values instead of validating `.env.example` in CI.

## Related

- `references/apis.md`
- `usecases/api-boundary-validation.md`
- `usecases/form-and-server-validation.md`
