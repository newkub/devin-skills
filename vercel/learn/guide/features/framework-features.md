# Framework Features

## Next.js Support

```typescript
// App Router (Next.js 13+)
// app/page.tsx
export default function Page() {
  return <h1>Hello World</h1>;
}

// Server Components
async function Component() {
  const data = await fetch('https://api.example.com');
  return <div>{data.name}</div>;
}

// API Routes
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}
```

## ISR (Incremental Static Regeneration)

```typescript
// pages/blog/[id].tsx
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id);
  
  return {
    props: { post },
    revalidate: 60 // Seconds
  };
}
```

## Image Optimization

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={800}
      height={600}
      priority
    />
  );
}
```
