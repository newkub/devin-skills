---
title: Portals
description: เรียนรู้เรื่อง Portals สำหรับ render components นอก DOM hierarchy
---

## สิ่งที่คือ Portals

Portals ช่วยให้ render components ไปยัง DOM node ที่อยู่นอก parent hierarchy ของ component ปัจจุบัน

## การใช้งาน

```jsx
import { Portal } from "solid-js/web";

function App() {
  return (
    <div>
      <h1>Main Content</h1>
      <Portal mount={document.getElementById("modal-root")}>
        <div class="modal">Modal Content</div>
      </Portal>
    </div>
  );
}
```

## Use Cases

- Modals และ Dialogs
- Tooltips
- Dropdowns
- Notifications
- Overlays

## ประโยชน์

- **Z-index Management**: ไม่ต้องกังวลเรื่อง stacking context
- **DOM Structure**: แยก UI ที่ซับซ้อนออกจาก main content
- **Accessibility**: ช่วยจัดการ focus management ได้ง่ายขึ้น
- **Performance**: ลดการ re-render ของ parent components

## Multiple Portals

สามารถใช้หลาย portals พร้อมกัน:

```jsx
<Portal mount={document.getElementById("modal-root")}>
  <Modal />
</Portal>

<Portal mount={document.getElementById("tooltip-root")}>
  <Tooltip />
</Portal>
```

## ถัดไป

ดู [Dynamic Components](./dynamic-components.md) เพื่อเรียนรู้เรื่อง dynamic rendering
