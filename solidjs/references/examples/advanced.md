---
title: Advanced Examples
description: Advanced code examples สำหรับ SolidJS
---

# Advanced Examples

ตัวอย่างขั้นสูงสำหรับ SolidJS

## Context Provider

```tsx
import { createContext, useContext } from 'solid-js';

const ThemeContext = createContext('light');

function ThemeProvider(props) {
  const [theme, setTheme] = createSignal('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

function ThemedComponent() {
  const { theme } = useContext(ThemeContext);
  return <div class={theme()}>Themed content</div>;
}
```

## Store with Nested State

```tsx
import { createStore } from 'solid-js/store';

function FormComponent() {
  const [form, setForm] = createStore({
    fields: {
      username: '',
      email: '',
      password: ''
    },
    errors: {},
    submitting: false
  });

  const updateField = (field: string, value: string) => {
    setForm('fields', field, value);
  };

  return (
    <form>
      <input
        type="text"
        value={form.fields.username}
        onInput={(e) => updateField('username', e.target.value)}
      />
      <input
        type="email"
        value={form.fields.email}
        onInput={(e) => updateField('email', e.target.value)}
      />
    </form>
  );
}
```

## Memoization

```tsx
import { createSignal, createMemo } from 'solid-js';

function ExpensiveComponent() {
  const [data, setData] = createSignal(largeDataset);

  const processed = createMemo(() => {
    return data().map(item => {
      return expensiveProcessing(item);
    });
  });

  return <div>{processed().length} items processed</div>;
}
```
