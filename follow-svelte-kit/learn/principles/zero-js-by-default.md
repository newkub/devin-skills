# Zero JS by Default

## หลักการ

SvelteKit ไม่ส่ง JavaScript ไปยัง browser ถ้าไม่จำเป็น ซึ่งแตกต่างจาก frameworks อื่นที่ส่ง bundle ขนาดใหญ่เสมอ

## ใน SvelteKit

- **Static pages** ไม่มี JavaScript ถ้าไม่มี interactivity
- **Prerendered routes** เป็น HTML ล้วน
- **Hydration** เกิดขึ้นเฉพาะเมื่อจำเป็น
- **Code splitting** โหลด JS เฉพาะส่วนที่ใช้

## ตัวอย่าง

```svelte
<!-- หน้านี้ไม่มี JavaScript -->
<h1>Hello World</h1>
<p>This is a static page with zero JavaScript.</p>
```

```svelte
<!-- หน้านี้มี JavaScript เพราะมี interactivity -->
<script>
  let count = 0;
</script>

<button on:click={() => count += 1}>
  Clicked {count} times
</button>
```

## ประโยชน์

- **Bundle size** เล็กลงอย่างมาก
- **Load time** เร็วขึ้น
- **Battery life** ประหยัดบน mobile
- **Accessibility** ดีขึ้น
