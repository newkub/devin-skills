# Developer Experience

## CLI Features

| Command | Description |
|---------|-------------|
| `vercel dev` | Local dev server |
| `vercel login` | Authenticate |
| `vercel link` | Link to project |
| `vercel logs` | View function logs |
| `vercel inspect` | View deployment |
| `vercel domains` | Manage domains |

## Local Development

```bash
# Start dev server with local env
vercel dev

# Specify port
vercel dev --port 3000

# With turbo
vercel dev --turbo
```

## TypeScript Support

```typescript
// Automatic types for environment
interface Env {
  DATABASE_URL: string;
  API_KEY: string;
}

// Access with type safety
const dbUrl = process.env.DATABASE_URL;
```
