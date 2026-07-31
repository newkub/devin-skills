---
name: drizzle
description: "แนวทางการพัฒนา Drizzle ORM ตาม best practices สำหรับ TypeScript database ORM ที่มี type safety,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Drizzle ORM สำหรับ TypeScript database operations ด้วย type safety และ SQL-like API


## Scope

ใช้สำหรับ database operations ด้วย Drizzle ORM บน PostgreSQL, MySQL, และ SQLite


## Execute

- ติดตั้ง Drizzle ORM ด้วย `bun add drizzle-orm`
- ติดตั้ง Drizzle Kit ด้วย `bun add -D drizzle-kit`
- ติดตั้ง database driver ตามที่ต้องการ
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `key-concepts/schema-definition.md` สำหรับ schema definitions
- อ่าน `key-concepts/query-builder.md` สำหรับ query builder
- อ่าน `key-concepts/migrations.md` สำหรับ migrations
- อ่าน `key-concepts/relations.md` สำหรับ relations
- อ่าน `guide/configuration.md` สำหรับ drizzle.config.ts setup
- อ่าน `references/configuration.md` สำหรับ configuration reference
- ตั้งค่า database credentials และ environment
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- ใช้ schema definitions ตาม best practices
- อ่าน `references/cli.md` สำหรับ Drizzle Kit CLI
- ใช้ `drizzle-kit generate` สำหรับ generate migrations
- ใช้ `drizzle-kit push` สำหรับ push schema changes
- อ่าน `references/api.md` สำหรับ API documentation
- อ่าน `guide/best-practices.md` สำหรับ best practices
- ใช้ query builder สำหรับ database operations
- อ่าน `guide/integration.md` สำหรับ framework integration
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป
- อ่าน `principles/type-safety.md` สำหรับ type safety
- อ่าน `principles/sql-like-syntax.md` สำหรับ SQL-like syntax
- อ่าน `guide/drizzle-seed.md` สำหรับ test data generation
- อ่าน `guide/schema-validation.md` สำหรับ schema validation ด้วย Zod/Valibot/TypeBox/ArkType
- อ่าน `guide/drizzle-studio.md` สำหรับ GUI database management
- อ่าน `guide/advanced-sql.md` สำหรับ CTE, set operators, aggregate functions
- อ่าน `guide/serverless-edge.md` สำหรับ serverless และ edge runtime support
- อ่าน `guide/eslint-plugin.md` สำหรับ ESLint plugin และ lint rules
- อ่าน `guide/query-caching.md` สำหรับ query caching
- อ่าน `guide/read-replicas.md` สำหรับ read replicas
- อ่าน `guide/database-specific-features.md` สำหรับ database-specific features
- อ่าน `guide/testing-infrastructure.md` สำหรับ testing infrastructure


## Rules

- ใช้ `bun add drizzle-orm` สำหรับ core library
- ใช้ `bun add -D drizzle-kit` สำหรับ dev tools
- ติดตั้ง database driver ตามที่ต้องการ
- ใช้ backticks สำหรับ `db.select()`, `db.insert()`, commands
- ใช้ code blocks สำหรับ schema examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture
- ใช้ TypeScript types จาก schema definitions เสมอ
- หลีกเลี่ยง type assertions ที่ไม่จำเป็น
- ใช้ Zod integration สำหรับ validation
- ใช้ indexes สำหรับ frequently queried columns
- ใช้ transactions สำหรับ multiple operations
- หลีกเลี่ยง N+1 queries ด้วย proper relations


## Expected Outcome

- Database operations ที่ type-safe
- Schema definitions ที่ maintainable
- Migrations ที่ version-controlled
- Query performance ที่ optimized
