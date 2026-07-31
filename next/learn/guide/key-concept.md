# Key Concept

## What is Next.js?

React framework สำหรับ production ที่มี Server-Side Rendering (SSR), Static Site Generation (SSG), และ App Router

## Core Concepts

### App Router
- ใช้ `app/` directory เป็น default
- รองรับ layouts, nested routing, loading states
- Server Components เป็น default
- Server Actions สำหรับ form handling

### Rendering Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| SSR | Render on each request | Dynamic content |
| SSG | Render at build time | Static pages |
| ISR | Revalidate on interval | Semi-dynamic content |
| CSR | Client-side rendering | Highly interactive |

### Server Components vs Client Components

```tsx
// Server Component (default)
async function Page() {
  const data = await fetchData(); // Direct DB access
  return <div>{data.name}</div>;
}

// Client Component
'use client';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## When to Use

- SEO สำคัญ (SSR/SSG)
- Performance สำคัญ (RSC)
- Full-stack React app
- Static sites ที่ต้องการ interactivity
