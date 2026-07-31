---
title: Signals
description: เรียนรู้เกี่ยวกับ Signals ใน SolidJS
---

## สิ่งที่คือ Signals

Signals คือ reactive state primitives ของ SolidJS:

```jsx
const [count, setCount] = createSignal(0);
```

- `count()` - getter สำหรับอ่านค่า
- `setCount()` - setter สำหรับอัปเดตค่า

## การสร้าง Signals

### Basic Signal

```jsx
const [value, setValue] = createSignal(initialValue);
```

### Signal กับ Options

```jsx
const [value, setValue] = createSignal(initial, {
  equals: false, // เปิดการเปรียบเทียบค่า
  name: "mySignal", // ตั้งชื่อสำหรับ debugging
});
```

## การอ่านค่า

ใช้ getter function:

```jsx
const [count, setCount] = createSignal(0);

console.log(count()); // 0
```

## การอัปเดตค่า

ใช้ setter function:

```jsx
setCount(5); // ตั้งค่าใหม่
setCount((prev) => prev + 1); // อัปเดตจากค่าเดิม
```

## Signals ใน JSX

ใช้ signals ใน JSX โดยเรียก getter:

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  
  return <div>Count: {count()}</div>;
}
```

## Derived Signals

สร้าง signals ที่ขึ้นกับ signals อื่น:

```jsx
const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);
```

## Signals กับ Effects

Effects ติดตามการเปลี่ยนแปลงของ signals:

```jsx
createEffect(() => {
  console.log("Count changed:", count());
});
```

## Best Practices

### ใช้ Signals สำหรับ Local State

```jsx
function Component() {
  const [local, setLocal] = createSignal(0);
  // ...
}
```

### ใช้ Stores สำหรับ Global State

```jsx
const [global, setGlobal] = createStore({ count: 0 });
```

### ใช้ Context สำหรับ Shared State

```jsx
const Context = createContext(defaultValue);
```

## ถัดไป

ดู [Reactivity](./reactivity.md) เพื่อเรียนรู้เรื่อง reactivity system
