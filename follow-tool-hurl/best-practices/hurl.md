# Hurl — Best Practices

Plain-text HTTP testing — requests, assertions และ chaining

## Recommended Patterns

- `.hurl` files = request + assertions ในไฟล์เดียว — `[QueryStringParams]`, `[FormParams]`, `[Captures]`, `[Asserts]` sections
- Chain requests ด้วย captures: `token: jsonpath "$.token"` แล้วใช้ `{{token}}` ใน request ถัดไป — auth flows สำหรับ test suites
- `hurl --variables-file vars.env` หรือ `--variable` สำหรับ env switching — ห้าม hardcode hosts/credentials
- Assert ทั้ง status + body + headers + duration — `jsonpath`/`xpath`/`regex` predicates ตาม content type
- Test suites = directories ของ `.hurl` files — `hurl --test dir/` รันทั้งหมด

## Common Pitfalls

- Secrets ใน .hurl files = commit leaks — variables-file + `.gitignore` เสมอ
- Retry/flaky endpoints: `--retry` + `--retry-interval` — ห้าม retry assertions ที่ mutate state (POST ไม่ idempotent)
- `body` asserts brittle บน dynamic fields — assert structure (jsonpath exists/type) มากกว่า exact values
- Cookies/session: `[Options]` `cookie` handling — Hurl ไม่ share cookie jar ข้าม files โดย default
- `--error-format long` ตอน debug — default output terse

## CI Integration

- `hurl --test --report-junit out.xml` สำหรับ CI reporting
- `--jobs 1` เมื่อ tests sequential-dependent (chains ใน file เดียว sequential อยู่แล้ว; files ขนานกัน)
- Rate-limited APIs: `--repeat` + delays ระวัง quota

## Do / Don't

| Do | Don't |
|----|-------|
| captures → chained requests | copy tokens มือ |
| variables-file per env | hardcode hosts/secrets |
| assert structure + status | exact-body asserts บน dynamic data |
| `--test` + junit report ใน CI | ad-hoc curl ใน pipelines |
