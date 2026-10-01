# drizzle-kit Best Practices

แนวทางใช้ `drizzle-kit` จัดการ schema migrations อย่างปลอดภัย — generate, migrate, push, studio

## Recommended Patterns

### 1. Workflow ที่ถูกต้อง: dev ใช้ push, production ใช้ migrate

```bash
# local dev — iterate เร็ว ไม่ต้องสร้าง migration file
drizzle-kit push

# เมื่อ schema พร้อม ship — สร้าง migration file จริง
drizzle-kit generate --name add_users_table

# apply บน staging/production
drizzle-kit migrate
```

เหตุผล: `push` แก้ DB โดยตรงจาก schema diff โดยไม่มี audit trail — เหมาะกับ dev throwaway database เท่านั้น ส่วน `migrate` apply SQL files ที่ commit ไว้ ทำให้ deploy reproducible และ rollback ได้

### 2. Review generated SQL ทุกครั้ง

`drizzle-kit generate` ใช้ snapshot diffing — rename detection ไม่สมบูรณ์:

- rename column อาจ generate เป็น `DROP COLUMN` + `ADD COLUMN` → data loss
- rename table อาจ generate เป็น `DROP TABLE` + `CREATE TABLE` → data loss ทั้งตาราง

ถ้าเจอ pattern นี้ ให้แก้ SQL ใน migration file เป็น `ALTER TABLE ... RENAME COLUMN ...` เองก่อน apply (ถ้ายังไม่เคย migrate)

### 3. Commit migrations เข้า git เสมอ

```
drizzle/
├── 0000_init.sql
├── 0001_add_users_table.sql
└── meta/
    ├── _journal.json
    └── snapshots/
```

ทั้ง SQL files และ `meta/` snapshots ต้องอยู่ใน version control — snapshots คือสิ่งที่ `generate` ใช้ diff ครั้งถัดไป ถ้าหายจะ generate migration ผิด

### 4. Custom migrations สำหรับ data changes

`generate` เห็นเฉพาะ schema diff — ไม่เห็น data migration เช่น backfill, seed, หรือ reindex ให้ใช้:

```bash
drizzle-kit generate --custom --name backfill_user_roles
```

จะได้ empty migration file มาเขียน SQL เอง และ journal ยัง track ถูกต้อง

### 5. drizzle.config.ts ที่ดี

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
})
```

- ใช้ `strict: true` ให้ interactive prompts ยืนยัน destructive changes (push)
- `dbCredentials` อ่านจาก env var — ห้าม hard-code connection string
- หลาย environments → หลาย config files แล้วเลือกด้วย `--config`

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `migrate` ใน CI/CD และ production | ใช้ `push` กับ production DB |
| review SQL diff ทุก migration ก่อน commit | trust generated SQL โดยไม่อ่าน |
| สร้าง migration ใหม่เมื่อต้องแก้ | แก้ migration file ที่ applied แล้ว |
| ใช้ `--name` ตั้งชื่อ migration ให้อ่านรู้เรื่อง | ปล่อยชื่อ auto-generated ยาวๆ ไม่มีความหมาย |
| backup DB ก่อน migrate production | migrate production โดยไม่มี rollback plan |
| ใช้ `drizzle-kit check` ตรวจ collisions ก่อน merge PR | merge branch ที่แก้ schema โดยไม่เช็ค migration conflict |

## Common Pitfalls

- Migration drift: แก้ `drizzle/` SQL ด้วยมือแล้ว snapshot ไม่ตรง — generate ครั้งถัดไปจะพังหรือ diff ผิด ให้แก้เฉพาะ migration ที่ยังไม่ applied เท่านั้น
- Two developers generate พร้อมกัน: journal sequence ชนกัน → ใช้ `drizzle-kit check` จับ collision แล้ว re-generate ใหม่
- `push` บน DB ที่มี data จริง: destructive diff (drop/rename) อาจลบข้อมูล — `strict: true` ช่วยเตือนแต่ไม่ควรใช้กับข้อมูลที่ห้ามหาย
- ลืม commit `meta/` snapshots: ทำให้คนอื่น generate ได้ migration ที่ diff จาก snapshot เก่า → ผิดเพี้ยน

## Performance / CI Notes

- ใน CI: รัน `drizzle-kit check` (fast, no DB needed) ใน lint job เพื่อจับ migration collisions ก่อน merge
- `migrate` ใน deploy step ต้องต่อ DB จริง — inject `DATABASE_URL` ผ่าน secrets เท่านั้น
- `drizzle-kit export` แปลง schema เป็น DDL โดยไม่ต้องมี DB — ใช้ตรวจ schema output ใน CI ได้
- `drizzle-kit pull` มีประโยชน์ตอน adopt drizzle กับ existing DB — introspect แล้วได้ schema.ts พร้อมใช้ แต่ควร cleanup ก่อน commit (naming, relations)
- `drizzle-kit studio` เปิด local UI สำหรับ browse data — อย่าเปิดบน production credentials ที่ share กัน
