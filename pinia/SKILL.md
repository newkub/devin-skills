---
name: pinia
description: "แนวทางการพัฒนา Pinia ตาม best practices สำหรับ Vue 3 state management ที่มี type-safe, devtools..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Pinia สำหรับ Vue 3 state management ที่ type-safe, integrate กับ devtools, และรองรับทั้ง Options API และ Composition API


## Scope

ใช้สำหรับ state management ใน Vue 3 applications ด้วย Pinia


## Execute

- ติดตั้ง Pinia ด้วย `bun add pinia`
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `key-concepts/` สำหรับแนวคิดเฉพาะทาง
- อ่าน `guide/configuration.md` สำหรับการตั้งค่า
- อ่าน `references/configuration.md` สำหรับ configuration reference
- ตั้งค่า Pinia และ stores
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- ใช้ Options Store หรือ Setup Store
- อ่าน `guide/best-practices.md` สำหรับ best practices
- ใช้ state, getters, actions อย่างเหมาะสม
- ใช้ plugins สำหรับ extend functionality
- อ่าน `guide/integration.md` สำหรับ Vue integration
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป
- อ่าน `references/api.md` สำหรับ API reference


## Rules

- ใช้ `bun add pinia` สำหรับ installation
- ใช้ `createPinia()` สำหรับ setup
- ใช้ Vue 3 เสมอ
- ใช้ backticks สำหรับ `defineStore()`, `useStore()`, commands
- ใช้ code blocks สำหรับ store examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture
- ใช้ TypeScript สำหรับ type-safe stores
- ใช้ `storeToRefs()` สำหรับ maintain reactivity
- ใช้ proper typing สำหรับ state, getters, actions
- ใช้ computed getters สำหรับ derived state
- หลีกเลี่ยง unnecessary reactivity
- ใช้ plugins อย่างเหมาะสม


## Expected Outcome

- State management ที่ type-safe และ maintainable
- Stores ที่ well-organized และ scalable
- Integration ที่ smooth กับ Vue 3 ecosystem
- Devtools integration ที่ seamless
