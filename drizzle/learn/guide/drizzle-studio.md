---
title: Drizzle Studio
description: ใช้ Drizzle Studio สำหรับ GUI database management
---

## Goal

ใช้ Drizzle Studio สำหรับจัดการ database ผ่าน GUI

## Scope

ใช้สำหรับ visualize และ manage database ผ่าน web interface

## Execute

### 1. Start Drizzle Studio

ใช้ drizzle-kit command:

```bash
bunx drizzle-kit studio
```

หรือ:

```bash
bun drizzle-kit studio
```

### 2. Configuration

ตั้งค่าใน `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 3. Features

Drizzle Studio มี features:

- **Table Browser** - เรียกดู tables และ data
- **Query Editor** - เขียนและ execute SQL queries
- **Schema Inspector** - ดู schema definitions
- **Data Editor** - edit, insert, delete data
- **Relationship Viewer** - ดู foreign key relationships

### 4. Access

Studio จะเปิดที่ `http://localhost:4983` โดย default

## Rules

- ต้องมี drizzle.config.ts ที่ configure แล้ว
- ใช้สำหรับ development และ testing เท่านั้น
- ไม่ควรใช้ใน production

## Expected Outcome

- GUI database management
- Easy data visualization
- Quick query testing
