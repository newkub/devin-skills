# Madge — Best Practices

Dependency graph + circular import detection สำหรับ JS/TS

## Recommended Patterns

- `madge --circular src/` — circular deps = primary use case; fail CI เมื่อเจอ
- `--extensions ts,tsx` + `--ts-config tsconfig.json` — ให้ resolve path aliases/TS ถูก
- `--image graph.svg` สำหรับ visual dep graph — useful เมื่อ review architecture ไม่ใช่ทุก run
- `--depends`/`--orphans` queries — หา modules ที่ไม่มีใครใช้ หรือ who-depends-on-X
- Engine สำหรับ related check: ใช้ร่วมกับ `/check-file-relation` และ refactor workflows

## Common Pitfalls

- Circular imports ไม่ใช่ error เสมอ (ES modules allow) แต่เป็น smell — initialization order issues, tree-shake blockers; fix โดย extract shared module
- Path aliases ต้อง tsconfig — มิฉะนั้น unresolved = orphan false positives
- Dynamic imports (`import()`) — madge trace ได้แต่ expression-based (`import(variable)`) miss; code แบบนั้น graph incomplete
- Barrel files amplify cycles: `index.ts` re-export ทั้ง folder ทำ cycle ผ่าน barrel ง่าย — เจอ cycle เช็ค barrels ก่อน
- Large repos: madge ช้าบน whole-graph — scope ด้วย dir หรือ `--include-npm false`

## Fix Patterns สำหรับ Cycles

1. Extract shared types/utils ลง layer ต่ำกว่า
2. Dependency inversion: callback/interface injection แทน import ตรง
3. Barrel-less imports: import ตรงจาก file ไม่ผ่าน index ที่รวมทุกอย่าง

## Do / Don't

| Do | Don't |
|----|-------|
| `--circular` ใน CI gate | tolerate cycles "เพราะมันทำงาน" |
| ts-config เพื่อ resolve aliases | report บน unresolved paths |
| extract shared module แก้ cycles | lazy-import hacks ทุก cycle |
| scope dir เมื่อ graph ใหญ่ | whole-repo graph ทุก run |
