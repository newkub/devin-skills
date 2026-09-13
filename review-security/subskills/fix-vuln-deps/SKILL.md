---
name: review-security-fix-vuln-deps
description: Apply vulnerable dependency findings — audit, upgrade, patch ตาม severity
argument-hint: "[package-or-severity]"
related:
  - review-security
  - review-dependencies
  - check-supply-chain
  - run-audit
  - run-check
  - run-test
  - report-before-after
---

## Goal

แก้ vulnerable dependency findings จาก `/review-security` จริง — upgrade/patch packages ที่มี CVE เรียง Critical/High ก่อน พร้อม verify ไม่มี regression

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: direct deps ที่มี advisory, transitive deps ที่ต้อง override, lockfile updates
- ไม่ครอบคลุม routine version bumps — ใช้ `/update-version-to-latest`; multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Audit Baseline

> Goal: รู้รายการ vulnerabilities ทั้งหมดพร้อม fix path

1. ทำ `/run-audit` ด้วย audit tool ของ ecosystem ที่ตรวจพบ (`npm audit`, `bun audit`, `cargo audit`, `pip-audit`)
2. บันทึก advisory, severity, affected range, และ fixed version ต่อ package
3. แยก direct dep vs transitive dep — transitive ต้องหา parent ที่ล็อก version อยู่

### 2. Upgrade Safe Path First

> Goal: patch ที่ไม่ break ออกไปก่อน

1. upgrade ทุก advisory ที่ fixed version อยู่ใน semver range เดิม — patch/minor ก่อนเสมอ
2. รัน update command ของ package manager ที่ project ใช้ แล้ว commit lockfile
3. เรียง Critical → High → Medium — แยก commit ต่อ severity group ถ้า diff ใหญ่

### 3. Handle Breaking And Transitive

> Goal: ครอบคลุม CVE ที่ fix ยาก

1. fixed version เป็น major → อ่าน changelog/migration guide ของ package นั้น (ดู official docs) แล้ววางแผน upgrade แยก
2. transitive dep → ใช้ `overrides`/`resolutions` ของ package manager pin เป็น fixed version แล้ว verify parent ยังทำงาน
3. ถ้าไม่มี fixed version → พิจารณา alternative package ตาม tech stack catalog หรือ workaround + tracking issue
4. ตรวจ supply chain เพิ่มด้วย `/check-supply-chain` ถ้า package เสี่ยง (maintainer change, typosquat)

### 4. Verify

> Goal: audit สะอาดและไม่มี regression

1. `/run-audit` ซ้ำ — Critical/High findings เดิมต้องหาย
2. `/run-check` + `/run-test` ผ่าน — โดยเฉพาะ flows ที่ dep นั้นใช้
3. `/report-before-after` — advisory, version เดิม → ใหม่, residual risk

## Rules

- patch Critical/High ก่อนเสมอ — Medium/Low รวม batch ได้
- ห้าม upgrade major โดยไม่อ่าน changelog — breaking changes ต้องมีแผน
- ทุก override ต้องมี comment/issue อ้างอิง advisory ที่บังคับ pin
- ถ้า upgrade ไม่ได้จริง → report residual risk + mitigation ห้ามปล่อยเงียบ
- fix-verify loop สูงสุด 3 รอบต่อ package → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- Critical/High advisories ถูก patch หรือมี mitigation ชัดเจน
- lockfile อัปเดตและ commit, tests ผ่านไม่มี regression
- report before/after พร้อม residual risk ที่เหลือ

