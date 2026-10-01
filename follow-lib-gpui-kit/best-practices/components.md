# GPUI Kit — Component Composition

## Recommended Patterns

### Controlled Components

- pattern หลัก: component ส่ง requested value ผ่าน `on_change` → owner view เก็บ state เอง → `cx.notify()`
- ตัวอย่าง: `Checkbox::new("id").label("...").checked(self.flag).on_change(cx.listener(|v, checked, _, cx| { v.flag = *checked; cx.notify(); }))`
- owner เป็น single source of truth — component ไม่ถือ state ของตัวเอง (ยกเว้น `*State` entities ที่ owner ถือให้)

### Builder + Shared Traits

- ทุก component ใช้ builder chain — `Component::new(id).prop(...).on_*(cx.listener(...))`
- trait `Sizable`: `text_xs`/`text_sm`/`text_base`/`text_lg` — ต้อง `use gpui_kit::component::Sizable as _;` ถึงเรียก method ได้
- trait `Disableable`: `disabled(bool)` — import แบบเดียวกัน
- layout ด้วย `div()`/`v_flex()`/`h_flex()` + tailwind-style methods: `flex_col`, `size_full`, `gap_2`, `p_4`, `items_center`, `justify_center`

### App Shell

- skeleton: `main()` → `application().with_assets(assets::Assets).run(|cx| { init(cx); open_window(WindowOptions::default(), cx, |_, cx| cx.new(|_| MyView)).expect(...) })`
- `open_window` wrap view ใน `Root` อัตโนมัติ — return content view ตรงๆ ห้ามสร้าง `Root` เอง
- view implement `Render` — `render(&mut self, _: &mut Window, cx: &mut Context<Self>) -> impl IntoElement`

### Imports และ Dependency

- dependency เดียว `gpui-kit` — re-export `gpui`, components อยู่ใต้ `gpui_kit::component::*`
- ไม่ต้อง add `gpui`/`gpui-component`/`gpui-base` แยก — version จะ conflict ได้
- import pattern: `use gpui_kit::component::<name>::<Type>;`

## Do / Don't

| Do | Don't |
|---|---|
| apply `on_change` value ใน listener แล้ว `cx.notify()` | expect component แก้ state ให้เอง |
| เลือก component จาก catalog แล้วเช็ค docs page ก่อนใช้ | เดา props/methods จากชื่อ |
| import `Sizable`/`Disableable` trait ก่อนเรียก method | เรียก `.text_sm()` โดยไม่ import trait |
| compose ด้วย `v_flex`/`h_flex` + gap/padding | nest `div()` ลึกโดยไม่จำเป็น |
| ใช้ `gpui-kit` crate เดียว | add `gpui`/`gpui-component` แยกใน `Cargo.toml` |

## Common Pitfalls

- สร้าง `Root` เอง → overlay system (dialog/sheet/notification) ซ้อนหรือพัง — `open_window` ทำให้แล้ว
- `id` ของ component ต้อง unique ภายใน parent — reuse id ทำให้ focus/interaction state ชนกัน
- ลืม `init(cx)` → theme/component defaults ไม่ถูก setup — runtime error หรือ style หลุด
- custom color hardcode แทน `cx.theme()` — dark/light theme จะไม่ตาม

## Performance Notes

- component เป็น `RenderOnce` — สร้างใหม่ทุก render เป็นปกติ ต้นทุนต่ำ
- ที่แพงคือ `Entity` creation ใน render (ดู `state-model.md`) — ย้ายไป constructor
- list ยาวใช้ virtualized list component ของ kit แทน render ทุก row

## Ecosystem / Integration

- component catalog: `gpui-kit.com/component/<name>` — เช็คหน้าจริงก่อนใช้ component ที่ไม่คุ้น
- API reference: `docs.rs/gpui-component` และ `docs.rs/gpui-kit`
- platform deps ตาม `/docs/installation` — fontconfig/x11/vulkan บน Linux, MSVC บน Windows
- license: code Apache-2.0, docs CC BY 4.0 — credit เมื่อ copy docs
