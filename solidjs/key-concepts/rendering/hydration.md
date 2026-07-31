---
title: Hydration
description: เรียนรู้เรื่อง Hydration สำหรับ server-side rendering ใน SolidJS
---

## สิ่งที่คือ Hydration

Hydration คือกระบวนการที่ client-side SolidJS นำ HTML จาก server มา attach reactivity เพื่อให้ interactive

## การทำงาน

```
Server: Render HTML → Client: Hydrate → Interactive
```

1. **Server Render**: สร้าง HTML บน server
2. **Transfer**: ส่ง HTML ไปยัง client
3. **Hydrate**: Client นำ HTML มา attach reactive bindings
4. **Interactive**: UI พร้อมใช้งาน

## การใช้งาน

```jsx
import { hydrate } from "solid-js/web";

hydrate(() => <App />, document.getElementById("app"));
```

## Hydration vs Render

| Operation | Description |
|-----------|-------------|
| `render` | สร้าง DOM ใหม่ทั้งหมด (client-side only) |
| `hydrate` | นำ HTML ที่มีอยู่มา attach reactivity (SSR) |

## Shared Config

SolidJS ใช้ `sharedConfig` เพื่อส่งข้อมูลจาก server ไป client:

```jsx
import { ssrHydrate } from "solid-js/web";

ssrHydrate(() => <App />, document, {
  context: { /* server context */ }
});
```

## Hydration ID

แต่ละ element ได้รับ hydration ID เพื่อ matching:

```html
<!-- Server HTML -->
<div data-hk="0-0">Content</div>

<!-- Client matches by data-hk -->
```

## Issues ที่พบบ่อย

- **Mismatch**: Server HTML ไม่ตรงกับ client render
- **Missing Events**: Event listeners ไม่ถูก attach
- **Resource State**: Async data ไม่ sync ระหว่าง server/client

## ถัดไป

ดู [SSR Architecture](./ssr-architecture.md) เพื่อเรียนรู้เรื่อง server-side rendering อย่างละเอียด
