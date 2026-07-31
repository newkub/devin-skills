# Configuration

## Purpose

อธิบายการตั้งค่า `drizzle.config.ts` สำหรับ Drizzle Kit อย่างละเอียด

## Scope

- Config File Structure
- Dialect Options
- Database Credentials
- Advanced Settings

## Config File

สร้างไฟล์ `drizzle.config.ts` ที่ root ของโปรเจกต์:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

| Option | Type | Required | ค่าเริ่มต้น | คำอธิบาย |
|--------|------|----------|------------|----------|
| `schema` | `string` | ใช่ | - | Path ไปยัง schema files directory |
| `out` | `string` | ใช่ | `./drizzle` | Path สำหรับ migration output |
| `dialect` | `string` | ใช่ | - | Database dialect ที่ใช้ |
| `dbCredentials` | `object` | ใช่ | - | ข้อมูลเชื่อมต่อ database |
| `verbose` | `boolean` | ไม่ | `false` | แสดง log รายละเอียด |
| `strict` | `boolean` | ไม่ | `false` | Strict mode |
| `breakpoints` | `boolean` | ไม่ | `true` | เปิด breakpoints ใน SQL |
| `migrationsTable` | `string` | ไม่ | `__drizzle_migrations` | ชื่อตารางเก็บ migration history |

## Dialect Options

Drizzle ORM รองรับ 3 dialects หลัก:

| Dialect | ค่า | Databases |
|---------|-----|-----------|
| **PostgreSQL** | `'postgresql'` | PostgreSQL, Neon, Supabase, Vercel Postgres |
| **MySQL** | `'mysql'` | MySQL, PlanetScale, TiDB |
| **SQLite** | `'sqlite'` | SQLite, Turso, Cloudflare D1 |

## Database Credentials

### PostgreSQL

```typescript
// ใช้ connection URL
dbCredentials: {
  url: process.env.DATABASE_URL!,
}

// หรือกำหนดแยก
dbCredentials: {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'secret',
  database: 'mydb',
  ssl: false,
}
```

### MySQL

```typescript
// ใช้ connection URL
dbCredentials: {
  url: process.env.DATABASE_URL!,
}

// หรือกำหนดแยก
dbCredentials: {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'secret',
  database: 'mydb',
}
```

### SQLite

```typescript
dbCredentials: {
  url: './sqlite.db',
}
```

### Credentials Summary

| Parameter | PostgreSQL | MySQL | SQLite |
|-----------|-----------|-------|--------|
| `url` | ใช่ | ใช่ | ใช่ (file path) |
| `host` | ใช่ | ใช่ | - |
| `port` | ใช่ (5432) | ใช่ (3306) | - |
| `user` | ใช่ | ใช่ | - |
| `password` | ใช่ | ใช่ | - |
| `database` | ใช่ | ใช่ | - |
| `ssl` | optional | optional | - |

## Advanced Settings

### SSL Configuration

```typescript
dbCredentials: {
  url: process.env.DATABASE_URL!,
  ssl: 'require',          // 'disable' | 'require' | 'prefer' | object
}
```

### Multiple Schema Files

```typescript
export default defineConfig({
  schema: './src/db/schema/*.ts',   // glob pattern
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Custom Migrations Table

```typescript
export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrationsTable: 'my_migrations',
  breakpoints: true,
  verbose: true,
})
```

## Environment Variables

ใช้ `.env` file เก็บ credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

```typescript
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Summary

| การตั้งค่า | ค่าแนะนำ |
|------------|----------|
| **Dialect** | เลือกตาม database ที่ใช้ |
| **Schema** | `./src/db/schema` |
| **Out** | `./src/db/migrations` |
| **Credentials** | ใช้ `.env` + `process.env.DATABASE_URL` |
| **SSL** | `require` สำหรับ production |
