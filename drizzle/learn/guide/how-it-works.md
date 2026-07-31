# How It Works

## Purpose

อธิบายการทำงานภายในของ Drizzle ORM เพื่อให้เข้าใจกลไกและ flow การทำงาน

## Scope

- Query Execution Flow
- Schema-to-Migration Pipeline
- Relation Loading
- Type Inference Mechanism

## Query Execution Flow

Drizzle ORM แปลง TypeScript query เป็น SQL string แล้วส่งไปยัง database driver

```
+------------------+     +------------------+     +------------------+
|  TypeScript API  | --> |  Query Builder   | --> |  SQL Generator   |
|  db.select()...  |     |  (build AST)     |     |  (to SQL string) |
+------------------+     +------------------+     +------------------+
                                                          |
                         +------------------+     +------------------+
                         |  Type-safe       | <-- |  Database Driver |
                         |  Result<T>       |     |  (pg, mysql2)    |
                         +------------------+     +------------------+
```

### ขั้นตอนการทำงาน

| ขั้นตอน | คำอธิบาย | Output |
|---------|----------|--------|
| **1. Build Query** | เรียก method เช่น `.select().from().where()` | Query Builder object |
| **2. Generate SQL** | แปลงเป็น SQL string พร้อม params | `SELECT * FROM users WHERE id = $1` |
| **3. Execute** | ส่ง SQL ไปยัง database driver | Raw rows |
| **4. Map Result** | แปลง raw rows เป็น typed objects | `User[]` |

## Schema-to-Migration Pipeline

Drizzle Kit อ่าน schema files แล้วเปรียบเทียบกับสถานะปัจจุบันของ database

```
+------------------+     +------------------+     +------------------+
|  Schema Files    | --> |  Schema Parser   | --> |  Schema Snapshot |
|  (TypeScript)    |     |  (read & eval)   |     |  (JSON)          |
+------------------+     +------------------+     +------------------+
                                                          |
+------------------+     +------------------+     +------------------+
|  Migration SQL   | <-- |  Diff Engine     | <-- |  Previous        |
|  (.sql files)    |     |  (compare)       |     |  Snapshot        |
+------------------+     +------------------+     +------------------+
```

### ขั้นตอนการทำงาน

| ขั้นตอน | คำอธิบาย | Tool |
|---------|----------|------|
| **1. Parse Schema** | อ่าน TypeScript schema files | `drizzle-kit generate` |
| **2. Compare** | เปรียบเทียบ schema เก่ากับใหม่ | Diff Engine |
| **3. Generate SQL** | สร้าง ALTER TABLE, CREATE TABLE ฯลฯ | SQL Generator |
| **4. Output** | เขียนไฟล์ `.sql` ลง folder `out` | Migration files |

## Relation Loading

Drizzle ORM โหลด relations ได้ 2 แบบ: `query` API และ `joins`

```
+--------------------------------------------------+
|               Relation Loading                   |
+--------------------------------------------------+
|                                                   |
|  Query API (recommended)                         |
|  ┌─────────────────────────────────────────┐     |
|  │ db.query.users.findMany({               │     |
|  │   with: { posts: true }                 │     |
|  │ })                                       │     |
|  └─────────────────────────────────────────┘     |
|  --> SELECT ... FROM users                       |
|  --> SELECT ... FROM posts WHERE author_id IN... |
|  --> Merge results in memory                     |
|                                                   |
|  Joins                                           |
|  ┌─────────────────────────────────────────┐     |
|  │ db.select()                              │     |
|  │   .from(users)                           │     |
|  │   .leftJoin(posts, eq(...))              │     |
|  └─────────────────────────────────────────┘     |
|  --> SELECT ... FROM users LEFT JOIN posts       |
|  --> Map flat rows to nested objects             |
|                                                   |
+--------------------------------------------------+
```

| Method | ข้อดี | ข้อเสีย |
|--------|-------|---------|
| **Query API** | ง่าย, type-safe, nested result | อาจเกิด N+1 ถ้าไม่ระวัง |
| **Joins** | ควบคุม SQL ได้เต็มที่ | ต้อง map result เอง |

## Type Inference Mechanism

Drizzle ORM ใช้ TypeScript generics เพื่อ infer type จาก schema

```
pgTable('users', {                    InferSelectModel<users>
  id: uuid().primaryKey(),     -->    {
  name: text().notNull(),              id: string
  email: text().notNull(),             name: string
  age: integer(),                      email: string
})                                     age: number | null
                                     }
```

### Type Utilities

| Utility | คำอธิบาย | ตัวอย่าง |
|---------|----------|----------|
| `$inferSelect` | Infer type สำหรับ SELECT | `type User = typeof users.$inferSelect` |
| `$inferInsert` | Infer type สำหรับ INSERT | `type NewUser = typeof users.$inferInsert` |
| `InferSelectModel` | Generic type สำหรับ select | `InferSelectModel<typeof users>` |
| `InferInsertModel` | Generic type สำหรับ insert | `InferInsertModel<typeof users>` |

## Summary

| กลไก | ประโยชน์ |
|-------|---------|
| **Query Builder** | แปลง TypeScript เป็น SQL อัตโนมัติ |
| **Migration Pipeline** | จัดการ schema changes แบบ declarative |
| **Relation Loading** | โหลดข้อมูลที่เกี่ยวข้องได้ง่าย |
| **Type Inference** | ปลอดภัยด้วย type-checking ตั้งแต่ compile-time |
