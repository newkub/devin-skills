# SolidJS — Rendering, Control Flow และ Async

Best practices สำหรับ control flow components, lists, resources, และ rendering performance

## Recommended Patterns

### เลือก Control Flow ให้ถูก

| Component | Use case |
|---|---|
| `<For>` | keyed lists — item ถูก track ด้วย reference, เหมาะกับ object arrays ที่ reorder/insert/remove |
| `<Index>` | unkeyed lists — track ด้วย index, เหมาะกับ primitives หรือ list ที่ items เปลี่ยนค่าแต่ตำแหน่งคงที่ |
| `<Show>` | conditional render — ใช้ callback form `{(v) => ...}` สำหรับ type narrowing |
| `<Switch>`/`<Match>` | multi-branch conditions — เลือก branch แรกที่ match |
| `<Dynamic>` | dynamic component — render component จาก variable |
| `<Portal>` | render นอก DOM tree (modals, tooltips) |
| `<ErrorBoundary>` | catch errors ใน subtree |
| `<Suspense>` | async boundary รอ resources/lazy components |

```tsx
// keyed list — For track ด้วย reference ของ item
<For each={users()}>{user => <UserCard user={user} />}</For>

// ห้าม — map ตรงๆ สร้าง elements ใหม่ทั้ง array ทุก update
{users().map(user => <UserCard user={user} />)}
```

### Async Data — `createResource`

```ts
const [data, { refetch, mutate }] = createResource(userId, fetchUser)
```

- source (arg แรก) เป็น reactive — เปลี่ยนแล้ว refetch อัตโนมัติ; ไม่ต้องการ dependency ใส่ `false`/`null`
- `mutate` สำหรับ optimistic update, `refetch` สำหรับ reload
- ใช้ `data.latest` เมื่ออยากได้ค่าล่าสุดที่ resolve (ข้าม loading state)
- ห้ามใช้ `createEffect` + signal เพื่อ fetch — resource handle dedup/cancellation/suspense ให้

### Code Splitting และ Lazy

- `lazy(() => import('./Heavy'))` สำหรับ component ใหญ่/route-level splitting
- ครอบด้วย `<Suspense>` เพื่อกำหนด fallback — หลีกเลี่ยง nested Suspense เกินจำเป็น
- preload บน hover/focus สำหรับ UX ที่ไหลลื่น: `<Link onMouseEnter={() => import('./Page')}>`

## Common Pitfalls

- ใช้ `.map()` ตรงๆ ใน JSX → ทำลาย fine-grained updates, recreate DOM ทั้ง list
- ใช้ `<Index>` กับ list ที่ reorder บ่อย → DOM ผูกกับ index ผิด item — ใช้ `<For>` แทน
- ลืม `<Show>` fallback → หน้าว่างแทนที่จะมี placeholder
- `createResource` ไม่มี reactive source → fetch ครั้งเดียวไม่ refetch เมื่อ params เปลี่ยน
- nested `<Suspense>` ทุก component → waterfall loading — ยุบ boundaries ให้น้อยลง
- render `<Portal>` โดยไม่ cleanup context — portal children ยัง reactive ต่อ parent scope อยู่

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `<For>` กับ array ของ objects | ใช้ `.map()`/`Array.map` ใน JSX กับ reactive arrays |
| ใช้ `<Index>` กับ primitives/static-length lists | ใช้ `<Index>` เมื่อ items reorder บ่อย |
| ใช้ `<Show keyed>` เมื่อต้องการ reset state ตอน value เปลี่ยน | reuse DOM ข้าม condition โดยไม่ตั้งใจ |
| ใช้ `createResource` + `<Suspense>` สำหรับ async | fetch ใน `createEffect` แล้ว set signal |
| split routes ด้วย `lazy()` | bundle ทุก page ใน initial chunk |
| wrap risky subtrees ด้วย `<ErrorBoundary>` | ปล่อย error พังทั้ง app |

## Performance Notes

- `<For>` reconcile ด้วย reference — update เฉพาะ item ที่เปลี่ยน; ระวัง fetch ให้ array ใหม่ทั้งก้อนจะย้าย DOM ใหม่ทั้งหมด (ใช้ `reconcile` ใน store ช่วย)
- ใช้ `createDeferred` กับ expensive lists/filters — input พิมพ์ลื่น ผลลัพธ์ตามมาทีหลัง
- `startTransition` สำหรับ non-blocking navigation/updates — UI ไม่กระตุกระหว่าง heavy re-render
- virtualization: list ยาวพัน+ rows ใช้ `@tanstack/solid-virtual` — `<For>` ไม่ได้ virtualize ให้
- DOM nodes ใน Solid เป็น persistent — moving item ใน `<For>` move node จริง ไม่ recreate; อย่าทำลายข้อได้เปรียบนี้ด้วย conditional remount

## Ecosystem / Integration

- SolidStart/Solid Router: `createAsync` ใช้แทน `createResource` เมื่อต้องการ SSR streaming data
- TanStack Virtual: `@tanstack/solid-virtual` ใช้คู่กับ `<For>` สำหรับ virtualized rows
- forms: `@tanstack/solid-form` หรือ Modular Forms — avoid controlled input patterns ของ React (Solid inputs uncontrolled-by-default ทำงานดีกว่า)
- animation: `solid-transition-group` หรือ animejs wrapper — exit animations ต้องใช้ transition group เพราะ Solid remove DOM ทันที
- devtools: `solid-devtools` ช่วย inspect reactive graph — ใช้ตอน debug dependency ที่ไม่คาดคิด
