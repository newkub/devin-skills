# Automation & Testing Tiers

ทุก app มี automation server ในตัว — design ให้ test ได้ทั้ง unit, harness, และ agent-driven E2E

## Recommended patterns

- **3 tiers ตาม docs (CI scaffolds จาก `native init --full`):**
  1. unit — `-Dplatform=null` (`NullPlatform`, view = f(model)) รันเร็วทุก platform ใน CI
  2. integration — Linux Xvfb + `-Dautomation=true` ขับจริงผ่าน automation protocol
  3. GUI smoke — macOS runner (deepest surface)
- **TS-level app tests ด้วย `native test` + `@native-sdk/core/testing`:**
  ```ts
  const app = await NativeApp.start({ wallMs: 0 })   // deterministic clock
  app.click("increment")
  expect(app.findWidget("count").text).toBe("1")
  app.fireTimer("tick")
  app.respond(key, bytes, ok)   // ตอบ effect/request ที่ pending
  app.verifyReplay()             // record/replay determinism
  ```
  ใช้ `snapshot.windows/effects.requests/timers` ตรวจ state แทนอ่าน widget ทีละตัว
- **Zig-level harness:** `TestHarness` (create/destroy + `BufferSink`) สำหรับ runtime wiring ที่ต่ำกว่า core
- **Agent-driven verification (file protocol):** build `-Dautomation=true` แล้วอ่าน/เขียนใต้ `.zig-cache/native-sdk-automation/`:
  - `snapshot.txt` (roles/labels/commands/ready), `accessibility.txt`, `windows.txt`, `screenshot-<view-label>.png`, `provenance.txt`
  - สั่งงานผ่าน queue: `command-<n>.txt` (CLI เขียน, runtime consume+delete = ack) — หรือใช้ CLI:
  ```sh
  native automate snapshot
  native automate assert "Counter" [--timeout-ms 5000] [--absent]
  native automate widget-click <id> | menu-command <id> | shortcut <combo> | screenshot | reload | resize | wait | bridge '<json>'
  ```
- **Record/replay:** `NATIVE_SDK_SESSION_RECORD=1` เก็บ session → `REPLAY=1` + `verifyReplay()` — ใช้เป็น regression gate หลัง refactor markup
- **Determinism:** เวลาเป็น input (`wallMs`) ไม่ใช่ ambient — app ที่ inject clock ผ่าน msg จะ test ได้ deterministic เสมอ

## Pitfalls

- **assert regex เป็น subset** — ไม่มี capture groups/alternation; เขียน pattern ง่าย ๆ ตรง text ที่ snapshot แสดง
- **golden screenshots byte-compare ได้เฉพาะ same runner image** — text measurement ต่างกันข้าม host; เก็บ goldens พร้อมระบุ image
- **อย่าลืมเปิด automation ตอน build** ที่ใช้ `native automate` — protocol dir ไม่เกิดถ้า build ปกติ (ReleaseFast ไม่มี `-Dautomation=true`)
- **command queue เป็น ack-by-delete** — ลบ/แก้ไฟล์ queue เองจะทำให้ command หายหรือ dispatch ซ้ำ; ใช้ `native automate` สั่งเสมอ
- **mobile automation คนละ path** — snapshot/actions ผ่าน embed ABI และ file protocol อยู่ใน app data container (experimental, API may change)
- **bridge responses** อ่านจาก `bridge-response.txt` — อย่า poll แบบจับ filesystem race; ให้ CLI เป็นเจ้าของ protocol
