---
title: Components
description: เรียนรู้เรื่อง components ใน SolidJS
---

## สิ่งที่คือ Components

Components ใน SolidJS คือ functions:

```jsx
function MyComponent(props) {
  return <div>{props.greeting}</div>;
}
```

## Render-Once Mental Model

Components ทำงานเพียงครั้งเดียว:

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  
  // โค้ดนี้ทำงานเพียงครั้งเดียว
  console.log("Component runs once");
  
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}
```

## Props

### Basic Props

```jsx
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

<Button label="Click me" onClick={handleClick} />
```

### Destructuring Props

```jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Default Props

```jsx
function Button({ label = "Click", onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

## Children

### Passing Children

```jsx
function Card(props) {
  return <div class="card">{props.children}</div>;
}

<Card>
  <h1>Title</h1>
  <p>Content</p>
</Card>
```

## Component Composition

### Higher-Order Components

```jsx
function withLoading(Component) {
  return (props) => {
    const [loading, setLoading] = createSignal(false);
    
    return (
      <Show when={!loading()} fallback={<p>Loading...</p>}>
        <Component {...props} setLoading={setLoading} />
      </Show>
    );
  };
}
```

## Lifecycle

### onMount

```jsx
import { onMount } from "solid-js";

function Component() {
  onMount(() => {
    console.log("Component mounted");
  });
  
  return <div>Hello</div>;
}
```

### onCleanup

```jsx
import { onCleanup } from "solid-js";

function Component() {
  onCleanup(() => {
    console.log("Component cleaned up");
  });
  
  return <div>Hello</div>;
}
```

## ถัดไป

ดู [Effects](./effects.md) เพื่อเรียนรู้เรื่อง effects
