---
title: Read Replicas
description: ใช้ withReplicas utility สำหรับ routing queries ระหว่าง primary และ read replicas
---

## Goal

ใช้ read replicas สำหรับ improve performance และ scalability

## Scope

ใช้สำหรับ routing queries ระหว่าง primary database และ multiple read replicas

## Execute

### 1. Setup withReplicas

ใช้ `withReplicas()` utility:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { withReplicas } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const primary = postgres(process.env.PRIMARY_DATABASE_URL!);
const replica1 = postgres(process.env.REPLICA1_DATABASE_URL!);
const replica2 = postgres(process.env.REPLICA2_DATABASE_URL!);

const db = withReplicas(
  drizzle(primary),
  [replica1, replica2]
);
```

### 2. Query Routing

Drizzle จะ route queries อัตโนมัติ:

- **SELECT queries** → ส่งไป read replicas
- **INSERT/UPDATE/DELETE** → ส่งไป primary
- **Transactions** → ใช้ primary เสมอ

```typescript
// ส่งไป read replica
const users = await db.select().from(users);

// ส่งไป primary
await db.insert(users).values({ name: 'John' });

// ใช้ primary ใน transaction
await db.transaction(async (tx) => {
  await tx.insert(users).values({ name: 'John' });
});
```

### 3. Custom Routing Logic

Custom routing สำหรับ specific queries:

```typescript
// Force ใช้ primary
const users = await db
  .select()
  .from(users)
  .$primary();

// Force ใช้ replica
const users = await db
  .select()
  .from(users)
  .$replica();
```

### 4. Load Balancing

Replicas จะถูกใช้แบบ round-robin:

```typescript
const db = withReplicas(
  drizzle(primary),
  [replica1, replica2, replica3]
);
// Queries จะ distribute ไปทั้ง 3 replicas
```

## Rules

- ใช้ read replicas สำหรับ read-heavy workloads
- ตรวจสอบ replication lag สำหรับ data consistency
- ใช้ primary สำหรับ queries ที่ต้องการ latest data
- ตั้งค่า connection pooling สำหรับแต่ละ replica
- Monitor replica health และ failover

## Expected Outcome

- Improved read performance
- Reduced load on primary database
- Automatic query routing
- Better scalability
