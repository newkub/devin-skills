---
title: Suspense
description: เรียนรู้เรื่อง Suspense สำหรับ async loading ใน SolidJS
---

## สิ่งที่คือ Suspense

Suspense คือ component ที่จัดการ async loading states ใน SolidJS โดยแสดง fallback UI ขณะที่ข้อมูลกำลังโหลด

## การใช้งานพื้นฐาน

```jsx
<Suspense fallback={<p>Loading...</p>}>
  <AsyncComponent />
</Suspense>
```

## การทำงาน

เมื่อ component ภายใน Suspense โหลดข้อมูล:

1. แสดง fallback UI
2. เมื่อข้อมูลพร้อม แสดง content
3. หากโหลดสำเร็จ แสดง component ปกติ
4. หากเกิด error ใช้ ErrorBoundary

## ใช้กับ Resources

```jsx
const [data] = createResource(fetchData);

<Suspense fallback={<p>Loading data...</p>}>
  <Show when={data()}>
    {(item) => <div>{item.name}</div>}
  </Show>
</Suspense>
```

## Nested Suspense

สามารถใช้ Suspense ซ้อนกันได้:

```jsx
<Suspense fallback={<p>Loading page...</p>}>
  <Layout>
    <Suspense fallback={<p>Loading content...</p>}>
      <Content />
    </Suspense>
  </Layout>
</Suspense>
```

## Streaming SSR

ใน SSR, Suspense รองรับ streaming:

- Server ส่ง HTML ที่พร้อมก่อน
- Client รับส่วนที่โหลดเสร็จทีละส่วน
- ปรับปรุง time-to-first-byte

## ถัดไป

ดู [Error Boundaries](./error-boundaries.md) เพื่อเรียนรู้เรื่อง error handling
