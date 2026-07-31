---
title: Type Safety
description: หลักการ type safety ใน SolidJS
---

## TypeScript Support

SolidJS มี TypeScript support ที่ดี:

- Full type inference
- Generic types
- Type-safe props
- Type-safe signals

## Basic Types

### Signal Types

```typescript
const [count, setCount] = createSignal<number>(0);
const [name, setName] = createSignal<string>("");
```

### Component Props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

## Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
}

function List<T>(props: ListProps<T>) {
  return (
    <For each={props.items}>
      {(item) => props.renderItem(item)}
    </For>
  );
}
```

## Store Types

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

const [user, setUser] = createStore<User>({
  name: "",
  email: "",
  age: 0,
});
```

## Context Types

```typescript
interface ThemeContextValue {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});
```

## Resource Types

```typescript
interface UserData {
  id: number;
  name: string;
}

async function fetchUser(id: number): Promise<UserData> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

const [user] = createResource<UserData>(() => userId(), fetchUser);
```

## Type Guards

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value
  );
}
```

## Best Practices

### ใช้ Interface สำหรับ Props

```typescript
// ✅ Good
interface Props {
  value: number;
  onChange: (value: number) => void;
}

// ❌ Bad - inline types
function Component(props: { value: number; onChange: (v: number) => void }) {
  // ...
}
```

### ใช้ Type Inference

```typescript
// ✅ Good - inferred
const [count, setCount] = createSignal(0);

// ❌ Bad - unnecessary type annotation
const [count, setCount] = createSignal<number>(0);
```

### Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

## สรุป

Type safety ให้:
- Catch errors ตอน compile
- Better IDE support
- Self-documenting code
- Refactor ด้วยความมั่นใจ
