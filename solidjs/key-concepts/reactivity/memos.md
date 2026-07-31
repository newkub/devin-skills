---
title: Memos
description: เรียนรู้เรื่อง memos ใน SolidJS
---

## สิ่งที่คือ Memos

Memos ใช้สำหรับ derived state:

```jsx
const doubled = createMemo(() => count() * 2);
```

## Basic Usage

### Simple Memo

```jsx
const [count, setCount] = createSignal(0);

const doubled = createMemo(() => count() * 2);

console.log(doubled()); // 0
setCount(5);
console.log(doubled()); // 10
```

## Memoization

Memos cache ผลลัพธ์:

```jsx
const expensive = createMemo(() => {
  console.log("Computing...");
  return heavyCalculation();
});
```

"Computing..." จะแสดงเฉพาะเมื่อ dependencies เปลี่ยน

## Dependencies

Memos ติดตาม dependencies อัตโนมัติ:

```jsx
const [count, setCount] = createSignal(0);
const [multiplier, setMultiplier] = createSignal(2);

const result = createMemo(() => count() * multiplier());
```

## Conditional Memos

```jsx
const [user, setUser] = createSignal(null);

const isAdmin = createMemo(() => user()?.role === "admin");
```

## Memo vs Effect

### Memo สำหรับ Computed Values

```jsx
const doubled = createMemo(() => count() * 2);
```

### Effect สำหรับ Side Effects

```jsx
createEffect(() => {
  console.log(count());
});
```

## Best Practices

### ใช้ Memos สำหรับ Expensive Calculations

```jsx
const filtered = createMemo(() => {
  return items().filter((item) => item.active);
});
```

### ใช้ Memos สำหรับ Derived State

```jsx
const fullName = createMemo(() => `${firstName()} ${lastName()}`);
```

## ถัดไป

ดู [Stores](./stores.md) เพื่อเรียนรู้เรื่อง stores
