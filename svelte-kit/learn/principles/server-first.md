# Server-First

## หลักการ

SvelteKit ออกแบบมาให้ data fetching เกิดขึ้นที่ server ก่อน แล้วค่อยส่งไปยัง client ซึ่งตรงข้ามกับ CSR-first frameworks

## ใน SvelteKit

```typescript
// +page.server.ts
export async function load({ fetch }) {
  const data = await fetch('https://api.example.com/data');
  return {
    items: await data.json()
  };
}
```

## ข้อดีของ Server-First

- **Security** Secrets อยู่ที่ server เท่านั้น
- **Performance** Database queries ที่ server เร็วกว่า
- **SEO** Search engines อ่าน HTML ที่มี data แล้ว
- **Caching** สามารถ cache ที่ server ได้

## เมื่อใช้ Client-side Data

```typescript
// +page.ts
export async function load({ fetch }) {
  // Data ที่ load ที่ client
  const res = await fetch('/api/user');
  return {
    user: await res.json()
  };
}
```

ใช้ client-side data เมื่อ:
- Data ขึ้นกับ user session
- Data เปลี่ยนบ่อย
- Data ไม่จำเป็นต้อง SEO
