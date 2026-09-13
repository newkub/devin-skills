---
name: check-correctness
description: ตรวจ content ว่าถูกต้องตามจริง — commands รันได้, API signatures ตรง, claims มี evidence
argument-hint: "[target]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
  - web_search
  - webfetch
  - mcp_call_tool
related:
  - deep-research
  - deep-validate
  - deep-verify
  - check-content-outdate
  - review-docs
  - resolve-errors
  - report
---

## Goal

ตรวจว่าเนื้อหาใน skills, docs, code comments, specs **ถูกต้อง** ไม่ใช่แค่ทันสมัย — commands รันได้จริง, API signatures ตรงกับ library, claims มี evidence รองรับ, logic สอดคล้องกัน

## Scope

ใช้สำหรับ verify factual correctness ของ content ที่ระบุ — ต่างจาก `/check-content-outdate` (เน้น freshness) และ `/deep-verify` (เน้น implementation vs plan)

## Execute

### 1. Extract Claims

> Goal: ดึง factual claims ออกจาก content

1. Commands และ flags ที่อ้าง (`bru run`, `--reporter-junit`, `scalar document serve`)
2. API signatures, function names, config keys, paths
3. Numeric claims: versions, ports, limits, defaults
4. Behavioral claims: "X does Y", "default คือ Z", "auto-injects W"
5. ทำ `/use-scripts` ถ้าต้อง extract จากหลายไฟล์

### 2. Verify Against Ground Truth

> Goal: ยืนยันแต่ละ claim กับ source of truth

1. Commands/flags → รัน `--help` จริง หรือเทียบ official docs
2. API signatures → เทียบ types/source ของ library ใน registry หรือ repo
3. Versions/defaults → `npm view`, official changelog, source code
4. Behavior claims → docs + ถ้าทำได้ รันจริงแบบ minimal
5. ทำ `/deep-research` เมื่อ claim ต้อง cross-check หลายแหล่งหรือ docs ขัดกัน

### 3. Classify Findings

| Severity | เกณฑ์ |
|----------|-------|
| Critical | command/API/claim ผิดจนใช้งานไม่ได้ หรือสื่อความหมายผิด |
| Warning | ถูกบางส่วนแต่ misleading — edge cases, version-conditional |
| Info | ถูกต้องแต่พยานอ่อน — ควร cite source |

- ระบุ file:line, claim เดิม, ground truth, source
- ถ้าพบเนื้อหาถูกแต่ล้าสมัย → route ไป `/check-content-outdate`

### 4. Report And Route

> Goal: รายงานและส่งต่อ

1. ทำ `/report` ตาราง: No, File, Line, Claim, Ground Truth, Severity, Source
2. Route fixes: `/resolve-errors` (code), `update-docs-*` (docs), `/update-devin-global-skills` (skills)
3. ถ้าไม่มี findings → report "content verified correct"
4. ทำ `/suggest-next-action`

## Rules

### 1. Ground Truth Priority

1. รันจริง/execute (strongest)
2. Official source code / types
3. Official docs / changelog
4. Package registry metadata
5. Third-party (weakest — cross-check เสมอ)

### 2. Discipline

- ตรวจเท่านั้น ไม่แก้ — fixes ผ่าน skill ที่ตรง domain
- claim ที่ verify ไม่ได้ → ระบุ "unverified" พร้อมเหตุผล ไม่ใช่เดาว่าถูก
- ห้าม mark ผิดถ้า claim ถูกใน version เดิมที่ content ระบุไว้ — ถ้าเจอแบบนั้น route ไป `/check-content-outdate` แทน

### 3. Efficiency

- batch verify ต่อ tool/library — รัน `--help` ครั้งเดียวเช็คหลาย claims
- claims ที่เป็น opinion/style ไม่ต้องตรวจ

- ใช้ /deep-research ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- claims ทุกตัวถูก verify หรือ mark unverified พร้อมเหตุผล
- รายการ incorrect content พร้อม file:line, ground truth, source
- Route ไปยัง fix skill ที่ถูกต้อง
