# Architecture

## Purpose

อธิบาย architecture ภายในของ Drizzle ORM เพื่อเข้าใจโครงสร้างและ layer ต่างๆ

## Scope

- Core Architecture
- Dialect Layer
- Driver Layer
- Schema System
- Drizzle Kit

## Core Architecture

Drizzle ORM แบ่งเป็น layers ที่แยกจากกันชัดเจน

```
+----------------------------------------------------------+
|                    Application Code                       |
|            db.select().from(users).where(...)            |
+----------------------------------------------------------+
|                        |                                  |
|                    v                                      |
+----------------------------------------------------------+
|                   Query Builder                           |
|     สร้าง query object จาก method chaining               |
|     select() -> from() -> where() -> orderBy()           |
+----------------------------------------------------------+
|                        |                                  |
|                    v                                      |
+----------------------------------------------------------+
|                  SQL Generator                            |
|     แปลง query object เป็น SQL string + params           |
|     dialect-specific SQL generation                      |
+----------------------------------------------------------+
|                        |                                  |
|                    v                                      |
+----------------------------------------------------------+
|                   Driver Layer                            |
|     ส่ง SQL ไปยัง database ผ่าน driver                   |
|     pg | mysql2 | better-sqlite3 | neon | d1             |
+----------------------------------------------------------+
|                        |                                  |
|                    v                                      |
+----------------------------------------------------------+
|                    Database                               |
|          PostgreSQL | MySQL | SQLite                      |
+----------------------------------------------------------+
```

## Package Structure

| Package | หน้าที่ | จำเป็น |
|---------|---------|--------|
| **drizzle-orm** | Core ORM library | ใช่ |
| **drizzle-orm/pg-core** | PostgreSQL schema helpers | สำหรับ PG |
| **drizzle-orm/mysql-core** | MySQL schema helpers | สำหรับ MySQL |
| **drizzle-orm/sqlite-core** | SQLite schema helpers | สำหรับ SQLite |
| **drizzle-kit** | CLI + migrations + studio | ใช่ (dev) |

## Dialect Layer

แต่ละ dialect มี schema helpers เป็นของตัวเอง

```
+---------------------------------------------------+
|                  drizzle-orm                       |
+---------------------------------------------------+
|                                                     |
|  +----------------+  +----------------+            |
|  |   pg-core      |  |  mysql-core    |            |
|  |  pgTable()     |  |  mysqlTable()  |            |
|  |  pgEnum()      |  |  mysqlEnum()   |            |
|  |  pgSchema()    |  |  int()         |            |
|  |  serial()      |  |  varchar()     |            |
|  |  uuid()        |  |  bigint()      |            |
|  +----------------+  +----------------+            |
|                                                     |
|  +----------------+                                 |
|  |  sqlite-core   |                                 |
|  |  sqliteTable() |                                 |
|  |  text()        |                                 |
|  |  integer()     |                                 |
|  |  blob()        |                                 |
|  +----------------+                                 |
|                                                     |
+---------------------------------------------------+
```

### Dialect Comparison

| Feature | PostgreSQL | MySQL | SQLite |
|---------|-----------|-------|--------|
| **Table Helper** | `pgTable()` | `mysqlTable()` | `sqliteTable()` |
| **Auto Increment** | `serial()`, `identity()` | `int().autoincrement()` | `integer().primaryKey()` |
| **UUID** | `uuid()` | `char(36)` | `text()` |
| **Enum** | `pgEnum()` | `mysqlEnum()` | - |
| **JSON** | `json()`, `jsonb()` | `json()` | - |
| **Array** | `array()` | - | - |

## Driver Layer

Drizzle ORM รองรับ drivers หลายตัวผ่าน subpath exports

```
+---------------------------------------------------+
|              drizzle-orm Drivers                   |
+---------------------------------------------------+
|                                                     |
|  PostgreSQL        MySQL              SQLite       |
|  ---------         -----              ------       |
|  node-postgres     mysql2             better-sqlite3|
|  neon-http         planetscale        d1           |
|  vercel-postgres   tidb-serverless    libsql       |
|  postgres-js                          bun:sqlite   |
|                                                     |
+---------------------------------------------------+
```

| Database | Drivers | Import Path |
|----------|---------|-------------|
| **PostgreSQL** | pg, neon, vercel, postgres-js | `drizzle-orm/node-postgres` |
| **MySQL** | mysql2, planetscale, tidb | `drizzle-orm/mysql2` |
| **SQLite** | better-sqlite3, d1, libsql, bun | `drizzle-orm/better-sqlite3` |

## Schema System

```
+---------------------------------------------------+
|                 Schema System                      |
+---------------------------------------------------+
|                                                     |
|  1. Define Schema (TypeScript)                     |
|     +-----------------------------------------+   |
|     | export const users = pgTable(...)       |   |
|     | export const posts = pgTable(...)       |   |
|     | export const relations = relations(..)  |   |
|     +-----------------------------------------+   |
|                         |                           |
|                         v                           |
|  2. Type Inference                                  |
|     +-----------------------------------------+   |
|     | type User = typeof users.$inferSelect   |   |
|     | type NewUser = typeof users.$inferInsert|   |
|     +-----------------------------------------+   |
|                         |                           |
|                         v                           |
|  3. Query Building                                  |
|     +-----------------------------------------+   |
|     | db.select().from(users)                 |   |
|     |   .where(eq(users.id, '1'))             |   |
|     +-----------------------------------------+   |
|                                                     |
+---------------------------------------------------+
```

## Drizzle Kit

Drizzle Kit เป็น standalone CLI tool สำหรับจัดการ migrations

```
+---------------------------------------------------+
|                  Drizzle Kit                       |
+---------------------------------------------------+
|                                                     |
|  +------------+  +------------+  +------------+   |
|  | generate   |  |  migrate   |  |   push     |   |
|  | schema     |  |  run .sql  |  |  direct    |   |
|  | diff       |  |  files     |  |  to DB     |   |
|  +------------+  +------------+  +------------+   |
|                                                     |
|  +------------+  +------------+                     |
|  |   pull     |  |  studio    |                     |
|  |  from DB   |  |  GUI       |                     |
|  +------------+  +------------+                     |
|                                                     |
+---------------------------------------------------+
```

| Component | หน้าที่ |
|-----------|---------|
| **Schema Parser** | อ่าน TypeScript schema files |
| **Diff Engine** | เปรียบเทียบ schema versions |
| **SQL Generator** | สร้าง migration SQL |
| **Migration Runner** | Apply migrations ไปยัง database |
| **Studio** | Web GUI สำหรับจัดการ database |

## Summary

| Layer | หน้าที่ | Packages |
|-------|---------|----------|
| **Core** | Query builder, type inference | `drizzle-orm` |
| **Dialect** | DB-specific schema helpers | `pg-core`, `mysql-core`, `sqlite-core` |
| **Driver** | DB connection adapters | `node-postgres`, `mysql2`, `d1`, etc. |
| **Kit** | Migrations, studio, pull/push | `drizzle-kit` |
