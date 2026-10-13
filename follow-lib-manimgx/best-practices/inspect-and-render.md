# ManimGX — Inspect, Render And Report

## Recommended Patterns

### The Feedback Loop

- ลำดับมาตรฐาน: write → `manimgx inspect` → ดู storyboard + timeline → fix → inspect ซ้ำ → `manimgx render` → เปิด MP4 ยืนยัน → report path
- ถือว่า exit code 1 ของ `inspect` คืองานยังไม่เสร็จ — มันคือ layout problems (mobject โดนเฟรมตัด, text ทับกัน, เส้นผ่าน text, ตัวหนังสือเล็กเกินอ่าน) ไม่ใช่ warning ให้ข้าม
- problem ใน storyboard อ้างชื่อ mobject ตามตัวแปรใน code — แก้ที่ตัวแปรนั้นตรงจุด
- ใช้ timeline ที่ `inspect` print (แต่ละ play พร้อมบรรทัด code) เป็นสคริปต์ตรวจ narrative ว่าลำดับฉากสื่อเรื่องครบ

### Targeted Sampling

- ค่า default sample แค่ play/wait endings — ฉากที่มี state กลาง animation (เช่น เส้นสัมผัสเลื่อนบนกราฟ) ต้องระบุ `-t` เพิ่ม
- `manimgx inspect scene.py -t 1.5,3,end` หรือซ้ำ flag `-t` เพื่อเจาะ moment; `-o detail.png` ตั้งชื่อ output
- ภาพเรียงตามเวลา 6 ภาพต่อ sheet เกินไปเป็น `…-2.png`; ไม่ใส่ `end` แล้ว inspect จะหยุดหลัง play ของ frame สุดท้ายที่ขอ
- inspect 3D ได้ storyboard/timeline เท่านั้น (layout checks ถูกข้าม) → ต้องดูรูปเองทุกครั้ง

### Draft Before Final

- iter เร็วด้วย `-r 1280x720 --fps 30`; ยืนยัน content ถูกแล้วค่อย final ที่ default `1920x1080` @ `60fps`
- ตั้ง `--preset` เร็วขึ้น (`veryfast`, `ultrafast`) ตอน iter, `medium` เป็นค่า default สำหรับ final; ปรับคุณภาพด้วย `--crf` (ต่ำ = ดีกว่า, default 23)
- แนวตั้ง (Shorts/Reels/TikTok) ใช้ `-r 1080x1920` — เฟรมแนวตั้งกว้าง 8 × สูง ~14.2 และ shared central 8×8 square กับแนวนอน อย่าออกแบบเผื่อเฉพาะขอบ
- ใช้ `manimgx preview` ขณะพัฒนา (replay ทุก save, คงตำแหน่งเดิม, error ทับภาพล่าสุด) แล้วปิดทิ้งก่อนเข้า CI

## Do / Don't

| Do | Don't |
|---|---|
| ตรวจว่า `manimgx --version` ได้ผลก่อนเขียน scene | `uv tool install manimgx` โดยไม่ใส่ `--python 3.14` (Python เริ่มต้นของเครื่องหา package ไม่เจอ) |
| รันคำสั่ง GPU-related นอก sandbox / ขออนุญาตผู้ใช้เมื่อ tool ต้อง approval | สรุปว่า environment พังเมื่อเห็น `no GPU adapter` (มันคือ sandbox บัง GPU) |
| `manimgx render scene.py MyScene` เมื่อ file มีหลาย scene | เดาสลับ `file`/`scene` argument order |
| เปิดไฟล์ผลลัพธ์ให้ผู้ใช้ดูพร้อมแจ้ง path | report ว่าเสร็จจาก exit code โดยไม่ดูรูป/วิดีโอ |
| commit เฉพาะ scene files + assets ที่ควบคุมได้ | commit `.mp4`, `voice/` cache หรือ generated artifacts |

## Common Pitfalls

- `render` เขียน output ข้าง file scene — ถ้ารันจาก directory อื่น path ในรายงานจะสับสน ให้ `cd` ไปยัง folder scene ก่อน
- narration ใช้ service (ค่าเริ่มต้น ElevenLabs ผ่าน fal.ai) — ถ้า `FAL_KEY` หาย `say` fail; voice cache ใน `voice/` ทำให้ render ซ้ำ offline ได้เมื่อเคยรันแล้วครั้งนึง
- scene ที่ speak แล้ว `render` จะสร้าง `.srt` ให้ด้วย — อย่าไปสร้าง subtitle ซ้ำเอง
- `inspect` ตรวจเฉพาะ moments ที่ sample ผ่านแล้วไม่ได้แปลว่าทั้งเรื่องไม่ทับกัน
- error message มี hint เมื่อชื่อ API เก่า (เช่น `ShowCreation is Create in ManimGX`) — อ่าน hint แทนการ search ใหม่

## Performance Notes

- ManimGX encode ด้วย x264 ในตัวและ render บน GPU — benchmark อย่างเป็นทางการ (Apple M4 Pro, 1080p60) ช้ากว่า ~90× เมื่อเทียบ Manim CE; ถ้าช้าผิดปกติให้สงสัยว่า fallback ไป CPU (server/container ไม่มี GPU) ไม่ใช่ code
- 36 s วิดีโอใช้เวลา render ระดับไม่กี่วินาที — ไม่มีเหตุผลให้ข้ามขั้น inspect เพื่อ "ประหยัดเวลา"
- browser path โหลด Pyodide + core ~26 MB ครั้งแรกแล้ว cache — ถ้าหลาย scene บน page เดียวให้ reuse player element เดิม

## CI Notes

- CI ต้องมี GPU adapter หรือยอมรับ CPU fallback (Linux wheels มี Mesa lavapipe มาให้) — ถ้า runner บัง device ให้ mark render step เป็น optional แล้วใช้ `inspect` + `SceneClass().render()` (ไม่ใส่ path = รันโดยไม่ draw) เป็น smoke test แทน
- ใส่ `ty check` เป็น step ก่อน render เพื่อจับ unknown keyword ที่ runtime จะเงียบ — ต้องรัน ty ด้วย `--python` ชี้ไปยัง interpreter ที่ติดตั้ง `manimgx` (venv ของ project หรือ tool env จาก `uv tool dir`) ไม่งั้น ty report `unresolved-import` แล้วเงียบกับทุกชื่อ
- ห้ามใส่ secret (`FAL_KEY`) ใน workflow env แบบ hardcode — ผ่าน repository secret/secret manager; ถ้า CI ไม่ต้องการเสียง ให้ disable narration ใน pipeline นั้น
