---
name: check-supply-chain
description: ตรวจ supply chain risks — lockfile integrity, typosquat signals และ install scripts
argument-hint: "[manifest-or-lockfile|lockfile|typosquat|install-scripts|pinning]"
related:
  - review-security
  - report
  - run-audit
---

## Goal

ตรวจ software supply chain ของ project — lockfile tampering, typosquatting, suspicious install scripts, unpinned/untrusted sources — ความเสี่ยงที่ไม่ใช่ vulns ใน code แต่มาจาก dependencies เอง

## Scope

- ตรวจ manifests + lockfiles: `package.json`, `bun.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `go.sum`
- ครอบคลุม: lockfile integrity, install scripts (`postinstall`), typosquat lookalikes, git/url deps, registry sources, version pinning
- Read-only: รายงาน — remediation ผ่าน `/review-security` หรือ `/review-dependencies`

## Execute

### Subskills

> Goal: dispatch ไปยัง domain subskill ตาม argument — หรือรันครบทุก domain ถ้าไม่ระบุ

| Domain/Argument | Subskill |
|-----------------|----------|
| `lockfile` | `subskills/lockfile/SKILL.md` — resolve ตรง manifest, integrity fields, sources |
| `typosquat`, `packages` | `subskills/typosquat/SKILL.md` — lookalike names, suspicious signals, dependency confusion |
| `install-scripts`, `scripts` | `subskills/install-scripts/SKILL.md` — lifecycle scripts audit |
| `pinning`, `sources` | `subskills/pinning/SKILL.md` — floating versions, `.npmrc`, CI install flags |

1. ถ้า argument ระบุ domain เดียว → อ่าน `subskills/<domain>/SKILL.md` แล้วทำตาม flow ในนั้น — ข้าม domains อื่น แต่ยังทำ Step 5 (Report)
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามลำดับ โดยแต่ละ step อ่าน subskill ที่ตรงมา execute

### 1. Lockfile Integrity

> Goal: ตรวจ lockfile ไม่ถูกแกะ

ทำตาม `subskills/lockfile/SKILL.md`

### 2. Typosquat And Suspicious Packages

> Goal: หา packages ที่อาจเป็นของปลอม

ทำตาม `subskills/typosquat/SKILL.md`

### 3. Install Scripts Audit

> Goal: ตรวจ lifecycle scripts ที่รันโค้ดตอน install

ทำตาม `subskills/install-scripts/SKILL.md`

### 4. Pinning And Sources

> Goal: ตรวจ reproducibility ของ supply chain

ทำตาม `subskills/pinning/SKILL.md`

### 5. Report

> Goal: สรุป supply chain risks

1. ใช้ `/report`: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`
2. Severity: `critical` (suspicious install script, registry hijack signals), `high` (unpinned, git deps), `medium` (missing integrity, loose ranges)
3. แนะนำ: SBOM generation (CycloneDX/SPDX) สำหรับ inventory, hash pinning, registry allowlist

## Rules

### 1. Evidence-Based

- ทุก flag ต้องมี artifact จริง — lockfile line, script content, registry metadata
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context นี้" (เช่น internal registry)

### 2. Read-Only

- ไม่แก้ lockfile/manifests — รายงานให้ `/review-dependencies` แก้
- ไม่รัน install scripts เพื่อทดสอบ

### 3. Practical

- เน้น risks ที่ actionable — ไม่ flag ทุก transitive dep
- supply chain hardening ต้องไม่ทำ workflow พัง — เสนอทีละขั้น
- ใช้ /run-audit ถ้าจำเป็น

## Expected Outcome

- รายการ supply chain findings พร้อม severity และ evidence
- Lockfile/install-script posture ที่ชัดเจน
- Hardening recommendations เรียงตาม risk
