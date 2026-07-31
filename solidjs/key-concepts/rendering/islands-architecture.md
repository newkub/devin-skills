---
title: Islands Architecture
description: เรียนรู้เรื่อง Islands Architecture สำหรับ selective hydration
---

## สิ่งที่คือ Islands Architecture

Islands Architecture คือ pattern ที่ server-render ส่วนใหญ่ของ page และ hydrate เฉพาะ interactive components ("islands")

## การทำงาน

```
┌─────────────────────────────────────────┐
│         Server Rendered HTML           │
├─────────────────────────────────────────┤
│  Static Content (No Hydration)         │
│  ┌─────────────────────────────────┐  │
│  │  Island 1 (Interactive)         │  │
│  │  - Hydrated on client           │  │
│  └─────────────────────────────────┘  │
│  Static Content (No Hydration)         │
│  ┌─────────────────────────────────┐  │
│  │  Island 2 (Interactive)         │  │
│  │  - Hydrated on client           │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## การใช้งาน (SolidStart)

```jsx
import { clientOnly } from "@solidjs/start/client";

function InteractiveComponent() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}

function Page() {
  return (
    <div>
      <h1>Static Content</h1>
      <clientOnly fallback={<p>Loading...</p>}>
        <InteractiveComponent />
      </clientOnly>
      <p>More Static Content</p>
    </div>
  );
}
```

## clientOnly Directive

`clientOnly` บอกให้ hydrate เฉพาะ component นั้น:

```jsx
<clientOnly>
  <InteractiveChart />
</clientOnly>
```

## Islands vs Full Hydration

| Approach | Hydration | Performance | Use Case |
|----------|-----------|--------------|----------|
| Full Hydration | Entire page | Slower | Highly interactive apps |
| Islands | Selective components | Faster | Content-heavy sites |

## ประโยชน์

- **Performance**: Hydrate เฉพาะส่วนที่ต้องการ
- **Progressive Enhancement**: Static content ทำงานทันที
- **Bundle Size**: ลด JavaScript ที่ต้องส่ง
- **SEO**: Better สำหรับ content-heavy pages

## Use Cases

- **E-commerce**: Product pages กับ interactive cart
- **Blogs**: Static content กับ interactive comments
- **Documentation**: Static docs กับ interactive examples
- **Marketing Pages**: Static content กับ interactive forms

## ถัดไป

ดู [Routing System](./routing-system.md) เพื่อเรียนรู้เรื่อง file-system routing
