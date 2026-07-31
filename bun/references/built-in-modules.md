# Built-in Modules - Bun

## Overview

Bun provides built-in modules prefixed with `bun:` for specialized functionality.

## bun:sqlite

SQLite database support - Built-in SQLite database with a simple, performant API for SQL operations and transactions.

```typescript
import { Database } from "bun:sqlite"

const db = new Database("app.db")
const result = db.query("SELECT * FROM users").all()
```

## bun:test

Testing framework - Jest-compatible test runner with built-in assertions, mocking, and snapshot support.

```typescript
import { test, expect, describe } from "bun:test"

test("example", () => {
  expect(1 + 1).toBe(2)
})
```

## bun:ffi

Foreign Function Interface - Call native libraries (C, C++, Rust) directly from JavaScript with type-safe bindings.

```typescript
import { dlopen, CString, ptr } from "bun:ffi"

const lib = dlopen("libm.so", {
  cos: { args: ["f64"], returns: "f64" }
})
```

---

**See also:**
- [SQLite Documentation](https://bun.sh/docs/runtime/sqlite)
- [Test Runner](https://bun.sh/docs/test/test-runner)
