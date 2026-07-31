---
title: Architecture
description: โครงสร้าง architecture ของ SolidJS
---

## Core Architecture

SolidJS ประกอบด้วย 3 ส่วนหลัก:

```
┌─────────────────────────────────────────────────────────┐
│                    Build Time Layer                    │
├─────────────────────────────────────────────────────────┤
│  JSX Source ──► babel-preset-solid ──► Compiled JS   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Runtime Layer                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │ Reactive System │──│  Store System   │           │
│  └─────────────────┘  └─────────────────┘           │
│         │                  │                           │
│         └──────────────────┼──────────────────┐        │
│                            ▼                   │        │
│                    ┌───────────────┐          │        │
│                    │Resource System│          │        │
│                    └───────────────┘          │        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Rendering Layer                       │
├─────────────────────────────────────────────────────────┤
│  Component System ──► Control Flow ──► solid-js/web   │
└─────────────────────────────────────────────────────────┘
```

## Build Time Layer

### JSX Compilation

`babel-preset-solid` แปลง JSX เป็น:

- Static templates
- Reactive bindings
- DOM operations

### Template Extraction

Static HTML ถูก extract:

```jsx
// Source
<div><h1>Hello</h1></div>

// Compiled
const _tmpl$ = _$template(`<div><h1>Hello</h1></div>`);
```

## Runtime Layer

### Reactive System

ประกอบด้วย:

- `createSignal` - Reactive state
- `createEffect` - Side effects
- `createMemo` - Derived state
- `createResource` - Async state

### Dependency Graph

SolidJS สร้าง graph ของ dependencies:

```
    Signal
      │
      ├──► Memo ──► Effect
      │
      └─────────┘
```

## Rendering Layer

### Component System

Components คือ functions ที่ทำงานครั้งเดียว ด้วย render-once mental model

**ดูรายละเอียดใน:** [Components](../../key-concepts/components/index.md)

### Control Flow

- `Show` - Conditional rendering
- `For` - List rendering  
- `Switch` - Multiple conditions
- `Suspense` - Async loading
- `ErrorBoundary` - Error handling

**ดูรายละเอียดใน:** [Rendering](../../key-concepts/rendering/index.md)

## Package Structure

```
solid-js/
├── solid-js (core)
├── solid-js/web (DOM rendering)
├── solid-js/store (state management)
├── solid-js/h (HyperScript)
├── solid-js/html (Tagged templates)
└── babel-preset-solid (compiler)
```

## ถัดไป

ดู [Structure](./structure.md) เพื่อเรียนรู้เรื่องโครงสร้าง project
