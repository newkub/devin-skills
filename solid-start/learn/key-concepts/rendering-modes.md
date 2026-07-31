# Rendering Modes

## แนวคิดหลัก

SolidStart รองรับ 3 rendering modes หลัก: CSR, SSR, และ SSG ซึ่งสามารถเลือกใช้ตาม use case ของ application

## Rendering Modes

### Client-Side Rendering (CSR)

**คำอธิบาย:** Render ทั้งหมดบน client หลังจาก load JavaScript

**เหมาะสำหรับ:**
- Interactive applications (dashboards, admin panels)
- Applications ที่ต้องการ rich interactivity
- SEO ไม่สำคัญ

**ข้อดี:**
- Fast navigation หลัง initial load
- Full interactivity
- Easy state management

**ข้อเสีย:**
- SEO ไม่ดี
- Initial load ช้ากว่า SSR
- TTFB ช้ากว่า

### Server-Side Rendering (SSR)

**คำอธิบาย:** Render HTML บน server แล้ว hydrate บน client

**เหมาะสำหรับ:**
- Content-heavy sites (blogs, documentation)
- E-commerce sites
- Sites ที่ต้องการ SEO ดี

**ข้อดี:**
- SEO ดี
- First contentful paint เร็ว
- Better TTFB

**ข้อเสีย:**
- Server load เพิ่ม
- Complex deployment
- Initial JavaScript load

### Static Site Generation (SSG)

**คำอธิบาย:** Pre-render HTML ที่ build time

**เหมาะสำหรับ:**
- Blogs
- Documentation sites
- Marketing pages
- Content ที่ไม่เปลี่ยนบ่อย

**ข้อดี:**
- Performance ดีที่สุด
- CDN hosting
- No server runtime
- Best SEO

**ข้อเสีย:**
- ไม่รองรับ dynamic content ที่ build time
- Rebuild เมื่อ content เปลี่ยน
- Limited interactivity

## เลือก Rendering Mode

| Use Case | Recommended Mode |
|----------|------------------|
| **Blog** | SSG |
| **Documentation** | SSG |
| **E-commerce** | SSR |
| **Dashboard** | CSR |
| **Admin Panel** | CSR |
| **Marketing Site** | SSG |
| **Social App** | SSR |

## Configuration

```typescript
// app.config.ts
export default defineConfig({
  ssr: true,        // เปิด/ปิด SSR
  prerender: true,  // เปิด SSG
});
```

## Per-Route Configuration

```typescript
// routes/[slug].tsx
export const routeConfig = {
  ssr: true,        // SSR เฉพาะ route นี้
  preload: false,  // ปิด preloading
}
```

## Hybrid Rendering

สามารถใช้ mixed modes ใน application เดียว:

```typescript
// Static routes
export const routeConfig = {
  ssr: false,
  prerender: true,
}

// Dynamic routes
export const routeConfig = {
  ssr: true,
  prerender: false,
}
```
