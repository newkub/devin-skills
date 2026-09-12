---
name: follow-tool-semgrep-config-rules
description: ตั้งค่า Semgrep rules — custom YAML rules, registry rulesets และ CI gating
argument-hint: "[ruleset-or-path]"
related:
  - follow-tool-semgrep
  - use-astgrep
  - follow-config
  - run-scan
  - setup-cicd
---

## Goal

ตั้งค่า Semgrep rules ให้เป็น versioned config ใน repo — custom YAML rules, registry rulesets selection และ CI gating

## Scope

- Config rules สำหรับ Semgrep ที่ install แล้ว (scan-only usage → parent skill)
- ครอบคลุม: `.semgrep/` custom rules, rule YAML anatomy, `p/*` registry rulesets, `--test`, CI gating
- ไม่ครอบคลุม: fix findings (`/review-security` หรือ `/fix`)

## Execute

### 1. Choose Rule Sources

> Goal: ตัดสินใจ custom vs registry ต่อ coverage ที่ต้องการ

1. Registry rulesets — `p/default`, `p/security-audit`, `p/owasp-top-ten`, `p/<language>`, `p/<framework>` — เริ่มแคบพอก่อน `p/default` อาจ noisy
2. Custom rules — project-specific patterns, internal API misuse, banned functions — เก็บใน `.semgrep/` หรือ `semgrep.yml`
3. Structural patterns ง่ายๆ → พิจารณา `use-astgrep` ก่อน (เร็วกว่า ไม่ต้อง install); semgrep เมื่อต้องการ taint/dataflow

### 2. Write Custom Rules

> Goal: custom rules ที่ถูกต้องและ test ได้

1. สร้าง `.semgrep/<domain>.yml` — top-level `rules:` list
2. แต่ละ rule ต้องมี: `id` (namespaced เช่น `project.no-fetch-in-loop`), `patterns`/`pattern`/`pattern-either`, `message`, `severity` (`ERROR`/`WARNING`/`INFO`), `languages`
3. ใช้ `pattern-inside`, `pattern-not`, `metavars` (`$X`), `pattern-regex` ตามต้องการ — ดู official docs สำหรับ operators ขั้นสูง (`pattern-sources`/`pattern-sinks` สำหรับ taint)
4. เพิ่ม `metadata` เช่น `category`, `cwe`, `references` สำหรับ triage
5. เขียน test file คู่กัน (เช่น `.semgrep/<domain>.ts` ที่มี `// ruleid:`/`// ok:` annotations) แล้วรัน `semgrep scan --test .semgrep/`

### 3. Wire Local And CI Config

> Goal: ruleset ถูกเลือกสม่ำเสมอทั้ง local และ CI

1. รวม configs: `semgrep scan --config=.semgrep/ --config=p/security-audit` — ผสม custom + registry ได้
2. ใช้ `.semgrepignore` ข้าม tests/generated/vendored paths (syntax คล้าย `.gitignore`)
3. เลือก baseline strategy สำหรับ legacy — `--baseline <ref>` เห็นเฉพาะ findings ใหม่

### 4. CI Gating

> Goal: semgrep เป็น quality gate ที่ควบคุมได้

1. CI step รัน `semgrep scan --config=<...>` — ใช้ `--error` ให้ exit non-zero เมื่อมี findings (gate)
2. Output `--sarif` สำหรับ GitHub code scanning หรือ `--json` สำหรับ processing
3. ถ้าใช้ Semgrep AppSec Platform → `semgrep login` + `semgrep ci` แทน `scan`
4. Pin ruleset ใน CI — ruleset เปลี่ยน = findings เปลี่ยน อย่าให้ gate พังจาก upstream
5. Triage loop: `// nosemgrep` พร้อมเหตุผลสำหรับ intentional patterns — อย่า suppress โดยไม่มี comment

### 5. Verify

> Goal: rules ทำงานถูกและ gate ถูกต้อง

1. รัน `semgrep scan --config=.semgrep/ <path>` — custom rules fire บน known-bad sample
2. รัน `semgrep scan --test .semgrep/` — rule tests ผ่าน
3. รัน CI command local — exit code ถูกตามที่ gate ตั้งไว้
4. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว report

## Rules

- Custom rules ต้องอยู่ใน repo พร้อม tests — ห้าม rule ที่ยังไม่เคย `semgrep scan --test`
- ทุก rule มี `id` namespaced, `message` ที่ actionable, `severity` ที่เหมาะ
- Pin ruleset versions ใน CI — อย่า track latest โดยไม่ควบคุม
- `// nosemgrep` ต้องมี comment เหตุผลเสมอ
- เริ่ม ruleset แคบ — เพิ่ม coverage ทีละนิดเพื่อไม่ให้ signal จมใน noise
- ถ้าไม่แน่ใจ rule syntax → ดู official docs (Semgrep rule schema)

## Expected Outcome

- `.semgrep/` มี custom rules พร้อม rule tests ที่ผ่าน
- Registry rulesets เลือกแล้วตามเป้าหมาย พร้อม baseline strategy
- CI gate ด้วย `--error`/SARIF ทำงานถูก และ findings triaged
