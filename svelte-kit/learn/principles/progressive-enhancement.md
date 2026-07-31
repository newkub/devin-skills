# Progressive Enhancement

## หลักการ

Progressive Enhancement คือแนวคิดที่ทำให้แอปพลิเคชันทำงานได้แม้ JavaScript จะถูกปิดอยู่ โดยเริ่มจาก HTML พื้นฐานที่ทำงานได้ แล้วค่อยเพิ่ม JavaScript เพื่อปรับปรุงประสบการณ์ผู้ใช้

## ใน SvelteKit

SvelteKit ออกแบบมาเพื่อรองรับ Progressive Enhancement โดย:

- **Server-side rendering** สร้าง HTML ที่สมบูรณ์ก่อนส่งไปยัง client
- **Form actions** ทำงานได้โดยไม่ต้องใช้ JavaScript
- **Links** ทำงานเป็น normal navigation ถ้า JavaScript ยังไม่โหลด
- **Hydration** เพิ่ม interactivity เมื่อ JavaScript โหลดเสร็จ

## การนำไปใช้

```svelte
<!-- +page.svelte -->
<form method="POST" action="?/login">
  <input name="username" />
  <input name="password" type="password" />
  <button type="submit">Login</button>
</form>

<script>
  // เพิ่ม client-side validation เมื่อ JS โหลด
  import { enhance } from '$app/forms';

  enhance(form, () => {
    // custom behavior
  });
</script>
```

## ประโยชน์

- **SEO** เพราะ search engines อ่าน HTML ได้
- **Performance** ผู้ใช้เห็น content ทันที
- **Accessibility** ทำงานได้กับ screen readers
- **Reliability** ทำงานได้แม้ JS ล้มเหลว
