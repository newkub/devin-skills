# SolidJS — Reactivity และ Render-Once Mental Model

Best practices สำหรับ signals, stores, effects และ props ใน Solid.js — จุดที่คนจาก React พลาดบ่อยสุด

## Recommended Patterns

### Render-Once Components

- Component function รันครั้งเดียวเพื่อ setup view — ไม่มี re-render เหมือน React; ทุกอย่างที่ต้อง reactive ต้องอยู่ใน JSX, `createMemo`, หรือ `createEffect`
- อ่าน signal ใน JSX เสมอ: `<div>{count()}</div>` — อ่านนอก JSX จะได้ snapshot ค่า ณ ตอนนั้น ไม่ reactive
- code ที่เขียนใน component body = init logic เท่านั้น — ห้ามเขียน logic ที่คาดว่าจะ re-run

### Props — ห้าม Destructure

```tsx
// ผิด — ทำลาย reactivity เพราะ destructure ตอน init
const { title } = props

// ถูก — preserve getter chain
const { local, others } = splitProps(props, ['local'])
const merged = mergeProps({ size: 'md' }, props)
```

- ใช้ `mergeProps` สำหรับ default props, `splitProps` เมื่อต้องแยก props ส่งต่อ
- access `props.title` ใน JSX/scope โดยตรง — props เป็น proxy object ที่ reactive อยู่แล้ว

### Signals vs Stores

| สถานการณ์ | ใช้ |
|---|---|
| primitive, flat state | `createSignal` |
| nested object/tree ที่ update เจาะจง field | `createStore` จาก `solid-js/store` |
| interop กับ lib ภายนอกที่ mutate โดยตรง | `createMutable` (ระวัง — ทุก mutation reactive) |

- store update ด้วย path syntax: `setState('users', 0, 'name', 'x')` หรือ `produce(draft => ...)`
- signal setter ใช้ function form `setCount(c => c + 1)` เมื่ออ้างถึงค่าเดิม — ไม่ต้องอ่าน signal ภายนอก setter

### Derived State — อย่าใช้ Effect

```ts
// ผิด — effect ไม่ใช่ที่ sync derived state
createEffect(() => setFullName(`${first()} ${last()}`))

// ถูก — memo หรือ plain function ใน JSX
const fullName = createMemo(() => `${first()} ${last()}`)
```

- simple derived value → plain function ก็พอ (Solid track ใน reactive scope ให้เอง)
- `createMemo` เฉพาะ computation ที่แพงจริงๆ — memo cache มี overhead เล็กน้อย
- `createEffect` สำหรับ side effects เท่านั้น: DOM mutation, third-party lib, logging, sync กับ external system

## Common Pitfalls

- destructure props → UI ไม่ update แบบเงียบๆ — bug ที่เจอบ่อยสุดจากคนย้ายมาจาก React
- อ่าน signal ใน component body นอก reactive scope → ได้ค่าเดิมตลอด
- ใส่ `setState` ใน `createEffect` ที่อ่าน state เดียวกัน → infinite loop (ใช้ `untrack` หรือย้ายไป event handler)
- fetch data ใน `createEffect` → ใช้ `createResource` แทนเสมอ
- ใช้ `createMemo` ทุกที่ "เผื่อ" → derived ธรรมดาไม่ต้อง memo
- nested reactivity ผ่าน function components ที่ wrap children → children re-run ทุกครั้งที่ parent signal เปลี่ยนถ้าไม่แยก scope

## Do / Don't

| Do | Don't |
|---|---|
| อ่าน signals ใน JSX/`createMemo`/`createEffect` | อ่าน signals ใน component body นอก reactive scope |
| ใช้ `batch` รวมหลาย updates เป็น tick เดียว | set signals ต่อเนื่องหลายครั้งใน handler โดยไม่ batch |
| ใช้ `on(deps, fn)` เมื่อต้องการ explicit deps | หวังว่า auto-tracking จะถูกเสมอใน callback ซับซ้อน |
| ใช้ `untrack` อ่านค่าโดยไม่สร้าง dependency | ปิด tracking ด้วยการ copy ค่าไปตัวแปรธรรมดา |
| เก็บ non-serializable objects (DOM, class instances) ใน plain variable | ใส่ใน signal/store โดยไม่จำเป็น |
| ใช้ `createRoot` + `dispose` เมื่อสร้าง reactive scope นอก component | สร้าง effects นอก root แล้วลืม dispose |

## Performance Notes

- fine-grained updates = ไม่มี VDOM diff — แต่ reactive graph ใหญ่เกินก็มีต้นทุน; แยก stores ตาม feature อย่าทำ global mega-store
- `batch` ลดจำนวน propagation rounds เมื่อ update หลาย signals พร้อมกัน
- `untrack` กัน dependency ที่ไม่ตั้งใจใน memo/effect — ช่วยตัด recompute ที่ไม่จำเป็น
- `createDeferred` สำหรับ defer updates ที่ไม่ urgent (เช่น search results, heavy lists)
- reactive reads ใน loop ใหญ่ → hoist ออกมาเป็น memo เดียวหรือใช้ `mapArray`/`indexArray` helpers

## Ecosystem / Integration

- router: `@solidjs/router` มี primitives ของตัวเอง (`createAsync`, cache) — ใช้ร่วมกับ `createResource` ได้
- TanStack Query มี `@tanstack/solid-query` — ใช้แทน `createResource` เมื่อต้องการ caching/devtools ขั้นสูง
- SSR/SolidStart: reactivity ทำงานเหมือนกันแต่ `onMount` ไม่รันบน server — ใส่ browser-only code ใน `onMount` เสมอ
- three.js/D3: เก็บ instance ใน closure + `onCleanup` dispose — ห้ามใส่ใน store (proxy พัง class internals)
- testing: `@solidjs/testing-library` + `renderHook`/`testEffect` — wrap ด้วย `createRoot` เมื่อ test primitives นอก component
