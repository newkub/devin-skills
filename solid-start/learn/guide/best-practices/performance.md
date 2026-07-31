# Performance - SolidStart

## Optimization Strategies

### Code Splitting

SolidStart ทำ code splitting อัตโนมัติตาม routes:

```typescript
// Auto-splitting ตาม routes
routes/
├── index.tsx       → chunk-1.js
├── about.tsx       → chunk-2.js
└── blog/
    ├── index.tsx   → chunk-3.js
    └── [slug].tsx  → chunk-4.js
```

### Lazy Loading Components

ใช้ lazy loading สำหรับ heavy components:

```typescript
import { lazy } from "solid-js";

const HeavyChart = lazy(() => import("./HeavyChart"));

export default function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Data Fetching Optimization

ใช้ `cache` สำหรับ caching data:

```typescript
import { cache } from "@solidjs/router";

const getData = cache(async () => {
  const res = await fetch("/api/data");
  return res.json();
}, "data");
```

### Asset Optimization

#### Images

ใช้ appropriate formats และ lazy loading:

```typescript
<img
  loading="lazy"
  src={imageSrc}
  alt={alt}
  width={800}
  height={600}
/>
```

#### Fonts

ใช้ font-display สำหรับ faster loading:

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2");
  font-display: swap;
}
```

## Bundle Optimization

### Tree Shaking

SolidStart ทำ tree shaking อัตโนมัติ:

```typescript
// ✅ Good - ใช้ named exports
export { Button, Input } from "./ui";

// ❌ Bad - ใช้ default export อาจไม่ tree-shake ได้ดี
export default Button;
```

### Minification

ตั้งค่าใน `app.config.ts`:

```typescript
export default defineConfig({
  minify: true,
  sourcemap: false, // ปิดใน production
});
```

## Rendering Performance

### SSR Streaming

ใช้ streaming SSR สำหรับ faster TTFB:

```typescript
export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <AsyncContent />
      </Suspense>
    </div>
  );
}
```

### Preloading

Preload critical resources:

```typescript
export const routeConfig = {
  preload: true, // Preload route
};
```

## Caching Strategies

### Edge Caching

ใช้ edge caching สำหรับ static content:

```typescript
// routes/api/data.ts
export async function GET() {
  return json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

### Static Generation

ใช้ SSG สำหรับ content ที่ไม่เปลี่ยนบ่อย:

```typescript
export const routeConfig = {
  prerender: true, // Static generation
};
```

## Performance Monitoring

### Web Vitals

ตรวจสอบ Core Web Vitals:

| Metric | Target | คำอธิบาย |
|--------|--------|-----------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |

### Bundle Analysis

ใช้ bundle analyzer:

```bash
bunx vite-bundle-visualizer
```

## Common Performance Issues

### Large Bundle Size

**สาเหตุ:**
- ไม่ได้ code split
- Import libraries ที่ไม่ใช้
- Large images

**วิธีแก้:**
- ใช้ lazy loading
- Tree shaking
- Optimize assets

### Slow TTFB

**สาเหตุ:**
- Server-side rendering ช้า
- Database queries ช้า
- No caching

**วิธีแก้:**
- ใช้ streaming SSR
- Cache data
- Optimize queries

### Layout Shifts

**สาเหตุ:**
- ไม่ระบุ dimensions
- Dynamic content loading
- Font loading

**วิธีแก้:**
- ระบุ width/height
- ใช้ skeleton screens
- font-display: swap
