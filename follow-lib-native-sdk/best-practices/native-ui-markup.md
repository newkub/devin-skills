# .native Markup Patterns

markup เป็น declarative UI ล้วน — ไม่มี logic นอกจาก binding expressions ที่ derive จาก `Model`

## Recommended patterns

- **Layout ด้วย flex primitives:** `<row>`/`<column>` พร้อม `gap padding grow` + `main` (cross-axis alignment: `center`) และ `cross` — เช่น header row:
  ```xml
  <column gap="12" padding="16">
    <row gap="8" cross="center">
      <text grow="1">Counter</text>
      <button size="sm" variant="ghost" on-press="reset">Reset</button>
    </row>
    <text>{count}</text>
    <status-bar>total: {total} | stamped: {stampedMs}ms</status-bar>
  </column>
  ```
- **Binding syntax:** `{expr}` — attribute ละหนึ่ง expression พอดี; text node ผูกตรงได้ (`<text>{count}</text>`)
- **Event = dispatch Msg:** `on-press="increment"`, parameterised: `on-press="toggle:{t.id}"` — markup ไม่เรียก function, ส่ง msg ให้ `update` เท่านั้น; events อื่น: `on-toggle on-change on-submit on-input on-scroll on-resize on-drag on-dismiss on-hold on-hover-enter on-hover-leave on-double-press`
- **Control flow จำกัดเท่าที่มี:** `<for each="{items}" key="{it.id}" as="t">`, `<if test="{model.loading}">…<else>…` — ไม่มี switch/computed ใน markup → derive เป็น field ใน Model แทน
- **Expression language เป็น closed lib:** operators `+ - * / == != < <= > >= and or not ++` + functions 17 ตัว: `upper lower trim min max abs round floor ceil plural pad fixed thousands percent date time datetime` — ไม่มี method calls, ไม่มี ternary, limits: 256B/64 terms/16 levels → ถ้า expression ยาวกว่านี้ แปลงเป็น computed field ใน core
- **Component reuse:** `<template name="row-item" args="title subtitle">…<slot/></template>` + `<use template="row-item" title="{x}">` + `<import src="src/components/row-item.native">` — convention: shared components ใต้ `src/components/`
- **Theming ด้วย token names เสมอ** (ห้าม hardcode สี): `background surface surface_subtle text text_muted border accent destructive success warning info focus_ring scrim disabled` + radii `sm md lg xl none` — pack เลือกใน `app.json` (`house`/`geist`), runtime override ผ่าน `themeState(model): ThemeState {pack?, colorScheme, accent, highContrast, reduceMotion}`
- **Widget identity เป็น structural** — ซ้ำกันต้องใช้ `key` (ใน `<for>`) หรือ `global-key` ไม่งั้น automation/state mapping เพี้ยน
- **Native controls เมื่อต้องการ OS feel:** `toolbar titlebar_accessory sidebar statusbar split stack button icon_button list_item checkbox toggle segmented_control text_field search_field label progress_indicator webview` — pipeline text ด้วย `|` separators

## Pitfalls

- **`switch` element ใน counter template** ไม่ใช่ Msg — เป็น element ชื่อ `switch` (เหมือน toggle); ระวังสับสนกับ control-flow
- **attribute values เป็น strings** — ตัวเลข/boolean ใน binding ต้อง match type ที่ core expects (`checked="{ticking}"` ต้องได้ Bool จาก Model)
- **list/grid ต้องมี virtualization awareness** — dataset ใหญ่ใช้ `<scroll>` + `<list>` ไม่ใช่ `<for>` ทบซ้อนใน `stack`
- **terminal element** `<terminal pty="{key}">` ผูกกับ `Cmd.ptySpawn/Write/Resize/Kill` (libghostty-vt; Windows ConPTY ต้องการ 1809+) — ห้ามส่ง bytes ก่อน spawn สำเร็จ
- **dynamic images** ต้อง model-owned `ImageId` ผ่าน `Cmd.imageLoad(id,…)` — cap 16 slots, unregister เมื่อเลิกใช้
- **markup reload ตอน `native dev`** hot-reload ได้โดย state คงเดิม — แต่เปลี่ยน binding ที่ reference field ใหม่ต้อง `native check` ผ่านก่อน เพราะ checker ทำงานฝั่ง core
- **debug tools:** `native markup check|dump|lsp` — ใช้ `dump` ดู parse result ก่อนเดาว่า markup ผิดตรงไหน
