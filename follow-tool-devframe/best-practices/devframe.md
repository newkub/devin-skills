# Devframe — Best Practices

Build-a-devtool-once, mount-anywhere — SPA, CLI, static, MCP, hub

## Recommended Patterns

- เขียน devtool เป็น single definition ครั้งเดียว — mounts: SPA, CLI, static HTML, MCP server, hub; เลือก mount ตาม consumer ไม่ใช่เขียนใหม่ต่อ target
- Tool surface = commands + views + actions — define declaratively; mount adapters handle runtime differences
- Keep tool logic pure/portable — ห้ามผูก DOM/stdio ตรงๆ ใน core; render ผ่าน adapter layer ของ devframe
- Export ทุก mounts ที่ต้องการจาก definition เดียว — hub ใช้ aggregate หลาย devtools เป็นที่เดียว

## Common Pitfalls

- Logic ที่ผูกกับ mount เดียว (เช่น direct `console.log` หรือ DOM calls) = mount อื่นพัง — ใช้ abstractions ของ frame
- State isolation: shared state ข้าม mounts = surprise; scope state ต่อ mount instance
- MCP mount: tool schemas ต้อง describe inputs ชัดเจน — MCP clients ไม่เห็น UI ต้อง self-documenting
- Static/CLI mounts ไม่มี persistent backend — features ที่ต้อง server ต้อง degrade gracefully ต่อ mount

## Perf Notes

- Mount เฉพาะที่จำเป็น — devtool หนักบน CLI mount = slow startup; lazy-load views
- Hub mode: aggregate หลาย tools = หนัก — lazy mount per-tool on demand

## Do / Don't

| Do | Don't |
|----|-------|
| definition เดียว → หลาย mounts | duplicate tool logic ต่อ mount |
| adapter abstractions สำหรับ I/O | direct DOM/stdio ใน core logic |
| degrade gracefully ต่อ mount | assume backend มีเสมอ |
| self-describing MCP schemas | rely UI text ใน MCP mount |
