# Quick Start

สร้าง Next.js app แรกของคุณใน 5 นาที

## 1. Create Project

```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
```

## 2. Start Development

```bash
bun run dev
```

เปิด http://localhost:3000

## 3. Create Your First Page

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
      <p>Start building with App Router.</p>
    </main>
  );
}
```

## 4. Create Layout

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Next Steps

- [Key Concepts](key-concept.md) - เข้าใจ App Router และ Rendering
- [Best Practices](best-practices.md) - วิธีเขียน code ที่ดี
- [Configuration](configuration.md) - ตั้งค่า Next.js
