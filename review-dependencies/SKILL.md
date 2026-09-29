---
name: review-dependencies
description: ตรวจ dependencies — outdated, vulnerabilities, licenses, duplicates, unused packages
argument-hint: "[workspace-or-package]"
related:
  - update-version-to-latest
  - review-security
  - scan-codebase
  - report
  - run-check
  - ask-me
  - run-install
  - run-review
  - use-subagents

---

## Goal

ตรวจสอบ dependencies ของ project — outdated versions, vulnerabilities, license compliance, duplicates และ unused packages ก่อนตัดสินใจ update — domain checklist อยู่ใน `subagents/deps-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้เมื่อต้อง audit dependencies ของ workspace/monorepo: runtime, dev, peer deps — ครอบคลุม manifests, lockfile, usage จริงใน code และการเปรียบเทียบ alternatives — ไม่ติดตั้งหรืออัปเดต (ใช้ `/update` หรือ package manager)

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ manifests, ecosystem และเก็บ baseline

1. อ่าน `package.json`, `Cargo.toml`, `go.mod` หรือ manifests ที่ตรวจพบ — ระบุ package manager และ monorepo workspaces
2. ทำ `/run-review` + `/scan-codebase` เก็บ baseline (ใช้เป็น findings-file ให้ subagent cross-check)
3. รัน outdated/audit ของ ecosystem (`bun outdated`, `npm audit`, `cargo outdated`) เก็บ raw output เป็น baseline

### 2. Dispatch Deps-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension (`inventory`, `usage`, `health`, `versions`, `licenses`, `alternatives`, `stack`)
2. Spawn `subagents/deps-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. monorepo หลาย workspace → spawn หลาย instance ทีละ workspace ขนานกัน — dimensions ต่างกันใน workspace เดียวรวมเป็น instance เดียว

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + alternatives scoring

1. รวม findings จากทุก instance — dedup ตาม package name + issue type
2. เมื่อ finding เป็น `replace` หรือต้องเลือก library → score alternatives แบบ apples-to-apples:

| Criteria | Weight |
|---|:---:|
| Modern / Type Safety / Performance / DX / Maintenance / Bundle Size / Dependencies | 5 ต่อข้อ (รวม 35) |

3. ระบุ Migration Effort และ Risk (Low/Medium/High) ต่อ candidate — priority High = Score ≥25 + Effort Low + Risk Low
4. เทียบ deps กับ canonical catalog `../shared/techstack-catalog.md` — flag ตัวที่ไม่ใช่ Default เป็น drift
5. ถ้าพบ vulnerability → เชื่อม `/review-security`

### 4. Report

> Goal: สรุป findings พร้อม action plan

1. ทำ `/report` พร้อม columns: No., Package, Current, Latest, Severity, Issue, Action
2. แยก actions: update now, update with caution, remove, replace, keep
3. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch report formatting ไปยัง subskill เมื่อต้องการ dep audit table แบบ persistent

| Topic | Subskill |
|-------|----------|
| `report`, `deps` — dep audit matrix + action plan + update order | `subskills/report-deps/SKILL.md` |

### Subagents

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

| Domain | Subagent |
|--------|----------|
| dependencies audit — inventory, usage, health, versions, licenses, alternatives, stack drift | `subagents/deps-reviewer/AGENT.md` |

## Rules

### 1. Read Only

- ห้าม install, update หรือแก้ lockfile ระหว่าง review
- ใช้ registry metadata และ local manifests เท่านั้น
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/deps-reviewer/` เท่านั้น

### 2. Evidence Based

- ทุก finding ต้องมี source: audit output, registry data, import scan
- ไม่เดาว่า dep ไม่ได้ใช้ — ต้องมี import scan evidence

### 3. Conservative Defaults

- แนะนำ update เฉพาะเมื่อมีเหตุผล (security, bug fix, EOL)
- major updates ต้องมี migration notes ก่อนเสนอ
- ถ้า dep ขัด tech stack → ระบุแต่ไม่ลบเอง

- ใช้ /run-check ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น

- ใช้ /update-version-to-latest ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. unused deps: knip/depcheck + grep verify ก่อนลบ — ระวัง config/plugin/peer refs
2. dedupe versions ใน lockfile, consolidate overlapping libs
3. vulnerabilities: patch Critical/High; major upgrade ที่ break → migration plan
4. stale: patch/minor batch, major ทีละตัว — ห้าม version <7 วัน
5. verify: clean install + `/run-check` + tests

## References

- [Full-dimension checklist](subagents/deps-reviewer/checklist.md)
- [Techstack catalog](../shared/techstack-catalog.md)
- ใช้ /run-install ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายงาน deps ครบ: outdated, vulnerable, unused, license issues
- Action plan ชัดเจนแยกตาม risk
- ไม่มี side effects บน lockfile หรือ `node_modules`
