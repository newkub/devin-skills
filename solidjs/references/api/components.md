---
title: Components & Web APIs
description: Component, Web, Server APIs และ JSX Attributes
---

# Components & Web APIs

คู่มือ Component, Web, Server APIs และ JSX Attributes ของ SolidJS

## Component API

### Component

Component function สำหรับสร้าง UI

```tsx
import { Component } from 'solid-js';

const MyComponent: Component<Props> = (props) => {
  return <div>{props.name}</div>;
};
```

### Show

Conditional rendering

```tsx
<Show when={condition()} fallback={<Fallback />}>
  <Content />
</Show>
```

### For

List rendering

```tsx
<For each={items()} fallback={<Empty />}>
  {(item, index) => <Item item={item} index={index()} />}
</For>
```

### Index

List rendering ด้วย index-based reconciliation

```tsx
<Index each={items()} fallback={<Empty />}>
  {(item, index) => <Item item={item} index={index()} />}
</Index>
```

### Switch

Multiple conditions

```tsx
<Switch fallback={<Default />}>
  <Match when={condition1()}>
    <Case1 />
  </Match>
  <Match when={condition2()}>
    <Case2 />
  </Match>
</Switch>
```

### Suspense

Async boundary

```tsx
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

### SuspenseList

จัดการ multiple Suspense boundaries พร้อม reveal order

```tsx
<SuspenseList fallback={<Loading />}>
  <Suspense fallback={<Loading1 />}>
    <Component1 />
  </Suspense>
  <Suspense fallback={<Loading2 />}>
    <Component2 />
  </Suspense>
</SuspenseList>
```

### ErrorBoundary

Error handling

```tsx
<ErrorBoundary fallback={(err) => <Error />}>
  <Component />
</ErrorBoundary>
```

## Web API

### render

Render component ไปยัง DOM

```tsx
import { render } from 'solid-js/web';

render(() => <App />, document.getElementById('app'));
```

### hydrate

Hydrate SSR content

```tsx
import { hydrate } from 'solid-js/web';

hydrate(() => <App />, document.getElementById('app'));
```

### Portal

Render children ไปยัง DOM ที่ต่างกัน

```tsx
import { Portal } from 'solid-js/web';

<Portal mount={document.getElementById('modal')}>
  <Modal />
</Portal>
```

### Dynamic

Render component แบบ dynamic ตาม prop

```tsx
import { Dynamic } from 'solid-js/web';

<Dynamic component={currentComponent()} />
```

### mergeProps

รวม props objects หลายตัวแบบ reactive

```tsx
import { mergeProps } from 'solid-js/web';

const merged = mergeProps(defaultProps, userProps);
```

### splitProps

แยก props object เป็นหลาย objects โดยไม่เสีย reactivity

```tsx
import { splitProps } from 'solid-js/web';

const [local, others] = splitProps(props, ['class', 'style']);
```

## Server API

### createServerContext

สร้าง context สำหรับ server-side

```tsx
import { createServerContext } from 'solid-start/server';

const Context = createServerContext();
```

## Special JSX Attributes

### ref

DOM reference

```tsx
<div ref={el => console.log(el)} />
```

### on:*

Event listeners

```tsx
<div onClick={handler} />
<div on:click={handler} />
```

### use:*

Directives

```tsx
<div use:clickOutside={handler} />
```

### prop:*

Property binding

```tsx
<input prop:value={value()} />
```
