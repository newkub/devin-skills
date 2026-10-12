---
name: review-issue
description: review issue/concern area ที่ user ระบุ (เช่น uxui, rbac, routing, payment) — หา issues + gaps + inconsistencies แล้วแก้หลัง confirm
argument-hint: "[areas]"
related:
  - deep-review
  - deep-review-then-fix
  - improve-features
  - improve-rbac
  - improve-form
  - refactor
  - create-plan-in-dot-devin
  - report
  - ask-me
  - suggest-next-action
---

## Goal

Review เจาะจงตาม issue/concern areas ที่ user ระบุ (เช่น `uxui rbac navigation routing`, `auth session`, `payment refund`) — หา 3 อย่าง: **issues** (พฤติกรรมผิด/bug), **gaps** (ควรมีแต่ไม่มี), **inconsistencies** (พฤติกรรมเดียวกันทำคนละแบบในที่ต่างกัน) — รวมเป็น prioritized list พร้อม evidence แล้วแก้หลัง user confirm

## Scope

- ใช้เมื่อ user ชี้ "issue area" ชัดเจน — ไม่ใช่ full codebase review (→ `/deep-review`) และไม่ใช่ feature gap analysis (→ `/improve-features`)
- Area เป็น free-form — map ไป `/deep-review` domain ที่ใกล้ที่สุด ถ้า map ไม่ได้ให้ review ตรงจาก source
- ถ้า user ใส่ `and fix` ท้ายคำสั่ง → ถือว่า confirm แล้ว แก้ทุก finding โดยไม่ต้องถามซ้ำ (ยังต้อง report ก่อนแก้)

## Execute

### 1. Scope Areas

> Goal: รู้ว่า review อะไรบ้าง

1. รับ `areas` จาก argument — ถ้าไม่มีหรือไม่ชัด → `/ask-me`
2. Map แต่ละ area ไป domain ของ `/deep-review` (เช่น `uxui` → `review-uxui`, `rbac`/`auth` → `review-auth`, `routing`/`navigation` → `review-frontend` + manual route analysis); map ไม่ได้ → review source ตรง
3. สำรวจ codebase หา surface ของแต่ละ area — routes, guards, components, stores ที่เกี่ยว — ก่อน review เพื่อไม่พลาดจุดที่ซ่อนอยู่

### 2. Review Each Area

> Goal: findings พร้อม evidence จริงทุกข้อ

ทุก area ตรวจ 3 มิติ:

1. **Issues** — พฤติกรรมผิดที่พิสูจน์ได้จาก code (dead action, wrong guard, broken link, silent failure)
2. **Gaps** — capability ที่ surface สัญญาไว้แต่ไม่มีจริง (ปุ่มที่ไม่ทำงาน, empty state ที่ไม่มีทางเติม, permission ที่ประกาศแต่ไม่เช็ค)
3. **Inconsistencies** — flow เดียวกันคนละพฤติกรรม (ฝั่ง A validate ฝั่ง B ไม่, cancel ฝั่งหนึ่งคืนเงินอีกฝั่งไม่)

ทุก finding ต้องมี `file:line` evidence — ห้ามเดา ห้ามนับ intentional mock/stub เป็น finding เว้นแต่ UI สัญญากับ user ไว้ว่าทำงานจริง

### 3. Present And Confirm

> Goal: prioritized report ก่อนแก้

1. ทำ `/report` ตาราง: `No.`, `Area`, `Type` (issue|gap|inconsistency), `Finding`, `Severity`, `Evidence`, `Fix Skill`
2. ถ้า user ไม่ได้ใส่ `and fix` → ถามว่าจะแก้ข้อไหน รอ confirm

### 4. Fix Confirmed Items

> Goal: แก้เฉพาะที่ confirm

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` ตาม domain ที่ตรง — finding ที่ map ไม่ได้แก้ตรงตาม evidence; area ที่มี dedicated entry → ใช้ entry นั้น (rbac → `/improve-rbac`, form → `/improve-form`, validation → `/improve-data-validation`, tests → `/improve-tests`)
2. Addition ใหญ่ → `/create-plan-in-dot-devin` ก่อน implement เสมอ
3. หลังแก้ครบ → `/refactor-to-srp` กับไฟล์ที่แตะเสมอ (≤250 บรรทัด, 1 responsibility)
4. Run build/lint ของ project ยืนยัน → `/suggest-next-action`

## Rules

- Delegate ไป `/deep-review` domains เมื่อ map ได้ — review เองเฉพาะ area ที่ไม่มี domain รองรับ
- ทุก finding ต้องมี evidence `file:line` — no evidence = no finding
- ไม่แก้โดยไม่ได้ confirm — เว้นแต่ user ใส่ `and fix` ในคำสั่ง
- Intentional demo/mock behavior ไม่นับเป็น finding เว้นแต่ UI หลอกว่าทำงานจริง
- ทุก addition ที่ confirm → `/create-plan-in-dot-devin` ก่อน implement เสมอ ห้ามข้าม

## Expected Outcome

- Prioritized findings ต่อ area พร้อม type, severity, evidence ครบ
- Findings ที่ confirm ถูกแก้ + verify ผ่าน build/lint + SRP ครบ
