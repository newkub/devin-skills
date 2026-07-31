---
title: Effects
description: เรียนรู้เรื่อง effects ใน SolidJS
---

## สิ่งที่คือ Effects

Effects ใช้สำหรับ side effects:

```jsx
createEffect(() => {
  console.log("Effect runs");
});
```

## Basic Usage

### Simple Effect

```jsx
const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log("Count is:", count());
});
```

Effect จะทำงานเมื่อ:
- Component mount
- `count()` เปลี่ยน

## Dependency Tracking

Effects ติดตาม dependencies อัตโนมัติ:

```jsx
const [count, setCount] = createSignal(0);
const [name, setName] = createSignal("John");

createEffect(() => {
  // ติดตามเฉพาะ count()
  console.log(count());
});
```

## Cleanup

### onCleanup ใน Effect

```jsx
createEffect(() => {
  const interval = setInterval(() => {
    console.log("Tick");
  }, 1000);
  
  onCleanup(() => {
    clearInterval(interval);
  });
});
```

## Conditional Effects

### Show/Hide Effect

```jsx
const [active, setActive] = createSignal(false);

createEffect(() => {
  if (active()) {
    // setup
  } else {
    // cleanup
  }
});
```

## Async Effects

### Async Operations

```jsx
createEffect(async () => {
  const data = await fetchData();
  setData(data);
});
```

## Best Practices

### ใช้ createMemo สำหรับ Computed Values

```jsx
// ❌ Wrong
createEffect(() => {
  setDoubled(count() * 2);
});

// ✅ Correct
const doubled = createMemo(() => count() * 2);
```

### Cleanup Resources

```jsx
createEffect(() => {
  const subscription = subscribe();
  onCleanup(() => subscription.unsubscribe());
});
```

## ถัดไป

ดู [Memos](./memos.md) เพื่อเรียนรู้เรื่อง memos
