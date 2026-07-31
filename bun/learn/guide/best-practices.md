# Best Practices - Bun

## Project Structure

```
my-project/
├── src/
│   ├── index.ts
│   ├── utils/
│   └── types/
├── tests/
│   └── *.test.ts
├── bun.lockb
├── package.json
└── tsconfig.json
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "types": ["bun-types"]
  }
}
```

## Performance

### Use Native APIs

```typescript
// Good
const file = Bun.file("data.json")
const data = await file.json()

// Bad
import { readFile } from "fs/promises"
const content = await readFile("data.json", "utf-8")
```

### Lazy Import

```typescript
// Good
async function handleRequest() {
  const { heavyModule } = await import("./heavy")
  return heavyModule.process()
}

// Bad
import { heavyModule } from "./heavy"
```

## Testing

### File Naming

```
tests/
├── auth.test.ts
├── user.test.ts
└── api.test.ts
```

### Test Structure

```typescript
import { test, expect, describe } from "bun:test"
describe("Authentication", () => {
  test("login success", async () => {
    const result = await login("user", "pass")
    expect(result.token).toBeDefined()
  })
})
```

## Production

### Build Command

```bash
bun build --target=browser --minify --outdir=dist src/index.ts
```

### Environment

```bash
# Development
bun run dev

# Production
NODE_ENV=production bun run start
```

## Common Patterns

### Error Handling

```typescript
try {
  const result = await fetchData()
} catch (error) {
  console.error("Failed:", error)
  throw error
}
```

### Async Operations

```typescript
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()])
```
