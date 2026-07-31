---
title: Features
description: ภาพรวม features หลักของ SolidJS
---

## Features หลักของ SolidJS

SolidJS มี features ที่ทำให้แตกต่างจาก frameworks อื่น:

### Fine-Grained Reactivity
- อัปเดตเฉพาะส่วนที่เปลี่ยนจริงๆ
- ไม่มี component re-rendering
- Performance ดีกว่า Virtual DOM

### No Virtual DOM
- Direct DOM operations
- ไม่มี diffing หรือ reconciliation
- ลด overhead ของ runtime

### Compile-Time Optimizations
- Static template extraction
- Minimal reactive wrappers
- Event delegation
- Bundle size เล็ก

### Render-Once Components
- Components ทำงานเพียงครั้งเดียว
- Setup code ทำงานครั้งเดียว
- Predictable lifecycle

### Reactive Primitives
- Signals - reactive state
- Effects - side effects
- Memos - derived state
- Resources - async state

### Control Flow Components
- Show - conditional rendering
- For - list rendering
- Switch - multiple conditions
- Suspense - async boundaries
- ErrorBoundary - error handling

### State Management
- Context API - shared state
- Store System - complex state
- Fine-grained updates

### Ecosystem
- SolidStart - full-stack framework
- TypeScript support
- Testing tools
- Developer tools

## ถัดไป

ดู [Architecture](./architecture.md) เพื่อเรียนรู้ architecture และ [How It Works](./how-it-works.md) เพื่อเข้าใจวิธีการทำงาน
