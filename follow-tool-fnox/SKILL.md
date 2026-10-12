---
name: follow-tool-fnox
description: โหลด secrets จาก encrypted files / vaults / cloud เข้า env ของ app ผ่าน fnox.toml + fnox exec
argument-hint: "[scope]"
related:
  - follow-tool-mise
  - follow-tool-packslip
  - follow-tool-usage
  - check-secrets
  - follow-tool-gitleaks
  - setup-cicd
---

## Goal

ใช้ `fnox` (jdx, Rust, MIT) จัดการ secrets ตอน dev/CI — กำหนด source ของแต่ละค่าใน `fnox.toml` (commit ได้ เพราะเก็บ reference/ciphertext ไม่ใช่ plaintext) แล้ว inject เข้า env ตอนรัน

## Scope

- `fnox.toml` providers + secrets, `fnox exec`, `fnox set`, profiles, shell integration, daemon cache, temporary credentials (leases), agent proxy
- ไม่ใช่การตั้งกฎ scan — สแกนหลุดใช้ `/follow-tool-gitleaks` + `/check-secrets`
- Latest: v1.36.x — https://fnox.jdx.dev/

## Execute

### 1. Install

> Goal: fnox พร้อมใช้

1. `mise use -g fnox` (ตาม `/follow-tool-mise`)
2. ตรวจ `fnox --version`

### 2. Configure Providers + Secrets

> Goal: `fnox.toml` ชี้แต่ละ secret ไปยัง source

1. Encrypted-in-git (age):

```toml
[providers.age]
type = "age"
recipients = ["age1..."]

[secrets.DATABASE_URL]
provider = "age"
value = "<ciphertext>"   # เขียนโดย fnox set
```

2. Vault ที่มีอยู่ (1Password example):

```toml
[providers.op]
type = "1password"
vault = "Engineering"

[secrets.DATABASE_URL]
provider = "op"
value = "Database/url"
```

3. Providers อื่น: aws-sm, azure-sm, gcp-sm, bitwarden, vault — ผสมได้ทีละ secret
4. `fnox set DATABASE_URL` เขียน ciphertext/reference ให้

### 3. Run With Secrets

> Goal: app เห็น env จริงโดยไม่ commit secret

1. `fnox exec -- npm start` → env ถูก inject เฉพาะ process
2. Profiles: dev/staging/prod — เปลี่ยน source โดยไม่เปลี่ยนคำสั่งรัน
3. Shell integration: auto load/unload ตาม directory (`guide/shell-integration`)
4. Daemon (opt-in): cache resolved values ใน memory ระหว่าง session
5. Leases: temporary credentials (AWS STS, GitHub Apps, Vault)
6. Agent proxy: ส่ง placeholder ให้ agent แล้ว inject ค่าจริงเฉพาะ HTTPS request ที่ match

## Rules

- commit `fnox.toml` ได้ — แต่ห้าม commit plaintext `value`; ใช้ provider reference หรือ ciphertext เท่านั้น
- เลือก provider ตามทีม: vault เดิมมีอยู่ → reference, ไม่มี → age encrypt
- local cache ผ่าน `fnox sync` (age) เท่านั้น — ไม่ใช่ plaintext fallback

## Expected Outcome

- `fnox.toml` commit อยู่ใน repo, secrets resolve จาก provider/ciphertext
- `fnox exec -- <cmd>` ใช้งานจริงใน dev และ CI
