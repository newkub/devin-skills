# Query Builder

## What is Query Builder

Query builder คือ API สำหรับ build SQL queries:
- **Type-safe** - TypeScript support
- **Composable** - compose queries ได้
- **SQL-like** - syntax คล้าย SQL

## Using Query Builder

```typescript
import { eq } from 'drizzle-orm';
import { users } from './schema';

const user = await db.select().from(users)
  .where(eq(users.email, 'test@example.com'))
  .limit(1);
```

## Query Operations

- **Select** - select data
- **Insert** - insert data
- **Update** - update data
- **Delete** - delete data
