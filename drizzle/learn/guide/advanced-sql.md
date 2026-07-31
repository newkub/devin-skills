---
title: Advanced SQL Features
description: ใช้ Advanced SQL Features ใน Drizzle ORM เช่น CTE, set operators, aggregate functions
---

## Goal

ใช้ advanced SQL features ใน Drizzle ORM สำหรับ complex queries

## Scope

ใช้สำหรับ CTE, set operators, aggregate functions, และ advanced queries

## Execute

### 1. Common Table Expressions (CTE)

ใช้ `WITH` clause สำหรับ temporary result sets:

```typescript
import { sql } from 'drizzle-orm';

const result = await db
  .with(cte, (qb) => qb
    .select()
    .from(users)
    .where(eq(users.age, 18))
  )
  .select()
  .from(cte);
```

CTE สำหรับ SELECT, INSERT, UPDATE, DELETE:

```typescript
// CTE with INSERT
await db
  .with(cte, (qb) => qb
    .select()
    .from(users)
    .where(eq(users.age, 18))
  )
  .insert(posts)
  .values({
    authorId: sql`${cte.id}`,
  });
```

### 2. Set Operators

ใช้ set operators สำหรับ combine results:

```typescript
// UNION
const result = await db
  .select()
  .from(users)
  .union(
    db.select().from(admins)
  );

// UNION ALL
const result = await db
  .select()
  .from(users)
  .unionAll(
    db.select().from(admins)
  );

// INTERSECT
const result = await db
  .select()
  .from(users)
  .intersect(
    db.select().from(admins)
  );

// EXCEPT
const result = await db
  .select()
  .from(users)
  .except(
    db.select().from(admins)
  );
```

### 3. Aggregate Functions

ใช้ aggregate functions สำหรับ calculations:

```typescript
import { count, avg, sum, max, min } from 'drizzle-orm';

const result = await db
  .select({
    count: count(),
    avgAge: avg(users.age),
    totalSalary: sum(users.salary),
    maxAge: max(users.age),
    minAge: min(users.age),
  })
  .from(users);
```

### 4. Window Functions

ใช้ window functions สำหรับ advanced analytics:

```typescript
import { sql } from 'drizzle-orm';

const result = await db
  .select({
    name: users.name,
    salary: users.salary,
    rank: sql`RANK() OVER (ORDER BY ${users.salary} DESC)`,
  })
  .from(users);
```

### 5. Subqueries

ใช้ subqueries สำหรับ nested queries:

```typescript
const result = await db
  .select()
  .from(users)
  .where(
    inArray(
      users.id,
      db.select({ id: posts.authorId }).from(posts)
    )
  );
```

### 6. Raw SQL

ใช้ `sql` tag สำหรับ custom SQL:

```typescript
import { sql } from 'drizzle-orm';

const result = await db.execute(
  sql`SELECT * FROM users WHERE age > ${minAge}`
);
```

## Rules

- ใช้ CTE สำหรับ complex queries ที่ต้องการ temporary result sets
- ใช้ set operators สำหรับ combine results จาก multiple queries
- ใช้ aggregate functions สำหรับ calculations บน groups
- ใช้ window functions สำหรับ analytics ที่ซับซ้อน
- ใช้ `sql` tag เมื่อต้องการ custom SQL
- ระวัง SQL injection - ใช้ parameterization เสมอ

## Expected Outcome

- Complex queries ที่ readable และ maintainable
- Efficient queries ที่ใช้ advanced SQL features
- Type-safe queries แม้ใช้ advanced features
