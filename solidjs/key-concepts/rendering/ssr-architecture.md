---
title: SSR Architecture
description: เรียนรู้เรื่อง Server-Side Rendering Architecture ใน SolidJS
---

## สิ่งที่คือ SSR Architecture

SSR Architecture ของ SolidJS ใช้ "Hydration-First" approach ที่ render HTML บน server แล้ว hydrate บน client

## Core Components

```
┌─────────────────────────────────────────┐
│         Build Time Layer                │
├─────────────────────────────────────────┤
│  JSX → babel-preset-solid → Compiled JS │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Server Runtime                  │
├─────────────────────────────────────────┤
│  renderToString / renderToStream       │
│  sharedConfig coordination              │
│  Hydration ID generation               │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Client Runtime                 │
├─────────────────────────────────────────┤
│  hydrateCore()                         │
│  Hydration ID matching                 │
│  Reactive binding attachment            │
└─────────────────────────────────────────┘
```

## renderToString

Render synchronous HTML string:

```jsx
import { renderToString } from "solid-js/web";

const html = renderToString(() => <App />);
```

ใช้สำหรับ:
- Static Site Generation
- Simple SSR
- HTML caching

## renderToStream

Render streaming HTML chunks:

```jsx
import { renderToStream } from "solid-js/web";

const stream = renderToStream(() => <App />);
```

ใช้สำหรับ:
- Progressive rendering
- Suspense streaming
- Faster TTFB

## sharedConfig

ส่งข้อมูลจาก server ไป client:

```jsx
import { setHydrateContext, getHydrateContext } from "solid-js/web";

// Server
setHydrateContext({ userId: 123 });

// Client
const context = getHydrateContext();
```

## Hydration IDs

แต่ละ element ได้รับ unique ID:

```html
<div data-hk="0-0-0">Content</div>
```

Client ใช้ IDs เหล่านี้เพื่อ:
- Match DOM nodes
- Attach reactive bindings
- Restore component state

## Resource Serialization

Resources ถูก serialize จาก server ไป client:

```jsx
const [data] = createResource(fetchData);

// Server serializes state
// Client deserializes and resumes
```

## ประโยชน์

- **SEO**: Search engines สามารถ index HTML
- **Performance**: Faster initial load
- **Progressive Enhancement**: ทำงานได้แม้ JS ไม่โหลด
- **Streaming**: Faster perceived performance

## ถัดไป

ดู [Server Functions](./server-functions.md) เพื่อเรียนรู้เรื่อง server-side logic
