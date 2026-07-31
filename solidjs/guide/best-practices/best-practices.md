---
title: Best Practices
description: best practices สำหรับการพัฒนา SolidJS
---

## Component Best Practices

### Keep Components Small

```jsx
// ✅ Good
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

// ❌ Bad
function BigComponent() {
  // หลายร้อยบรรทัด
}
```

### Use Descriptive Names

```jsx
// ✅ Good
function UserCard(props) {
  return <div>{props.name}</div>;
}

// ❌ Bad
function Comp1(props) {
  return <div>{props.n}</div>;
}
```

## State Management Best Practices

### Use Signals for Local State

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}
```

### Use Stores for Global State

```jsx
const [user, setUser] = createStore({
  name: "",
  email: "",
});
```

### Use Context for Shared State

```jsx
const ThemeContext = createContext("light");

function ThemeProvider(props) {
  const [theme, setTheme] = createSignal("light");
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {props.children}
    </ThemeContext.Provider>
  );
}
```

## Performance Best Practices

### Use createMemo for Computed Values

```jsx
const doubled = createMemo(() => count() * 2);
```

### Use batch for Multiple Updates

```jsx
batch(() => {
  setCount(count() + 1);
  setName("New");
});
```

### Use For for Lists

```jsx
<For each={items()}>
  {(item) => <div>{item.name}</div>}
</For>
```

## Code Organization Best Practices

### Separate Concerns

```
components/ - UI components
hooks/ - Custom hooks
stores/ - State management
services/ - API calls
utils/ - Helper functions
```

### Use Index Files

```jsx
// components/index.jsx
export { default as Button } from "./Button";
export { default as Card } from "./Card";
```

## Testing Best Practices

### Test Components in Isolation

```javascript
import { render, screen } from "solid-js/testing-library";

describe("Button", () => {
  it("renders label", () => {
    render(() => <Button label="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### Test User Interactions

```javascript
it("calls onClick when clicked", () => {
  const handleClick = vi.fn();
  render(() => <Button onClick={handleClick} label="Click" />);
  screen.getByText("Click").click();
  expect(handleClick).toHaveBeenCalled();
});
```

## ถัดไป

ดู [Ecosystem](./ecosystem.md) เพื่อเรียนรู้เรื่อง ecosystem
