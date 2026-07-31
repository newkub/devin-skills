---
title: Drizzle Seed
description: ใช้ Drizzle Seed สำหรับสร้าง test data แบบ deterministic และ realistic
---

## Goal

ใช้ Drizzle Seed สำหรับสร้าง test data แบบ deterministic และ realistic สำหรับ database

## Scope

ใช้สำหรับสร้าง test data สำหรับ PostgreSQL, MySQL, และ SQLite

## Execute

### 1. Installation

ติดตั้ง drizzle-seed:

```bash
bun add drizzle-seed
```

ต้องการ drizzle-orm@0.36.4 หรือสูงกว่า

### 2. Basic Usage

ใช้ `seed()` function เพื่อสร้าง test data:

```typescript
import { seed } from 'drizzle-seed';
import { db } from './db';
import { schema } from './schema';

await seed(db, schema, {
  count: 10,
  seed: 123, // optional seed for deterministic data
});
```

### 3. Data Generation Pipeline

Drizzle Seed ทำงานตามขั้นตอน:

1. **Schema Definition** - ให้ Drizzle ORM schema
2. **seed() function call** - เริ่ม data generation
3. **Schema Filtering** - filter schema ตาม database dialect
4. **SeedService Initialization** - สร้าง SeedService instance
5. **Generator Selection** - เลือก generators ตาม column metadata
6. **Data Generation** - สร้าง data จริง
7. **Database Population** - insert data เข้า database

### 4. Deterministic Data Generation

ใช้ pRNG (pseudorandom number generator) ที่ initialized ด้วย seed value:

```typescript
await seed(db, schema, {
  seed: 123, // ค่าเดียวกันจะได้ data เหมือนกันเสมอ
});
```

สำคัญสำหรับ:
- Reproducible tests
- Debugging
- Consistent test environments

### 5. Refinements

ใช้ `.refine()` method เพื่อ custom data generation:

```typescript
await seed(db, schema)
  .refine({
    users: {
      count: 100,
      name: () => faker.name.fullName(),
      email: () => faker.internet.email(),
      age: () => faker.number.int({ min: 18, max: 80 }),
    },
  });
```

### 6. Handling Relationships

Drizzle Seed จัดการ foreign key relationships อัตโนมัติ:

- สร้าง dependency graph จาก foreign keys
- จัดลำดับ table insertion อัตโนมัติ
- จัดการ cyclic dependencies ด้วย two-phase generation

```typescript
await seed(db, schema)
  .refine({
    posts: {
      with: {
        author: 5, // 5 posts per author
      },
    },
  });
```

### 7. Built-in Generators

Generators ที่มีให้:

- `int` - ตัวเลขจำนวนเต็ม
- `string` - ข้อความ
- `email` - email address
- `firstName` - ชื่อจริง
- `lastName` - นามสกุล
- `date` - วันที่
- `timestamp` - timestamp
- `loremIpsum` - ข้อความ lorem ipsum

ตัวอย่าง:

```typescript
await seed(db, schema)
  .refine({
    users: {
      email: generators.email({ isUnique: true }),
      bio: generators.loremIpsum({ arraySize: 3 }),
    },
  });
```

### 8. Reset Database

ใช้ `reset()` utility เพื่อ truncate tables ก่อน seeding:

```typescript
import { reset } from 'drizzle-seed';

await reset(db, schema);
await seed(db, schema);
```

## Rules

- ใช้ seed value เดียวกันสำหรับ reproducible tests
- ใช้ refinements เพื่อ custom data generation
- ระบุ count สำหรับแต่ละ table
- ใช้ `with` property สำหรับ relationship multiplicity
- ใช้ `reset()` ก่อน seed สำหรับ clean state

## Expected Outcome

- Test data ที่ deterministic และ reproducible
- Data ที่ realistic และ match schema constraints
- Automatic handling ของ relationships
- Easy test data management
