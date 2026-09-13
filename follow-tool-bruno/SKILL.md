---
name: follow-tool-bruno
description: ใช้ Bruno API client และ bru CLI สำหรับ collections, import specs, รัน tests ใน CI
argument-hint: "[scope]"
related:
  - deep-test-api
  - follow-tool-hurl
  - gen-openapi
  - follow-tool-github-actions
  - follow-test
---

## Goal

ใช้ Bruno สำหรับจัดการ API collections แบบ Git-native (`.bru` / OpenCollection files) และรัน tests ผ่าน `bru` CLI ทั้ง local และ CI/CD

## Scope

ใช้สำหรับ projects ที่ต้องการ API client แบบ offline, collections เป็น text files ใน repo, รัน collection tests ใน pipeline

- Latest: `@usebruno/cli@4.1.0` (verified 2026-09-13); GitHub Action `usebruno/bruno-cli-action@v1`
- ถ้าต้องการ plain-text tests เบากว่า (ไม่ใช่ collection model) → `/follow-tool-hurl`; docs/mock จาก spec → `/follow-tool-scalar`

## Execute

### 1. Installation

> Goal: ติดตั้ง Bruno CLI

1. Project dev-dep: `bun add -D @usebruno/cli` (binary ชื่อ `bru`)
2. Global: `mise use -g npm:@usebruno/cli` หรือ `npm i -g @usebruno/cli`
3. Docker ก็มี official image สำหรับ CI ที่ไม่มี Node
4. Verify ด้วย `bru --version`

### 2. Collection Structure

> Goal: เข้าใจ collection layout

1. Classic format: folder ของ `.bru` files + `bruno.json` + `environments/*.bru`
2. OpenCollection format (default ใหม่): `opencollection.yml` + `.yml` requests — human-readable YAML
3. ถ้ายังไม่มี collection → สร้างจาก spec ด้วย `bru import openapi` (ขั้นถัดไป) หรือทำ `/gen-postman-collection`

### 3. Import Specs

> Goal: แปลง OpenAPI/WSDL เป็น Bruno collection ผ่าน CLI

1. `bru import openapi --source <spec.yaml|url> --output <dir> --collection-name "API"` — default format `opencollection`, ใช้ `--collection-format=bru` ถ้าต้องการ classic
2. Single file: `--output-file collection.json` แทน `--output`
3. WSDL (SOAP): `bru import wsdl --source <file.wsdl> --output <dir>`
4. Shorthand: `-s` (source), `-o` (output), `-n` (collection-name)
5. รายละเอียดใน [references/bru-cli.md](references/bru-cli.md)

### 4. Run Collections

> Goal: รัน collection พร้อม env และ reporters

1. `bru run <collection>` — เพิ่ม `-r` สำหรับ recursive
2. Environment: `--env <name>`, `--global-env <name>`, `--env-var k=v`, `--env-file <file>`
3. Control: `--bail` (หยุดเมื่อ fail), `--tags`/`--exclude-tags`, `--tests-only`, `--parallel`, `--iteration-count`, `--delay`, `--csv-file-path`/`--json-file-path` (data-driven)
4. Sandbox: `--sandbox safe` (default ตั้งแต่ v3) หรือ `developer` เมื่อต้องการ Node APIs เต็ม
5. Reporters: `--reporter-json`, `--reporter-junit`, `--reporter-html` + `--reporter-skip-*` เพื่อซ่อน secrets/bodies ใน artifacts

### 5. Secrets And Security

> Goal: จัดการ secrets และ TLS ใน CI

1. `--secrets-env-file` + `externalSecrets` block → fetch จาก HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Cloud Secret Manager (ไม่เขียนลง disk/log)
2. mTLS: `--client-cert-config <config.json>`; CA: `--cacert`; proxy bypass: `--noproxy`
3. ห้าม commit credentials — ใช้ env vars/secret managers เสมอ

### 6. GitHub Actions

> Goal: รัน Bruno ใน CI ด้วย official action

1. ใช้ `usebruno/bruno-cli-action@v1` — composite action ที่ prepend `bru` ให้เอง (เขียน `run --env prod` ไม่ใช่ `bru run --env prod`)
2. Auto-inject `--reporter-junit` ถ้าไม่ระบุ, expose outputs: `exit-code`, `passed`, `failed`, `total`, `duration-ms`
3. Inputs: `command` (required), `bru-version`, `working-directory`
4. ดูตัวอย่าง workflow และ downstream actions ใน [references/github-actions.md](references/github-actions.md)

## Rules

### 1. Collection Hygiene

- เก็บ collection ใน repo เดียวกับ API code — diff ใน PR ได้
- แยก secrets ออกจาก `.bru`/`.yml` files — ใช้ env vars หรือ secret managers
- เลือก format เดียวต่อ collection: `opencollection` (ใหม่) หรือ `bru` (classic)

### 2. CI Discipline

- ใช้ `--bail` เมื่อต้องการ fail-fast, `--tests-only` เมื่อ collection มี exploratory requests ปน
- ระบุ `--reporter-junit` path ชัดเจนถ้าจะ feed ต่อ downstream actions
- pin `@v1` สำหรับ compatible updates หรือ `@v1.x.y` เมื่อต้องการ immutable

### 3. Safety

- `--sandbox safe` เป็น default — เปลี่ยนเป็น `developer` เฉพาะเมื่อ collection scripts ต้องการ Node APIs
- ไม่รัน collection กับ production env โดยไม่มี user confirmation

- ใช้ /deep-test-api ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น (tool bruno)

## References

- [bru CLI commands](references/bru-cli.md)
- [GitHub Actions](references/github-actions.md)
- [Package manifest](references/package-manifest.md)
- [Official resources](references/website.md)

## Expected Outcome

- Bruno collection อยู่ใน version control พร้อม environments
- `bru import openapi` สร้าง collection จาก spec ได้ใน pipeline
- `bru run` รันผ่าน CLI พร้อม reporters ครบ
- GitHub Actions workflow รัน collection ด้วย official action และ gate ด้วย exit code
