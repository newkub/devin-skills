---
title: Fine-Grained Reactivity
description: หลักการ fine-grained reactivity ของ SolidJS
---

## สิ่งที่คือ Fine-Grained Reactivity

SolidJS ใช้ fine-grained reactivity ซึ่งแตกต่างจาก frameworks อื่น:

- **Component-level**: React, Vue - re-render components เมื่อ state เปลี่ยน
- **Expression-level**: SolidJS - อัปเดตเฉพาะ expressions ที่ขึ้นกับ state

## ทำงานอย่างไร

เมื่อ state เปลี่ยน:

```jsx
const [count, setCount] = createSignal(0);

return (
  <div>
    <h1>Count: {count()}</h1>
    <p>This won't update</p>
  </div>
);
```

เมื่อ `setCount` ถูกเรียก:
- เฉพาะ `<h1>` ที่จะถูกอัปเดต
- `<p>` จะไม่ถูก touch

## ประโยชน์

### Performance

- ไม่มี unnecessary re-renders
- ลด DOM operations
- เร็วกว่า Virtual DOM

### Predictability

- ทราบแน่ชัดว่าส่วนไหนจะอัปเดต
- ไม่มี surprises จาก re-renders

## การใช้งาน

### Signals

```jsx
const [value, setValue] = createSignal(initial);
```

### Effects

```jsx
createEffect(() => {
  console.log(value());
});
```

### Memos

```jsx
const derived = createMemo(() => value() * 2);
```

## Best Practices

### ใช้ Fine-Grained Updates

```jsx
// ✅ Good
<span>{count()}</span>

// ❌ Bad - ไม่จำเป็นต้อง wrap ทั้ง component
```

### หลีกเลี่ยง Unnecessary Recomputations

```jsx
// ✅ Good
const doubled = createMemo(() => count() * 2);

// ❌ Bad
const doubled = () => count() * 2;
```

## สรุป

Fine-grained reactivity ให้:
- Performance ดีกว่า
- Predictable updates
- Minimal DOM operations
- Efficient dependency tracking
