| command | description | options |
|---|---|---|
| `manimgx --version` | พิมพ์เวอร์ชันที่ยืนยันว่า tool ติดตั้งถูกตัว | --version, --help |
| `manimgx inspect <file> [Scene]` | รัน scene โดยไม่ทำวิดีโอ — print timeline (แต่ละ play พร้อมบรรทัด code), ตรวจ 2D layout, เขียน `<Scene>.storyboard.png`; exit 1 เมื่อมี layout problems | -t/--time `<sec>|end` (ซ้ำหรือคั่น `,`), -o/--output `<path>` |
| `manimgx render <file> [Scene]` | ทำ MP4 ข้าง file แล้ว print path (+ `.storyboard.png`, `.srt` เมื่อ scene speak) | -o/--output (default `<Scene>.mp4`), -r/--resolution `WxH` (default 1920x1080), --fps `<int≥1>` (default 60), --preset `ultrafast…placebo` (default medium), --crf `<0–51>` (default 23.0) |
| `manimgx preview <file> [Scene]` | เปิด window เล่น scene และ replay ทุกครั้งที่ save file หรือ module ที่ import จากข้างๆ | keys: Space play/pause, ←/→ ±5s, `,`/`.` ทีละ frame, Ctrl/Option+←/→ ทีละ play, N/P สลับ scene, ? shown keys, Ctrl+C/ปิด window หยุด |
| `manimgx present <file> [Scene]` | ทำวิดีโอแล้วแสดง section เป็น slides ในเบราว์เซอร์ (คู่กับ `self.next_section()`) | like `render` |
| `uv tool install --python 3.14 manimgx` | ติดตั้ง CLI บน PATH (แนะนำสำหรับ agent) | ต้องคง `--python 3.14`; PATH ไม่รวม `~/.local/bin` → `uv tool update-shell` แล้วเปิด shell ใหม่ |
| `uvx --python 3.14 manimgx <command>` | รัน CLI โดยไม่ติดตั้งถาวร | — |
| `pip install manimgx` | ติดตั้งใน venv ที่เป็น Python 3.13/3.14 | interpreter เก่ากว่าจะหา package ไม่เจอ |
| `npm install manimgx` | ติดตั้ง web player (`<manimgx-player>` + Pyodide/WebGPU) | — |
| `ty check <file>` | type-check scene (จับ unknown keyword/ชื่อ API ก่อน render) | --python `<interpreter ที่ติดตั้ง manimgx>` — ไม่งั้น report `unresolved-import`; venv = `.venv/Scripts/python.exe` (Windows) / `.venv/bin/python`, uv tool = `<uv tool dir>/manimgx/Scripts/python.exe` หรือ `/bin/python`; https://docs.astral.sh/ty/ |
