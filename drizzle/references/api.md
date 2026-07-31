# API

## Purpose

Core API reference for Drizzle ORM query methods, schema helpers, and operators.

## Query Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `select` | `db.select().from(table)` | Query rows from a table |
| `insert` | `db.insert(table).values(data)` | Insert new rows |
| `update` | `db.update(table).set(data)` | Update existing rows |
| `delete` | `db.delete(table)` | Delete rows |
| `transaction` | `db.transaction(async (tx) => {...})` | Run queries in a transaction |
| `execute` | `db.execute(sql\`...\`)` | Execute raw SQL |

### Select

```typescript
// Select all columns
db.select().from(users)

// Select specific columns
db.select({ id: users.id, name: users.name }).from(users)

// With where, orderBy, limit, offset
db.select()
  .from(users)
  .where(eq(users.active, true))
  .orderBy(asc(users.name))
  .limit(10)
  .offset(20)

// Distinct, Count
db.selectDistinct({ name: users.name }).from(users)
db.select({ count: count() }).from(users)
```

### Insert / Update / Delete

```typescript
// Insert single row
db.insert(users).values({ name: 'John', email: 'john@test.com' })

// Insert multiple rows
db.insert(users).values([
  { name: 'John', email: 'john@test.com' },
  { name: 'Jane', email: 'jane@test.com' },
])

// With returning
db.insert(users).values(data).returning()

// Update with returning
db.update(users).set({ name: 'Updated' }).where(eq(users.id, '1')).returning()

// Delete with returning
db.delete(users).where(eq(users.id, '1')).returning()
```

## Schema Helpers

| Dialect | Helper | Description |
|---------|--------|-------------|
| **PostgreSQL** | `pgTable` | Define a PostgreSQL table |
| | `pgEnum` | Define a PostgreSQL enum type |
| | `pgView` | Define a PostgreSQL view |
| | `pgSchema` | Define a PostgreSQL schema namespace |
| | `uniqueIndex` | Create a unique index |
| | `index` | Create a regular index |
| **MySQL** | `mysqlTable` | Define a MySQL table |
| | `mysqlEnum` | Define a MySQL enum column |
| | `mysqlView` | Define a MySQL view |
| **SQLite** | `sqliteTable` | Define a SQLite table |
| | `sqliteView` | Define a SQLite view |

## Column Types (PostgreSQL)

| Column | SQL Type | Column | SQL Type |
|--------|----------|--------|----------|
| `text` | `text` | `timestamp` | `timestamp` |
| `varchar` | `varchar(n)` | `date` | `date` |
| `integer` | `integer` | `uuid` | `uuid` |
| `bigint` | `bigint` | `json` | `json` |
| `boolean` | `boolean` | `jsonb` | `jsonb` |
| `serial` | `serial` | `real` | `real` |
| `numeric` | `numeric` | | |

## Column Modifiers

| Modifier | Description | Example |
|----------|-------------|---------|
| `.primaryKey()` | Set as primary key | `uuid('id').primaryKey()` |
| `.notNull()` | Disallow null values | `text('name').notNull()` |
| `.unique()` | Add unique constraint | `text('email').unique()` |
| `.default(value)` | Set default value | `boolean('active').default(true)` |
| `.defaultNow()` | Default to current timestamp | `timestamp('created_at').defaultNow()` |
| `.defaultRandom()` | Default to random UUID | `uuid('id').defaultRandom()` |
| `.references(() => col)` | Foreign key reference | `uuid('user_id').references(() => users.id)` |
| `.autoincrement()` | Auto-increment | `int('id').autoincrement()` |

## Operators

### Comparison

| Operator | SQL | Example |
|----------|-----|---------|
| `eq` | `=` | `eq(users.id, '1')` |
| `ne` | `!=` | `ne(users.active, false)` |
| `gt` | `>` | `gt(users.age, 18)` |
| `gte` | `>=` | `gte(users.age, 18)` |
| `lt` | `<` | `lt(users.age, 65)` |
| `lte` | `<=` | `lte(users.age, 65)` |
| `isNull` | `IS NULL` | `isNull(users.deletedAt)` |
| `isNotNull` | `IS NOT NULL` | `isNotNull(users.email)` |
| `inArray` | `IN (...)` | `inArray(users.id, ['1', '2'])` |
| `notInArray` | `NOT IN (...)` | `notInArray(users.id, ['3'])` |
| `like` | `LIKE` | `like(users.name, '%John%')` |
| `ilike` | `ILIKE` | `ilike(users.name, '%john%')` |
| `between` | `BETWEEN` | `between(users.age, 18, 65)` |

### Logical

| Operator | SQL | Example |
|----------|-----|---------|
| `and` | `AND` | `and(eq(users.active, true), gt(users.age, 18))` |
| `or` | `OR` | `or(eq(users.role, 'admin'), eq(users.role, 'mod'))` |
| `not` | `NOT` | `not(eq(users.active, false))` |
| `sql` | Raw SQL | `` sql`LOWER(${users.name}) = ${name}` `` |

## Relations API

| Method | Description | Example |
|--------|-------------|---------|
| `relations` | Define relations | `relations(users, ({ many }) => ({...}))` |
| `one` | One-to-one/many-to-one | `one(users, { fields, references })` |
| `many` | One-to-many | `many(posts)` |

## Query API (Relational)

```typescript
// Find many with relations
db.query.users.findMany({
  where: eq(users.active, true),
  with: { posts: true },
  limit: 10,
  orderBy: [asc(users.name)],
})

// Find first
db.query.users.findFirst({
  where: eq(users.id, '1'),
  with: { posts: { limit: 5 } },
})
```

## Aggregation Functions

| Function | SQL |
|----------|-----|
| `count` | `COUNT(*)` |
| `sum` | `SUM(column)` |
| `avg` | `AVG(column)` |
| `min` | `MIN(column)` |
| `max` | `MAX(column)` |
| `sql` | Raw SQL expression |