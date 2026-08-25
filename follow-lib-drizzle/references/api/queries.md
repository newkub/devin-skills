# Queries

## CRUD

```ts
import { eq, and, or, like, gt, asc, desc, sql } from 'drizzle-orm';
import { usersTable, postsTable } from './db/schema';

// Insert
const user: typeof usersTable.$inferInsert = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Insert with returning
const [inserted] = await db.insert(usersTable).values(user).returning();

// Select all
const users = await db.select().from(usersTable);

// Select with filter
const found = await db.select().from(usersTable).where(eq(usersTable.email, 'john@example.com'));

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```

## Joins

```ts
// Inner join
const result = await db.select()
  .from(usersTable)
  .innerJoin(postsTable, eq(usersTable.id, postsTable.authorId));

// Left join with selected columns
const rows = await db.select({
    name: usersTable.name,
    title: postsTable.title,
  })
  .from(usersTable)
  .leftJoin(postsTable, eq(usersTable.id, postsTable.authorId));
```

## Relational Queries (RQB)

ต้องส่ง `relations` และ `schema` เข้า `drizzle()` ก่อน

```ts
const db = drizzle(process.env.DATABASE_URL!, { schema });

// findMany with relations
const usersWithPosts = await db.query.users.findMany({
  with: { posts: true },
});

// findFirst with filtered relations
const user = await db.query.users.findFirst({
  with: { posts: { where: eq(postsTable.published, true) } },
});
```

## Pagination And Ordering

```ts
import { limit, offset } from 'drizzle-orm';

const page = await db.select().from(usersTable)
  .orderBy(asc(usersTable.id))
  .limit(10)
  .offset(20);
```

## Raw SQL

```ts
const rows = await db.execute(sql`SELECT * FROM users WHERE age > ${18}`);
```

## Sources

- Queries: https://orm.drizzle.team/docs/select
- Joins: https://orm.drizzle.team/docs/joins
- RQB: https://orm.drizzle.team/docs/rqb
