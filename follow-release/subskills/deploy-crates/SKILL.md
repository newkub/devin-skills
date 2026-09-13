---
name: follow-release-deploy-crates
description: Release Rust crate ไป crates.io — cargo publish flow พร้อม verify
argument-hint: "[crate-name]"
related:
  - run-release
  - run-check
  - follow-secret-manager
  - resolve-errors
  - learn
  - ask-me
---

## Goal

Publish Rust crate ไปยัง crates.io อย่างถูกต้อง — metadata ครบ, auth พร้อม, publish แล้ว verify บน registry

## Scope

- ครอบคลุม: manual publish ด้วย `cargo publish` — metadata checks, token, dry-run, publish, verify
- automated release (release-plz/cargo-release + GitHub Actions) → ทำตาม parent `/follow-release` Step 3

## Execute

### 1. Verify Crate Metadata

> Goal: `Cargo.toml` พร้อม publish

1. ตรวจ required fields: `name`, `version`, `description`, `license` (หรือ `license-file`)
2. ตรวจ recommended fields: `authors`, `repository`, `homepage`, `keywords` (≤5), `categories`
3. ตรวจ `publish` field ไม่ถูกตั้งเป็น `false`
4. ถ้า workspace → ระบุ crate ที่จะ publish ชัดเจน (`-p <name>`)

### 2. Authenticate

> Goal: token พร้อมสำหรับ publish

1. ตรวจ credentials ด้วย `cargo login` — token เก็บใน `~/.cargo/credentials.toml`
2. CI: ใช้ `CARGO_REGISTRY_TOKEN` — เก็บผ่าน `/follow-secret-manager`
3. ถ้าไม่มี token → `/ask-me` ให้ user สร้างที่ crates.io

### 3. Pre-Publish Checks

> Goal: crate build และ package ถูกต้องก่อน publish

1. ทำ `/run-check` — tests, lint ต้องผ่าน
2. รัน `cargo publish --dry-run` เพื่อตรวจ package contents และ warnings
3. ตรวจ version ใหม่ยังไม่ถูก publish (เช็กบน crates.io หรือ `cargo search <name>`)

### 4. Publish

> Goal: crate ขึ้น registry

1. รัน `cargo publish` (หรือ `cargo publish -p <name>` ใน workspace)
2. เก็บ version ที่ publish สำเร็จ

### 5. Post-Publish Verify

> Goal: crate ใช้งานได้จาก registry

1. รอ registry index update (อาจใช้เวลาสั้นๆ) แล้วเช็คหน้า crate บน crates.io
2. verify ด้วย `cargo add <name>` หรือ `cargo install <name>` ใน temp project
3. ถ้า publish เพี้ยน → `cargo yank --vers <version>` เพื่อถอน version (ไม่ใช่ลบ) แล้ว `/resolve-errors`
4. สำเร็จ → report version แล้วทำ `/run-release` ถ้า parent flow ต้องการ multi-platform release

## Rules

### 1. Publish Is Irreversible

- publish แล้วลบไม่ได้ — ใช้ `cargo yank` เท่านั้น; dry-run + version check ก่อนเสมอ
- version bump ต้อง commit/tag ตาม project convention

### 2. Metadata Quality

- ห้าม publish ถ้า required metadata ขาด — cargo จะ reject
- secrets/token ผ่าน `/follow-secret-manager` เท่านั้น

### 3. Docs First

- ถ้าไม่แน่ใจ flags/features ใหม่ → ดู official docs ผ่าน `/learn-web` แทนการเดา

## Expected Outcome

- crate publish บน crates.io ด้วย version ใหม่ และ install ได้จริง
- version ที่ผิดถูก yank ถ้าจำเป็น
