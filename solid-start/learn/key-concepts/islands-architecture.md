---
title: Islands Architecture
description: Islands Architecture ใน Solid Start สำหรับ selective client-side hydration ของ interactive components
---

## Islands Architecture คืออะไร

Islands Architecture เป็น pattern ที่ server-renders ส่วนใหญ่ของ page และ hydrate เฉพาะ interactive components ที่จำเป็นเท่านั้น โดย components ที่ไม่ interactive จะยังคงเป็น static HTML

## หลักการทำงาน

```
Server → Render HTML → Send to Client
          ↓
          Static HTML (ไม่ interactive)
          ↓
          Interactive Islands (hydrate เฉพาะส่วนนี้)
          ↓
          Client Interactivity
```

## การใช้งาน

ใช้ `clientOnly` function สำหรับ render components เฉพาะบน client:

```typescript
import { clientOnly } from "solid-start/client";

const Counter = clientOnly(() => import("./Counter"));

export default function Page() {
  return (
    <div>
      <h1>Static Content</h1>
      <Counter />
    </div>
  );
}
```

## การเปิดใช้งาน

ตั้งค่า environment variable `START_ISLANDS`:

```bash
START_ISLANDS=true bun run dev
```

หรือใน `app.config.ts`:

```typescript
export default defineConfig({
  islands: true,
});
```

## Benefits

- **Performance**: Server-render ส่วนใหญ่ ลด JavaScript bundle
- **SEO**: Static HTML ที่ดีสำหรับ search engines
- **Progressive Enhancement**: เริ่มด้วย static content แล้ว hydrate ตามลำดับ
- **Flexibility**: เลือก hydrate เฉพาะ components ที่ต้องการ interactivity

## Best Practices

- ใช้ islands สำหรับ components ที่ต้องการ interactivity เท่านั้น
- หลีกเลี่ยง islands สำหรับ content ที่ static
- ใช้ Suspense สำหรับ loading states ของ islands
- Minimize JavaScript bundle โดย lazy loading islands
