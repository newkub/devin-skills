# Use Case — Parse Environment Config Once at Startup

> Turn raw string environment variables into a typed, validated config object and fail fast with a readable summary. Source: https://arktype.io/docs (accessed 2026-10-20)

## 1. Declare the config schema

```ts
import { type } from "arktype"

export const envSchema = type({
  NODE_ENV: "'development' | 'test' | 'production' = 'development'",
  PORT: "string.numeric.parse",
  DATABASE_URL: "string.url",
  "SENTRY_DSN?": "string.url",
})
```

- `string.numeric.parse` is a morph: it accepts a string and returns a number.
- `= 'development'` supplies a default when the key is missing.
- `"KEY?"` marks a genuinely optional key; the output type stays `string | undefined`.

## 2. Validate and freeze

```ts
const parsed = envSchema(process.env)

if (parsed instanceof type.errors) {
  console.error(`Invalid environment:\n${parsed.summary}`)
  process.exit(1)
}

export const env = Object.freeze(parsed)
```

Validate at module scope so the process refuses to start with a broken config instead of failing on the first request that touches a missing URL.

## 3. Consume typed values

```ts
import { serve } from "bun"

serve({
  port: env.PORT,          // number, not string
  fetch: app.fetch,
})
```

## 4. Keep secrets out of the schema output

```ts
const { SENTRY_DSN, ...safe } = env
console.log("config loaded", safe) // never log the whole object
```

## Pitfalls

- Validating `process.env` inside a handler → the error surfaces per request and repeats on every call; validate once at startup.
- Declaring numbers as `"number"` → environment variables are always strings; use a numeric morph or `.string.numeric.parse`.
- Logging the parsed object → secrets leak into logs and error trackers; log key names only.
- Treating a missing optional key as `null` → ArkType returns `undefined`; normalise explicitly if downstream code needs `null`.

## Related

- `references/apis.md`
- `best-practices/arktype.md`
- `usecases/api-boundary-validation.md`
