---
title: Reactivity
description: เรียนรู้เรื่อง reactivity system ของ SolidJS
---

## สิ่งที่คือ Reactivity

SolidJS ใช้ fine-grained reactivity:

- อัปเดตเฉพาะส่วนที่เปลี่ยนจริงๆ
- ไม่มี component re-rendering
- ติดตาม dependencies อัตโนมัติ

## Dependency Tracking

SolidJS ติดตาม dependencies อัตโนมัติ:

```jsx
const [count, setCount] = createSignal(0);

createEffect(() => {
  // Effect นี้ติดตาม count()
  console.log(count());
});
```

## Reactive Graph

SolidJS สร้าง graph ของ dependencies:

```
    Signal
      │
      ├──► Effect
      │
      └──► Memo ──► Effect
```

## Update Propagation

เมื่อ signal เปลี่ยน:

1. Signal mark เป็น "changed"
2. Notify observers
3. Re-run effects
4. Update DOM

## Fine-Grained Updates

เฉพาะ DOM nodes ที่ใช้ signal ที่จะถูกอัปเดต:

```jsx
const [name, setName] = createSignal("John");

return (
  <div>
    <h1>Hello {name()}</h1>
    <p>This text won't update</p>
  </div>
);
```

เมื่อ `setName` ถูกเรียก เฉพาะ `<h1>` ที่จะถูกอัปเดต

## Batch Updates

ใช้ `batch` สำหรับ multiple updates:

```jsx
batch(() => {
  setCount(count() + 1);
  setName("New");
});
```

## Reactive Primitives

### createSignal

```jsx
const [value, setValue] = createSignal(initial);
```

### createEffect

```jsx
createEffect(() => {
  console.log(value());
});
```

### createMemo

```jsx
const doubled = createMemo(() => value() * 2);
```

## ถัดไป

ดู [Components](./components.md) เพื่อเรียนรู้เรื่อง components
