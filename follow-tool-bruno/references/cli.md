| Option | Description |
|--------|-------------|
| `--env <name>` | environment ของ collection |
| `--global-env <name>` | workspace-level environment |
| `--workspace-path <path>` | workspace path เมื่อ collection ไม่อยู่ที่ root |
| `--env-var k=v` | overwrite env var (ใช้หลายครั้งได้) |
| `--global-env-var k=v` | overwrite global env var (ต้องมี `--global-env`) |
| `--env-file <file>` | environment file (`.bru` หรือ `.json`) |
| `--sandbox <safe|developer>` | JS sandbox mode — default `safe` ตั้งแต่ v3.0.0 |
| `--csv-file-path` / `--json-file-path` | data file สำหรับ data-driven run |
| `--iteration-count <n>` | รันซ้ำ n รอบ |
| `-r` | recursive run |

| Option | Description |
|--------|-------------|
| `--delay <ms>` | delay ระหว่าง requests |
| `--tests-only` | รันเฉพาะ requests ที่มี tests/assertions |
| `--bail` | หยุดเมื่อ request/test/assertion fail |
| `--tags` / `--exclude-tags` | filter ด้วย tags (comma-separated) |
| `--parallel` | รัน requests ขนานกัน |

| Option | Description |
|--------|-------------|
| `--reporter-json <path>` | JSON report |
| `--reporter-junit <path>` | JUnit XML report |
| `--reporter-html <path>` | HTML report |
| `--reporter-skip-all-headers` | ตัด headers ทั้งหมดใน report |
| `--reporter-skip-headers <list>` | ตัด headers เฉพาะ |
| `--reporter-skip-request-body` / `--reporter-skip-response-body` / `--reporter-skip-body` | ตัด bodies ใน report |

| Option | Description |
|--------|-------------|
| `--secrets-env-file <file>` | dotenv credentials สำหรับ external secret managers (Vault/AWS/Azure/GCP) |
| `--cacert <file>` | CA certificate (PEM) |
| `--client-cert-config <file>` | client cert config JSON (per-domain mTLS) |
| `--insecure` | ยอม insecure TLS |
| `--noproxy` | bypass proxies ทั้งหมด |
| `--ignore-truststore` / `--disable-cookies` | truststore/cookie control |
