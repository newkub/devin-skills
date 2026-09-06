---
name: gen-sbom
description: Generate SBOM (CycloneDX/SPDX) จาก dependency manifests สำหรับ supply chain audit
argument-hint: "[format] [--output path]"
related:
  - analyze-dependencies
  - list-dependencies
  - improve-dependencies
  - review-compliance
  - run-audit
  - report-table
---

## Goal

Generate Software Bill of Materials (SBOM) ของ project — รายการ dependencies ทั้งหมดพร้อม versions, licenses และ hashes — ใน format มาตรฐาน CycloneDX หรือ SPDX สำหรับ security/compliance audit

## Scope

- Input: lockfiles/manifests ที่ตรวจพบ (`package.json`+lockfile, `Cargo.toml`+lock, `go.mod`+sum, `requirements*.txt`, `pom.xml` ฯลฯ)
- Output: `sbom.cdx.json` (CycloneDX) หรือ `sbom.spdx.json` (SPDX) — default CycloneDX
- ครอบคลุม direct + transitive dependencies

## Execute

### 1. Detect Ecosystem And Tool

> Goal: เลือก generator ที่ตรงกับ stack

1. ตรวจ manifests/lockfiles ใน project
2. เลือก tool:
   - Multi-ecosystem: `syft` (preferred ถ้ามี), `cdxgen`
   - npm: `@cyclonedx/cdxgen` หรือ `npm sbom`
   - cargo: `cargo cyclonedx` / `cargo sbom`
   - go: `cyclonedx-gomod`
   - python: `cyclonedx-bom` / `pip-audit` formats
3. ถ้าไม่มี tool → ติดตั้งผ่าน package manager หรือ `mise use -g` ตาม convention, หรือ fallback สร้าง minimal SBOM จาก lockfile เอง

### 2. Generate SBOM

> Goal: สร้าง SBOM ที่ครบจาก lockfile

1. รัน generator — เช่น `syft . -o cyclonedx-json=sbom.cdx.json` หรือ `npx @cyclonedx/cdxgen -o sbom.cdx.json`
2. ต้องครอบ transitive deps — ใช้ lockfile เป็น source ไม่ใช่ manifest อย่างเดียว
3. รวม metadata: tool version, timestamp, project identity (name, version, purl)

### 3. Validate Content

> Goal: ตรวจว่า SBOM ถูกต้องและครบ

1. Validate schema: JSON parse ได้, required fields ครบ (`bomFormat`, `specVersion`, `components`)
2. เทียบ component count กับ lockfile package count — flag ถ้าขาดเยอะ
3. spot-check: components มี name, version, purl, license (ถ้าทราบ), hashes
4. flag dev dependencies — ระบุว่ารวมหรือแยก scope

### 4. Report And Next Steps

> Goal: สรุป SBOM และแนะนำการใช้

1. ใช้ `/report-table` สรุป: `No.`, `Ecosystem`, `Components`, `Licenses Found`, `Format`
2. แนะนำต่อยอด:
   - `/run-audit` หรือ `grype sbom.cdx.json` เพื่อ scan vulnerabilities จาก SBOM
   - `/review-compliance` สำหรับ license compliance
   - commit SBOM หรือ generate ใน CI ทุก release
3. บอกตำแหน่งไฟล์และวิธี regenerate

## Rules

### 1. From Lockfiles

- ใช้ lockfile เป็น source — SBOM จาก manifest อย่างเดียวไม่ reflect ของที่ติดตั้งจริง
- ถ้าไม่มี lockfile → flag เป็น gap ก่อน generate

### 2. Standard Formats

- ใช้ CycloneDX หรือ SPDX เท่านั้น — ไม่สร้าง format เอง
- ระบุ spec version ที่ generate

### 3. Reproducible

- SBOM ต้อง regenerate ได้จาก commit เดียวกัน — บันทึก tool + version ที่ใช้
- อย่า commit SBOM ที่ stale — แนะนำ generate ใน CI/release pipeline

## Expected Outcome

- SBOM file ที่ valid ตาม spec พร้อม transitive deps ครบ
- สรุป component/license counts ต่อ ecosystem
- ช่องทางต่อยอด: vulnerability scan, compliance review, CI integration
