---
name: capture-bug-context
description: เก็บ context ครบตอนเจอ bug — git state, env, logs, screenshots ไว้ใน .devin/bugs
argument-hint: "[bug-title]"
related:
  - capture
  - capture
  - capture
  - deep-debug
---

## Goal

เมื่อเจอ bug ให้เก็บ context ครบทันที — git state, environment, logs, screenshots, repro steps — ลง `.devin/bugs/<slug>-<date>/` เพื่อ reproduce หรือ debug ทีหลังโดยไม่เสียบริบท

## Scope

- ใช้ตอนเจอ bug ที่ต้องจดจำ: intermittent bugs, hard-to-reproduce issues, bug reports ที่จะส่งต่อ
- เก็บใน `.devin/bugs/<slug>-<YYYYMMDD>/` — dir เดียวต่อ bug รวมทุก artifact
- ครอบคลุม: git state, env snapshot, logs, screenshots, repro steps, hypotheses

## Execute

### 1. Create Bug Directory

> Goal: สร้างที่เก็บ artifacts

1. สร้าง `.devin/bugs/<slug>-<YYYYMMDD>/` ใน project — slug จาก argument หรือสรุปอาการ
2. โครงสร้าง:
   - `CONTEXT.md` — รายละเอียดหลัก
   - `logs/` — log captures
   - `screenshots/` — ภาพหน้าจอ/terminal
   - `state/` — env, config, versions

### 2. Capture Git State

> Goal: บันทึกว่า code อยู่สถานะไหน

1. `git rev-parse HEAD`, `git status --porcelain`, `git diff` — commit + uncommitted changes
2. `git log --oneline -10` — recent history รอบๆ
3. บันทึกลง `state/git.txt`

### 3. Capture Environment

> Goal: บันทึกสภาพแวดล้อมที่เกี่ยวข้อง

1. Versions: runtime (node/bun/python), OS, relevant tool versions — `state/versions.txt`
2. Env vars ที่เกี่ยว (mask secrets — เก็บชื่อและค่าที่ปลอดภัยเท่านั้น)
3. Config files ที่เกี่ยวข้อง — copy หรืออ้าง path
4. Network/service state ถ้าเกี่ยว: ports, running services, DB state

### 4. Capture Evidence

> Goal: เก็บ artifacts ที่พิสูจน์ bug

1. Terminal output/errors → `logs/` (ทำ `/capture` ถ้าเหมาะ)
2. UI bugs → screenshots ลง `screenshots/` (ทำ `/capture` หรือ `/capture`)
3. Error stack traces เต็ม — ไม่ตัด
4. Request/response ถ้าเป็น API bug — headers + body (mask secrets)

### 5. Write CONTEXT.md

> Goal: เอกสารที่คนอื่นอ่านแล้ว reproduce ได้

```markdown
# Bug: <title>
- Date: <datetime>
- Reporter: <user/session>
- Severity: <critical/high/medium/low>

## Symptom
<อาการที่เห็น — จริง vs คาดหวัง>

## Repro Steps
1. <ขั้นตอนที่ทำให้เกิด — ละเอียดพอให้คนอื่นทำตาม>
2. ...

## Environment
<OS, versions, config ที่เกี่ยว>

## Evidence
- logs/: <files>
- screenshots/: <files>
- state/: <files>

## Hypotheses
- <สาเหตุที่สงสัย + evidence รองรับ>

## Frequency
<เกิดทุกครั้ง / เป็นบางครั้ง — pattern ที่สังเกต>
```

### 6. Hand Off

> Goal: บอกตำแหน่งและ next steps

1. แจ้ง path `.devin/bugs/<slug>-<date>/` พร้อมสรุปสั้น
2. ถ้าจะ debug ต่อ → `/deep-debug` อ่านจาก context นี้ได้
3. ถ้าจะส่งต่อ → ทั้ง dir attach/อ้างอิงได้

## Rules

### 1. Capture Immediately

- เก็บตอนเจอ bug — state จะหาย (logs rotate, server restart, memory)
- อย่าแก้ไขก่อนเก็บ — preserve evidence ดิบก่อน

### 2. No Secrets

- mask secrets/tokens ใน env captures, logs และ request bodies
- `.devin/bugs/` ไม่ควรมี credentials — ตรวจก่อนบันทึก

### 3. Complete But Focused

- เก็บพอให้ reproduce — ไม่ dump ทุกอย่างโดยไม่เลือก
- repro steps ต้องทำตามได้จริงโดยคนที่ไม่เคยเห็น bug

## Expected Outcome

- `.devin/bugs/<slug>-<date>/` มี context ครบ: CONTEXT.md + logs + screenshots + state
- Bug reproduce ได้จาก artifacts โดยไม่ต้องถามซ้ำ
- พร้อมส่งต่อ `/deep-debug` หรือทีมอื่น
