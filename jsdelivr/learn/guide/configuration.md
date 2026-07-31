# jsDelivr Configuration

แนวทางการตั้งค่าและปรับแต่งการใช้งาน jsDelivr ให้เหมาะสมกับโปรเจกต์

## การตั้งค่า Version

### Exact Version (แนะนำสำหรับ Production)

```html
<!-- ระบุ version เต็ม -->
<script src="https://cdn.jsdelivr.net/bun/vue@3.4.21/dist/vue.global.js"></script>
```

**ข้อดี:**

- Immutable - จะได้ไฟล์เดิมเสมอ
- No unexpected breaking changes
- 1-year browser cache

### Major Version (แนะนำสำหรับ Development)

```html
<!-- รับ minor และ patch ล่าสุดของ major version -->
<script src="https://cdn.jsdelivr.net/bun/vue@3/dist/vue.global.js"></script>
```

**ข้อดี:**

- ได้ bug fixes อัตโนมัติ
- ไม่ได้ breaking changes

### Latest (ไม่แนะนำสำหรับ Production)

```html
<!-- ได้ version ล่าสุดเสมอ -->
<script src="https://cdn.jsdelivr.net/bun/vue/dist/vue.global.js"></script>
```

**ข้อควรระวัง:**

- อาจมี breaking changes
- Cache สั้น (12 ชั่วโมง)

## Subresource Integrity (SRI)

เพิ่มความปลอดภัยโดยตรวจสอบว่าไฟล์ไม่ถูกแก้ไข:

### วิธีสร้าง SRI Hash

ใช้ command line:

```bash
# ใช้ openssl
openssl dgst -sha384 -binary filename.js | openssl base64 -A

# หรือใช้ online tool: https://www.srihash.org/
```

### การใช้งาน

```html
<script src="https://cdn.jsdelivr.net/bun/vue@3.4.21/dist/vue.global.js"
        integrity="sha384-oWzV2nPZcJl3+P6+8K/8oU9VJNl7d6r3X9qP8r+Z9nH3eK5tM9V/8vN8C9M4r+"
        crossorigin="anonymous"></script>
```

## CORS Configuration

เพิ่ม `crossorigin` attribute เมื่อใช้ SRI:

```html
<script src="https://cdn.jsdelivr.net/bun/axios@1/dist/axios.min.js"
        crossorigin="anonymous"></script>
```

## Async และ Defer

### Async

โหลดและ execute แบบ asynchronous:

```html
<script src="https://cdn.jsdelivr.net/bun/analytics-library/analytics.min.js" async></script>
```

### Defer

โหลด async แต่ execute หลัง HTML parsed:

```html
<script src="https://cdn.jsdelivr.net/bun/dom-manipulation-lib/lib.min.js" defer></script>
```

### Module (ESM)

```html
<script type="module">
  import { createApp } from 'https://esm.run/vue@3';
  // Execute หลัง HTML parsed โดยอัตโนมัติ
</script>
```

## Preconnect และ DNS-Prefetch

เพิ่ม performance โดย preconnect ไปยัง jsDelivr:

```html
<head>
  <!-- Preconnect ไปยัง jsDelivr domains -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">

  <!-- Preconnect ไปยัง esm.run -->
  <link rel="preconnect" href="https://esm.run" crossorigin>
  <link rel="dns-prefetch" href="https://esm.run">
</head>
```

## Preload Critical Resources

Preload ไฟล์ที่สำคัญ:

```html
<head>
  <!-- Preload main library -->
  <link rel="preload" href="https://cdn.jsdelivr.net/bun/vue@3/dist/vue.global.js" 
        as="script" crossorigin>

  <!-- Preload CSS -->
  <link rel="preload" href="https://cdn.jsdelivr.net/bun/bootstrap@5/dist/css/bootstrap.min.css" 
        as="style">
</head>
```

## Package.json Configuration (สำหรับ Library Authors)

ตั้งค่า jsDelivr entry point ใน package.json:

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "unpkg": "dist/index.umd.js",
  "jsdelivr": "dist/index.umd.js",
  "files": [
    "dist/"
  ]
}
```

### Field ที่รองรับ

- `main` - CommonJS entry (default)
- `module` - ES Module entry
- `unpkg` - สำหรับ unpkg และ jsDelivr
- `jsdelivr` - เฉพาะสำหรับ jsDelivr
- `browser` - Browser-specific entry

## การใช้งานกับ Frameworks

### Vue.js

```html
<!-- Global build -->
<script src="https://cdn.jsdelivr.net/bun/vue@3/dist/vue.global.js"></script>

<!-- ESM build -->
<script type="module">
  import { createApp } from 'https://cdn.jsdelivr.net/bun/vue@3/dist/vue.esm-browser.js';
</script>

<!-- หรือใช้ esm.run -->
<script type="module">
  import { createApp } from 'https://esm.run/vue@3';
</script>
```

### React

```html
<!-- Development -->
<script src="https://cdn.jsdelivr.net/bun/react@18/umd/react.development.js"></script>
<script src="https://cdn.jsdelivr.net/bun/react-dom@18/umd/react-dom.development.js"></script>

<!-- Production -->
<script src="https://cdn.jsdelivr.net/bun/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/bun/react-dom@18/umd/react-dom.production.min.js"></script>
```

### Alpine.js

```html
<!-- ต้องใช้ defer -->
<script defer src="https://cdn.jsdelivr.net/bun/alpinejs@3/dist/cdn.min.js"></script>
```

### HTMX

```html
<script src="https://cdn.jsdelivr.net/bun/htmx.org@1/dist/htmx.min.js"></script>
```

## File Combining Configuration

รวมหลายไฟล์เป็น request เดียว:

```html
<!-- รวมหลาย libraries -->
<script src="https://cdn.jsdelivr.net/combine/bun/vue@3/dist/vue.global.js,bun/lodash@4/lodash.min.js"></script>

<!-- รวม CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/combine/bun/bootstrap@5/dist/css/bootstrap.min.css,bun/@fortawesome/fontawesome-free@6/css/all.min.css">
```

### Limitations

- สูงสุด 10 files ต่อ request
- ไฟล์ต้องมาจับ jsDelivr เท่านั้น
- ไม่ support minification เพิ่มเติม

## Error Handling

### Fallback ไปยัง Local Copy

```html
<script src="https://cdn.jsdelivr.net/bun/vue@3/dist/vue.global.js"></script>
<script>
  if (typeof Vue === 'undefined') {
    document.write('<script src="./fallback/vue.global.js"><\/script>');
  }
</script>
```

### Global Error Handler

```html
<script>
  window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT') {
      console.error('Failed to load script:', e.target.src);
      // Handle error (e.g., load from fallback CDN)
    }
  }, true);
</script>
```

## ตัวอย่าง Configuration สมบูรณ์

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Performance: Preconnect -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">

  <!-- Preload critical resources -->
  <link rel="preload" href="https://cdn.jsdelivr.net/bun/vue@3.4.21/dist/vue.global.js" 
        as="script" crossorigin>

  <!-- CSS with SRI -->
  <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/bun/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-..."
        crossorigin="anonymous">

  <title>Configured jsDelivr Setup</title>
</head>
<body>
  <div id="app" class="container">
    <h1>{{ message }}</h1>
  </div>

  <!-- JavaScript with SRI -->
  <script src="https://cdn.jsdelivr.net/bun/vue@3.4.21/dist/vue.global.js"
          integrity="sha384-..."
          crossorigin="anonymous"></script>

  <script>
    const { createApp } = Vue;

    createApp({
      data() {
        return { message: 'Hello World!' };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

## Configuration Checklist

- [ ] เลือก version ที่เหมาะสม (exact สำหรับ production)
- [ ] เพิ่ม SRI สำหรับ security
- [ ] ใช้ `crossorigin` เมื่อใช้ SRI
- [ ] Preconnect ไปยัง jsDelivr domains
- [ ] Preload critical resources
- [ ] ใช้ `async` หรือ `defer` ตามความเหมาะสม
- [ ] มี fallback plan หาก CDN ล่ม
