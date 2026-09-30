---
name: improve-consistency
description: หา consistency improvements ใน scope — naming, patterns, style, layer alignment, divergent duplicates — แก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - improve-code-quality
  - improve-writing
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "consistency improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-alignment` + `review-redundancy` + `review-code-quality`/`review-writing` (scope consistency) เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "consistency ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-alignment` — layers/spec/docs อ้างกันถูกและ sync กัน: code vs docs drift, API contract vs implementation, config vs usage
- `review-redundancy` — divergent duplicates: สิ่งเดียวกัน implement ต่างกันหลายที่ ควรรวมเป็น canonical เดียว
- `review-code-quality` (consistency scope) — naming conventions, code style, pattern usage ไม่สม่ำเสมอข้ามไฟล์/module
- `review-writing` (consistency scope) — naming/terminology ใน docs/prose ไม่ตรงกัน
- config consistency/drift เฉพาะทาง → `/improve-config`; UX/UI consistency → `/improve-uxui`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-alignment` + `review-redundancy` + `review-code-quality` + `review-writing` (scope consistency)
3. รวบรวม prioritized list พร้อม severity และ evidence — จับคู่ "canonical ที่ถูก" กับ "จุดที่ deviate" ไว้ในทุก finding

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง improvements: No., Finding, Canonical/Chosen Convention, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหนและเลือก convention ไหนเป็น canonical — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain ที่ตรง) — แก้ให้ตรง canonical ที่ user เลือก ไม่สร้าง convention ที่ 3
2. rename/restructure ข้ามหลายไฟล์ → ใช้ `/all-this-patterns` หรือ `/batch-rename-files` ให้ครบทุก occurrence
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- ไม่แก้ไขโดยไม่ได้ user confirm — และ user เป็นคนเลือก canonical convention
- ห้ามแก้ครึ่งทาง — consistency fix ต้องครบทุก occurrence ใน scope (`/all-this-patterns`)
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized consistency improvement list จาก `/deep-review` พร้อม canonical convention ต่อ finding
- User เลือกสิ่งที่จะแก้และ convention เป้าหมาย
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix` ครบทุก occurrence ใน scope
