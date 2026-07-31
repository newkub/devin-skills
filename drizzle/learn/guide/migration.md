# Migration

## Migrating from Prisma

### Key Differences

- **Schema Definition** - Drizzle ใช้ TypeScript สำหรับ schema
- **Query Builder** - Drizzle ใช้ query builder pattern
- **Type Safety** - Drizzle มี type safety แบบ compile-time

### Migration Steps

1. Convert Prisma schema ไปเป็น Drizzle schema
2. Convert Prisma queries ไปเป็น Drizzle queries
3. Update configuration
4. Test migration

## Migrating from TypeORM

- **Entity to Schema** - convert entities ไปเป็น schema
- **Repository to Query** - convert repositories ไปเป็น queries
- **TypeScript Support** - Drizzle มี TypeScript support ดีกว่า
