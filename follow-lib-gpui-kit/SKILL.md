---
name: follow-lib-gpui-kit
description: ใช้ GPUI Kit (gpui-kit crate) สร้าง desktop app ด้วย Rust/GPUI — components, themes, Entity/Render
argument-hint: "[component-or-feature]"
related:
  - follow-lang-rust
  - follow-create-rust-cli
  - follow-my-techstack
  - deep-research
  - learn-from-web
  - deep-validate
---

## Goal

ใช้ GPUI Kit — component library ของ Longbridge บน GPUI (UI framework จาก Zed) — สร้าง desktop application ด้วย Rust อย่างถูกต้องตาม official docs

## Scope

ใช้เมื่อ project ติดตั้งหรือพัฒนา `gpui-kit` crate (Rust) — components, themes, Entity/Render model, window/app shell, input state, testing

- docs site: <https://gpui-kit.com> (มี `llms-full.txt` รวมเอกสารทั้งหมดเป็นไฟล์เดียว)
- crate `gpui-kit` รวม GPUI + GPUI Base + GPUI Component + default icon assets ใน dependency เดียว — `use gpui_kit::*` re-export GPUI essentials, components อยู่ใต้ `gpui_kit::component::*`
- API reference: `docs.rs/gpui-component` และ `docs.rs/gpui-kit`
- component catalog ทั้งหมดอยู่ใน ; app skeleton อยู่ใน 

## Execute

### 1. Check Manifest And Version

> Goal: ยืนยัน version จริงก่อนเขียน code

1. ตรวจ `Cargo.toml` ของ project ว่ามี `gpui-kit` แล้วหรือยัง
2. รัน `cargo search gpui-kit --limit 3` หรือ `/deep-research` เพื่อยืนยัน version ล่าสุด (docs แสดง v0.7.0 เป็น latest)
3. ติดตั้งด้วย `cargo add gpui-kit` — ไม่ pin version ตายตัวใน skill (ตรวจสดทุกครั้ง)
4. ดึง metadata + links จาก official docs ผ่าน `/learn-from-web`

### 2. Scaffold App Skeleton

> Goal: app บูตได้ถูกต้องตาม official pattern

1. `main()` เรียก `application().with_assets(assets::Assets).run(|cx| { init(cx); open_window(WindowOptions::default(), cx, |_, cx| cx.new(|_| MyView)).expect(...) })` — ดู skeleton เต็มใน 
2. `init(cx)` ต้องถูกเรียกก่อนเปิด window หรือสร้าง component — initialize Kit layers + component themes
3. `open_window` wrap view ใน `Root` อัตโนมัติ (Root เป็นเจ้าของ dialog/sheet/notification overlays) — return content view ตรงๆ ห้ามสร้าง `Root` เอง
4. view struct implement `Render` — `render(&mut self, _: &mut Window, cx: &mut Context<Self>) -> impl IntoElement`

### 3. Apply Entity/Render Mental Model

> Goal: ใช้ state model ถูกต้อง

1. `Entity<T>` = retained state ข้าม frames; เมื่อ `T: Render` entity คือ persistent View ที่สร้าง element tree ใหม่ทุก render
2. `RenderOnce` component = value ที่ caller ส่ง state + handlers เข้าไป — ใช้สำหรับ reusable piece ไม่มี state ถาวร
3. stateful inputs (Input, Editor ฯลฯ) เก็บเป็น `Entity<InputState>` ใน owner view — `cx.new(|cx| InputState::new(window, cx))` แล้ว subscribe ผ่าน `cx.subscribe_in(&state, window, ...)` เก็บ `Subscription` ไว้ใน struct
4. callbacks ใช้ `cx.listener(|this, ev, _, cx| { ...; cx.notify(); })` — อัปเดต state แล้ว `cx.notify()` เสมอ
5. theme colors อ่านผ่าน `cx.theme()` เช่น `.bg(cx.theme().background)` `.text_color(cx.theme().foreground)`

### 4. Select And Compose Components

> Goal: เลือก component ถูกและใช้ API ถูก

1. เลือกจาก catalog ใน  — import pattern `use gpui_kit::component::<name>::<Type>;`
2. builder pattern: `Checkbox::new("id").label("...").checked(self.flag).on_change(cx.listener(|v, checked, _, cx| { v.flag = *checked; cx.notify(); }))`
3. shared traits: `Sizable` (`text_xs`/`text_sm`/`text_base`/`text_lg`) และ `Disableable` (`disabled(bool)`) — import trait `use gpui_kit::component::Sizable as _;`
4. layout ด้วย `div()`/`v_flex()`/`h_flex()` + tailwind-style methods (`flex_col`, `size_full`, `gap_2`, `p_4`, `items_center`, `justify_center`)
5. `on_change` ส่ง requested value — owner เก็บ value เองแล้ว `cx.notify()` (controlled component pattern)

### 5. Background Work And Events

> Goal: async/task ถูกต้อง

1. `cx.spawn(async move |this, cx| ...)` = foreground task บน UI thread — update entity ผ่าน `this.update(cx, |view, cx| ...)` หรือ `WeakEntity`
2. `cx.background_spawn(async move { ... })` = work หนักบน worker pool — return owned `Send` data เท่านั้น ห้าม mutate entity ตรงๆ
3. `Task<T>` handle: drop = cancel — เก็บ handle ใน struct field เสมอถ้าต้องการให้ทำงานต่อ; ใช้ request_id กัน stale results
4. keyboard/action: `Action` derive + `cx.bind_keys`/`KeyBinding` ตาม guide docs

### 6. Verify

> Goal: build + test ผ่าน

1. `cargo build` — แก้ error จนผ่าน (GPUI ต้องการ platform deps: ดู `/docs/installation`)
2. UI tests ใช้ GPUI test harness (`cargo test` mount view ใน test window — ตัวอย่างใน getting-started)
3. ทำ `/deep-validate` ก่อน ship

## Rules

### 1. Official Docs First

- docs หลัก: `gpui-kit.com` — ดึง `llms-full.txt` เมื่อต้องการเอกสารรวมทั้ง site
- component page pattern: `gpui-kit.com/component/<name>` — เช็คหน้าจริงก่อนใช้ component ที่ไม่คุ้น
- ห้ามเดา props — ถ้าไม่แน่ใจอ่าน docs page หรือ `docs.rs` ก่อน

### 2. Ownership

- `Task`/`Subscription` ต้องเก็บใน struct field — drop คือ cancel/detach
- state ของ input components อยู่ใน `Entity<*State>` ที่ owner view — ห้าม recreate ใน `render`
- `on_change` = requested value เท่านั้น — owner apply เอง

### 3. Single Dependency

- ใช้ `gpui-kit` ตัวเดียว — ไม่ต้อง add `gpui`, `gpui-component`, `gpui-base` แยก (kit re-export ให้)
- platform system deps (fontconfig, x11, vulkan ฯลฯ บน Linux; MSVC บน Windows) ตาม `/docs/installation`

### 4. Licensing

- code Apache-2.0; docs prose CC BY 4.0 — credit GPUI Kit + link source เมื่อ copy เอกสาร

- ใช้ /deep-research ถ้าจำเป็น
- ใช้ /follow-lang-rust ถ้าจำเป็น
- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `gpui-kit` ติดตั้ง version ล่าสุดที่ stable
- app skeleton บูตด้วย `application()` + `init(cx)` + `open_window`
- components ใช้ controlled pattern ถูก (`on_change` + owner state + `cx.notify()`)
- tasks/subscriptions มี owner ไม่ leak
- `cargo build` ผ่าน พร้อมใช้งานต่อบน desktop (และ WebAssembly target ได้)
