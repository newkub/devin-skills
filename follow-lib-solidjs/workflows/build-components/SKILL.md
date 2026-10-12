---
name: follow-lib-solidjs-build-components
description: เขียน SolidJS components — props, children, control flow (<For>/<Show>/<Switch>), refs, portals
argument-hint: "[scope]"
related:
  - follow-lib-solidjs
  - run-test
  - resolve-errors
---

## Goal

เขียน SolidJS components ถูก mental model — render-once, props destructuring pitfalls, control flow components, refs/portal

## Scope

component authoring — JSX ใน Solid render-once (ไม่เหมือน React re-render); state primitives → `manage-state`

## Execute

### 1. Component Basics

```tsx
function Card(props: { title: string; children?: JSX.Element }) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
```

- **Render-once**: component body run ครั้งเดียว — reactive expressions ใน JSX เท่านั้นที่ update
- **ห้าม destructure props ทันที** — `const { title } = props` ทำลาย reactivity; ใช้ `props.title` ใน JSX หรือ `mergeProps`/`splitProps`

```ts
const [local, rest] = splitProps(props, ['title', 'variant'])
const merged = mergeProps({ variant: 'default' }, props)
```

### 2. Control Flow Components

```tsx
<Show when={user()} fallback={<Login />}>{u => <Profile user={u()} />}</Show>
<For each={items()} fallback={<Empty />}>{item => <Row item={item} />}</For>
<Switch><Match when={a()}>...</Match><Match when={b()}>...</Match></Switch>
<ErrorBoundary fallback={err => <Oops err={err} />}>...</ErrorBoundary>
```

- `<For>` = keyed (identity tracking); `<Index>` = index-based (สำหรับ primitives ที่มูลค่าเปลี่ยน)
- `<Dynamic component={Comp()} />` — dynamic component; `<Portal>` — render ข้าม DOM tree

### 3. Refs And Directives

```tsx
let inputRef!: HTMLInputElement
<input ref={inputRef} />           // หรือ ref={el => el.focus()}
```

- `ref` = element จริง ไม่ใช่ wrapper
- Directives: `use:directiveName` (`directives/` custom), `classList={{ active: isActive() }}`
- Event handlers: `onClick`, `on:input` — delegate auto; `onClick={[handler, data]}` bound args

### 4. Patterns

1. Context: `createContext` + `useContext` — ทำงานทุก component tree (ไม่ต้อง memo)
2. Lazy: `lazy(() => import('./Heavy'))` — code split
3. `children` — `props.children` evaluate once; `children(() => props.children)` สำหรับ helper

## Rules

- Props destructuring → reactivity loss — ใช้ `splitProps`/`mergeProps` เท่านั้น
- `<For>` keyed ตาม item identity — อย่าใช้ map+index ธรรมดาสำหรับ lists ที่ reorder
- JSX ไม่ใช่ template string — expressions `{...}` evaluate lazily ใน JSX scope เท่านั้น
- Component body ไม่ re-run — logic ใน body = run ครั้งเดียว; reactive logic อยู่ใน JSX/effects

## Expected Outcome

- Components reactive ถูกต้อง (ไม่พัง reactivity ผ่าน destructure)
- Control flow ใช้ components ถูกตัว
