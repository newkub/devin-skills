## Inputs

| Input | Details |
|-------|-----------|
| Package Manager | Bun |
| Database | PostgreSQL, MySQL, SQLite |
| Runtime | Node.js, Bun, Edge |

## Structure

### Directory Structure

```text
project/
├── drizzle.config.ts     # Drizzle config
├── src/
│   └── db/
│       ├── schema.ts     # Table definitions (หรือ schema/*.ts)
│       ├── migrations/   # Migration files
│       └── index.ts      # Database client
└── package.json
```

### Phase Definitions

| Phase | Description | Main Activities |
|-------|-------------|---------------|
| Setup | ติดตั้ง | Add packages ตาม runtime |
| Configure | กำหนดค่า | Config file ด้วย driver ที่ถูกต้อง |
| Schema | ออกแบบ | Define tables ด้วย column types ที่ถูกต้อง |
| Migrations | สร้าง | Generate & run ตาม strategy |
| Query | ใช้งาน | CRUD operations แบบ type-safe |

## Best Practices

### 1. Driver Selection
- ใช้ driver ที่เหมาะสมกับ runtime
- Bun runtime: ใช้ `bun:sqlite` (native support)
- Node.js: ใช้ `better-sqlite3` (synchronous, faster)

### 2. Migration Strategy
- Development: ใช้ `drizzle-kit push` สำหรับความเร็ว
- Production: ใช้ `drizzle-kit generate` + `drizzle-kit migrate` สำหรับความปลอดภัย
- Teams: ใช้ migration files เพื่อ version control

### 3. Schema Organization
- ใช้ single file สำหรับโปรเจกต์เล็ก
- ใช้ glob patterns สำหรับโปรเจกต์ใหญ่: `./src/db/**/*.ts`
- แยก schema ตาม feature หรือ domain

### 4. Performance Optimization
- ใช้ WAL mode สำหรับ SQLite: `PRAGMA journal_mode = WAL`
- สร้าง indexes สำหรับ columns ที่ query บ่อย
- ใช้ `inferSelect` และ `inferInsert` สำหรับ type safety

### 5. Type Safety
- ใช้ `$inferSelect` สำหรับ types ของ database records
- ใช้ `$inferInsert` สำหรับ types สำหรับ insert/update
- ใช้ Drizzle Query API แทน raw SQL เมื่อเป็นไปได้

## Outputs

| Output | Details |
|--------|-----------|
| drizzle.config.ts | ORM configuration ด้วย driver ที่ถูกต้อง |
| src/db/schema.ts | Table definitions หรือ schema/*.ts |
| src/db/index.ts | Database client ด้วย driver ที่เหมาะสม |
| migrations/ | Migration files (หรือ push สำหรับ dev) |

## Reference

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [SQLite Column Types](https://orm.drizzle.team/docs/column-types/sqlite)
- [Migration Fundamentals](https://orm.drizzle.team/docs/migrations)
- [Database Connection](https://orm.drizzle.team/docs/connect-overview)
- `/validate` - ตรวจสอบความถูกต้องก่อนเริ่ม
- `connect-workflows` - เชื่อมโยง workflows
