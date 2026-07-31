---
title: Reactivity System
description: ระบบ reactivity ของ SolidJS
---

## Reactivity System

ระบบ reactivity เป็นหัวใจของ SolidJS ที่ทำให้การอัปเดต UI เป็นไปอย่างมีประสิทธิภาพ

## Topics

### [Signals](./signals.md)
- สร้าง reactive state ด้วย getter/setter pattern
- การอ่านและอัปเดตค่า
- Derived signals
- Signals ใน JSX

### [Reactivity](./reactivity.md)
- Fine-grained reactivity
- Dependency tracking
- Reactive graph
- Update propagation
- Batch updates

### [Memos](./memos.md)
- Derived state ที่ cache ไว้
- การใช้ createMemo
- Performance optimization
- Memoization patterns

### [Effects](./effects.md)
- Side effects ด้วย createEffect
- Lifecycle management
- Cleanup functions
- Dependency tracking

### [Observable Integration](./observable-integration.md)
- การเชื่อมต่อกับ Observables
- RxJS integration
- Custom observables
- Async patterns

## Learning Path

1. เริ่มจาก [Signals](./signals.md) เพื่อเข้าใจพื้นฐาน
2. ศึกษา [Reactivity](./reactivity.md) เพื่อเข้าใจระบบทั้งหมด
3. ใช้ [Memos](./memos.md) สำหรับ derived state
4. ใช้ [Effects](./effects.md) สำหรับ side effects
5. เชื่อมต่อกับ [Observables](./observable-integration.md) สำหรับ advanced use cases
