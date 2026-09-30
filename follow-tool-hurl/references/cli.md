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

| Option | Description |
|--------|-------------|
| `--report-junit <file>` | JUnit XML report |
| `--report-html <dir>` | HTML report (per-file pages + waterfall) |
| `--report-json <dir>` | JSON report |
| `--json` | output structured JSON ไป stdout |

| Code | Meaning |
|------|---------|
| 0 | สำเร็จทั้งหมด |
| 1 | usage error |
| 2 | parse error ใน `.hurl` |
| 3 | runtime error (network, etc.) |
| 4 | assert error (`--test` mode) |
