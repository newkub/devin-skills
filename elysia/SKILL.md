---
name: elysia
description: "แนวทางการพัฒนา Elysia ตาม best practices สำหรับ ergonomic web framework สำหรับ Bun ที่มี..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Elysia สร้าง web applications ด้วย Bun runtime ที่มี type-safe, high performance, และ ergonomic API


## Scope

ใช้สำหรับสร้าง web applications, APIs, และ microservices ด้วย Elysia framework บน Bun runtime


## Execute

- ติดตั้ง Elysia ด้วย `bun add elysia`
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `key-concepts/routing.md` สำหรับ routing system
- อ่าน `key-concepts/plugins.md` สำหรับ plugin system
- อ่าน `key-concepts/lifecycle.md` สำหรับ request lifecycle
- อ่าน `key-concepts/validation.md` สำหรับ validation
- อ่าน `key-concepts/type-safety.md` สำหรับ type safety
- อ่าน `guide/configuration.md` สำหรับ server options
- อ่าน `references/configuration.md` สำหรับ configuration reference
- ตั้งค่า context extension และ plugins
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- อ่าน `principles/ergonomic-design.md` สำหรับ ergonomic design
- อ่าน `workflows/create-plugin.md` สำหรับสร้าง custom plugin
- ใช้ plugin system สำหรับ reusable logic
- อ่าน `principles/performance-first.md` สำหรับ performance first
- อ่าน `guide/performance.md` สำหรับ performance optimization
- อ่าน `guide/best-practices.md` สำหรับ best practices
- อ่าน `guide/integration.md` สำหรับ service integration
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `workflows/deploy-elysia.md` สำหรับ deployment
- อ่าน `guide/security.md` สำหรับ security considerations
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป


## Rules

- ใช้ `bun add elysia` สำหรับ installation
- ใช้ `bun add @elysiajs/*` สำหรับ official plugins
- ใช้ Bun runtime เสมอ
- ใช้ backticks สำหรับ `Elysia`, `.get()`, `.post()`, commands
- ใช้ code blocks สำหรับ server examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture
- ใช้ TypeScript types จาก Elysia เสมอ
- ใช้ TypeBox schemas สำหรับ validation
- ใช้ Eden Treaty สำหรับ type-safe client
- ใช้ Trie tree routing สำหรับ fast routing
- ใช้ lifecycle hooks อย่างเหมาะสม
- หลีกเลี่ยง unnecessary middleware


## Expected Outcome

- Web applications ที่ type-safe และ performant
- Code ที่ ergonomic และ maintainable
- Plugin system ที่ flexible และ reusable
- Integration ที่ smooth กับ Bun ecosystem
