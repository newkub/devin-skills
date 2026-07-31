# Ecosystem

## Runtime Support

| Runtime | Support | Notes |
|---------|---------|-------|
| Bun | ✅ Full | Recommended - native TypeScript support |
| Node.js | ✅ Full | Requires TypeScript compiler |
| Deno | ✅ Full | Use bun specifier |
| Browser | ✅ Full | Requires bundler |

## Integrations

### Framework Integrations

- **React** - Use `@effect/react` for React hooks
- **Next.js** - Server actions และ API routes
- **Vue** - Composables สำหรับ Vue 3
- **Svelte** - Actions และ stores

### Database Integrations

- **PostgreSQL** - `@effect/sql` สำหรับ PostgreSQL
- **MySQL** - `@effect/sql` สำหรับ MySQL
- **SQLite** - `@effect/sql` สำหรับ SQLite
- **Prisma** - Custom Prisma adapter

## Tools

| Tool | Purpose | Link |
|------|---------|------|
| Effect CLI | Development tooling | `@effect/cli` |
| Effect Testing | Testing utilities | Built-in Vitest support |
| Effect DevTools | Debugging และ inspection | Chrome extension |
| Effect Platform | Managed services | effect.run |

## Related Libraries

```bash
# Core
bun add effect

# React integration
bun add @effect/react

# SQL database
bun add @effect/sql

# HTTP client
bun add @effect/platform
```
