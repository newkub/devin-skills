---
name: follow-lib-drizzle-use-transactions
description: Drizzle mutations + transactions — insert/update/delete, returning, batch, nested tx, upsert
argument-hint: "[scope]"
related:
  - follow-lib-drizzle
  - run-test
  - resolve-errors
---

## Goal

เขียน mutations + transactions ใน Drizzle ครบ — CRUD, `returning`, upsert, batch, nested transactions, concurrency control

## Scope

write paths — `insert`/`update`/`delete`/`returning`, `onConflict*`, `db.transaction` + nested savepoints, `db.batch` (sqlite/libsql), prepared statements

## Execute

### 1. CRUD Mutations

```ts
await db.insert(users).values({ email, name }).returning()
await db.insert(users).values([...rows])                       // bulk
await db.update(users).set({ name }).where(eq(users.id, id)).returning()
await db.delete(users).where(eq(users.id, id)).returning()
```

- `.returning()` — pg/sqlite รองรับ (mysql ไม่มี → re-select)
- `.onConflictDoUpdate({ target, set })` / `.onConflictDoNothing()` — upsert
- `$dynamic()` — build queries conditionally (`let q = db.select().$dynamic()`)

### 2. Transactions

```ts
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values(u).returning()
  await tx.insert(profiles).values({ userId: user.id })
  // throw → rollback อัตโนมัติ
})
```

- Nested `tx.transaction()` = savepoint — inner rollback ไม่ล้ม outer
- `tx.rollback()` — manual rollback; return value = tx result
- Isolation levels (driver support): `.transaction(fn, { isolationLevel: 'serializable' })`

### 3. Batch And Prepared

```ts
await db.batch([db.insert(logs).values(a), db.update(stats).set(...)]) // libsql/d1 atomic batch
const prepared = db.select().from(users).where(eq(users.id, sql.placeholder('id'))).prepare()
await prepared.execute({ id: 1 })
```

- `db.batch` = atomic multi-statement (sqlite/libsql/D1) — ใช้แทน tx เมื่อ driver รองรับ
- `sql.placeholder` + `.prepare()` — reuse statement plans บน hot paths

### 4. Concurrency Patterns

- Optimistic: version column + `where(and(eq(id), eq(version, v)))` → 0 rows = conflict
- Pessimistic: `select().for('update')` (pg) row lock ใน tx
- Idempotent writes: natural key + `onConflictDoNothing` + check `.returning()` empty

## Rules

- Multi-write operations ต้องใน `db.transaction` — ห้าม fire sequential inserts ที่ต้อง atomic
- `.returning()` เช็ค driver support (mysql ไม่มี)
- Nested tx = savepoints — อย่า assume independent
- `batch` สำหรับ libsql/d1 ดีกว่า tx ใน serverless (single round trip)

## Expected Outcome

- Mutations type-safe ครบ insert/update/delete/upsert
- Transactions nested ถูกต้อง, concurrency strategy ชัด
