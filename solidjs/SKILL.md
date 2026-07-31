---
name: solidjs
description: "พัฒนา SolidJS applications ด้วย fine-grained reactivity และ no virtual DOM"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา reactive UI applications ด้วย SolidJS โดยใช้ fine-grained reactivity, compile-time optimization, และ no virtual DOM


## Scope

ใช้สำหรับพัฒนา web applications ด้วย SolidJS library รวมถึง component development, state management, และ performance optimization


## Execute

### 1. Setup Project

ติดตั้งและตั้งค่า SolidJS project

- ใช้ `bun add solid-js` สำหรับ installation
- ตั้งค่า `tsconfig.json` ด้วย `"jsx": "preserve"` และ `"jsxImportSource": "solid-js"`
- ใช้ `babel-preset-solid` สำหรับ JSX compilation

### 2. Develop Components

สร้าง components ด้วย SolidJS patterns

- ใช้ `createSignal()` สำหรับ reactive state
- ใช้ `createEffect()` สำหรับ side effects
- ใช้ `createMemo()` สำหรับ derived state
- ใช้ control flow components: `<For>`, `<Show>`, `<Index>`

### 3. Manage State

จัดการ state ด้วย reactive primitives

- ใช้ `createStore()` สำหรับ nested state
- ใช้ Context API สำหรับ global state
- ใช้ proper reactivity patterns เพื่อ avoid unnecessary re-renders

### 4. Optimize Performance

ปรับปรุง performance ด้วย SolidJS features

- ใช้ fine-grained reactivity เสมอ
- หลีกเลี่ยง virtual DOM overhead
- ใช้ compile-time optimization จาก JSX compilation


## Rules

### Reactivity Patterns

- ใช้ signals สำหรับ state management
- Component functions execute once ที่ initialization
- Updates เกิดผ่าน reactive system ไม่ใช่ re-renders
- ใช้ `createMemo()` สำหรับ expensive computations
- ใช้ `createEffect()` สำหรับ side effects ที่ต้อง tracking

### Component Design

- Components เป็น regular JavaScript functions
- ใช้ JSX สำหรับ declarative UI
- ใช้ fragments, Context, Portals ตามต้องการ
- ใช้ Suspense สำหรับ async components
- ใช้ Error Boundaries สำหรับ error handling

### Performance Best Practices

- ใช้ `<For>` สำหรับ keyed list rendering
- ใช้ `<Index>` สำหรับ index-based lists
- ใช้ `<Show>` สำหรับ conditional rendering
- หลีกเลี่ยง inline functions ใน JSX
- ใช้ `onMount` และ `onCleanup` สำหรับ lifecycle

### TypeScript Integration

- ตั้งค่า `jsxImportSource` ใน tsconfig.json
- ใช้ type annotations สำหรับ signals
- ใช้ generic types สำหรับ components
- ใช้ proper typing สำหรับ props

### File Organization

- ใช้ `kebab-case` สำหรับ file names
- จัดโครงสร้างตาม features หรือ modules
- แยก components, hooks, utilities ออกจากกัน
- แต่ละไฟล์ต้องไม่เกิน 250 บรรทัด


## Expected Outcome

- Reactive applications ที่ performant ด้วย fine-grained updates
- Code ที่ maintainable ด้วย clear reactivity patterns
- Performance ที่ optimized ด้วย no virtual DOM
- Integration ที่ smooth กับ TypeScript และ ecosystem
