# Data Loading

## แนวคิดหลัก

SolidStart มีหลายวิธีในการ load data ตั้งแต่ server-side data fetching ไปจนถึง client-side data management โดยออกแบบมาให้ทำงานร่วมกับ reactivity system ของ SolidJS

## Data Loading Strategies

### Server-Side Data Loading

ใช้ `routeData` สำหรับ data fetching บน server:

```typescript
// routes/[slug].tsx
import { cache } from "@solidjs/router";

export function routeData() {
  return cache(async () => {
    const res = await fetch("https://api.example.com/posts");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }, "posts");
}

export default function PostPage() {
  const data = useRouteData();
  return <div>{JSON.stringify(data())}</div>;
}
```

**ข้อดี:**
- SEO friendly
- Fast initial load
- Reduce client-side JavaScript

**ข้อเสีย:**
- Server load เพิ่ม
- Data อาจเก่าถ้าไม่ revalidate

### Client-Side Data Loading

ใช้ `createResource` สำหรับ data fetching บน client:

```typescript
import { createResource } from "solid-js";

export default function PostsPage() {
  const [posts] = createResource(async () => {
    const res = await fetch("/api/posts");
    return res.json();
  });

  return (
    <Suspense fallback={<Loading />}>
      <For each={posts()}>
        {(post) => <PostCard post={post} />}
      </For>
    </Suspense>
  );
}
```

**ข้อดี:**
- Interactive
- Real-time data
- ลด server load

**ข้อเสีย:**
- Initial load ช้ากว่า
- SEO ไม่ดี

### Server Functions (RPC)

ใช้ server functions สำหรับ data fetching แบบ type-safe:

```typescript
// server/data.ts
import { createServerData$ } from "solid-start/server";

export const getPosts = createServerData$(async () => {
  const posts = await db.posts.getAll();
  return posts;
});

// component
import { getPosts } from "~/server/data";

export default function PostsPage() {
  const posts = getPosts();
  return <div>{JSON.stringify(posts())}</div>;
}
```

**ข้อดี:**
- Type-safe
- No CORS issues
- Code co-location

## Best Practices

| Practice | คำอธิบาย |
|----------|-----------|
| **Server-first** | Load data บน server เมื่อเป็นไปได้ |
| **Cache wisely** | ใช้ cache อย่างเหมาะสม |
| **Error handle** | Handle errors อย่าง graceful |
| **Loading states** | แสดง loading states อย่างชัดเจน |
| **Type safety** | ใช้ TypeScript สำหรับ data types |

## Use Cases

| Use Case | Strategy |
|----------|----------|
| **Blog posts** | Server-side data loading |
| **User dashboard** | Client-side data loading |
| **Real-time data** | Server functions + polling |
| **Static content** | SSG + pre-render |
| **Mixed content** | Hybrid approach |

## Related Topics

- **Data Fetching Patterns** - อ่าน `patterns.md` สำหรับ patterns การ fetch data
- **Caching Strategies** - อ่าน `caching.md` สำหรับ caching strategies
- **Preloading** - อ่าน `preloading.md` สำหรับ preloading data
- **Error Handling** - อ่าน `error-handling.md` สำหรับ error handling
