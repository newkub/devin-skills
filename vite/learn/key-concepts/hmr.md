# HMR (Hot Module Replacement)

## HMR คืออะไร

Hot Module Replacement (HMR) คือการอัปเดต modules ใน runtime โดยไม่ต้อง reload ทั้งหน้า

## ทำงานอย่างไร

### 1. HMR Flow

```
File Change
  ↓
Vite Detects Change
  ↓
Send HMR Update to Browser
  ↓
Browser Replaces Module
  ↓
Application Updates
```

### 2. State Preservation

HMR preserve state ของ components

```javascript
// State is preserved on HMR
const count = ref(0)
```

### 3. Error Handling

HMR จะ rollback ถ้าเกิด error

```javascript
// If HMR fails, rollback to previous state
```

## ข้อดี

### 1. Developer Experience

- **Fast Updates**: Updates ทันทีโดยไม่ reload
- **State Preservation**: State ไม่หาย
- **Error Recovery**: Auto-rollback ถ้า error

### 2. Productivity

- **Faster Iteration**: แก้ไขและเห็นผลทันที
- **Less Context Switching**: ไม่ต้อง reload ทั้งหน้า
- **Better Debugging**: ดู changes ได้ง่ายขึ้น

### 3. UX

- **Smooth Updates**: Updates ที่ smooth
- **No Flash**: ไม่มี flash เมื่อ update
- **Preserved Scroll**: Scroll position ไม่เปลี่ยน

## Configuration

### 1. Enable HMR

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: true,  // Default: true
  },
})
```

### 2. Configure HMR

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,  // Show error overlay
      port: 24678,   // HMR server port
    },
  },
})
```

### 3. Disable HMR

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: false,
  },
})
```

## ตัวอย่างการใช้งาน

### 1. Vue HMR

```vue
<!-- src/components/Button.vue -->
<script setup>
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

เมื่อแก้ไขไฟล์ HMR จะอัปเดต component โดย preserve state

### 2. React HMR

```jsx
// src/components/Button.jsx
import { useState } from 'react'

export default function Button() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

React Fast Refresh จะอัปเดต component โดย preserve state

### 3. CSS HMR

```css
/* src/styles/main.css */
.button {
  background: blue;
}
```

เมื่อแก้ไข CSS HMR จะอัปเดต styles ทันที

## HMR API

### 1. Accept HMR

```javascript
// src/main.js
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle HMR update
  })
}
```

### 2. Dispose HMR

```javascript
// src/main.js
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // Cleanup before HMR
  })
}
```

### 3. Decline HMR

```javascript
// src/main.js
if (import.meta.hot) {
  import.meta.hot.decline()
}
```

## Troubleshooting

### 1. HMR Not Working

**Problem:**
HMR ไม่ทำงาน

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
})
```

### 2. State Not Preserved

**Problem:**
State ไม่ถูก preserve

**Solution:**
ตรวจสอบว่า component รองรับ HMR อย่างถูกต้อง

### 3. HMR Errors

**Problem:**
HMR เกิด errors

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,  // Show error overlay
    },
  },
})
```

## Best Practices

### 1. Use Framework HMR

```vue
<!-- Good - use Vue's HMR -->
<script setup>
const count = ref(0)
</script>
```

### 2. Avoid Manual HMR

```javascript
// Avoid - manual HMR unless necessary
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### 3. Test HMR

```bash
# Test HMR by editing files
bun run dev
```

## สรุป

HMR เป็น feature สำคัญของ Vite ที่:
- อัปเดต modules โดยไม่ reload ทั้งหน้า
- Preserve state ของ components
- Auto-rollback ถ้าเกิด error
- Support frameworks อย่าง Vue และ React

Feature นี้ทำให้ development experience ดีขึ้นมาก
