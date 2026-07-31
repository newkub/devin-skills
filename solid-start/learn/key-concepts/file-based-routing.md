# File-Based Routing

## แนวคิดหลัก

SolidStart ใช้ file-based routing ซึ่งกำหนด routes ด้วยโครงสร้างไฟล์ใน `src/routes/` directory แทนการ config แบบ manual

## วิธีการทำงาน

```
src/routes/
├── index.tsx          → /
├── about.tsx          → /about
├── blog/
│   ├── index.tsx      → /blog
│   └── [slug].tsx     → /blog/:slug
└── api/
    └── hello.ts       → /api/hello
```

## ประเภท Routes

| ประเภท | รูปแบบไฟล์ | URL | ตัวอย่าง |
|--------|-------------|-----|---------|
| **Index** | `index.tsx` | `/` | Home page |
| **Static** | `about.tsx` | `/about` | About page |
| **Nested** | `blog/index.tsx` | `/blog` | Blog listing |
| **Dynamic** | `[slug].tsx` | `/blog/:slug` | Blog post |
| **Catch-all** | `[...path].tsx` | `/any/path` | 404 page |
| **API** | `api/hello.ts` | `/api/hello` | API endpoint |

## Route Configuration

แต่ละ route สามารถ config ได้:

```typescript
export const routeConfig = {
  preload: false,    // ปิด preloading
  ssr: true,         // เปิด SSR
}
```

## Nested Routes

ใช้สำหรับ layouts และ shared UI:

```
routes/
├── (app)/
│   ├── layout.tsx    # Layout component
│   ├── index.tsx     # / (ใช้ layout)
│   └── about.tsx     # /about (ใช้ layout)
```

## Route Groups

ใช้ parentheses สำหรับจัดกลุ่มโดยไม่กระทบ URL:

```
routes/
├── (auth)/
│   ├── login.tsx     # /login
│   └── register.tsx  # /register
```

## Benefits

- **Intuitive**: โครงสร้างไฟล์ = URL structure
- **No Config**: ไม่ต้อง config routes แยก
- **Type Safety**: TypeScript support สำหรับ params
- **Lazy Loading**: Auto code splitting ตาม routes
