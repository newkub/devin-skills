---
name: follow-tool-packslip
description: publish signed release manifests (packslip) สำหรับ artifacts — digests, platforms, bin paths ให้ installers verify ได้
argument-hint: "[scope]"
related:
  - follow-tool-mise
  - follow-tool-fnox
  - follow-tool-usage
  - setup-cicd
  - run-release
  - ship
---

## Goal

Publish `packslip.sigstore.json` ข้าง release artifacts — signed manifest (in-toto statement ใน sigstore bundle) ที่บอก digests, platform metadata, executable paths และ resource links ให้ installer (เช่น mise) เลือก/verify ไฟล์ได้โดยไม่ต้องเดา filename

## Scope

- ใช้เมื่อ publish release artifacts ที่ต้องการให้ installers (mise/others) เลือกและ verify ได้ — GitHub Actions มี `jdx/packslip@v1`, publisher นอก CI ใช้ Ed25519 key
- spec stable ที่ `release/v1` — predicateType `https://packslip.dev/release/v1`
- Docs: https://packslip.dev/ · Spec: https://packslip.dev/release/v1/ · CLI: https://packslip.dev/cli/

## Execute

### 1. Publish From GitHub

> Goal: workflow release ผลิต signed manifest

1. หลัง build artifacts + สร้าง release เพิ่ม step:

```yaml
- uses: jdx/packslip@v1
  with:
    artifacts: dist/*.tar.xz dist/*.zip
    bin: mytool
    resources: |
      man=archive:share/man/man1/mytool.1
```

2. ให้สิทธิ์ workflow ที่ต้องการ (id-token สำหรับ sigstore signing ด้วย workflow identity)
3. Manifest `packslip.sigstore.json` ถูก publish ข้าง artifacts อัตโนมัติ

### 2. Describe Artifacts

> Goal: metadata ครบสำหรับ installer

1. `subject` — digest (sha256) ของแต่ละไฟล์
2. `predicate.artifacts[]` — `name`, `url`, `format` (tar.gz/zip), `bin` (executable paths), platform fields (`os`/`arch`/`libc`)
3. `resources` — man pages, completions, CLI specs (usage), agent skills, SBOMs, desktop files
4. `host requirements` — libraries/commands ที่ runtime ต้องมี

### 3. Verify / Consume

> Goal: consumer verify ก่อน install

1. Verify manifest กับ trusted identity/key แล้วเช็ค digest ของไฟล์ที่ download
2. Signed release lists (`/docs/release-lists/`) — expiry, sequence, withdrawals, recommended version
3. ตัวอย่าง consumer: mise อ่าน packslip เพื่อเลือก platform artifact — ดู https://packslip.dev/docs/mise/

## Rules

- Build provenance เป็น evidence แยก — verify แยกจาก manifest เสมอ
- Manifest เดียวไม่ตรวจ withdrawn/rollback releases — ใช้ signed release lists
- Checksum ธรรมดาข้าง binary ไม่เทียบเท่า — ต้อง signer verification
- เวอร์ชัน spec คงที่ที่ v1 — pin `jdx/packslip@v1`

## Expected Outcome

- Release workflow ผลิต `packslip.sigstore.json` ข้างทุก artifact
- Installer/consumer (เช่น mise) เลือกและ verify ไฟล์จาก manifest ได้
