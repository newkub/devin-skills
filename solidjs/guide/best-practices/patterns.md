---
title: Patterns
description: patterns ที่ใช้บ่อยใน SolidJS
---

## Component Pattern

### Basic Component

```jsx
function MyComponent(props) {
  return <div>{props.greeting}</div>;
}
```

### With State

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}
```

## State Management Pattern

### Local State

```jsx
const [value, setValue] = createSignal(initial);
```

### Global State with Store

```jsx
const [state, setState] = createStore({
  count: 0,
  user: null,
});
```

### Context Pattern

```jsx
const MyContext = createContext(defaultValue);

function Provider(props) {
  const [value, setValue] = createSignal(initial);
  return (
    <MyContext.Provider value={[value, setValue]}>
      {props.children}
    </MyContext.Provider>
  );
}
```

## Data Fetching Pattern

### With createResource

```jsx
const [data] = createResource(fetchData);

return (
  <Suspense fallback={<p>Loading...</p>}>
    <Show when={data()}>
      {(d) => <div>{d().name}</div>}
    </Show>
  </Suspense>
);
```

### With createEffect

```jsx
const [data, setData] = createSignal(null);

createEffect(async () => {
  const result = await fetchData();
  setData(result);
});
```

## List Rendering Pattern

### With For

```jsx
<For each={items()} fallback={<p>No items</p>}>
  {(item, index) => (
    <div>
      {index()}: {item.name}
    </div>
  )}
</For>
```

### With Index

```jsx
<For each={items()}>
  {(item, index) => (
    <div key={index()}>
      {item.name}
    </div>
  )}
</For>
```

## Conditional Rendering Pattern

### With Show

```jsx
<Show when={condition()} fallback={<p>Else</p>}>
  <p>If</p>
</Show>
```

### With Switch

```jsx
<Switch>
  <Match when={status() === "loading"}>
    <p>Loading...</p>
  </Match>
  <Match when={status() === "error"}>
    <p>Error</p>
  </Match>
  <Match when={status() === "success"}>
    <p>Success</p>
  </Match>
</Switch>
```

## Form Pattern

### Controlled Input

```jsx
const [value, setValue] = createSignal("");

return (
  <input
    type="text"
    value={value()}
    onInput={(e) => setValue(e.currentTarget.value)}
  />
);
```

### With Store

```jsx
const [form, setForm] = createStore({
  username: "",
  password: "",
});

return (
  <form>
    <input
      value={form.username}
      onInput={(e) => setForm("username", e.currentTarget.value)}
    />
  </form>
);
```

## Custom Hook Pattern

```jsx
function useCounter(initial = 0) {
  const [count, setCount] = createSignal(initial);
  const increment = () => setCount(count() + 1);
  const decrement = () => setCount(count() - 1);
  return { count, increment, decrement };
}

function App() {
  const { count, increment, decrement } = useCounter();
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count()}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## ถัดไป

ดู [Performance](./performance.md) เพื่อเรียนรู้เรื่อง performance
