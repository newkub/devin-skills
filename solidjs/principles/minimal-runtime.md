---
title: Minimal Runtime
description: หลักการ minimal runtime ของ SolidJS
---

## สิ่งที่คือ Minimal Runtime

SolidJS มี runtime ที่เล็กและเร็ว:

- No Virtual DOM
- Compile-time optimizations
- Direct DOM operations
- Minimal overhead

## No Virtual DOM

SolidJS ไม่ใช้ Virtual DOM:

```jsx
// React - Virtual DOM diffing
function App() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// SolidJS - Direct DOM operations
function App() {
  const [count, setCount] = createSignal(0);
  return <div>{count()}</div>;
}
```

## Compile-Time Optimizations

JSX ถูก optimize ตอน compile:

### Template Extraction

```jsx
// Source
<div><h1>Hello</h1></div>

// Compiled
const _tmpl$ = _$template(`<div><h1>Hello</h1></div>`);
```

### Reactive Binding

```jsx
// Source
<p>{name()}</p>

// Compiled
_$insert(_el$, name);
```

## Runtime Size

SolidJS bundle size เล็ก:

- Core: ~6KB gzipped
- Web: ~2KB gzipped
- Store: ~2KB gzipped

## Performance Benefits

### Fast Initial Load

- Bundle เล็ก
- Fast parsing
- Quick hydration

### Fast Updates

- Direct DOM operations
- No diffing
- Minimal reconciliation

## Best Practices

### ใช้ Compile-Time Features

```jsx
// ✅ Good - ถูก optimize ตอน compile
<For each={items()}>
  {(item) => <div>{item.name}</div>}
</For>
```

### หลีกเลี่ยง Runtime Overhead

```jsx
// ❌ Bad - สร้าง overhead
{items().map((item) => <div>{item.name}</div>)}
```

## สรุป

Minimal runtime ให้:
- Bundle size เล็ก
- Fast load times
- Fast updates
- Low memory usage
