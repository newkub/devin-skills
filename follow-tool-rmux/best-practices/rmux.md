# RMUX — Best Practices

Terminal multiplexer สำหรับ automation และ scripting

## Recommended Patterns

- Sessions มีชื่อบรรยายงาน — `rmux new -s <name>`; list ด้วย `rmux ls` ก่อน attach
- Scripting: send-keys/new-window/split commands ผ่าน CLI — layout reproducible สำหรับ dev envs
- Detached sessions สำหรับ long-running tasks — survive SSH disconnects
- Windows/panes per concern — logs หนึ่ง pane, server หนึ่ง, editor หนึ่ง
- Capture output: `capture-pane` สำหรับ programmatic reads — automation reads panes ไม่ใช่ logs เท่านั้น

## Common Pitfalls

- Orphaned sessions กิน RAM/processes — `rmux kill-session` cleanup เป็นส่วนหนึ่งของ workflow
- send-keys เร็วเกิน shell รับ = dropped input — เพิ่ม sleeps หรือ wait-for patterns ใน scripts
- Env vars ใน session = snapshot ตอน create — respawn session เมื่อ env เปลี่ยน
- Scripting timing: pane ready ≠ command done — poll output/capture-pane แทน fixed sleeps เมื่อทำได้
- Shared session collisions: scripts ตั้งชื่อ unique ต่อ run หรือ check exists ก่อน

## Automation

- Dev env bootstrap: script = rmux commands สร้าง layout + เริ่ม services — one-command environment
- CI/testing: rmux เหมาะ local automation; CI ใช้ proper job orchestration ไม่ใช่ tmux-style hacks
- Logging: pane output transient — persistent logs redirect ไปไฟล์แยก

## Do / Don't

| Do | Don't |
|----|-------|
| named sessions + scripted layouts | ad-hoc unnamed sessions กระจาย |
| capture-pane สำหรับ automation reads | fixed sleeps ทุกจุด |
| cleanup sessions เมื่อจบ | accumulate orphans |
| env-aware session respawn | assume env refresh อัตโนมัติ |
