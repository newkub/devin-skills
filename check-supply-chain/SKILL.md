---
name: check-supply-chain
description: ตรวจ supply chain risks — lockfile integrity, typosquat signals และ install scripts
argument-hint: "[manifest-or-lockfile]"
related:
  - gen-sbom
  - run-audit
  - review-dependencies
  - list-dependencies
  - improve-security
  - report-table
---

## Goal

ตรวจ software supply chain ของ project — lockfile tampering, typosquatting, suspicious install scripts, unpinned/untrusted sources — ความเสี่ยงที่ไม่ใช่ vulns ใน code แต่มาจาก dependencies เอง

## Scope

- ตรวจ manifests + lockfiles: `package.json`, `bun.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `go.sum`
- ครอบคลุม: lockfile integrity, install scripts (`postinstall`), typosquat lookalikes, git/url deps, registry sources, version pinning
- Read-only: รายงาน — remediation ผ่าน `/improve-security` หรือ `/improve-dependencies`

## Execute

### 1. Lockfile Integrity

> Goal: ตรวจ lockfile ไม่ถูกแกะ

1. เทียบ lockfile กับ manifest — versions ที่ resolve ตรง declared ranges ไหม
2. หา integrity fields ที่ขาดหรือแปลก (missing hashes, http:// URLs)
3. flag deps ที่ resolve จาก non-standard registries หรือ direct URLs/git

### 2. Typosquat And Suspicious Packages

> Goal: หา packages ที่อาจเป็นของปลอม

1. flag names ที่ใกล้ popular packages (lodash vs lodas ฯลฯ) — edit distance
2. flag: packages ที่เพิ่ง publish, downloads ต่ำมาก, no repo/README, single maintainer ใหม่
3. flag packages ที่ชื่อ internal-looking แต่ resolve จาก public registry (dependency confusion)

### 3. Install Scripts Audit

> Goal: ตรวจ lifecycle scripts ที่รันโค้ดตอน install

1. ค้น `preinstall`/`install`/`postinstall` ใน deps ทั้งหมด
2. flag scripts ที่: เรียก network, เขียนไฟล์นอก package, spawn processes, obfuscated
3. ตรวจว่า project เปิด `--ignore-scripts` หรือไม่ — trade-off ที่ต้องระบุ

### 4. Pinning And Sources

> Goal: ตรวจ reproducibility ของ supply chain

1. flag: floating versions (`*`, `latest`) ที่ auto-resolve ไปเวอร์ชันใหม่
2. ตรวจ `.npmrc`/registry config — มี scope overrides หรือ auth tokens ถูก commit ไหม
3. ตรวจ CI: install ด้วย `--frozen-lockfile`/`--immutable` ไหม

### 5. Report

> Goal: สรุป supply chain risks

1. ใช้ `/report-table`: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`
2. Severity: `critical` (suspicious install script, registry hijack signals), `high` (unpinned, git deps), `medium` (missing integrity, loose ranges)
3. แนะนำ: `/gen-sbom` สำหรับ inventory, hash pinning, registry allowlist

## Rules

### 1. Evidence-Based

- ทุก flag ต้องมี artifact จริง — lockfile line, script content, registry metadata
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context นี้" (เช่น internal registry)

### 2. Read-Only

- ไม่แก้ lockfile/manifests — รายงานให้ `/improve-dependencies` แก้
- ไม่รัน install scripts เพื่อทดสอบ

### 3. Practical

- เน้น risks ที่ actionable — ไม่ flag ทุก transitive dep
- supply chain hardening ต้องไม่ทำ workflow พัง — เสนอทีละขั้น

## Expected Outcome

- รายการ supply chain findings พร้อม severity และ evidence
- Lockfile/install-script posture ที่ชัดเจน
- Hardening recommendations เรียงตาม risk
