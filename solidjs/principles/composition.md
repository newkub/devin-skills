---
title: Composition
description: หลักการ composition ของ SolidJS
---

## สิ่งที่คือ Composition

SolidJS สนับสนุน composition ของ components:

- Components เป็น functions
- ง่ายต่อการ compose
- Reusable logic

## Component Composition

### Basic Composition

```jsx
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

function Toolbar() {
  return (
    <div>
      <Button label="Save" onClick={save} />
      <Button label="Cancel" onClick={cancel} />
    </div>
  );
}
```

### Children Composition

```jsx
function Card(props) {
  return <div class="card">{props.children}</div>;
}

<Card>
  <h1>Title</h1>
  <p>Content</p>
</Card>
```

## Higher-Order Components

### With Loading

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

const LoadingButton = withLoading(Button);
```

## Custom Hooks Composition

### Composable Hooks

```jsx
function useCounter(initial = 0) {
  const [count, setCount] = createSignal(initial);
  const increment = () => setCount(count() + 1);
  const decrement = () => setCount(count() - 1);
  return { count, increment, decrement };
}

function useToggle(initial = false) {
  const [value, setValue] = createSignal(initial);
  const toggle = () => setValue(!value());
  return { value, toggle };
}

function App() {
  const { count, increment } = useCounter();
  const { value, toggle } = useToggle();
  
  return (
    <div>
      <button onClick={increment}>{count()}</button>
      <button onClick={toggle}>{value() ? "On" : "Off"}</button>
    </div>
  );
}
```

## Context Composition

### Nested Contexts

```jsx
<ThemeContext.Provider value={["dark", setTheme]}>
  <UserContext.Provider value={[user, setUser]}>
    <App />
  </UserContext.Provider>
</ThemeContext.Provider>
```

## Benefits

### Reusability

- Logic สามารถ reuse
- Components สามารถ combine
- ลด code duplication

### Flexibility

- ง่ายต่อการ extend
- Mix and match
- Custom combinations

## Best Practices

### ใช้ Small Components

```jsx
// ✅ Good
function Button(props) {
  return <button>{props.label}</button>;
}

function Icon(props) {
  return <span>{props.icon}</span>;
}

// ❌ Bad - component ใหญ่เกินไป
function BigComponent() {
  // หลายร้อยบรรทัด
}
```

### ใช้ Composition แทน Inheritance

```jsx
// ✅ Good - composition
function ThemedButton(props) {
  return <Button class={props.theme} />;
}

// ❌ Bad - inheritance
class ThemedButton extends Button {
  // ...
}
```

## สรุป

Composition ให้:
- Reusable components
- Flexible architecture
- ลด code duplication
- ง่ายต่อ testing
