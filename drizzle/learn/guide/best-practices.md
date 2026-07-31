# Best Practices

## Purpose

แนะนำ best practices สำหรับการใช้งาน Drizzle ORM ใน production

## Scope

- Schema Organization
- Type Safety
- Query Patterns
- Migration Strategy
- Performance

## Schema Organization

### แยก Schema ตาม Domain

```typescript
// src/db/schema/users.ts
export const users = pgTable('users', { ... })

// src/db/schema/posts.ts
export const posts = pgTable('posts', { ... })

// src/db/schema/index.ts
export * from './users'
export * from './posts'
```

| หลักการ | คำอธิบาย |
|---------|----------|
| **แยกไฟล์ตาม table** | แต่ละ table อยู่ในไฟล์ของตัวเอง |
| **มี index.ts** | Export ทั้งหมดจากจุดเดียว |
| **วาง relations ใกล้ table** | กำหนด relations ในไฟล์เดียวกับ table |
| **ใช้ barrel export** | Import จาก `schema/index.ts` |

### ตั้งชื่อให้สอดคล้องกับ SQL

```typescript
// ใช้ snake_case สำหรับ column names ใน SQL
export const users = pgTable('users', {
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  createdAt: timestamp('created_at'),
})
```

## Type Safety

### ใช้ `$inferSelect` และ `$inferInsert`

```typescript
type User = typeof users.$inferSelect
type NewUser = typeof users.$inferInsert

function createUser(data: NewUser): Promise<User> {
  return db.insert(users).values(data).returning().then(r => r[0])
}
```

| Pattern | ใช้เมื่อ |
|---------|----------|
| `$inferSelect` | ต้องการ type ของ row ที่ select มา |
| `$inferInsert` | ต้องการ type สำหรับ insert |
| `InferSelectModel<T>` | ต้องการ generic type |

### หลีกเลี่ยง `any`

```typescript
// หลีกเลี่ยง
const result: any = await db.select().from(users)

// ใช้
const result = await db.select().from(users)
```

## Query Patterns

### ใช้ Returning แทน Select ซ้ำ

```typescript
// ไม่ดี - query 2 ครั้ง
await db.insert(users).values({ name: 'John', email: 'john@test.com' })
const user = await db.select().from(users).where(eq(users.email, 'john@test.com'))

// ดี - query ครั้งเดียว
const user = await db.insert(users).values({ name: 'John', email: 'john@test.com' }).returning()
```

### ใช้ Transactions สำหรับหลาย Operations

```typescript
await db.transaction(async (tx) => {
  const user = await tx.insert(users).values(data).returning()
  await tx.insert(profiles).values({ userId: user[0].id, ... })
  await tx.insert(roles).values({ userId: user[0].id, role: 'user' })
})
```

### ใช้ Prepared Statements สำหรับ Query ที่เรียกบ่อย

```typescript
const getUserById = db
  .select().from(users)
  .where(eq(users.id, sql.placeholder('id')))
  .prepare('get_user_by_id')

const user1 = await getUserById.execute({ id: '1' })
const user2 = await getUserById.execute({ id: '2' })
```

## Migration Strategy

| หลักการ | คำอธิบาย |
|---------|----------|
| **Review ก่อน push** | ใช้ `generate` แล้ว review SQL ก่อน `push` |
| **ใช้ version control** | Commit migration files เข้า git |
| **ไม่แก้ไข migration ที่ run แล้ว** | สร้าง migration ใหม่แทน |
| **ทดสอบกับ staging** | ทดสอบ migration กับ staging database ก่อน |

## Performance

| เทคนิค | คำอธิบาย | ผลกระทบ |
|--------|----------|---------|
| **ใช้ Indexes** | เพิ่ม index สำหรับ column ที่ query บ่อย | เร็วขึ้นมาก |
| **Select เฉพาะ columns** | ไม่ select `*` เมื่อไม่จำเป็น | ลด network |
| **ใช้ `.limit()`** | จำกัดจำนวน rows ที่ select | ลด memory |
| **ใช้ Joins** | ใช้ joins แทน N+1 queries | ลด round trips |
| **Batch Insert** | Insert หลาย rows ครั้งเดียว | เร็วขึ้นมาก |
| **Connection Pool** | ใช้ connection pool เสมอ | ลด overhead |

### N+1 Problem

```typescript
// N+1 - ช้า! เรียก query N+1 ครั้ง
const users = await db.select().from(users)
for (const user of users) {
  user.posts = await db.select().from(posts).where(eq(posts.authorId, user.id))
}

// ใช้ Query API - เร็ว! เรียก 2 ครั้ง
const users = await db.query.users.findMany({ with: { posts: true } })

// ใช้ Join - เร็ว! เรียก 1 ครั้ง
const result = await db.select().from(users).leftJoin(posts, eq(users.id, posts.authorId))
```

## Summary

| หมวด | Best Practice สำคัญ |
|------|---------------------|
| **Schema** | แยกไฟล์ตาม domain, ใช้ snake_case ใน SQL |
| **Types** | ใช้ `$inferSelect` / `$inferInsert`, ห้ามใช้ `any` |
| **Queries** | ใช้ `.returning()`, transactions, prepared statements |
| **Migrations** | Review ก่อน push, เก็บใน version control |
| **Performance** | ใช้ indexes, หลีกเลี่ยง N+1, batch insert |
