---
name: prioritize-and-report
description: Classify findings, prioritize impact x effort, report plan before fixing
---

# Prioritize And Report

## Goal

ทุก finding เป็น fix candidate พร้อม evidence — user เห็น plan ก่อนลงมือ

## Classify

จัด findings เข้า 3 กลุ่ม:

| กลุ่ม | เกณฑ์ |
|------|-------|
| `apply now` | high impact + low risk — แก้ได้โดยไม่เปลี่ยน behavior/UX, มี evidence ชัด |
| `needs measurement` | impact ไม่แน่นอน — ต้อง profile/benchmark ก่อนตัดสินใจแก้ |
| `deferred` | เสี่ยงสูงหรือกำไรน้อย — rewrite architecture, undo deliberate optimizations, build-time cost สูง (fat LTO), UX trade-offs |

### Deferred Anti-Patterns

- unmount keep-alive views ที่กระทบ session/UX persistence
- rewrite ที่ใหญ่กว่า fix ที่ต้องการ (database → background thread, framework swap)
- fat LTO / heavy build flags ที่จ่ายนาทีเพื่อ gain เล็กน้อย — prefer `codegen-units = 1` + thin LTO
- broad icon/dependency refactor โดยไม่มี measured evidence
- ลบ lazy loading/chunk splits ที่ตั้งใจไว้เพราะ "ดูไม่จำเป็น"

## Prioritize

ทำ `/prioritize` เรียงตาม:

1. `impact` — perceived speed/smoothness, bundle bytes, CPU/memory savings
2. `effort` — lines changed, files touched, test surface
3. `risk` — chance ของ behavior regression, blast radius

high impact + low effort + low risk ขึ้นก่อนเสมอ

## Report

ทำ `/report-before-after` ก่อนแก้ — ตาราง:

| No. | Finding | Layer | Impact | Effort | Risk | Evidence |
|-----|---------|-------|--------|--------|------|----------|

- ทุก row ต้องมี `file:line` evidence
- รอ user confirm ก่อนเข้า `## Fix` — ยกเว้น user สั่ง optimize ตรงๆ มาแล้ว
- แยก `deferred` list พร้อมเหตุผล — ไม่มี fixes เสี่ยงสูงโดยไม่บอก

## Severity

- Critical: findings ที่ไม่มี evidence แต่ถูกรวมใน plan
- High: plan ไม่แยก apply-now vs deferred — user ไม่รู้ว่าอะไรเสี่ยง
- Medium: ไม่มี baseline สำหรับ before/after
- Low: formatting ของ report table
