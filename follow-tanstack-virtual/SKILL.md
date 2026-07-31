---
name: follow-tanstack-virtual
description: ตั้งค่า TanStack Virtual สำหรับ virtualized lists และ grids
---

## Goal

ตั้งค่า TanStack Virtual สำหรับ headless virtualization ของ large lists และ grids

## Scope

ใช้สำหรับ TanStack Virtual ใน React, Solid, Vue, Svelte projects ที่ต้องการ render large datasets

## Execute

### 1. Setup And Virtualizer

1. ติดตั้งด้วย `bun add @tanstack/[framework]-virtual`
2. สร้าง virtualizer ด้วย `useVirtualizer` (React) หรือ `createVirtualizer` (other frameworks)
3. กำหนด `count`, `estimateSize`, และ `getScrollElement`

### 2. Rendering

1. ใช้ `virtualizer.getVirtualItems()` สำหรับ render visible items
2. ใช้ `virtualizer.getTotalSize()` สำหรับ container height
3. ใช้ `transform: translateY()` สำหรับ item positioning
4. รองรับ dynamic item sizes ด้วย `measureElement`

### 3. Advanced Features

1. ใช้ `overscan` สำหรับ render items นอก visible area
2. ใช้ `lanes` สำหรับ multi-column virtualization
3. ใช้ `rangeExtractor` สำหรับ custom visible range
4. ใช้ `scrollToIndex` และ `scrollToOffset` สำหรับ programmatic scrolling

## Rules

### 1. Virtualization Best Practices

- ใช้สำหรับ lists >1000 items
- กำหนด `estimateSize` ใกล้เคียง actual size เพื่อลด layout shift
- ใช้ `overscan` อย่างเหมาะสม (default 1-2)
- ใช้ dynamic measurement เฉพาะเมื่อจำเป็น
- หลีกเลี่ยง heavy computation ใน render loop

## Expected Outcome

- TanStack Virtual ติดตั้งพร้อม headless virtualization
- Large lists render ได้โดยไม่กระทบ performance
- Dynamic item sizes รองรับ variable height content
- Programmatic scrolling สำหรับ navigation
