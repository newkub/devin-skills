# GPUI Kit — State Model และ Async Tasks

## Recommended Patterns

### Entity/Render Mental Model

- `Entity<T>` = state ที่ retained ข้าม frames — สร้างครั้งเดียวด้วย `cx.new(|cx| ...)` แล้ว reuse
- เมื่อ `T: Render` → entity เป็น persistent view ที่ rebuild element tree ทุก render pass
- `RenderOnce` component = value ชั่วคราว รับ state + handler จาก caller — เหมาะกับ reusable piece ที่ไม่มี state ถาวร (Button, Checkbox, Label)
- กฎง่ายๆ: มี state ที่ต้องอยู่ข้าม render → `Entity`; แค่ render ตาม props → `RenderOnce`

### Ownership ของ State และ Handles

- stateful inputs (Input, Editor) สร้างเป็น `Entity<InputState>` แล้วเก็บใน struct field ของ owner view — ห้ามสร้างใหม่ใน `render`
- `cx.subscribe_in(&state, window, |view, state, ev, window, cx| ...)` คืน `Subscription` — เก็บไว้ใน field เสมอ เพราะ drop = detach
- `Task<T>` handle เช่นกัน — เก็บใน field ถ้าต้องการให้ทำงานต่อ; drop = cancel
- callbacks ใช้ `cx.listener(|this, ev, _, cx| { this.field = ...; cx.notify(); })` — mutate state แล้วเรียก `cx.notify()` เสมอ ไม่งั้น UI ไม่ redraw

### Foreground vs Background Work

- `cx.spawn(async move |this, cx| ...)` — foreground task บน UI context; update entity ผ่าน `this.update(cx, |view, cx| ...)` หรือ `WeakEntity`
- `cx.background_spawn(async move { ... })` — CPU work หนักบน worker pool; return เฉพาะ owned `Send` data เท่านั้น ห้ามแตะ entity/window ข้างใน
- pattern มาตรฐาน: spawn foreground → delegate งานหนักให้ `background_spawn` → await → `this.update()` เอาผลกลับเข้า state → `cx.notify()`
- กัน stale result ด้วย `request_id` หรือ sequence counter ใน struct — เช็คก่อน apply ผล async

## Do / Don't

| Do | Don't |
|---|---|
| เก็บ `Entity<InputState>`, `Task`, `Subscription` ใน struct field | สร้าง entity/subscription ใหม่ใน `render` |
| `cx.notify()` หลัง mutate state ทุกครั้ง | ลืม notify แล้วงงว่าทำไม UI ไม่อัปเดต |
| คำนวณหนักด้วย `cx.background_spawn` แล้วส่งผลกลับ | แก้ entity จาก background task โดยตรง |
| เช็ค `request_id`/`WeakEntity` ก่อน apply async result | assume ว่า result ที่ได้ยัง fresh เสมอ |
| อ่าน theme ผ่าน `cx.theme()` | hardcode สี เช่น `rgb(0x...)` ตรงๆ |

## Common Pitfalls

- สร้าง `InputState` ใน `render` → state หายทุก frame, cursor/text reset — ต้อง hoist ขึ้น constructor
- `Task`/`Subscription` ไม่ถูกเก็บ → cancel/detach ทันที ทำให้ดูเหมือน callback ไม่ทำงาน
- update state ใน `cx.spawn` โดยไม่ผ่าน `this.update(cx, ...)` → panic หรือ borrow error — ใช้ `WeakEntity` ถ้า view อาจถูก drop ก่อน
- `on_change` คือ requested value — owner ต้อง apply เอง (controlled component) ไม่ใช่ component แก้ state ให้

## Performance Notes

- `render` rebuild element tree ทุกครั้งที่ `cx.notify()` — keep render cheap: เตรียม derived data ไว้ใน state หรือ cache ไม่คำนวณหนักใน render
- `cx.notify()` มีต้นทุน — batch updates เมื่อทำได้ ไม่ notify ใน loop ทีละรอบ
- async result ที่มาช้า (search, file IO) ควร debounce ใน caller ก่อน spawn task ใหม่

## Ecosystem / Integration

- `init(cx)` ต้องถูกเรียกก่อนสร้าง component หรือเปิด window — initialize Kit layers + themes
- `open_window` wrap ใน `Root` ให้อัตโนมัติ — overlays (dialog/sheet/notification) อาศัย Root
- keyboard shortcuts ใช้ `Action` derive + `KeyBinding`/`cx.bind_keys` ตาม guide docs
- test ผ่าน GPUI test harness — mount view ใน test window แล้ว simulate events ได้
