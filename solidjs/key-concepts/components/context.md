---
title: Context
description: เรียนรู้เรื่อง context ใน SolidJS
---

## สิ่งที่คือ Context

Context ใช้สำหรับ shared state ระหว่าง components:

```jsx
const MyContext = createContext(defaultValue);
```

## Basic Usage

### Creating Context

```jsx
import { createContext } from "solid-js";

const ThemeContext = createContext("light");
```

### Providing Context

```jsx
function ThemeProvider(props) {
  const [theme, setTheme] = createSignal("light");
  
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {props.children}
    </ThemeContext.Provider>
  );
}
```

### Consuming Context

```jsx
function ThemedComponent() {
  const [theme] = useContext(ThemeContext);
  
  return <div class={theme()}>Hello</div>;
}
```

## Default Values

```jsx
const UserContext = createContext({ name: "Guest" });
```

## Nested Context

```jsx
<ThemeContext.Provider value={["dark", setTheme]}>
  <UserContext.Provider value={[user, setUser]}>
    <App />
  </UserContext.Provider>
</ThemeContext.Provider>
```

## Context กับ Signals

```jsx
const CountContext = createContext();

function CountProvider(props) {
  const [count, setCount] = createSignal(0);
  
  return (
    <CountContext.Provider value={[count, setCount]}>
      {props.children}
    </CountContext.Provider>
  );
}
```

## Best Practices

### ใช้ Context สำหรับ Global State

```jsx
const AuthContext = createContext();
```

### ใช้ Stores สำหรับ Complex State

```jsx
const [state, setState] = createStore(complexState);
```

## ถัดไป

ดู [Resources](./resources.md) เพื่อเรียนรู้เรื่อง resources
