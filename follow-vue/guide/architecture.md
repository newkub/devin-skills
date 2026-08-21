# Architecture

## โครงสร้าง Vue.js

Vue.js เป็น progressive framework ที่ออกแบบมาให้ adoptable และ incrementally adoptable ได้

## Core Architecture

```
┌─────────────────────────────────────────────────┐
│                  Application                     │
├─────────────────────────────────────────────────┤
│  Component System                               │
│  ├─ Single File Components (.vue)               │
│  ├─ Props & Events                              │
│  ├─ Slots                                       │
│  └─ Provide/Inject                              │
├─────────────────────────────────────────────────┤
│  Reactivity System                              │
│  ├─ Reactive State (ref, reactive)              │
│  ├─ Computed Properties                         │
│  ├─ Watchers                                    │
│  └─ Effect Scope                                │
├─────────────────────────────────────────────────┤
│  Composition API                                │
│  ├─ Lifecycle Hooks                             │
│  ├─ Composables                                 │
│  └─ Dependency Injection                        │
├─────────────────────────────────────────────────┤
│  Runtime                                        │
│  ├─ Virtual DOM                                 │
│  ├─ Template Compiler                           │
│  └─ Renderer                                    │
└─────────────────────────────────────────────────┘
```

## Component Lifecycle

```
┌──────────┐
│  Create  │
└────┬─────┘
     │
     ├─ beforeCreate()
     ├─ created()
     │
┌────▼─────┐
│  Mount   │
└────┬─────┘
     │
     ├─ beforeMount()
     ├─ mounted()
     │
┌────▼─────┐
│  Update  │
└────┬─────┘
     │
     ├─ beforeUpdate()
     ├─ updated()
     │
┌────▼─────┐
│ Unmount  │
└────┬─────┘
     │
     ├─ beforeUnmount()
     └─ unmounted()
```

## Reactivity Flow

```
┌─────────────┐
│   State     │ (ref, reactive)
└──────┬──────┘
       │
       ├─ Track Dependencies
       │
┌──────▼──────┐
│  Computed   │ (computed)
└──────┬──────┘
       │
       ├─ Watch Effects
       │
┌──────▼──────┐
│   Effect    │ (watch, watchEffect)
└──────┬──────┘
       │
       └─ DOM Update
```

## Key Architectural Principles

- **Declarative Rendering**: ใช้ template syntax ที่อ่านง่าย
- **Component-Based**: แบ่ง UI เป็น reusable components
- **Reactive Data Binding**: สถานะและ UI อัปเดตอัตโนมัติ
- **Composition API**: เขียน logic แบบ composable และ reusable
- **Virtual DOM**: ประสิทธิภาพการ render สูง
