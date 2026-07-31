---
title: Universal Rendering
description: เรียนรู้เรื่อง Universal Rendering สำหรับ custom render targets
---

## สิ่งที่คือ Universal Rendering

Universal Rendering ช่วยให้ใช้ SolidJS reactivity กับ targets ที่ไม่ใช่ DOM เช่น Canvas, Native, หรือ custom renderers

## การใช้งาน

```jsx
import { createRenderer } from "solid-js/universal";

const renderer = createRenderer({
  createElement(type) {
    // Custom element creation
  },
  insertNode(parent, node, anchor) {
    // Custom insertion logic
  },
  // ... other renderer methods
});
```

## Renderer Methods

| Method | Description |
|--------|-------------|
| `createElement` | สร้าง element ใหม่ |
| `createTextNode` | สร้าง text node |
| `insertNode` | เพิ่ม node เข้า parent |
| `removeNode` | ลบ node ออกจาก parent |
| `setProp` | ตั้งค่า properties |
| `diffProps` | เปรียบเทียบ props |

## ตัวอย่าง Canvas Renderer

```jsx
const canvasRenderer = createRenderer({
  createElement(type) {
    return { type, children: [] };
  },
  insertNode(parent, node) {
    parent.children.push(node);
    drawCanvas(parent);
  },
  // ... implementation
});
```

## Use Cases

- **Canvas Rendering**: Games, visualizations
- **Native Apps**: React Native-style rendering
- **Terminal UI**: CLI applications
- **PDF Generation**: Document rendering
- **Custom Platforms**: Specialized targets

## ประโยชน์

- **Reactivity**: ใช้ signals และ effects ได้เหมือน DOM
- **Performance**: Direct rendering ไม่ผ่าน DOM
- **Flexibility**: Render ไปยังทุก platform
- **Consistency**: เขียน logic เดียวใช้ได้หลายที่

## ถัดไป

ดู [Observable Integration](./observable-integration.md) เพื่อเรียนรู้เรื่อง integration กับ observables
