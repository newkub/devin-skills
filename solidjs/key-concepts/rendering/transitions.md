---
title: Transitions
description: เรียนรู้เรื่อง Transitions สำหรับ concurrent rendering และ async updates
---

## สิ่งที่คือ Transitions

Transitions ช่วยจัดการ async updates โดย batch การอัปเดต DOM และแสดง fallback UI ระหว่างรอ

## การใช้งาน

```jsx
import { Transition } from "solid-js";

function App() {
  const [isPending, start] = useTransition();

  const handleClick = () => {
    start(() => {
      // Async operation
      fetchData();
    });
  };

  return (
    <button onClick={handleClick}>
      {isPending() ? "Loading..." : "Click"}
    </button>
  );
}
```

## useTransition Hook

```jsx
const [isPending, start] = useTransition();
```

- `isPending`: Signal ที่บอกว่า transition กำลังทำงานอยู่หรือไม่
- `start`: Function สำหรับเริ่ม transition

## การทำงาน

เมื่อเรียก `start()`:

1. Mark เป็น pending
2. แสดง UI ที่ pending
3. Execute async operations
4. Batch DOM updates
5. Clear pending state

## ใช้กับ Suspense

```jsx
<Transition>
  <Suspense fallback={<p>Loading...</p>}>
    <AsyncContent />
  </Suspense>
</Transition>
```

## ประโยชน์

- **Better UX**: แสดง loading states ที่ smooth
- **Performance**: Batch DOM updates
- **Concurrent Rendering**: ทำงานหลายอย่างพร้อมกัน

## ถัดไป

ดู [Hydration](./hydration.md) เพื่อเรียนรู้เรื่อง server-side rendering
