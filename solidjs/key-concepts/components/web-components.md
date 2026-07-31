---
title: Web Components
description: เรียนรู้เรื่อง Web Components ใน SolidJS
---

## สิ่งที่คือ Web Components

SolidJS รองรับการสร้าง Web Components (Custom Elements) ผ่าน `solid-element`

## การใช้งาน

```jsx
import { customElement } from "solid-element";

customElement("my-counter", (props) => {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  );
});
```

## การใช้ใน HTML

```html
<my-counter></my-counter>
```

## Props และ Attributes

```jsx
customElement("my-greeting", (props, { options }) => {
  return <h1>Hello {props.name}</h1>;
});
```

```html
<my-greeting name="World"></my-greeting>
```

## Lifecycle

Web Components ใน SolidJS ทำงานครั้งเดียวเหมือน components ปกติ:

- `connectedCallback`: เมื่อ element ถูกเพิ่มเข้า DOM
- `disconnectedCallback`: เมื่อ element ถูกลบออกจาก DOM
- `attributeChangedCallback`: เมื่อ attributes เปลี่ยน

## Use Cases

- **Cross-Framework**: ใช้ใน frameworks อื่นๆ
- **Micro-frontends**: แชร์ components ระหว่าง applications
- **Design Systems**: สร้าง component libraries
- **Legacy Integration**: ผสานกับ systems ที่มีอยู่

## ข้อจำกัด

- Props ต้องเป็น strings หรือ primitives
- Complex objects ต้อง serialize
- Event handling แตกต่างจาก SolidJS components

## ถัดไป

ดู [Universal Rendering](./universal-rendering.md) เพื่อเรียนรู้เรื่อง custom renderers
