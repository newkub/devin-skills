---
name: improve-ux-writing
description: หา UX writing improvements — microcopy, CTA, empty states, error wording — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-uxui
  - improve-writing
  - improve-error-handling
  - improve-onboarding
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "UX writing improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-uxui + review-writing` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "ข้อความใน UI ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-uxui` (copy scope) — microcopy ชัด/กระชับ, CTA ที่บอก action จริง, label ตรง behavior, tone consistent กับ brand, empty states ที่นำทางต่อได้
- `review-writing` (copy scope) — grammar/voice/tone hygiene, terminology ตรงกันทุก screen,อ่านง่าย (grade level), no jargon leak
- กลไก error states/UI → `/improve-error-handling` (เจ้าของ error UI); docs/README prose → `/improve-writing`; first-run flow ภาพใหญ่ → `/improve-onboarding`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-uxui + review-writing` — สแกน string ทั้งหมดใน scope (i18n keys, inline copy)
3. รวบรวม prioritized list พร้อม severity และ evidence — copy ที่ทำให้ user ทำ wrong action (destructive confirm) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-uxui`/`review-writing`)
2. เขียน copy ใหม่ต้อง check ทุก locale ที่มี (ไม่แก้ hardcoded ในภาษาเดียวถ้า project ใช้ i18n) — ส่งต่อ `/improve-i18n` เมื่อแตะ keys
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามแก้ copy ที่เปลี่ยน semantic ของ legal/compliance text โดยไมส่งต่อ `/improve-compliance`
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized UX-writing improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม locale parity ตรวจแล้ว
