# Features

## Purpose

สรุป features ทั้งหมดของ Drizzle ORM พร้อมตัวอย่างการใช้งาน

## Scope

- CRUD Operations
- Relations & Joins
- Transactions
- Schema Features
- Advanced Query

## CRUD Operations

### Select

```typescript
// Select all
const allUsers = await db.select().from(users)

// Select specific columns
const names = await db.select({ name: users.name, email: users.email }).from(users)

// With conditions
const adults = await db.select().from(users)
  .where(gte(users.age, 18))
  .orderBy(asc(users.name))
  .limit(10)
  .offset(20)
```

### Insert

```typescript
// Single insert
await db.insert(users).values({ name: 'John', email: 'john@example.com' })

// Batch insert
await db.insert(users).values([
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' },
])

// With returning
const inserted = await db.insert(users).values({ name: 'John', email: 'john@example.com' }).returning()
```

### Update

```typescript
await db.update(users).set({ name: 'Updated', updatedAt: new Date() }).where(eq(users.id, '123')).returning()
```

### Delete

```typescript
await db.delete(users).where(eq(users.id, '123')).returning()
```

## Relations & Joins

### Query API (Recommended)

```typescript
const userWithPosts = await db.query.users.findMany({
  with: { posts: { where: eq(posts.published, true), limit: 5 } },
})
```

### Joins

```typescript
const result = await db.select({
  user: users,
  postCount: count(posts.id),
}).from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .groupBy(users.id)
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({ name: 'John', email: 'john@example.com' }).returning()
  await tx.insert(posts).values({ title: 'First Post', authorId: user[0].id })
})
```

## Schema Features

### Indexes

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
}, (table) => [
  uniqueIndex('email_idx').on(table.email),
  index('name_idx').on(table.name),
])
```

### Enums

```typescript
export const roleEnum = pgEnum('role', ['admin', 'user', 'guest'])
export const users = pgTable('users', { role: roleEnum('role').default('user').notNull() })
```

### Constraints

```typescript
export const users = pgTable('users', {
  age: integer('age'),
}, (table) => [check('age_check', sql`${table.age} >= 0`)])
```

## Summary

| Category | Features |
|----------|----------|
| **CRUD** | Select, Insert, Update, Delete, Returning |
| **Relations** | Query API, Joins, Nested relations |
| **Schema** | Tables, Indexes, Enums, Constraints |
| **Advanced** | Transactions, Subqueries, Raw SQL |
| **Database** | PostgreSQL, MySQL, SQLite, Serverless drivers |