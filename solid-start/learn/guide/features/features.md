# Features - SolidStart

## ฟีเจอร์หลัก

| ฟีเจอร์ | คำอธิบาย | ประโยชน์ |
|---------|-----------|---------|
| **File-Based Routing** | กำหนด routes ด้วยโครงสร้างไฟล์ | จัดการ routes ง่าย ไม่ต้อง config ซับซ้อน |
| **Multiple Rendering Modes** | รองรับ CSR, SSR, SSG | เลือก rendering ตาม use case ได้อย่างยืดหยุ่น |
| **Isomorphic Code** | Code เดียวทำงานได้ทั้ง client/server | ลด code duplication และ maintenance |
| **Vinxi Bundler** | รวม Vite + Nitro | Fast development และ production-ready |
| **Seroval Serializer** | High-performance serializer | ทำให้ client/server communication เร็วขึ้น |
| **Server Actions** | Form actions บน server ด้วย code co-location | Full-stack forms ที่ง่ายและปลอดภัย |
| **Single-Flight Mutations** | ป้องกัน waterfalls เมื่อ update data | Performance ดีขึ้นเมื่อ mutate data |
| **Request & Resource Deduplication** | ไม่ส่ง requests ซ้ำ | ลด network load และปรับปรุง performance |
| **Data (pre-)Loading** | Parallel data loading พร้อม preloading strategies | UX ที่ snappy และ responsive |
| **Unopinionated** | ไม่บังคับ tools ใดๆ เฉพาะ | ใช้ libraries ที่ชอบได้อย่างอิสระ |
| **API Routes** | Server functions ในไฟล์ routes | Full-stack development ใน project เดียว |
| **Nested Routes** | Layouts และ nested routing | สร้าง UI ที่ซับซ้อนได้ง่าย |
| **Dynamic Routes** | Routes แบบ parameterized | สร้าง dynamic pages ได้ง่าย |
| **Route Groups** | จัดกลุ่ม routes โดยไม่กระทบ URL | จัดโครงสร้าง routes ได้เป็นระบบ |
| **Lazy Loading** | Auto lazy load routes | ปรับปรุง initial load performance |

## File-Based Routing Features

### Route Types

| ประเภท | รูปแบบไฟล์ | URL ตัวอย่าง |
|--------|-------------|---------------|
| **Index Route** | `index.tsx` | `/` |
| **Static Route** | `about.tsx` | `/about` |
| **Nested Route** | `blog/index.tsx` | `/blog` |
| **Dynamic Route** | `blog/[slug].tsx` | `/blog/my-post` |
| **Catch-all Route** | `[...catchAll].tsx` | `/any/path` |
| **API Route** | `api/hello.ts` | `/api/hello` |

### Route Configuration

```typescript
// routes/[slug].tsx
export const routeConfig = {
  preload: false,
  ssr: true,
}
```

## Rendering Strategies

### Client-Side Rendering (CSR)
- เหมาะสำหรับ interactive applications
- Fast navigation หลังจาก initial load
- SEO ไม่ดีเท่า SSR

### Server-Side Rendering (SSR)
- เหมาะสำหรับ content-heavy sites
- SEO ดี
- First contentful paint เร็ว

### Static Site Generation (SSG)
- เหมาะสำหรับ blogs, documentation
- Performance ดีที่สุด
- ไม่รองรับ dynamic content ที่ build time

## Server Features

### API Routes

```typescript
// routes/api/hello.ts
import { json } from "@solidjs/start/server";

export async function GET() {
  return json({ message: "Hello World" });
}
```

### Server Functions

```typescript
// routes/api/data.ts
import { json } from "@solidjs/start/server";

export async function POST(req: Request) {
  const body = await req.json();
  return json({ received: body });
}
```

### Middleware

```typescript
// middleware.ts
export function onRequest(event: any) {
  // Add authentication, logging, etc.
}
```

## Development Features

| ฟีเจอร์ | คำอธิบาย |
|---------|-----------|
| **HMR** | Hot Module Replacement สำหรับ development ที่รวดเร็ว |
| **Fast Refresh** | Preserve state ระหว่าง hot reloads |
| **TypeScript Support** | First-class TypeScript support |
| **ESLint Integration** | Built-in linting และ code quality checks |
| **Vite Ecosystem** | ใช้ plugins และ tools จาก Vite ecosystem |

## Deployment Targets

| Platform | รองรับ | หมายเหตุ |
|----------|--------|---------|
| **Vercel** | ✅ | Auto-deployment |
| **Netlify** | ✅ | Edge functions |
| **Cloudflare Pages** | ✅ | Workers integration |
| **Node.js** | ✅ | Standard deployment |
| **Deno** | ✅ | Deno Deploy |
| **Bun** | ✅ | Bun native |

## Performance Features

| ฟีเจอร์ | คำอธิบาย |
|---------|-----------|
| **Code Splitting** | Auto code splitting ตาม routes |
| **Tree Shaking** | Remove unused code อัตโนมัติ |
| **Asset Optimization** | Optimize images, fonts, และ assets |
| **Caching** | Built-in caching strategies |
| **Streaming SSR** | Stream HTML สำหรับ faster TTFB |

## Integration Features

| ฟีเจอร์ | คำอธิบาย |
|---------|-----------|
| **Solid Router** | Official router integration |
| **Solid Meta** | Metadata management |
| **Solid Query** | Data fetching และ caching |
| **Solid Store** | State management |
| **Third-party Libraries** | Easy integration กับ libraries อื่นๆ |
