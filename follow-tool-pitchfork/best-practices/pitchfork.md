# pitchfork — Best Practices

Daemon/process manager สำหรับ dev workflows — start, stop, supervise

## Recommended Patterns

- Declare daemons ใน pitchfork config ต่อ project — name, command, cwd, env, auto-restart policy
- ใช้สำหรับ dev-time services: watchers, local servers, db proxies — ไม่ใช่ production supervisor
- `pitchfork start/stop/list/logs` — consistent CLI แทน ad-hoc `&` background jobs
- Auto-restart เฉพาะ services ที่ crash-recoverable — restart loops บน broken config = noise
- Log capture ต่อ daemon — `pitchfork logs <name>` แทน redirect ไฟล์เอง

## Common Pitfalls

- Daemon drift: process ที่ช้างนอก pitchfork ไม่ tracked — start/stop ผ่าน pitchfork เท่านั้น
- Env ตอน spawn = snapshot — env changes ต้อง restart daemon ไม่ใช่ expect reload
- Port conflicts เมื่อ daemon เก่าค้าง — `pitchfork list` เช็คก่อน assume clean state
- Auto-restart ซ้อน retry storms — backoff/max-restart limits
- Cleanup ตอน done — daemons ค้างกิน ports/resources; `pitchfork stop --all` เมื่อจบงาน

## Workflow

- Project boot: script ที่ `pitchfork start` services ที่ต้องการ — reproducible dev environment
- Debugging: `logs` + status check ก่อน assume service รันอยู่
- Integration: ใช้กับ `/run-dev` orchestration เมื่อหลาย services ต้องพร้อมกัน

## Do / Don't

| Do | Don't |
|----|-------|
| track ทุก daemon ผ่าน pitchfork | `nohup`/`&` ข้างนอก |
| restart policies + backoff | infinite restart loops |
| stop daemons เมื่อจบ | leave orphans กิน ports |
| config ต่อ project | global ad-hoc starts |
