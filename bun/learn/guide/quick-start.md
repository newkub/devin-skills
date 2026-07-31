# Quick Start - Bun

## Hello World

```typescript
console.log("Hello from Bun!")
bun run hello.ts
```

## HTTP Server

```typescript
const server = Bun.serve({
  port: 3000,
  fetch(request) { return new Response("Hello Bun!") }
})
console.log(`Server running on http://localhost:${server.port}`)
bun run server.ts
```

## Working with Files

```typescript
// Node.js style
import { readFileSync } from "fs"
const data = JSON.parse(readFileSync("package.json", "utf-8"))

// Bun native API
const file = Bun.file("package.json")
const content = await file.text()
const data = JSON.parse(content)
```

## TypeScript

```typescript
interface User { name: string; age: number }
function greet(user: User): string { return `Hello, ${user.name}!` }
const user: User = { name: "Alice", age: 30 }
console.log(greet(user))
bun run typescript.ts
```

## Testing

```typescript
import { test, expect } from "bun:test"
test("greet returns greeting", () => {
  expect(greet({ name: "World", age: 0 })).toBe("Hello, World!")
})
bun test
```

## SQLite

```typescript
import { Database } from "bun:sqlite"
const db = new Database("app.db")
db.query(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)`)
const result = db.query("SELECT * FROM users").all()
console.log(result)
```

## Create Project

```bash
bun create react my-app && cd my-app && bun install && bun run dev
```

## Full Workflow

```bash
bun create next my-app && cd my-app && bun install && bun run dev && bun run build && bun test && bun run start
```
