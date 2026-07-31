---
title: Declarative Programming
description: หลักการ declarative programming ของ SolidJS
---

## สิ่งที่คือ Declarative Programming

SolidJS ใช้ declarative approach:

- อธิบาย "what" ไม่ใช่ "how"
- Reactivity system จัดการ updates
- ไม่ต้อง manual DOM manipulation

## Imperative vs Declarative

### Imperative (Bad)

```jsx
// ❌ Bad - manual DOM manipulation
function Counter() {
  let count = 0;
  
  return (
    <div>
      <button
        onClick={() => {
          count++;
          document.getElementById("count").textContent = count;
        }}
      >
        Increment
      </button>
      <span id="count">{count}</span>
    </div>
  );
}
```

### Declarative (Good)

```jsx
// ✅ Good - declarative
function Counter() {
  const [count, setCount] = createSignal(0);
  
  return (
    <div>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
      <span>{count()}</span>
    </div>
  );
}
```

## Declarative Patterns

### Conditional Rendering

```jsx
<Show when={loggedIn()}>
  <p>Welcome!</p>
</Show>
```

### List Rendering

```jsx
<For each={items()}>
  {(item) => <div>{item.name}</div>}
</For>
```

### State Management

```jsx
const [state, setState] = createStore({
  count: 0,
  user: null,
});
```

## Benefits

### Readability

- Code อ่านง่าย
- Intent ชัดเจน
- น้อย bugs

### Maintainability

- ง่ายต่อการ modify
- Predictable behavior
- Test ง่าย

## Best Practices

### ใช้ Declarative APIs

```jsx
// ✅ Good
<Show when={condition()}>
  <Content />
</Show>

// ❌ Bad
{condition() && <Content />}
```

### ใช้ Reactive Primitives

```jsx
// ✅ Good
const doubled = createMemo(() => count() * 2);

// ❌ Bad
let doubled;
createEffect(() => {
  doubled = count() * 2;
});
```

## สรุป

Declarative programming ให้:
- Code ที่อ่านง่าย
- Predictable behavior
- น้อย bugs
- ง่ายต่อ maintain
