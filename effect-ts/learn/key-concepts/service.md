# Service

## What is Service

Service คือ dependency ที่ Effect ใช้:
- **Dependency Injection** - inject dependencies
- **Testable** - easy to test
- **Type-safe** - TypeScript support

## Creating Services

```typescript
import { Context, Effect } from 'effect';

class Database {
  constructor(private readonly connection: string) {}
  query(sql: string) {
    return Effect.sync(() => this.connection);
  }
}

const Database = Context.GenericTag<Database>('Database');
```

## Using Services

```typescript
const program = Effect.gen(function* () {
  const db = yield* Database;
  return yield* db.query('SELECT * FROM users');
});
```
