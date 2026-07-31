# Key Concept

## Purpose

อธิบาย core concepts สำคัญของ Drizzle ORM เพื่อเป็นพื้นฐานในการใช้งาน

## Scope

- Schema Definition
- Type-safe Queries
- Relations
- Migrations
- SQL-like API

## Core Concepts

### 1. Schema Definition

Schema คือการกำหนดโครงสร้าง database table ในรูปแบบ TypeScript

```typescript
import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  age: integer('age'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

| องค์ประกอบ | คำอธิบาย | ตัวอย่าง |
|------------|----------|----------|
| **Table** | กำหนด table ด้วย `pgTable`, `mysqlTable`, `sqliteTable` | `pgTable('users', {...})` |
| **Column** | กำหนด column พร้อม type | `text('name').notNull()` |
| **Primary Key** | กำหนด primary key | `uuid('id').primaryKey()` |
| **Default** | กำหนด default value | `timestamp().defaultNow()` |
| **Unique** | กำหนด unique constraint | `text('email').unique()` |

### 2. Type-safe Queries

Drizzle ORM ให้ความปลอดภัยด้าน type ตั้งแต่เขียน query จนถึงผลลัพธ์

```typescript
import { eq, and, gt } from 'drizzle-orm'

// TypeScript รู้ว่า result มี field อะไรบ้าง
const result = await db
  .select()
  .from(users)
  .where(and(eq(users.name, 'John'), gt(users.age, 18)))
```

| Feature | คำอธิบาย |
|---------|----------|
| **Type Inference** | TypeScript รู้ type ของผลลัพธ์อัตโนมัติ |
| **Compile-time Check** | ตรวจ column name ผิดตั้งแต่ compile |
| **Operator Safety** | operators ตรวจสอบ type compatibility |

### 3. Relations

Relations กำหนดความสัมพันธ์ระหว่าง tables

```typescript
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
```

| Relation Type | คำอธิบาย | Method |
|---------------|----------|--------|
| **One-to-One** | 1 row เชื่อม 1 row | `one()` |
| **One-to-Many** | 1 row เชื่อมหลาย rows | `many()` |
| **Many-to-Many** | ใช้ junction table | `many()` + junction |

### 4. Migrations

Drizzle Kit เป็นเครื่องมือจัดการ migration แบบ declarative

```text
Schema เปลี่ยน  -->  drizzle-kit generate  -->  SQL migration file
                                                    |
drizzle-kit push  <--  Review SQL  <----------------+
```

| Command | คำอธิบาย |
|---------|----------|
| `drizzle-kit generate` | สร้าง migration file จาก schema diff |
| `drizzle-kit push` | Push schema ตรงไปยัง database |
| `drizzle-kit pull` | ดึง schema จาก database ที่มีอยู่ |
| `drizzle-kit studio` | เปิด GUI จัดการ database |

### 5. SQL-like API

Drizzle ORM ใช้ syntax คล้าย SQL ทำให้คนที่รู้ SQL ใช้งานได้ง่าย

```typescript
// SQL: SELECT * FROM users WHERE age > 18 ORDER BY name LIMIT 10
const result = await db
  .select()
  .from(users)
  .where(gt(users.age, 18))
  .orderBy(users.name)
  .limit(10)
```

| SQL | Drizzle ORM |
|-----|-------------|
| `SELECT * FROM users` | `db.select().from(users)` |
| `WHERE age > 18` | `.where(gt(users.age, 18))` |
| `ORDER BY name` | `.orderBy(users.name)` |
| `LIMIT 10` | `.limit(10)` |
| `JOIN posts ON ...` | `.leftJoin(posts, eq(...))` |

## Summary

| Concept | ความสำคัญ | ระดับ |
|---------|-----------|-------|
| **Schema Definition** | กำหนดโครงสร้าง table แบบ type-safe | พื้นฐาน |
| **Type-safe Queries** | Query ปลอดภัยด้วย TypeScript | พื้นฐาน |
| **Relations** | จัดการความสัมพันธ์ระหว่าง tables | ปานกลาง |
| **Migrations** | จัดการ database schema changes | ปานกลาง |
| **SQL-like API** | เขียน query ด้วย syntax คล้าย SQL | พื้นฐาน |
