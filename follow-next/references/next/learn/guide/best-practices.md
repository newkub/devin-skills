# Best Practices

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Route group
│   ├── (dashboard)/
│   ├── api/               # Route handlers
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Shared components
├── lib/                   # Utilities
├── hooks/                 # Custom hooks
└── types/                 # TypeScript types
```

## Server Components

### Use Server Components by Default

```tsx
// ✅ Good - Server Component
async function UserList() {
  const users = await db.user.findMany();
  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

// ❌ Avoid - Unnecessary Client Component
'use client';
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);
  // ...
}
```

### Client Component Boundaries

```tsx
// Only add 'use client' when needed
'use client';
import { useState } from 'react';

export function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Data Fetching

### Cache Strategically

```tsx
// Revalidate every hour
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  });
  return <ProductList data={data} />;
}

// Force dynamic
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  });
  return <RealtimeData data={data} />;
}
```

### Use Suspense for Streaming

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Hero />
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  );
}
```

## Error Handling

### Use error.tsx

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## SEO

### Metadata API

```tsx
// app/about/metadata.ts
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our company',
  openGraph: {
    title: 'About Us',
    images: ['/og-image.jpg'],
  },
};
```

## Performance

### Image Optimization

```tsx
import Image from 'next/image';

export function ProductImage({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      sizes="(max-width: 768px) 100vw, 400px"
      priority={true}
    />
  );
}
```

### Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```
