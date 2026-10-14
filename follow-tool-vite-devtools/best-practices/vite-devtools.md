# Vite DevTools — Best Practices

Devtools framework ของระบบนิเวศ Vite — dock เดียว, RPC type-safe, shared state, plugin `devtools.setup`

## Recommended Patterns

- เปิดใช้แบบจงใจ — เลือก `apply` ตามความต้องการจริง (`'serve'` ระหว่าง dev เท่านั้น ถ้าไม่ต้องการ devtools ใน build) อย่าปล่อย `devtools: true` ไว้เพราะลองเล่น
- ใช้ launcher ใน dock เป็นช่องทางติดตั้ง integration on demand — ตัวที่โปรเจกต์มีอยู่แล้วจะ mount อัตโนมัติ ไม่ต้อง add dependency เอง
- สร้าง UI ของ tool ตัวเองใน `Plugin.devtools.setup` เท่านั้น — dock/palette/terminal/renderer อยู่ใน ctx นี้หมด
- ถ้ามี Devframe definition อยู่แล้ว → `createPluginFromDevframe` ตัวเดียวจบ อย่าเขียน plugin ซ้ำซ้อนทับ
- ตั้ง `embeddedVisibility: 'passive'` ให้ทีมที่รำคาญ dock ถาวร — shortcut `Shift + Alt + D` แล้วระบบจำไว้ให้
- อ่าน error code จาก docs (DTK00xx ของ Kit, RDDT00xx ของ Rolldown) ก่อน debug เอง

## Common Pitfalls

- `devtools: true` เปิดทั้ง `vite dev` และ `vite build` — ตั้งแบบ shorthand แล้วเจอ devtools ติดไปใน output ที่ build แล้วโดยไม่ตั้งใจ
- `build.injection: true` โดยไม่มี `build.withApp: true` → ไม่ได้ผล (injection ต้องคู่กับ with app เสมอ)
- ลืมว่า deployed assets ต้องอยู่ใต้ Vite `base` → dock เปิดได้ตอน local แต่ 404 บน staging
- โปรเจกต์ที่ Vite ไม่ได้เสิร์ฟ HTML (JS-only entry, middleware mode, backend integration) ตั้ง `embeddedVisibility` แล้วไม่มีผล — ต้องใช้ client injector จาก browser entry
- import injector หลาย mode พร้อมกัน (`inject` + `inject-passive`) → dock ซ้ำ/พฤติกรรมชนกัน เลือก entry เดียว
- hardcode `/__devtools/` ในโค้ดแอป — path นี้ต้องประกอบจาก `base`
- พึ่ง `@vitejs/devtools-vite` ที่ upstream ยังระบุ "work in progress" เป็นส่วนสำคัญของ workflow

## Perf / DX Notes

- เปิด devtools เฉพาะ `serve` ในโปรเจกต์ที่ build time สำคัญ — ไม่ต้องจ่ายค่า build analysis ทุก CI build
- ใช้ Rolldown DevTools (module graph, chunk treemap, plugin hook cost, session compare) เป็นชั้นวัดก่อน `/optimize-bundle` ไม่ใช่หลัง
- Vitest dock รัน `vitest --ui` เป็น iframe — ถ้า CI ไม่มี browser ให้เปิดเฉพาะ local
- ถ้าโปรเจกต์มี devtools hub ของตัวเองอยู่แล้ว (เช่น `/use-wrikka-vite-devtools`) ให้รวมเข้า dock เดียวผ่าน `createPluginFromDevframe` แทนการเปิดสองระบบขนาน

## Do / Don't

| Do | Don't |
|----|-------|
| เลือก `apply` ให้ตรงคำสั่งที่ต้องการ | ปล่อย shorthand แล้ว Surprise ใน build |
| `build.withApp: true` ก่อน `build.injection: true` | ตั้ง injection เดี่ยว ๆ |
| client injector 1 entry ต่อ visibility mode | import หลาย entry พร้อมกัน |
| dock `id` คงที่เพราะ user bookmark | เปลี่ยน id ทุก release |
| reuse Devframe definition ผ่าน Kit adapter | เขียน integration ใหม่ต่อ host |
| ประกอบ path จาก Vite `base` | hardcode `/__devtools/` |
