# Environment Variables - Bun

## Overview

Bun supports environment variables through `.env` files and process.env.

## .env Loading

Bun automatically loads `.env` files from the project root.

```bash
# .env
API_KEY=your_key
DATABASE_URL=postgres://localhost/db
PORT=3000
```

## Accessing Variables

```typescript
const apiKey = process.env.API_KEY
const port = process.env.PORT ?? "3000"
```

## Disable .env Loading

```toml
# bunfig.toml
[env]
file = false
```

## Custom .env Path

```bash
bun --env-file=.env.production run src/index.ts
```

## Global Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (development, production) |
| `BUN_RUNTIME` | Runtime mode |
| `BUN_CONFIG_FILE` | Config file path |

## Best Practices

- Never commit `.env` files with secrets
- Use `.env.example` as template
- Validate required variables at startup
- Use TypeScript for type safety

```typescript
const required = ["API_KEY", "DATABASE_URL"]
const missing = required.filter(key => !process.env[key])

if (missing.length > 0) {
  throw new Error(`Missing env vars: ${missing.join(", ")}`)
}
```

---

**See also:**
- [Runtime Configuration](https://bun.sh/docs/runtime/configuration)
