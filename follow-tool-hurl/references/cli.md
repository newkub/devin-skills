# Hurl CLI

> Source: https://hurl.dev/docs/manual.html (verified 2026-09-13)

## Synopsis

```bash
hurl [OPTIONS] [FILES...]
hurl --test [OPTIONS] [FILES...]
```

- `FILES...` = `.hurl` files หรือ directories (recursive หา `.hurl`)
- ไม่ระบุ files → อ่านจาก stdin (`echo GET https://httpbin.org/get | hurl`)
- default: รันทุก request แล้ว output response body ของ call สุดท้าย
- `--test` = test-oriented output + non-zero exit เมื่อ assert fail

## Core Options

| Option | Description |
|--------|-------------|
| `--test` | test mode — report per-file pass/fail, exit non-zero on failure |
| `--variable <name=value>` | กำหนด variable (ใช้หลายครั้งได้) |
| `--variables-file <file>` | โหลด variables จาก `.env`-style file |
| `-o, --output <file>` | เขียน response body ลงไฟล์ |
| `-L, --location` | follow redirects (curl semantics เหมือนกัน) |
| `--insecure` | ยอม insecure TLS |
| `--connect-timeout <s>` / `-m, --max-time <s>` | timeouts (รองรับ `20s`, `3500ms`) |
| `--retry <n>` / `--retry-interval <ms>` | retry failed requests |
| `--parallel` | รัน files ขนานกัน |
| `--continue-on-error` | รันต่อแม้ entry fail |
| `-v, --verbose` / `--very-verbose` | debug output |
| `--error-format <short|long>` | format ของ error report |
| `--proxy`, `--user`, `--cacert`, `-E/--cert`, `--aws-sigv4` | curl-equivalent network/auth options |

## Report Options

| Option | Description |
|--------|-------------|
| `--report-junit <file>` | JUnit XML report |
| `--report-html <dir>` | HTML report (per-file pages + waterfall) |
| `--report-json <dir>` | JSON report |
| `--json` | output structured JSON ไป stdout |

## Configuration Precedence

ต่ำ → สูง: env vars (`HURL_*` เช่น `HURL_INSECURE`) → CLI options → `[Options]` section ใน `.hurl` entry

```hurl
GET https://example.org
[Options]
location: true
HTTP 200
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | สำเร็จทั้งหมด |
| 1 | usage error |
| 2 | parse error ใน `.hurl` |
| 3 | runtime error (network, etc.) |
| 4 | assert error (`--test` mode) |
