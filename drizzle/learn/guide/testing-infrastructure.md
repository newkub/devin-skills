---
title: Testing Infrastructure
description: ใช้ Testing Infrastructure สำหรับ test Drizzle ORM ด้วย integration tests
---

## Goal

ใช้ testing infrastructure สำหรับ test Drizzle ORM ด้วย integration tests

## Scope

ใช้สำหรับ integration tests กับ real database instances

## Execute

### 1. Test Database Setup

ใช้ test database แยกจาก development/production:

```typescript
// test/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.TEST_DATABASE_URL!);
export const testDb = drizzle(client);
```

### 2. Test Setup with Vitest

ตั้งค่า Vitest:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
  },
});
```

### 3. Test Setup File

สร้าง setup file สำหรับ database cleanup:

```typescript
// test/setup.ts
import { migrate } from 'drizzle-kit/postgres/migrate';
import { testDb } from './db';

beforeAll(async () => {
  // Run migrations
  await migrate(testDb, { migrationsFolder: './drizzle' });
});

afterEach(async () => {
  // Clean up database after each test
  await testDb.execute(sql`TRUNCATE TABLE users, posts CASCADE`);
});

afterAll(async () => {
  // Close connection
  await testDb.$client.end();
});
```

### 4. Writing Integration Tests

เขียน integration tests:

```typescript
// test/users.test.ts
import { describe, it, expect } from 'vitest';
import { eq } from 'drizzle-orm';
import { users } from '../src/db/schema';
import { testDb } from './db';

describe('Users', () => {
  it('should create a user', async () => {
    const [user] = await testDb
      .insert(users)
      .values({ name: 'John', email: 'john@example.com' })
      .returning();

    expect(user).toBeDefined();
    expect(user.name).toBe('John');
  });

  it('should query users', async () => {
    const result = await testDb
      .select()
      .from(users)
      .where(eq(users.email, 'john@example.com'));

    expect(result).toHaveLength(1);
  });
});
```

### 5. Testing with Docker

ใช้ Docker สำหรับ test database:

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"
```

### 6. Test Transactions

ใช้ transactions สำหรับ isolated tests:

```typescript
it('should rollback on error', async () => {
  await testDb.transaction(async (tx) => {
    await tx.insert(users).values({ name: 'John' });
    throw new Error('Rollback');
  });

  const result = await testDb.select().from(users);
  expect(result).toHaveLength(0);
});
```

### 7. Mocking Database

Mock database สำหรับ unit tests:

```typescript
import { vi } from 'vitest';
import { users } from '../src/db/schema';

vi.mock('../src/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  },
}));
```

## Rules

- ใช้ test database แยกจาก production
- Clean up database หลังแต่ละ test
- ใช้ transactions สำหรับ isolated tests
- ใช้ Docker สำหรับ consistent test environments
- Test both happy paths และ error cases

## Expected Outcome

- Reliable integration tests
- Consistent test environments
- Fast test execution
- Isolated test cases
