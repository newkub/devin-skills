---
title: Troubleshooting
description: การแก้ปัญหาที่พบบ่อยใน SolidJS
---

## Common Issues

### Component Not Updating

**Problem**: Component ไม่อัปเดตเมื่อ state เปลี่ยน

**Solution**: ตรวจสอบว่าใช้ signal getter ถูกต้อง

```jsx
// ❌ Wrong
const [count, setCount] = createSignal(0);
<div>{count}</div>

// ✅ Correct
const [count, setCount] = createSignal(0);
<div>{count()}</div>
```

### Infinite Loop in Effects

**Problem**: Effect ทำงานซ้ำไม่สิ้นสุด

**Solution**: ตรวจสอบ dependencies และใช้ `createMemo` แทน

```jsx
// ❌ Wrong
createEffect(() => {
  setCount(count() + 1);
});

// ✅ Correct
const doubled = createMemo(() => count() * 2);
```

### List Not Rendering

**Problem**: List ไม่แสดง

**Solution**: ใช้ `<For>` แทน `map`

```jsx
// ❌ Wrong
{items().map((item) => <div>{item}</div>)}

// ✅ Correct
<For each={items()}>
  {(item) => <div>{item}</div>}
</For>
```

### JSX Compilation Errors

**Problem**: JSX ไม่ compile ถูกต้อง

**Solution**: ตรวจสอบ Babel config

```javascript
// babel.config.js
module.exports = {
  presets: ["solid"],
};
```

### TypeScript Errors

**Problem**: TypeScript errors กับ JSX

**Solution**: ตั้งค่า tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

## Performance Issues

### Slow Re-renders

**Problem**: Application ช้า

**Solution**: ใช้ `createMemo` และ `batch`

```jsx
const expensive = createMemo(() => heavyCalculation());

batch(() => {
  setState1(newValue1);
  setState2(newValue2);
});
```

### Memory Leaks

**Problem**: Memory ใช้เยอะเกินไป

**Solution**: Dispose effects และ resources

```jsx
const [data, { refetch }] = createResource(fetchData);

onCleanup(() => {
  // cleanup code
});
```

## Build Issues

### Vite Build Errors

**Problem**: Build ล้มเหลว

**Solution**: ตรวจสอบ vite.config.js

```javascript
import solidPlugin from "vite-plugin-solid";

export default {
  plugins: [solidPlugin()],
};
```

### SSR Hydration Errors

**Problem**: Hydration ล้มเหลว

**Solution**: ตรวจสอบว่า server และ client render เหมือนกัน

```jsx
// ใช้ isServer check
import { isServer } from "solid-js/web";

if (!isServer) {
  // client-only code
}
```

## Debugging Tips

### Use Solid DevTools

ติดตั้ง Solid DevTools browser extension

### Console Logging

```jsx
createEffect(() => {
  console.log("State changed:", count());
});
```

### Reactivity Inspector

ใช้ `devtools` สำหรับ inspect reactivity:

```javascript
import { devtools } from "solid-js/dev";

devtools();
```

## Getting Help

- [SolidJS Discord](https://discord.com/invite/solidjs)
- [GitHub Issues](https://github.com/solidjs/solid/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/solidjs)
