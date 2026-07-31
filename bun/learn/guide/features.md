# All Features - Bun

## Core Features

| Feature | Description |
|---------|-------------|
| Runtime | JavaScript/TypeScript execution |
| Package Manager | bun install, bun add |
| Bundler | bun build |
| Test Runner | bun test |
| REPL | Interactive shell |
| LSP | Language Server Protocol |

## Built-in APIs

```typescript
// HTTP Server
Bun.serve({ port: 3000, fetch(req) { return new Response("OK") } })

// File System
const file = Bun.file("data.json")
const text = await file.text()

// SQLite
const db = new Database("app.db")

// Hashing
const hash = await Bun.password.hash("secret")

// Test
import { test, describe, expect } from "bun:test"
```

## bun Compatibility

### Compatible

- bun packages
- node_modules
- package.json scripts ส่วนใหญ่

### Not Compatible

- Some native modules
- Certain Node.js APIs

## Bun Specific

### Bun.write

```typescript
await Bun.write("output.txt", "Hello!")
```

### Bun.serve

```typescript
Bun.serve({
  port: 3000,
  tls: { cert: fs.readFileSync("cert.pem"), key: fs.readFileSync("key.pem") },
  fetch(req) { return new Response("Hello") }
})
```

### Bun.SQL

```typescript
const db = new Database("app.db")
const result = db.query("SELECT * FROM users").all()
```

## Environment Variables

```typescript
const port = process.env.PORT ?? "3000"
```

## Globals

| Variable | Description |
|----------|-------------|
| `Bun` | Bun namespace |
| `process` | Node.js compatible |
| `console` | Console API |
| `globalThis` | Global scope |
| `fetch` | Native fetch API |
