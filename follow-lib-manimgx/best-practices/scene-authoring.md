# ManimGX — Scene Authoring

## Recommended Patterns

### File And Class Shape

- 1 scene file = 1 เรื่อง/1 output — ตั้งชื่อ file ตามเนื้อหา (`derivative.py`) แล้วให้ class name เป็นชื่อเดียวกันเพื่อที่ output (`<Scene>.mp4`, `<Scene>.storyboard.png`) จะอ่านออก
- `def construct(self) -> None:` ใส่ return type ให้ checker เห็น signature ครบ
- แยก scene ที่ reuse ได้เป็น class ย่อยใน file เดียว เมื่อต้อง render หลายคลิปจากชุด mobject เดียวกัน (อย่าแยกเป็น package เล็กเกินความจำเป็น)
- เริ่มจาก template ของ official quickstart แล้วแก้ค่า อย่าเริ่มจาก structure ที่ออกแบบเอง

### Placement Discipline

- compute layout ก่อน animate: สร้าง mobject → `.to_edge()` / `.next_to(..., buff=)` / `VGroup(...).arrange()` → ค่อย `self.play(...)`
- ใช้ relative placement (`.next_to(formula, m.DOWN)`) แทน hardcode `.move_to([x, y, 0])` เมื่อตำแหน่งขึ้นกับ content — ขนาด text เปลี่ยนแล้ว layout ไม่พัง
- เว้นระยะด้วย `buff=` เสมอ ห้ามบวก offset เองมั่วๆ; ตัวเลข `font_size` ที่เล็กเกินจะโดน `inspect` จับ
- จุดทุกตัวเป็น 3-element list `[x, y, 0]` แม้ใน 2D

### Timing

- คุมเวลาด้วย `run_time=` ต่อ play และ `self.wait(n)` เมื่อต้องการหยุดคิด — อย่าทำ play ต่อเนื่องกันโดยไม่กำหนดเวลาแล้วหวังให้ sync กับ narration
- use `Succession` สำหรับลำดับ, `LaggedStart` สำหรับ stagger, `AnimationGroup` สำหรับพร้อมกัน; animations ของ mobject เดียวที่เริ่มพร้อมกันจะรวมกัน (movements add)
- `.animate` chain ใช้ได้หลาย method เรียงกัน และใน `Succession` แต่ละ `.animate` เริ่มจากจุดที่อันก่อนจบ
- rotation เป็นการหมุนทั้ง rigid piece รอบจุดเดียว — ถ้าต้องการ rotate about origin ใช้ `rotate(angle, about_point=m.ORIGIN)`

### Simulation And Updaters

- updater ได้รับ exact time since last call และรันต่อขณะ animation ของ mobject นั้นเล่นอยู่ — integrate จาก dt ไม่ใช่ ++ counter
- ใช้ time-based clock (`lambda mob: f(scene.time)`) เพื่อให้ผลเหมือนเดิมที่ทุก fps/ความละเอียด
- อย่าใช้ `self.wait()` เป็น timing ของ simulation — ใช้ `run_time` ของ animation ที่ drive updater

## Do / Don't

| Do | Don't |
|---|---|
| `import manimgx as m` แล้วเรียก `m.<Name>` | `import manim` หรือ module path แบบ CE (`from manimgx.utils.x import y`) |
| raw string สำหรับ math: `m.MathTex(r"\int_0^1 x^2 \, dx")` | non-raw string ที่ backslash จะถูก Python กิน |
| `box.animate.shift(m.RIGHT)` | `ApplyMethod(box.shift, ...)`, `ScaleInPlace`, `FadeToColor` (deprecated ใน GX) |
| `self.add(mob)` เพื่อแสดงโดยไม่ animate | นึกว่า `self.add()` หน่วงเวลา (time ไม่เดิน) |
| ทุกอย่างใน x ∈ [-7, 7], y ∈ [-4, 4] | วาง mobject ชิดขอบแล้วเพิ่งมารู้ตอนดู MP4 |
| `m.config.background_color = m.WHITE` หลัง import | แก้ config ก่อน import หรือหลังเริ่ม scene |

## Common Pitfalls

- keyword ผิดสะกด (`colour=`, `fill_oppacity=`) ไม่ error ตอน runtime — mobject เงียบๆ กลืน keyword นั้น ทำให้สี/opacity ไม่เปลี่ยน; ต้องให้ `ty` จับ
- ทุก scene มี camera เคลื่อนที่ได้เอง — ไม่ต้องใช้ `MovingCameraScene` (class นั้นถูก merge เข้า `Scene`)
- `VGroup` และ `Group` ใช้ได้เหมือนกัน, `c2p` และ `coords_to_point` ก็เหมือนกัน — docs ใช้ `VGroup`/`c2p` เป็นหลัก
- LaTeX advanced ที่ต้อง `\def` หรือ `usepackage` จะไม่ถูก convert ไป Typst — math พื้นฐาน/ทั่วไปใช้ได้, สืบทอด complex macro ไม่ได้
- 3D + 2D วางรวมกันได้ แต่ 2D layout checks ของ `inspect` จะถูกข้ามใน 3D scene — ต้องดู storyboard เอง
- ไฟล์มีหลาย scene แต่ไม่ส่งชื่อ scene ในคำสั่ง render → CLI ไม่รู้จะตัวไหน

## Testing Notes

- เรียก `SceneClass().render()` โดยไม่ใส่ path เพื่อรัน scene จริงโดยไม่ draw — เป็น smoke test เร็วใน test suite
- assert จากเวลาของ scene (ผลรวม `run_time`) ไม่ใช่จากขนาดไฟล์ MP4 — ขนาด-bitrate ไม่ deterministic ข้าม platform
- ถ้า test ต้อง render จริงให้จำกัดที่ low resolution (`m.config.pixel_width/height`) เพื่อไม่ให้ suite ช้า
