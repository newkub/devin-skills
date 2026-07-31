# SQLite Reference - Bun

## Overview

Bun includes a built-in SQLite database via `bun:sqlite`.

## Basic Usage

```typescript
import { Database } from "bun:sqlite"

const db = new Database("app.db")
```

## Querying

```typescript
// Select all
const users = db.query("SELECT * FROM users").all()

// Select one
const user = db.query("SELECT * FROM users WHERE id = ?").get(userId)

// Execute
db.run("INSERT INTO users (name) VALUES (?)", ["John"])
```

## Prepared Statements

```typescript
const stmt = db.query("SELECT * FROM users WHERE id = ?")
const user = stmt.get(userId)
```

## Transactions

```typescript
db.transaction(() => {
  db.run("INSERT INTO users (name) VALUES (?)", ["Alice"])
  db.run("INSERT INTO users (name) VALUES (?)", ["Bob"])
})
```

## In-Memory Database

```typescript
const db = new Database(":memory:")
```

## Schema Migration

```typescript
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
  )
`)
```

## Type Safety

```typescript
interface User {
  id: number
  name: string
  email: string
}

const stmt = db.query<User>("SELECT * FROM users")
const users = stmt.all()
```

---

**See also:**
- [SQLite Documentation](https://bun.sh/docs/runtime/sqlite)
