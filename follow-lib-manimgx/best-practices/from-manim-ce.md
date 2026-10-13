# ManimGX — Coming From Manim CE

## Recommended Patterns

### Migration Order

- copy scene เข้า file ใหม่ในโปรเจกต์ ManimGX แล้วรัน `manimgx inspect` ทั้งยังไม่ได้แก้อะไร — signal แรกคือ error/hint ของ CLI ไม่ใช่ grep หา rename เอง
- แก้ import เป็น `import manimgx as m` ก่อนอื่น (Manim CE module paths ไม่มีอยู่จริงใน GX) แล้วค่อยไล่ API names
- ใช้ hint จาก error เป็น guide: CLI พิมพ์บรรทัดที่ fail และบอกชื่อใหม่ (`ShowCreation is Create in ManimGX`)
- รัน `ty check` หลังกู้ import เสร็จ — มันจับ keyword ที่ runtime จะเงียบ
- ทำ snapshot output ของ CE scene (สคริปต์ + เฟรมอ้างอิง) ไว้เทียบ composition แล้ว compare กับ storyboard ของ GX ทีละ moment

### Name Map

- เปลี่ยนชื่อที่ deprecated (ชื่อเก่ายังใช้ได้แต่ editor จะ mark): `ShowCreation` → `Create`, `arrange_submobjects` → `arrange`, `PGroup` → `Group`, `add_foreground_mobject` → `add_foreground_mobjects`, `get_edge_center(m.UP)` → `get_top()`
- `rotate_about_origin(angle)` → `rotate(angle, about_point=m.ORIGIN)`
- `MovingCameraScene` → `Scene` — ใน GX กล้องของทุก scene เคลื่อนที่ได้
- `ApplyMethod(square.scale, 2)`, `ScaleInPlace(square, 2)`, `FadeToColor(square, m.RED)` → `.animate`: `square.animate.scale(2)`, `square.animate.set_color(m.RED)`
- `VGroup` ≡ `Group`, `c2p` ≡ `coords_to_point` — ทั้งคู่คงไว้ docs ใช้ชื่อแรก

### Behavior Differences To Re-check

- quality flags ของ CE (`-ql`, `-qh`) ไม่มีใน GX → ใช้ `-r <WxH>` และ `--fps <n>` แทน
- เฟรมแนวตั้ง: CE กว้าง ~4.5 หน่วย แต่ GX กว้าง 8 หน่วย (สูง ~14.2) โดยสั้นของเฟรมเป็น 8 หน่วยเสมอ — layout ที่อิงค่าเดิมต้องคำนวณใหม่ หรือตั้ง `config.frame_height`
- ทุก frame แสดง scene ที่ time ของมันเองที่ทุก fps และวิดีโอจบด้วย last frame ของ scene — scene ที่พึ่ง "frame สุดท้ายไม่ถูกวาด" แบบ CE จะต่างออกไป
- `.animate` apply ตอน animation เริ่ม, ใน `Succession` แต่ละ `.animate` เริ่มจากจุดจบของอันก่อน
- rotation หมุนทั้ง object เป็น rigid piece รอบจุดเดียว — CE ที่ compose การหมุนหลายชั้นให้ตรวจผลลัพธ์
- animation ของ mobject เดียวที่เริ่มพร้อมกันจะถูก combine (movements บวกกัน)
- LaTeX → Typst: `Tex`/`MathTex` ทำงานได้โดยไม่มี LaTeX install แต่ LaTeX packages และ `\def` macros ไม่ถูก convert — scene ที่พึ่ง `\\usepackage` หรือ custom macro ต้อง rewrite math ส่วนนั้นเป็น Typst-compatible หรือใช้ `Text`

### Plugin Replacements

- `manim-voiceover` → ในตัว: `with self.voiceover(...) as tracker:` + `run_time=tracker.duration` → `self.say("... [words] ...", anims...)`
- `manim-slides` → ในตัว: `self.next_slide()` → `self.next_section()`, `loop=True` → `"presentation.loop"`, `notes=` คงเดิม; เปิดด้วย `manimgx present`
- shape booleans ที่มาจาก plugin/`manimpango` และ CJK text ยังไม่รองรับใน browser path — ตรวจก่อนว่าต้องใช้ไหม

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `.animate` สำหรับ method ที่เคย `ApplyMethod` |คง `ApplyMethod` ไว้เพราะ "ยังรันได้" |
| ตรวจ vertical frame size ใหม่ (8 × ~14.2) | ลอกพิกัดของ CE 9:16 มาตรงๆ |
| rewrite math ที่พึ่ง `\def`/packages | งง ว่าทำไม formula หายไปเงียบๆ |
| รัน GX scene บน CE setup เพื่อเทียบ | สับสนว่า `no module named manimgx` คือปัญหาของ GX (จริงคือ environment) |

## Common Pitfalls

- จุดที่มักพลาดคือ `import` path ของ helpers: `from manimgx.utils.polylabel import polylabel` → ใช้ไม่ได้ ต้อง `from manimgx import polylabel`
- keyword ที่สะกดผิด/ตกไปจาก CE จะไม่ error — ผลลัพธ์เงียบๆ เปลี่ยน เช่น `fill_colour` ทำให้ shape ใส
- deprecated names ยังรันได้ แต่ `ty`/editor จะ mark ว่า deprecated — migration จบจริงเมื่อไม่มี mark เหลือ
- scene ที่พึ่ง frame counting ใน updater จะได้ผลต่างจาก CE เพราะ GX ส่ง exact dt ต่อ call — rewrite เป็น time-based
