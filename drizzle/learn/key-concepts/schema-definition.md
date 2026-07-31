# Schema Definition

## What is Schema

Schema คือ TypeScript definitions สำหรับ database tables:
- **Type-safe** - TypeScript types จาก schema
- **Declarative** - define schema ด้วย TypeScript
- **Multi-database** - รองรับ PostgreSQL, MySQL, SQLite

## Creating Schema

```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Schema Features

- **Column Types** - รองรับทุก column types
- **Constraints** - define constraints ใน schema
- **Relations** - define table relations
