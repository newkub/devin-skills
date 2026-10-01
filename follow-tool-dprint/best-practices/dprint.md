# dprint — Best Practices

Pluggable multi-language formatter — config discipline และ plugin hygiene

## Recommended Patterns

- `dprint.json` เดียวที่ root — plugins array ชี้ WASM plugin URLs (`plugins: ["https://plugins.dprint.dev/typescript-x.y.z.wasm", ...]`) พร้อม pin version
- Pin plugin versions เสมอ — URL มี version อยู่แล้ว; floating = format drift ข้ามทีม/CI
- Per-language config ภายใต้ language keys (`typescript`, `json`, `markdown`) — global options (`lineWidth`, `indentWidth`, `useTabs`) ที่ top-level
- `includes`/`excludes` explicit — ไม่ format generated code, `node_modules`, dist, lockfiles
- `dprint fmt` + `dprint check` (CI) + editor extension — format-on-save เดียวกับ CI gate

## Common Pitfalls

- Editor integration: VS Code extension ชี้ `dprint.json` — ถ้า prettier extension ยังเปิด = format conflicts; disable formatter อื่น
- `dprint config update` อัปเกรด plugin URLs — review diff ก่อน commit (format เปลี่ยน = mass diff)
- Overlapping tools: dprint vs prettier/biome เลือกตัวเดียวต่อ language — running ทั้งคู่ = flip-flop diffs
- Incremental cache: `dprint fmt` เร็วเพราะ cache — CI ที่ล้าง cache = ช้ากว่า local; ยอมรับ
- Config JSON — comments ต้อง `//` ได้เพราะ jsonc support; แต่ JSON5 features อื่นไม่รองรับทั้งหมด

## Perf Notes

- WASM plugins เร็วมาก — อย่า spawn `dprint fmt` ต่อไฟล์; run ครั้งเดียวทั้ง repo
- `dprint check` ใน CI แทน `fmt` + diff — fail fast ไม่ dirty working tree

## Do / Don't

| Do | Don't |
|----|-------|
| pin plugin versions ใน URLs | floating plugin refs |
| `dprint check` ใน CI | `fmt` แล้ว hope clean |
| excludes generated/vendor code | format lockfiles/dist |
| formatter เดียวต่อ language | prettier+dprint ชนกัน |
