# cargo-mutants — Best Practices

Mutation testing สำหรับ Rust — วัดคุณภาพ test suite จริง

## Recommended Patterns

- `cargo mutants` ที่ crate root — mutants = code variants ที่ควรทำให้ tests fail; survive = test gap
- Scope ด้วย `-f`/`--file` globs — full-crate runs ช้ามาก; เจาะเฉพาะ critical modules (business logic, parsers)
- Run ใน CI เป็น scheduled/weekly job — ไม่ใช่ทุก PR (นานเกิน); per-PR scope ให้ changed files
- `--baseline ref` incremental mode — mutants เฉพาะ code ที่เปลี่ยน
- Iterate: surviving mutant → เขียน test เพิ่ม → re-run เฉพาะไฟล์นั้น

## Common Pitfalls

- Timeout mutants (infinite loops) — ใช้ `--timeout` + `--jobs` parallel; hangs คือ cost ของ mutation testing
- False survivors: `#[derive]` code, logging, formatting-only mutations — `--exclude`/skip annotations สำหรับ untestable paths
- Mutation score ไม่ใช่ goal — 100% impractical; focus critical-path mutants
- Debug asserts: mutants tests ต้องรัน release-ish behavior — `--test-tool nextest` เร็วกว่า cargo test มาก
- Compile time dominates — incremental + parallel jobs + sccache

## Interpretation

- Caught mutant = test suite ดี; Survived = missing assertion/coverage; Timeout/Unviable = analyze แยก
- Report เป็น gap list ไม่ใช่ score เดียว — surviving mutants คือ test-writing backlog

## Do / Don't

| Do | Don't |
|----|-------|
| scope changed files / critical modules | full-crate mutants ทุก PR |
| `--test-tool nextest` | default cargo test (ช้า) |
| survivors → test backlog | chase 100% mutation score |
| exclude untestable paths | fight logging/format mutants |
