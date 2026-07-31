# Setup esm.sh

## วัตถุประสงค์

ตั้งค่าและใช้งาน esm.sh สำหรับโหลด ES Modules บน browser

## ขั้นตอน

### 1. ตรวจสอบความต้องการ

- ต้องการใช้ ES Modules บน browser
- ต้องการ import จาก bun โดยตรง
- ต้องการ tree-shaking เพื่อลด bundle size

### 2. ใช้งานพื้นฐาน

```html
<script type="module">
  import { useState } from 'https://esm.sh/react@18.2.0'
  // ใช้งาน React
</script>
```

### 3. ตั้งค่า version pinning

```html
<script type="module">
  import { useState } from 'https://esm.sh/react@18.2.0'
  // ระบุ version ที่ต้องการ
</script>
```

### 4. ใช้กับ TypeScript

```html
<script type="module">
  import { useState } from 'https://esm.sh/react@18.2.0?target=es2020'
  // ระบุ target environment
</script>
```

### 5. ตรวจสอบ

- เปิด browser และตรวจสอบ console
- ตรวจสอบว่า modules โหลดสำเร็จ
- ตรวจสอบ network tab ดูการโหลด

## ตรวจสอบความถูกต้อง

- Modules โหลดสำเร็จ
- ไม่มี errors ใน console
- Tree-shaking ทำงานอย่างถูกต้อง
