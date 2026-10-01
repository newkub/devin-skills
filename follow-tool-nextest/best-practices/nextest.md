# cargo-nextest — Best Practices

Fast Rust test runner — process-per-test isolation และ parallelism

## Recommended Patterns

- `cargo nextest run` แทน `cargo test` — process-per-test = isolation จริง, fail-fast, parallel-by-default
- `.config/nextest.toml` สำหรับ profiles: `default` (dev), `ci` (retries, junit, slow-timeout)
- `slow-timeout`/`leak-timeout` config — tests ช้าเกิน threshold flag เป็น slow ไม่ kill ทันที
- `retries` ใน CI profile เฉพาะ flaky-tagged tests — retry ทุกอย่าง mask real flakes
- `--package`/`-E` filter expressions — run เฉพาะ affected tests ตอน dev

## Common Pitfalls

- Test isolation ต่างจาก cargo test: ทุก test เป็น process → shared mutable state (files, ports, env) ระหว่าง tests พัง — ใช้ `test-group` หรือ serial filter สำหรับ resource-dependent tests
- Env vars ไม่ inherit เหมือน cargo test — set ผ่าน config `[env]` section หรือ export ก่อน run
- doctests ไม่รันผ่าน nextest — ต้อง `cargo test --doc` แยกใน CI
- `--no-fail-fast` ใน CI เพื่อเห็น failure ทั้งหมด; local dev fail-fast ดีกว่า
- Partitioning (`--partition`/`--shard`) สำหรับ CI matrix — split tests ข้าม runners

## CI Integration

- `--profile ci` + `--message-format libtest-json`/junit สำหรับ reporters
- `cargo nextest archive` → transfer test binaries ข้าม build/test stages — build once, test everywhere
- Flaky detection: nextest report retries as `FLAKY` — track เป็น backlog

## Do / Don't

| Do | Don't |
|----|-------|
| process isolation + parallel | assume shared state ข้าม tests |
| `test-group` สำหรับ port/file resource tests | serial ทั้ง suite เพื่อ test เดียว |
| retries เฉพาะ tagged flaky | blanket retries mask bugs |
| `cargo test --doc` complement | expect nextest run doctests |
