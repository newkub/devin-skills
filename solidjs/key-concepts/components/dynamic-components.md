---
title: Dynamic Components
description: เรียนรู้เรื่อง Dynamic Components สำหรับ render components แบบ dynamic
---

## สิ่งที่คือ Dynamic Components

Dynamic component ช่วยให้ render components หรือ elements ที่เปลี่ยนไปตาม reactive values

## การใช้งาน

```jsx
import { Dynamic } from "solid-js/web";

function App() {
  const [component, setComponent] = createSignal("div");

  return (
    <Dynamic component={component()}>
      Content
    </Dynamic>
  );
}
```

## Render Components ตาม Condition

```jsx
const [view, setView] = createSignal("home");

<Dynamic component={view() === "home" ? Home : Profile} />
```

## Render Elements ตาม Tag Name

```jsx
const [tag, setTag] = createSignal("h1");

<Dynamic component={tag()} fallback={<p>Loading...</p>}>
  Title
</Dynamic>
```

## Props Passing

```jsx
<Dynamic component={MyComponent} prop1="value" prop2={signal()} />
```

## Use Cases

- Component switching ตาม state
- Dynamic tag selection
- Plugin systems
- Layout components
- Conditional rendering ที่ซับซ้อน

## ถัดไป

ดู [Transitions](./transitions.md) เพื่อเรียนรู้เรื่อง concurrent rendering
