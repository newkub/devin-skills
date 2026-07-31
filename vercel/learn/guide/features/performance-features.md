# Performance Features

## Built-in Analytics

```typescript
// app/page.tsx
import { Analytics } from '@vercel/analytics';

export default function Page() {
  return (
    <>
      <h1>My Page</h1>
      <Analytics />
    </>
  );
}
```

## Speed Insights

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Page() {
  return (
    <>
      <h1>My Page</h1>
      <SpeedInsights />
    </>
  );
}
```

## Edge Caching

```typescript
// Set cache headers
export const config = {
  revalidate: 60, // ISR
};

export default function Page() {
  return <h1>Cached Page</h1>;
}
```
