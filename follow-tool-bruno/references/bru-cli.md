# Bruno CLI (`bru`)

> Source: https://docs.usebruno.com/bru-cli/commandOptions + https://docs.usebruno.com/bru-cli/import (verified 2026-09-13)

## Install

```bash
bun add -D @usebruno/cli   # v4.1.0 — binary name: bru
```

## bru run

```bash
bru run [collection] [options]
```

### Setup options

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

### Request options

| Option | Description |
|--------|-------------|
| `--delay <ms>` | delay ระหว่าง requests |
| `--tests-only` | รันเฉพาะ requests ที่มี tests/assertions |
| `--bail` | หยุดเมื่อ request/test/assertion fail |
| `--tags` / `--exclude-tags` | filter ด้วย tags (comma-separated) |
| `--parallel` | รัน requests ขนานกัน |

### Reporting options

| Option | Description |
|--------|-------------|
| `--reporter-json <path>` | JSON report |
| `--reporter-junit <path>` | JUnit XML report |
| `--reporter-html <path>` | HTML report |
| `--reporter-skip-all-headers` | ตัด headers ทั้งหมดใน report |
| `--reporter-skip-headers <list>` | ตัด headers เฉพาะ |
| `--reporter-skip-request-body` / `--reporter-skip-response-body` / `--reporter-skip-body` | ตัด bodies ใน report |

Deprecated: `-o/--output`, `-f/--format` — ใช้ reporter flags แทน

### Security options

| Option | Description |
|--------|-------------|
| `--secrets-env-file <file>` | dotenv credentials สำหรับ external secret managers (Vault/AWS/Azure/GCP) |
| `--cacert <file>` | CA certificate (PEM) |
| `--client-cert-config <file>` | client cert config JSON (per-domain mTLS) |
| `--insecure` | ยอม insecure TLS |
| `--noproxy` | bypass proxies ทั้งหมด |
| `--ignore-truststore` / `--disable-cookies` | truststore/cookie control |

## bru import

```bash
# OpenAPI → collection directory (opencollection default)
bru import openapi --source api.yaml --output collections/api --collection-name "API"

# Classic .bru layout
bru import openapi --source api.yaml --output collections/api --collection-format=bru

# Single JSON file
bru import openapi --source api.yaml --output-file collection.json --collection-name "API"

# WSDL (SOAP)
bru import wsdl --source service.wsdl --output collections/soap
```

Shorthand: `-s` source, `-o` output, `-n` collection-name. Source รับ path หรือ URL
